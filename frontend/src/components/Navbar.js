import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, ShoppingCart, User, LogOut, Package, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_78d76407-00e9-4982-b8fe-49b9e45052f0/artifacts/strtt6dl_labcellogo.png";

export default function Navbar() {
  const { user, login, logout, loading } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/personalizar', label: 'Personalizar' },
    { href: '/rastrear', label: 'Rastrear Pedido' },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-[#00FF88]/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="nav-logo">
            <img 
              src={LOGO_URL} 
              alt="LABCEL San Antonio" 
              className="h-10 w-10 object-contain transition-all group-hover:drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]"
            />
            <span className="font-bold text-lg tracking-tight hidden sm:block font-['Orbitron']">
              LABCEL <span className="text-[#00FF88]">San Antonio</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-gray-300 hover:text-[#00FF88] transition-colors relative group"
                data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00FF88] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link 
              to="/carrito" 
              className="relative p-2 hover:bg-[#00FF88]/10 rounded-lg transition-colors border border-transparent hover:border-[#00FF88]/30"
              data-testid="nav-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00FF88] text-[#0A0A0F] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center font-['JetBrains_Mono']">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {loading ? (
              <div className="w-8 h-8 rounded-lg bg-[#1E1E2E] animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-[#00FF88]/10" data-testid="user-menu-trigger">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-lg border border-[#00FF88]/30" />
                    ) : (
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#00FF88] to-[#00D4FF] flex items-center justify-center text-[#0A0A0F] font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#12121A] border-[#00FF88]/20">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                  <div className="px-2 pb-1.5 text-xs text-gray-500">{user.email}</div>
                  <DropdownMenuSeparator className="bg-[#00FF88]/10" />
                  <DropdownMenuItem onClick={() => navigate('/mis-pedidos')} className="hover:bg-[#00FF88]/10 cursor-pointer" data-testid="menu-my-orders">
                    <Package className="mr-2 h-4 w-4" />
                    Mis Pedidos
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-[#00FF88]/10" />
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-[#00FF88]/10 cursor-pointer" data-testid="menu-admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Panel Admin
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-[#00FF88]/10" />
                  <DropdownMenuItem onClick={logout} className="text-red-400 hover:bg-red-500/10 cursor-pointer" data-testid="menu-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={login} 
                className="btn-futuristic text-sm h-10 px-6"
                data-testid="nav-login"
              >
                Iniciar Sesión
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-[#00FF88]/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-[#0A0A0F] border-l border-[#00FF88]/20">
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-[#00FF88] transition-colors font-['Orbitron']"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user && (
                    <>
                      <hr className="border-[#00FF88]/10" />
                      <Link
                        to="/mis-pedidos"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-medium hover:text-[#00FF88] transition-colors"
                      >
                        Mis Pedidos
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-lg font-medium hover:text-[#00FF88] transition-colors"
                        >
                          Panel Admin
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
