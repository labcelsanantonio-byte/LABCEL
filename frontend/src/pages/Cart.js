import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen gradient-bg grid-pattern flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#1E1E2E] rounded-full flex items-center justify-center border border-[#00FF88]/20">
            <ShoppingBag className="h-12 w-12 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold font-['Orbitron'] mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-8">Agrega productos personalizados para comenzar.</p>
          <Link to="/personalizar">
            <Button className="btn-futuristic" data-testid="empty-cart-cta">
              Crear Mi Funda
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-['Orbitron'] mb-8">
          Carrito de <span className="text-[#00FF88]">Compras</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.id}
                className="card-futuristic p-4 flex gap-4"
                data-testid={`cart-item-${index}`}
              >
                {/* Preview Image */}
                <div className="w-24 h-24 bg-[#1E1E2E] rounded-lg overflow-hidden flex-shrink-0 border border-[#00FF88]/20">
                  {item.preview_image_url ? (
                    <img 
                      src={item.preview_image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.product_name}</h3>
                  {item.phone_brand && item.phone_model && (
                    <p className="text-sm text-gray-500">
                      {item.phone_brand} {item.phone_model}
                    </p>
                  )}
                  <p className="text-[#00FF88] font-bold font-['JetBrains_Mono'] mt-1">
                    ${item.price.toFixed(0)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-[#00FF88]/30 hover:bg-[#00FF88]/10"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium font-['JetBrains_Mono']">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-[#00FF88]/30 hover:bg-[#00FF88]/10"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                  onClick={() => removeItem(item.id)}
                  data-testid={`remove-item-${index}`}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}

            {/* Clear Cart */}
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-red-400"
              onClick={clearCart}
            >
              Vaciar carrito
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-futuristic p-6 sticky top-24">
              <h2 className="text-xl font-bold font-['Orbitron'] mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'})</span>
                  <span className="font-['JetBrains_Mono']">${getTotal().toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Envío</span>
                  <span className="text-[#00FF88]">A calcular</span>
                </div>
                <div className="border-t border-[#00FF88]/10 pt-3 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-[#00FF88] font-['JetBrains_Mono']">${getTotal().toFixed(0)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full btn-futuristic h-12"
                data-testid="checkout-button"
              >
                Proceder al Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Link to="/personalizar" className="block mt-4">
                <Button variant="outline" className="w-full btn-outline-futuristic">
                  Seguir Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
