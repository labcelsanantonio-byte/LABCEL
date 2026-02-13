import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  ChevronLeft,
  LogOut,
  Home
} from 'lucide-react';
import { Button } from './ui/button';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_78d76407-00e9-4982-b8fe-49b9e45052f0/artifacts/strtt6dl_labcellogo.png";

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/productos', icon: Package, label: 'Productos' },
  { href: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
  { href: '/admin/usuarios', icon: Users, label: 'Usuarios' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-soft fixed h-full z-40 hidden lg:block">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="LABCEL" className="h-10 w-10" />
            <div>
              <span className="font-bold block">LABCEL</span>
              <span className="text-xs text-gray-500">Panel Admin</span>
            </div>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#00C853]/10 text-[#00C853] font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mb-2"
          >
            <Home className="h-5 w-5" />
            Volver a la tienda
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Volver</span>
          </Link>
          <span className="font-bold">Panel Admin</span>
          <div className="w-20"></div>
        </div>
        {/* Mobile nav */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap text-sm ${
                  isActive 
                    ? 'bg-[#00C853] text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-6 pt-32 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
