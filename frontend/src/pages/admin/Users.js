import { useState, useEffect } from 'react';
import { apiClient } from '../../App';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Users, Shield, ShieldOff, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, user: null, action: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    const { user: targetUser, action } = confirmDialog;
    const newRole = action === 'make_admin' ? 'admin' : 'customer';
    
    try {
      await apiClient.put(`/users/${targetUser.user_id}/role`, { role: newRole });
      toast.success(`Rol actualizado a ${newRole === 'admin' ? 'Administrador' : 'Cliente'}`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al actualizar rol');
    } finally {
      setConfirmDialog({ open: false, user: null, action: '' });
    }
  };

  const openConfirmDialog = (user, action) => {
    setConfirmDialog({ open: true, user, action });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-gray-600">Gestiona los usuarios y sus roles</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00C853] border-t-transparent"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-soft">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-soft overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => {
                  const isCurrentUser = user.user_id === currentUser?.user_id;
                  
                  return (
                    <TableRow key={user.user_id} data-testid={`user-row-${index}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.picture ? (
                            <img 
                              src={user.picture} 
                              alt={user.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{user.name}</p>
                            {isCurrentUser && (
                              <span className="text-xs text-gray-500">(Tú)</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}>
                          {user.role === 'admin' ? (
                            <>
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            'Cliente'
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {!isCurrentUser && (
                          user.role === 'admin' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => openConfirmDialog(user, 'remove_admin')}
                            >
                              <ShieldOff className="h-4 w-4 mr-1" />
                              Quitar Admin
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmDialog(user, 'make_admin')}
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Hacer Admin
                            </Button>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === 'make_admin' ? '¿Hacer Administrador?' : '¿Quitar Rol de Admin?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action === 'make_admin' 
                ? `¿Estás seguro de que deseas hacer a ${confirmDialog.user?.name} administrador? Tendrá acceso completo al panel de control.`
                : `¿Estás seguro de que deseas quitar el rol de administrador a ${confirmDialog.user?.name}? Perderá acceso al panel de control.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRoleChange}
              className={confirmDialog.action === 'remove_admin' ? 'bg-red-600 hover:bg-red-700' : 'btn-primary'}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
