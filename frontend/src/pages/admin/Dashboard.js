import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../App';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Package, Users, ShoppingCart, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/orders?status=pendiente')
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      title: 'Pedidos Totales',
      value: stats.total_orders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      link: '/admin/pedidos'
    },
    {
      title: 'Pedidos Pendientes',
      value: stats.pending_orders,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/admin/pedidos?status=pendiente'
    },
    {
      title: 'Ingresos Totales',
      value: `$${stats.total_revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Usuarios Registrados',
      value: stats.total_users,
      icon: Users,
      color: 'bg-purple-500',
      link: '/admin/usuarios'
    }
  ] : [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Panel de control de LABCEL San Antonio</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00C853] border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <Card key={index} className="shadow-soft" data-testid={`stat-card-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold mt-1 mono">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-full text-white`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                    {stat.link && (
                      <Link 
                        to={stat.link}
                        className="text-sm text-[#00C853] hover:underline mt-2 inline-block"
                      >
                        Ver detalles →
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pending Orders */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    Pedidos Pendientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay pedidos pendientes</p>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order, index) => (
                        <div 
                          key={order.order_id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium mono text-sm">{order.order_id}</p>
                            <p className="text-sm text-gray-500">{order.customer_name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#00C853] mono">${order.total?.toFixed(2)}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Link 
                        to="/admin/pedidos"
                        className="block text-center text-[#00C853] hover:underline text-sm"
                      >
                        Ver todos los pedidos →
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#00C853]" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <Link
                      to="/admin/productos"
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="bg-blue-500 p-3 rounded-full text-white">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Gestionar Productos</p>
                        <p className="text-sm text-gray-500">Agregar, editar o eliminar productos</p>
                      </div>
                    </Link>
                    <Link
                      to="/admin/pedidos"
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="bg-yellow-500 p-3 rounded-full text-white">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Ver Pedidos</p>
                        <p className="text-sm text-gray-500">Revisar y actualizar estados</p>
                      </div>
                    </Link>
                    <Link
                      to="/admin/usuarios"
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="bg-purple-500 p-3 rounded-full text-white">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Gestionar Usuarios</p>
                        <p className="text-sm text-gray-500">Administrar roles y permisos</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
