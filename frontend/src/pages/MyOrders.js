import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../App';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Package, Eye, Clock, CheckCircle2, Truck, Home, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusConfig = {
  pendiente: { icon: Clock, class: 'status-pendiente', label: 'Pendiente' },
  confirmado: { icon: CheckCircle2, class: 'status-confirmado', label: 'Confirmado' },
  en_proceso: { icon: Package, class: 'status-en_proceso', label: 'En Proceso' },
  enviado: { icon: Truck, class: 'status-enviado', label: 'Enviado' },
  entregado: { icon: Home, class: 'status-entregado', label: 'Entregado' },
  cancelado: { icon: XCircle, class: 'status-cancelado', label: 'Cancelado' }
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00C853] border-t-transparent"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No tienes pedidos</h2>
          <p className="text-gray-600 mb-8">Crea tu primera funda personalizada.</p>
          <Link to="/personalizar">
            <Button className="btn-primary">
              Crear Mi Funda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Mis <span className="text-[#00C853]">Pedidos</span>
      </h1>

      <div className="space-y-4">
        {orders.map((order, index) => {
          const config = statusConfig[order.status] || statusConfig.pendiente;
          const StatusIcon = config.icon;
          const date = new Date(order.created_at);
          
          return (
            <div 
              key={order.order_id}
              className="bg-white rounded-xl shadow-soft p-6"
              data-testid={`order-${index}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Pedido</p>
                  <p className="font-bold mono text-lg">{order.order_id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${config.class} px-3 py-1`}>
                    <StatusIcon className="h-4 w-4 mr-1" />
                    {config.label}
                  </Badge>
                  <Link to={`/rastrear/${order.order_id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t pt-4">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    <strong>Fecha:</strong>{' '}
                    {date.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span>
                    <strong>Productos:</strong> {order.items?.length || 0}
                  </span>
                </div>
                <p className="text-xl font-bold text-[#00C853] mono">
                  ${order.total?.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
