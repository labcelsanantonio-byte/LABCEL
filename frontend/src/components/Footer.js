import { Link } from 'react-router-dom';
import { Smartphone, Mail, MapPin, Sparkles } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_78d76407-00e9-4982-b8fe-49b9e45052f0/artifacts/strtt6dl_labcellogo.png";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0F] border-t border-[#00FF88]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="LABCEL" className="h-12 w-12" />
              <span className="font-bold text-xl font-['Orbitron']">
                LABCEL <span className="text-[#00FF88]">San Antonio</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Tu tienda de confianza para fundas personalizadas y accesorios tecnológicos. 
              Diseña tu estilo, protege tu dispositivo con tecnología de vanguardia.
            </p>
            
            {/* Emergent Badge */}
            <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#00FF88]/10 to-[#00D4FF]/10 border border-[#00FF88]/20 rounded px-4 py-2">
              <Sparkles className="h-4 w-4 text-[#00FF88]" />
              <span className="text-xs text-gray-400">
                Creado con <span className="text-[#00FF88] font-semibold">Emergent AI</span>
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 font-['Orbitron'] text-sm tracking-wider">ENLACES</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/catalogo" className="hover:text-[#00FF88] transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/personalizar" className="hover:text-[#00FF88] transition-colors">
                  Personalizar
                </Link>
              </li>
              <li>
                <Link to="/rastrear" className="hover:text-[#00FF88] transition-colors">
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="hover:text-[#00FF88] transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-[#00FF88] transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 font-['Orbitron'] text-sm tracking-wider">CONTACTO</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#00FF88]" />
                <span>+52 749 110 0081</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#00FF88]" />
                <span className="text-xs">labcelsanantonio@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#00FF88] mt-0.5" />
                <span>Calle Motolinea #10,Heroica Ciudad de Calpulalpan, Tlaxcala.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#00FF88]/10 mt-12 pt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} LABCEL San Antonio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
