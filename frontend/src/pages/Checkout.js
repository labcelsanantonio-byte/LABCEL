import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../App';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';
import { CheckCircle2, CreditCard, Store, ArrowLeft, Sparkles } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: '',
    customer_whatsapp: '',
    shipping_address: '',
    payment_method: 'transferencia',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/orders', {
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          phone_brand: item.phone_brand,
          phone_model: item.phone_model,
          custom_image_url: item.custom_image_url,
          preview_image_url: item.preview_image_url
        })),
        ...formData
      });

      setOrderId(response.data.order_id);
      setOrderComplete(true);
      clearCart();
      toast.success('¡Pedido creado exitosamente!');
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.detail || 'Error al crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen gradient-bg grid-pattern flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          <div className="card-futuristic p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#00FF88]/20 to-[#00D4FF]/20 rounded-full flex items-center justify-center border border-[#00FF88]/30">
              <CheckCircle2 className="h-10 w-10 text-[#00FF88]" />
            </div>
            <h1 className="text-3xl font-bold font-['Orbitron'] mb-4">¡Pedido Confirmado!</h1>
            <p className="text-gray-400 mb-2">
              Tu pedido ha sido recibido exitosamente.
            </p>
            <p className="text-xl font-bold text-[#00FF88] font-['JetBrains_Mono'] mb-6">
              {orderId}
            </p>
            <p className="text-gray-400 mb-8 text-sm">
              Te contactaremos pronto para confirmar tu diseño y coordinar el pago.
              Recibirás notificaciones por WhatsApp y correo electrónico.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(`/rastrear/${orderId}`)}
                className="btn-futuristic"
                data-testid="track-order-button"
              >
                Rastrear Pedido
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="btn-outline-futuristic"
              >
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/carrito')}
          className="mb-6 text-gray-400 hover:text-[#00FF88]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al carrito
        </Button>

        <h1 className="text-3xl font-bold font-['Orbitron'] mb-8">
          Finalizar <span className="text-[#00FF88]">Compra</span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card-futuristic p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-[#00FF88]" />
                <h2 className="text-xl font-bold font-['Orbitron']">Información de Contacto</h2>
              </div>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="customer_name" className="text-gray-400">Nombre Completo *</Label>
                  <Input
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    className="h-12 mt-1 bg-[#1E1E2E] border-[#00FF88]/20 focus:border-[#00FF88]"
                    data-testid="input-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customer_email" className="text-gray-400">Correo Electrónico *</Label>
                  <Input
                    id="customer_email"
                    name="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                    className="h-12 mt-1 bg-[#1E1E2E] border-[#00FF88]/20 focus:border-[#00FF88]"
                    data-testid="input-email"
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_phone" className="text-gray-400">Teléfono *</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      type="tel"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      required
                      className="h-12 mt-1 bg-[#1E1E2E] border-[#00FF88]/20 focus:border-[#00FF88]"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_whatsapp" className="text-gray-400">WhatsApp (opcional)</Label>
                    <Input
                      id="customer_whatsapp"
                      name="customer_whatsapp"
                      type="tel"
                      value={formData.customer_whatsapp}
                      onChange={handleChange}
                      placeholder="Para notificaciones"
                      className="h-12 mt-1 bg-[#1E1E2E] border-[#00FF88]/20 focus:border-[#00FF88]"
                      data-testid="input-whatsapp"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="shipping_address" className="text-gray-400">Dirección (para entregas a domicilio)</Label>
                  <Textarea
                    id="shipping_address"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 bg-[#1E1E2E] border-[#00FF88]/20 focus:border-[#00FF88]"
                    placeholder="Calle, número, colonia, ciudad, código postal"
                    data-testid="input-address"
                  />
                </div>
              </div>
            </div>

            <div className="card-futuristic p-6">
              <h2 className="text-xl font-bold font-['Orbitron'] mb-6">Método de Pago</h2>
              
              <RadioGroup 
                value={formData.payment_method} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, payment_method: val }))}
                className="space-y-3"
              >
                <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  formData.payment_method === 'transferencia' 
                    ? 'border-[#00FF88] bg-[#00FF88]/5' 
                    : 'border-[#00FF88]/20 hover:border-[#00FF88]/40'
                }`}>
                  <RadioGroupItem value="transferencia" id="transferencia" />
                  <Label htmlFor="transferencia" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-[#00FF88]" />
                      <div>
                        <p className="font-medium">Transferencia Bancaria</p>
                        <p className="text-sm text-gray-500">Se enviarán los datos de cuenta por WhatsApp/Email</p>
                      </div>
                    </div>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  formData.payment_method === 'recoger_tienda' 
                    ? 'border-[#00D4FF] bg-[#00D4FF]/5' 
                    : 'border-[#00FF88]/20 hover:border-[#00FF88]/40'
                }`}>
                  <RadioGroupItem value="recoger_tienda" id="recoger_tienda" />
                  <Label htmlFor="recoger_tienda" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Store className="h-5 w-5 text-[#00D4FF]" />
                      <div>
                        <p className="font-medium">Pago al Recoger en Tienda</p>
                        <p className="text-sm text-gray-500">Recoge y paga tu funda en nuestra tienda</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {formData.payment_method === 'recoger_tienda' && (
                <div className="mt-4 p-4 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-lg">
                  <p className="text-sm text-[#00D4FF] font-medium">📍 Dirección de la tienda:</p>
                  <p className="text-sm text-gray-400 mt-1">San Antonio, TX - Te enviaremos la ubicación exacta por WhatsApp</p>
                </div>
              )}
            </div>

            <div className="card-futuristic p-6">
              <Label htmlFor="notes" className="text-gray-400">Notas adicionales (opcional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-2 bg-[#1E1E2E] border-[#00FF88]/20 focus:border-[#00FF88]"
                placeholder="Instrucciones especiales para tu pedido..."
                data-testid="input-notes"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 btn-futuristic text-lg"
              disabled={loading}
              data-testid="submit-order-button"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                <>Confirmar Pedido - <span className="font-['JetBrains_Mono'] ml-2">${getTotal().toFixed(0)}</span></>
              )}
            </Button>
          </form>

          {/* Order Summary */}
          <div>
            <div className="card-futuristic p-6 sticky top-24">
              <h2 className="text-xl font-bold font-['Orbitron'] mb-6">Resumen del Pedido</h2>
              
              <div className="divide-y divide-[#00FF88]/10">
                {items.map((item, index) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="w-16 h-16 bg-[#1E1E2E] rounded-lg overflow-hidden flex-shrink-0 border border-[#00FF88]/20">
                      {item.preview_image_url && (
                        <img 
                          src={item.preview_image_url} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product_name}</p>
                      {item.phone_brand && (
                        <p className="text-sm text-gray-500">{item.phone_brand} {item.phone_model}</p>
                      )}
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-medium font-['JetBrains_Mono'] text-[#00FF88]">${(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#00FF88]/10 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-['JetBrains_Mono']">${getTotal().toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Envío</span>
                  <span className="text-[#00FF88]">{formData.payment_method === 'recoger_tienda' ? 'Gratis' : 'A coordinar'}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2 border-t border-[#00FF88]/10">
                  <span>Total</span>
                  <span className="text-[#00FF88] font-['JetBrains_Mono']">${getTotal().toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
