import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Package, Search, CheckCircle2, Clock, Truck, Home, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const statusConfig = {
  pendiente: { 
    icon: Clock, 
    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    label: 'Pendiente',
    description: 'Tu pedido está siendo revisado'
  },
  confirmado: { 
    icon: CheckCircle2, 
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    label: 'Confirmado',
    description: 'Tu pedido ha sido confirmado'
  },
  en_proceso: { 
    icon: Package, 
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    label: 'En Proceso',
    description: 'Estamos fabricando tu funda personalizada'
  },
  enviado: { 
    icon: Truck, 
    color: 'text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/30',
    label: 'Enviado / Listo para Recoger',
    description: 'Tu pedido está listo'
  },
  entregado: { 
    icon: Home, 
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    label: 'Entregado',
    description: '¡Tu pedido ha sido entregado!'
  },
  cancelado: { 
    icon: XCircle, 
    color: 'text-red-400 bg-red-400/10 border-red-400/30',
    label: 'Cancelado',
    description: 'Este pedido ha sido cancelado'
  }
};

const statusOrder = ['pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado'];

export default function TrackOrder() {
  const { orderId: paramOrderId } = useParams();
  const navigate = useNavigate();
  
  const [orderId, setOrderId] = useState(paramOrderId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (paramOrderId) {
      fetchOrder(paramOrderId);
    }
  }, [paramOrderId]);

  const fetchOrder = async (id) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.get(`/orders/track/${id}`);
      setOrder(response.data);
    } catch (err) {
      setError('Pedido no encontrado');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/rastrear/${orderId.trim()}`);
      fetchOrder(orderId.trim());
    }
  };

  const currentStatusIndex = order ? statusOrder.indexOf(order.status) : -1;
  const StatusIcon = order ? statusConfig[order.status]?.icon || AlertCircle : null;

  return (
    <div className="min-h-screen gradient-bg grid-pattern py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold font-['Orbitron'] mb-4">
            Rastrear <span className="text-[#00FF88]">Pedido</span>
          </h1>
          <p className="text-gray-400">
            Ingresa tu número de pedido para ver el estado actual
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Número de pedido (ej: ORD-20260203-ABC123)"
                className="pl-12 h-14 text-lg bg-[#1E1E2E] border-[#00FF88]/20 focus:border-[#00FF88]"
                data-testid="track-order-input"
              />
            </div>
            <Button type="submit" className="btn-futuristic h-14 px-8" data-testid="track-order-button">
              Buscar
            </Button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Buscando pedido...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="card-futuristic p-6 text-center border-red-500/30">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 font-medium">{error}</p>
            <p className="text-gray-500 text-sm mt-2">
              Verifica que el número de pedido sea correcto
            </p>
          </div>
        )}

        {/* Order Status */}
        {order && !loading && (
          <div className="card-futuristic overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00FF88]/20 to-[#00D4FF]/20 p-6 border-b border-[#00FF88]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pedido</p>
                  <p className="text-xl font-bold font-['JetBrains_Mono']">{order.order_id}</p>
                </div>
                <div className={`p-3 rounded-lg border ${statusConfig[order.status]?.color || 'bg-gray-500/10'}`}>
                  {StatusIcon && <StatusIcon className="h-6 w-6" />}
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="p-6 border-b border-[#00FF88]/10">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-lg border ${statusConfig[order.status]?.color || 'bg-gray-500/10'}`}>
                  {StatusIcon && <StatusIcon className="h-8 w-8" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-['Orbitron']">
                    {statusConfig[order.status]?.label || order.status}
                  </h2>
                  <p className="text-gray-400">
                    {statusConfig[order.status]?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            {order.status !== 'cancelado' && (
              <div className="p-6 border-b border-[#00FF88]/10">
                <div className="flex items-center justify-between">
                  {statusOrder.slice(0, -1).map((status, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const config = statusConfig[status];
                    const Icon = config.icon;
                    
                    return (
                      <div key={status} className="flex-1 flex flex-col items-center relative">
                        {/* Connector line */}
                        {index < statusOrder.length - 2 && (
                          <div 
                            className={`absolute top-5 left-1/2 w-full h-0.5 ${
                              index < currentStatusIndex ? 'bg-[#00FF88]' : 'bg-[#1E1E2E]'
                            }`}
                          />
                        )}
                        
                        {/* Icon */}
                        <div 
                          className={`relative z-10 w-10 h-10 rounded-lg flex items-center justify-center border ${
                            isCompleted 
                              ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]' 
                              : 'bg-[#1E1E2E] border-[#2A2A2A] text-gray-500'
                          } ${isCurrent ? 'ring-2 ring-[#00FF88]/30' : ''}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        {/* Label */}
                        <span className={`text-xs mt-2 text-center ${
                          isCompleted ? 'text-[#00FF88] font-medium' : 'text-gray-500'
                        }`}>
                          {config.label.split(' / ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* History */}
            {order.status_history && order.status_history.length > 0 && (
              <div className="p-6">
                <h3 className="font-semibold font-['Orbitron'] mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#00FF88]" />
                  Historial de Estado
                </h3>
                <div className="space-y-4">
                  {order.status_history.slice().reverse().map((entry, index) => {
                    const config = statusConfig[entry.status];
                    const Icon = config?.icon || AlertCircle;
                    const date = new Date(entry.timestamp);
                    
                    return (
                      <div key={index} className="flex gap-4">
                        <div className={`p-2 rounded-lg h-fit border ${config?.color || 'bg-gray-500/10 text-gray-400'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{config?.label || entry.status}</p>
                          {entry.notes && (
                            <p className="text-sm text-gray-400">{entry.notes}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1 font-['JetBrains_Mono']">
                            {date.toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
