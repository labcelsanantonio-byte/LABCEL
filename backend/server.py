from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Depends, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import base64
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

#Environment configuration
Environment = os.environ.get("ENVIRONMENT",'production')
IS_DEVELOPMENT = Environment == 'development'

# Create the main app
app = FastAPI(title="LABCEL San Antonio API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "customer"  # customer, admin
    phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    role: Optional[str] = None

class PhoneBrand(BaseModel):
    brand_id: str = Field(default_factory=lambda: f"brand_{uuid.uuid4().hex[:8]}")
    name: str
    logo_url: Optional[str] = None
    is_active: bool = True

class PhoneModel(BaseModel):
    model_id: str = Field(default_factory=lambda: f"model_{uuid.uuid4().hex[:8]}")
    brand_id: str
    name: str
    image_url: Optional[str] = None
    case_template_url: Optional[str] = None
    is_active: bool = True

class Product(BaseModel):
    product_id: str = Field(default_factory=lambda: f"prod_{uuid.uuid4().hex[:8]}")
    name: str
    description: str
    price: float
    category: str = "funda"  # funda, accesorio, etc.
    base_image_url: Optional[str] = None
    is_customizable: bool = True
    is_active: bool = True
    stock: int = 100
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str = "funda"
    base_image_url: Optional[str] = None
    is_customizable: bool = True
    stock: int = 100

class CartItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float
    phone_brand: Optional[str] = None
    phone_model: Optional[str] = None
    custom_image_url: Optional[str] = None
    preview_image_url: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[CartItem]
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    customer_whatsapp: Optional[str] = None
    shipping_address: str
    payment_method: str = "transferencia"  # transferencia, recoger_tienda
    notes: Optional[str] = None

class Order(BaseModel):
    order_id: str = Field(default_factory=lambda: f"ORD-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}")
    user_id: Optional[str] = None
    items: List[CartItem]
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_whatsapp: Optional[str] = None
    shipping_address: str
    payment_method: str
    notes: Optional[str] = None
    subtotal: float
    total: float
    status: str = "pendiente"  # pendiente, confirmado, en_proceso, enviado, entregado, cancelado
    status_history: List[Dict[str, Any]] = []
    design_approved: bool = False
    design_proposal_sent: bool = False
    admin_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class Notification(BaseModel):
    notification_id: str = Field(default_factory=lambda: f"notif_{uuid.uuid4().hex[:8]}")
    order_id: str
    recipient_email: Optional[str] = None
    recipient_whatsapp: Optional[str] = None
    notification_type: str  # order_created, status_update, design_proposal
    message: str
    status: str = "pending"  # pending, sent, failed
    channel: str  # email, whatsapp
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    sent_at: Optional[datetime] = None

class DesignProposal(BaseModel):
    order_id: str
    proposal_image_url: str
    message: str
    send_via_whatsapp: bool = True
    send_via_email: bool = True

class Stats(BaseModel):
    total_orders: int
    pending_orders: int
    completed_orders: int
    total_revenue: float
    orders_today: int
    total_users: int

# ==================== AUTH HELPERS ====================

async def get_session_from_token(session_token: str) -> Optional[Dict]:
    """Get session data from token"""
    session = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    if not session:
        return None
    
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    
    return session

async def get_current_user(request: Request) -> Optional[Dict]:
    """Get current user from session token in cookie or header"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        return None
    
    session = await get_session_from_token(session_token)
    if not session:
        return None
    
    user = await db.users.find_one(
        {"user_id": session["user_id"]},
        {"_id": 0}
    )
    return user

async def require_auth(request: Request) -> Dict:
    """Require authentication"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="No autenticado")
    return user

async def require_admin(request: Request) -> Dict:
    """Require admin role"""
    user = await require_auth(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere rol de administrador")
    return user

# ==================== NOTIFICATION SERVICE ====================

async def send_notification(
    order_id: str,
    notification_type: str,
    message: str,
    recipient_email: Optional[str] = None,
    recipient_whatsapp: Optional[str] = None
):
    """Send notification via email and/or WhatsApp (mock for now)"""
    notifications = []
    
    if recipient_email:
        notif = Notification(
            order_id=order_id,
            recipient_email=recipient_email,
            notification_type=notification_type,
            message=message,
            channel="email",
            status="pending"
        )
        
        # TODO: Integrate with Resend when API key is available
        # For now, mark as sent (simulated)
        notif.status = "sent"
        notif.sent_at = datetime.now(timezone.utc)
        
        await db.notifications.insert_one(notif.model_dump())
        notifications.append(notif)
        logger.info(f"Email notification queued for {recipient_email}")
    
    if recipient_whatsapp:
        notif = Notification(
            order_id=order_id,
            recipient_whatsapp=recipient_whatsapp,
            notification_type=notification_type,
            message=message,
            channel="whatsapp",
            status="pending"
        )
        
        # TODO: Integrate with Twilio when credentials are available
        # For now, mark as sent (simulated)
        notif.status = "sent"
        notif.sent_at = datetime.now(timezone.utc)
        
        await db.notifications.insert_one(notif.model_dump())
        notifications.append(notif)
        logger.info(f"WhatsApp notification queued for {recipient_whatsapp}")
    
    return notifications

async def notify_admins(order: Dict, notification_type: str, message: str):
    """Notify all admins about an order"""
    admins = await db.users.find(
        {"role": "admin"},
        {"_id": 0}
    ).to_list(100)
    
    for admin in admins:
        await send_notification(
            order_id=order["order_id"],
            notification_type=notification_type,
            message=message,
            recipient_email=admin.get("email"),
            recipient_whatsapp=admin.get("whatsapp_number")
        )

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/session")
async def exchange_session(request: Request):
    """Exchange session_id for session data and create user"""
    # REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id requerido")
    
    # Exchange session_id with Emergent Auth
    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Sesión inválida")
        
        auth_data = response.json()
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    email = auth_data.get("email")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        # Update user info
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": auth_data.get("name"),
                "picture": auth_data.get("picture"),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
    else:
        # Create new user
        new_user = {
            "user_id": user_id,
            "email": email,
            "name": auth_data.get("name"),
            "picture": auth_data.get("picture"),
            "role": "customer",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(new_user)
    
    # Create session
    session_token = auth_data.get("session_token")
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Get user data
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    # Add token to response for client-side storage
    user_with_token = {**user, "session_token": session_token}
    
    response = JSONResponse(content=user_with_token)
    
    # Configure cookie based on environment
    if IS_DEVELOPMENT:
        # Development: allow HTTP, lax samesite
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=False,
            samesite="lax",
            path="/",
            max_age=7 * 24 * 60 * 60
        )
    else:
        # Production: secure cookies over HTTPS
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="lax",
            path="/",
            max_age=7 * 24 * 60 * 60
        )
        
    response = JSONResponse(content=user)
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    return response

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current authenticated user"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="No autenticado")
    return user

@api_router.post("/auth/logout")
async def logout(request: Request):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response = JSONResponse(content={"message": "Sesión cerrada"})
    response.delete_cookie(key="session_token", path="/")
    return response

# ==================== USER ROUTES ====================

@api_router.get("/users", response_model=List[Dict])
async def get_users(request: Request):
    """Get all users (admin only)"""
    await require_admin(request)
    users = await db.users.find({}, {"_id": 0}).to_list(1000)
    return users

@api_router.put("/users/{user_id}")
async def update_user(user_id: str, update: UserUpdate, request: Request):
    """Update user (admin only)"""
    await require_admin(request)
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.users.update_one(
        {"user_id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user

@api_router.put("/users/{user_id}/role")
async def update_user_role(user_id: str, request: Request):
    """Toggle user admin role (admin only)"""
    admin = await require_admin(request)
    body = await request.json()
    new_role = body.get("role", "customer")
    
    if user_id == admin["user_id"]:
        raise HTTPException(status_code=400, detail="No puedes cambiar tu propio rol")
    
    result = await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"role": new_role, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return {"message": f"Rol actualizado a {new_role}"}

# ==================== PHONE BRANDS & MODELS ====================

@api_router.get("/phone-brands")
async def get_phone_brands():
    """Get all phone brands"""
    brands = await db.phone_brands.find({}, {"_id": 0}).to_list(100)
    return brands

@api_router.post("/phone-brands")
async def create_phone_brand(brand: PhoneBrand, request: Request):
    """Create phone brand (admin only)"""
    await require_admin(request)
    await db.phone_brands.insert_one(brand.model_dump())
    return brand

@api_router.get("/phone-models")
async def get_phone_models(brand_id: Optional[str] = None):
    """Get phone models, optionally filtered by brand"""
    query = {}
    if brand_id:
        query["brand_id"] = brand_id
    models = await db.phone_models.find(query, {"_id": 0}).to_list(500)
    return models

@api_router.post("/phone-models")
async def create_phone_model(model: PhoneModel, request: Request):
    """Create phone model (admin only)"""
    await require_admin(request)
    await db.phone_models.insert_one(model.model_dump())
    return model

# ==================== PRODUCT ROUTES ====================

@api_router.get("/products")
async def get_products(category: Optional[str] = None, active_only: bool = True):
    """Get all products"""
    query = {}
    if active_only:
        query["is_active"] = True
    if category:
        query["category"] = category
    
    products = await db.products.find(query, {"_id": 0}).to_list(500)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get single product"""
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@api_router.post("/products")
async def create_product(product: ProductCreate, request: Request):
    """Create product (admin only)"""
    await require_admin(request)
    
    new_product = Product(**product.model_dump())
    await db.products.insert_one(new_product.model_dump())
    return new_product

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, request: Request):
    """Update product (admin only)"""
    await require_admin(request)
    body = await request.json()
    
    body["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.products.update_one(
        {"product_id": product_id},
        {"$set": body}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    return product

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, request: Request):
    """Delete product (admin only)"""
    await require_admin(request)
    
    result = await db.products.delete_one(
        {"product_id": product_id}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    return {"message": "Producto eliminado"}

# ==================== ORDER ROUTES ====================

@api_router.post("/orders")
async def create_order(order_data: OrderCreate, background_tasks: BackgroundTasks, request: Request):
    """Create new order"""
    user = await get_current_user(request)
    
    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in order_data.items)
    total = subtotal  # No shipping fee for now
    
    # Create order
    order = Order(
        user_id=user["user_id"] if user else None,
        items=[item.model_dump() for item in order_data.items],
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        customer_phone=order_data.customer_phone,
        customer_whatsapp=order_data.customer_whatsapp,
        shipping_address=order_data.shipping_address,
        payment_method=order_data.payment_method,
        notes=order_data.notes,
        subtotal=subtotal,
        total=total,
        status_history=[{
            "status": "pendiente",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "notes": "Pedido creado"
        }]
    )
    
    order_dict = order.model_dump()
    order_dict["created_at"] = order_dict["created_at"].isoformat()
    order_dict["updated_at"] = order_dict["updated_at"].isoformat()
    
    await db.orders.insert_one(order_dict)
    
    # Notify admins in background
    background_tasks.add_task(
        notify_admins,
        order_dict,
        "order_created",
        f"Nuevo pedido #{order.order_id}\nCliente: {order.customer_name}\nTotal: ${total:.2f}\nProductos: {len(order_data.items)}"
    )
    
    # Notify customer
    background_tasks.add_task(
        send_notification,
        order.order_id,
        "order_created",
        f"¡Gracias por tu pedido #{order.order_id}!\nTotal: ${total:.2f}\nTe contactaremos pronto para confirmar tu diseño.",
        order.customer_email,
        order.customer_whatsapp
    )
    
    return {"order_id": order.order_id, "total": total, "status": order.status}

@api_router.get("/orders")
async def get_orders(request: Request, status: Optional[str] = None):
    """Get orders (admin gets all, user gets their own)"""
    user = await get_current_user(request)
    
    if not user:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    query = {}
    if user.get("role") != "admin":
        query["user_id"] = user["user_id"]
    
    if status:
        query["status"] = status
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return orders

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, request: Request):
    """Get single order"""
    user = await get_current_user(request)
    
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    # Check access
    if user:
        if user.get("role") != "admin" and order.get("user_id") != user["user_id"]:
            raise HTTPException(status_code=403, detail="No tienes acceso a este pedido")
    
    return order

@api_router.get("/orders/track/{order_id}")
async def track_order(order_id: str):
    """Track order status (public endpoint)"""
    order = await db.orders.find_one(
        {"order_id": order_id},
        {"_id": 0, "order_id": 1, "status": 1, "status_history": 1, "created_at": 1}
    )
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return order

@api_router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status_update: OrderStatusUpdate, background_tasks: BackgroundTasks, request: Request):
    """Update order status (admin only)"""
    await require_admin(request)
    
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    status_entry = {
        "status": status_update.status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "notes": status_update.notes or ""
    }
    
    await db.orders.update_one(
        {"order_id": order_id},
        {
            "$set": {
                "status": status_update.status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            "$push": {"status_history": status_entry}
        }
    )
    
    # Notify customer
    status_messages = {
        "confirmado": "Tu pedido ha sido confirmado. Estamos preparando tu diseño.",
        "en_proceso": "Tu pedido está en proceso de fabricación.",
        "enviado": "¡Tu pedido ha sido enviado! Pronto lo recibirás.",
        "entregado": "Tu pedido ha sido entregado. ¡Gracias por tu compra!",
        "cancelado": "Tu pedido ha sido cancelado. Contáctanos si tienes dudas."
    }
    
    message = status_messages.get(status_update.status, f"Tu pedido ha sido actualizado: {status_update.status}")
    
    background_tasks.add_task(
        send_notification,
        order_id,
        "status_update",
        f"Pedido #{order_id}\n{message}",
        order.get("customer_email"),
        order.get("customer_whatsapp")
    )
    
    return {"message": "Estado actualizado", "status": status_update.status}

@api_router.post("/orders/{order_id}/design-proposal")
async def send_design_proposal(order_id: str, proposal: DesignProposal, background_tasks: BackgroundTasks, request: Request):
    """Send design proposal to customer (admin only)"""
    await require_admin(request)
    
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    # Update order with proposal info
    await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {
            "design_proposal_sent": True,
            "design_proposal_image": proposal.proposal_image_url,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    message = f"Propuesta de diseño para tu pedido #{order_id}\n\n{proposal.message}\n\nResponde para aprobar o solicitar cambios."
    
    if proposal.send_via_email:
        background_tasks.add_task(
            send_notification,
            order_id,
            "design_proposal",
            message,
            order.get("customer_email"),
            None
        )
    
    if proposal.send_via_whatsapp and order.get("customer_whatsapp"):
        background_tasks.add_task(
            send_notification,
            order_id,
            "design_proposal",
            message,
            None,
            order.get("customer_whatsapp")
        )
    
    return {"message": "Propuesta de diseño enviada"}

@api_router.put("/orders/{order_id}/approve-design")
async def approve_design(order_id: str, request: Request):
    """Mark design as approved (admin only)"""
    await require_admin(request)
    
    result = await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {
            "design_approved": True,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    return {"message": "Diseño aprobado"}

# ==================== UPLOAD ROUTES ====================

@api_router.post("/upload/image")
async def upload_image(file: UploadFile = File(...)):
    """Upload custom image for case design"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Solo se permiten imágenes")
    
    # Read file content
    content = await file.read()
    
    # Check file size (max 5MB)
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="La imagen no puede superar 5MB")
    
    # Convert to base64 for storage
    base64_content = base64.b64encode(content).decode('utf-8')
    content_type = file.content_type
    
    # Generate unique ID
    image_id = f"img_{uuid.uuid4().hex[:12]}"
    
    # Store in database
    await db.uploaded_images.insert_one({
        "image_id": image_id,
        "filename": file.filename,
        "content_type": content_type,
        "data": base64_content,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Return data URL for immediate use
    data_url = f"data:{content_type};base64,{base64_content}"
    
    return {"image_id": image_id, "url": data_url}

@api_router.get("/upload/image/{image_id}")
async def get_uploaded_image(image_id: str):
    """Get uploaded image"""
    image = await db.uploaded_images.find_one({"image_id": image_id}, {"_id": 0})
    if not image:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    
    data_url = f"data:{image['content_type']};base64,{image['data']}"
    return {"image_id": image_id, "url": data_url}

# ==================== ADMIN STATS ====================

@api_router.get("/admin/stats")
async def get_admin_stats(request: Request):
    """Get dashboard statistics (admin only)"""
    await require_admin(request)
    
    # Get order counts
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pendiente"})
    completed_orders = await db.orders.count_documents({"status": "entregado"})
    
    # Get today's orders
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    orders_today = await db.orders.count_documents({
        "created_at": {"$gte": today_start.isoformat()}
    })
    
    # Calculate total revenue
    pipeline = [
        {"$match": {"status": {"$ne": "cancelado"}}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    # Get user count
    total_users = await db.users.count_documents({})
    
    return Stats(
        total_orders=total_orders,
        pending_orders=pending_orders,
        completed_orders=completed_orders,
        total_revenue=total_revenue,
        orders_today=orders_today,
        total_users=total_users
    )

@api_router.get("/admin/notifications")
async def get_notifications(request: Request, limit: int = 50):
    """Get recent notifications (admin only)"""
    await require_admin(request)
    
    notifications = await db.notifications.find(
        {},
        {"_id": 0}
    ).sort("created_at", -1).to_list(limit)
    
    return notifications

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_data():
    """Seed initial data for demo"""
    
    # Seed phone brands
    brands = [
        {"brand_id": "brand_apple", "name": "Apple", "is_active": True},
        {"brand_id": "brand_samsung", "name": "Samsung", "is_active": True},
        {"brand_id": "brand_xiaomi", "name": "Xiaomi", "is_active": True},
        {"brand_id": "brand_huawei", "name": "Huawei", "is_active": True},
        {"brand_id": "brand_motorola", "name": "Motorola", "is_active": True},
    ]
    
    for brand in brands:
        await db.phone_brands.update_one(
            {"brand_id": brand["brand_id"]},
            {"$set": brand},
            upsert=True
        )
    
    # Seed phone models
    models = [
        {"model_id": "model_iphone15", "brand_id": "brand_apple", "name": "iPhone 15", "is_active": True},
        {"model_id": "model_iphone15pro", "brand_id": "brand_apple", "name": "iPhone 15 Pro", "is_active": True},
        {"model_id": "model_iphone14", "brand_id": "brand_apple", "name": "iPhone 14", "is_active": True},
        {"model_id": "model_iphone13", "brand_id": "brand_apple", "name": "iPhone 13", "is_active": True},
        {"model_id": "model_s24", "brand_id": "brand_samsung", "name": "Galaxy S24", "is_active": True},
        {"model_id": "model_s24ultra", "brand_id": "brand_samsung", "name": "Galaxy S24 Ultra", "is_active": True},
        {"model_id": "model_s23", "brand_id": "brand_samsung", "name": "Galaxy S23", "is_active": True},
        {"model_id": "model_a54", "brand_id": "brand_samsung", "name": "Galaxy A54", "is_active": True},
        {"model_id": "model_redmi13", "brand_id": "brand_xiaomi", "name": "Redmi Note 13", "is_active": True},
        {"model_id": "model_poco", "brand_id": "brand_xiaomi", "name": "Poco X6", "is_active": True},
        {"model_id": "model_p60", "brand_id": "brand_huawei", "name": "P60 Pro", "is_active": True},
        {"model_id": "model_edge40", "brand_id": "brand_motorola", "name": "Edge 40", "is_active": True},
    ]
    
    for model in models:
        await db.phone_models.update_one(
            {"model_id": model["model_id"]},
            {"$set": model},
            upsert=True
        )
    
    # Seed products
    products = [
        {
            "product_id": "prod_funda_normal",
            "name": "Funda Personalizada Una Pieza",
            "description": "Funda personalizada de una pieza para uso normal. Diseño elegante con tu imagen favorita, protección diaria para tu smartphone.",
            "price": 180.00,
            "category": "funda",
            "base_image_url": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?crop=entropy&cs=srgb&fm=jpg&q=85&w=400",
            "is_customizable": True,
            "is_active": True,
            "stock": 100
        },
        {
            "product_id": "prod_funda_rudo",
            "name": "Funda Personalizada Dos Piezas - Uso Rudo",
            "description": "Funda personalizada de dos piezas para uso rudo. Máxima protección con diseño personalizado, ideal para trabajo pesado y aventuras.",
            "price": 280.00,
            "category": "funda",
            "base_image_url": "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?crop=entropy&cs=srgb&fm=jpg&q=85&w=400",
            "is_customizable": True,
            "is_active": True,
            "stock": 50
        },
    ]
    
    for product in products:
        product["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.products.update_one(
            {"product_id": product["product_id"]},
            {"$set": product},
            upsert=True
        )
    
    return {"message": "Datos iniciales creados correctamente"}

# ==================== HEALTH CHECK ====================

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.68:3000",
        "http://192.168.1.68:8001",
        "http://localhost:8001",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
