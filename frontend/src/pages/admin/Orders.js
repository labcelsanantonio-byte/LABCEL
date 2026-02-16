import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../App';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { 
  Eye, 
  Clock, 
  CheckCircle2, 
  Package, 
  Truck, 
  Home, 
  XCircle,
  Send,
  Download,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

const statusConfig = {
  pendiente: { icon: Clock, class: 'status-pendiente', label: 'Pendiente' },
  confirmado: { icon: CheckCircle2, class: 'status-confirmado', label: 'Confirmado' },
  en_proceso: { icon: Package, class: 'status-en_proceso', label: 'En Proceso' },
  enviado: { icon: Truck, class: 'status-enviado', label: 'Enviado' },
  entregado: { icon: Home, class: 'status-entregado', label: 'Entregado' },
  cancelado: { icon: XCircle, class: 'status-cancelado', label: 'Cancelado' }
};

const statusOptions = ['pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado', 'cancelado'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' });
  const [proposal, setProposal] = useState({ 
    proposal_image_url: '', 
    message: '',
    send_via_whatsapp: true,
    send_via_email: true
  });

  const fetchOrders = useCallback(async () => {
    try {
      const url = filterStatus === 'all' ? '/orders' : `/orders?status=${filterStatus}`;
      const response = await apiClient.get(url);
      setOrders(response.data);
    } catch (error) {
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setStatusUpdate({ status: order.status, notes: '' });
    setDetailsOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!statusUpdate.status) return;
    
    try {
      await apiClient.put(`/orders/${selectedOrder.order_id}/status`, statusUpdate);
      toast.success('Estado actualizado');
      setDetailsOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleSendProposal = async () => {
    if (!proposal.proposal_image_url || !proposal.message) {
      toast.error('Completa todos los campos');
      return;
    }
    
    try {
      await apiClient.post(`/orders/${selectedOrder.order_id}/design-proposal`, {
        order_id: selectedOrder.order_id,
        ...proposal
      });
      toast.success('Propuesta enviada');
      setProposalOpen(false);
      setProposal({ proposal_image_url: '', message: '', send_via_whatsapp: true, send_via_email: true });
    } catch (error) {
      toast.error('Error al enviar propuesta');
    }
  };

  const handleApproveDesign = async (orderId) => {
    try {
      await apiClient.put(`/orders/${orderId}/approve-design`);
      toast.success('Diseño aprobado');
      fetchOrders();
      setDetailsOpen(false);
    } catch (error) {
      toast.error('Error al aprobar diseño');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Pedidos</h1>
            <p className="text-gray-600">Gestiona los pedidos de tus clientes</p>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48" data-testid="filter-status">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {statusConfig[status].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00C853] border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-soft">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No hay pedidos {filterStatus !== 'all' && `con estado "${statusConfig[filterStatus]?.label}"`}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-soft overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => {
                  const config = statusConfig[order.status] || statusConfig.pendiente;
                  return (
                    <TableRow key={order.order_id} data-testid={`order-row-${index}`}>
                      <TableCell className="font-medium mono text-sm">
                        {order.order_id}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">{order.customer_email}</p>
                      </TableCell>
                      <TableCell>{order.items?.length || 0}</TableCell>
                      <TableCell className="mono font-medium text-[#00C853]">
                        ${order.total?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${config.class} px-2 py-1`}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Pedido</p>
                  <p className="font-bold mono">{selectedOrder.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-[#00C853] mono">${selectedOrder.total?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Método de Pago</p>
                  <p className="font-medium capitalize">{selectedOrder.payment_method?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Diseño Aprobado</p>
                  <p className={`font-medium ${selectedOrder.design_approved ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedOrder.design_approved ? 'Sí' : 'Pendiente'}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">Cliente</h3>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <p><strong>Nombre:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p><strong>Teléfono:</strong> {selectedOrder.customer_phone}</p>
                  {selectedOrder.customer_whatsapp && (
                    <p><strong>WhatsApp:</strong> {selectedOrder.customer_whatsapp}</p>
                  )}
                  <p><strong>Dirección:</strong> {selectedOrder.shipping_address}</p>
                  {selectedOrder.notes && (
                    <p><strong>Notas:</strong> {selectedOrder.notes}</p>
                  )}
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-semibold mb-2">Productos</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      {item.preview_image_url && (
                        <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                          <img src={item.preview_image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        {item.phone_brand && (
                          <p className="text-sm text-gray-500">{item.phone_brand} {item.phone_model}</p>
                        )}
                        <p className="text-sm">Cantidad: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                      {item.custom_image_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.preview_image_url} download target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-1" />
                            Imagen
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold mb-2">Actualizar Estado</h3>
                <div className="space-y-3">
                  <Select 
                    value={statusUpdate.status} 
                    onValueChange={(val) => setStatusUpdate(prev => ({ ...prev, status: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>
                          {statusConfig[status].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Notas (opcional)"
                    value={statusUpdate.notes}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                  />
                  <Button onClick={handleUpdateStatus} className="w-full btn-primary">
                    Actualizar Estado
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {!selectedOrder.design_approved && (
                  <Button 
                    variant="outline"
                    onClick={() => handleApproveDesign(selectedOrder.order_id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Aprobar Diseño
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => {
                    setProposalOpen(true);
                  }}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Enviar Propuesta
                </Button>
                {selectedOrder.customer_whatsapp && (
                  <Button variant="outline" asChild>
                    <a 
                      href={`https://wa.me/${selectedOrder.customer_whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Design Proposal Dialog */}
      <Dialog open={proposalOpen} onOpenChange={setProposalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Propuesta de Diseño</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>URL de la Imagen de Propuesta</Label>
              <Input
                value={proposal.proposal_image_url}
                onChange={(e) => setProposal(prev => ({ ...prev, proposal_image_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Mensaje</Label>
              <Textarea
                value={proposal.message}
                onChange={(e) => setProposal(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                placeholder="Hola, adjunto la propuesta de diseño para tu funda..."
                className="mt-1"
              />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={proposal.send_via_whatsapp}
                  onChange={(e) => setProposal(prev => ({ ...prev, send_via_whatsapp: e.target.checked }))}
                  className="rounded"
                />
                WhatsApp
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={proposal.send_via_email}
                  onChange={(e) => setProposal(prev => ({ ...prev, send_via_email: e.target.checked }))}
                  className="rounded"
                />
                Email
              </label>
            </div>
            <Button onClick={handleSendProposal} className="w-full btn-primary">
              Enviar Propuesta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
