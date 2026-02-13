import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Smartphone, Palette, Shield, Star, Sparkles, Zap } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_78d76407-00e9-4982-b8fe-49b9e45052f0/artifacts/strtt6dl_labcellogo.png";

const features = [
  {
    icon: Palette,
    title: 'Diseño Único',
    description: 'Crea fundas con tus propias imágenes y diseños personalizados con tecnología de impresión HD.'
  },
  {
    icon: Smartphone,
    title: 'Múltiples Modelos',
    description: 'Compatible con iPhone, Samsung, Xiaomi, Huawei, Motorola y más marcas líderes.'
  },
  {
    icon: Shield,
    title: 'Protección Total',
    description: 'Fundas de una pieza o dos piezas para uso normal o rudo según tus necesidades.'
  },
  {
    icon: Zap,
    title: 'Entrega Rápida',
    description: 'Recoge en tienda o recibe actualizaciones en tiempo real de tu pedido.'
  }
];

const testimonials = [
  {
    name: 'María García',
    text: 'Excelente calidad y el diseño quedó exactamente como lo quería. ¡100% recomendado!',
    rating: 5
  },
  {
    name: 'Carlos Rodríguez',
    text: 'Pedí una funda con la foto de mi mascota y quedó increíble. Muy buen servicio.',
    rating: 5
  },
  {
    name: 'Ana Martínez',
    text: 'La atención al cliente es excelente y la funda es de muy buena calidad.',
    rating: 5
  }
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#0A0A0F]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF88]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#00FF88]/10 text-[#00FF88] px-4 py-2 rounded border border-[#00FF88]/30 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span className="tracking-wider uppercase">Tecnología de Personalización</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Fundas <span className="text-[#00FF88]">Personalizadas</span> para tu Smartphone
              </h1>
              <p className="text-lg text-gray-400 max-w-lg">
                Diseña tu propia funda con imágenes, fotos o arte. 
                Protege tu teléfono con estilo único y tecnología de vanguardia.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/personalizar">
                  <Button className="bg-gradient-to-r from-[#00FF88] to-[#00D4FF] text-[#0A0A0F] font-bold px-8 h-12 rounded hover:opacity-90 transition-opacity" data-testid="hero-cta-personalizar">
                    Crear Mi Funda
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/catalogo">
                  <Button variant="outline" className="border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/10 px-8 h-12 rounded" data-testid="hero-cta-catalogo">
                    Ver Catálogo
                  </Button>
                </Link>
              </div>
              
              {/* Price Tags */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-[#12121A] border border-[#00FF88]/20 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Uso Normal</p>
                  <p className="text-2xl font-bold text-[#00FF88]">$180</p>
                </div>
                <div className="bg-[#12121A] border border-[#00D4FF]/20 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Uso Rudo</p>
                  <p className="text-2xl font-bold text-[#00D4FF]">$280</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={LOGO_URL}
                  alt="LABCEL Mascota"
                  className="w-full max-w-md mx-auto drop-shadow-[0_0_40px_rgba(0,255,136,0.3)]"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-[#00FF88]/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border border-[#00D4FF]/10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              ¿Por qué <span className="text-[#00FF88]">elegirnos</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia en personalización de fundas con tecnología de punta.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-[#12121A] border border-[#00FF88]/10 rounded-lg p-6 hover:border-[#00FF88]/30 transition-colors"
                data-testid={`feature-${index}`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#00FF88]/20 to-[#00D4FF]/20 rounded-lg flex items-center justify-center mb-4 border border-[#00FF88]/30">
                  <feature.icon className="h-6 w-6 text-[#00FF88]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20 relative bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Nuestras <span className="text-[#00FF88]">Fundas</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Dos opciones diseñadas para diferentes estilos de vida.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link 
              to="/personalizar"
              className="group bg-[#12121A] border border-[#00FF88]/10 rounded-lg overflow-hidden hover:border-[#00FF88]/30 transition-all"
              data-testid="product-preview-0"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?crop=entropy&cs=srgb&fm=jpg&q=85&w=500"
                  alt="Funda Una Pieza"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs bg-[#00FF88]/20 text-[#00FF88] px-2 py-1 rounded border border-[#00FF88]/30">
                    Uso Normal
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2 text-white group-hover:text-[#00FF88] transition-colors">
                  Funda Una Pieza
                </h3>
                <ul className="text-sm text-gray-400 space-y-1 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#00FF88] rounded-full" />
                    Diseño elegante
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#00FF88] rounded-full" />
                    Protección diaria
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#00FF88] rounded-full" />
                    Personalización HD
                  </li>
                </ul>
                <p className="text-[#00FF88] font-bold text-2xl">$180</p>
              </div>
            </Link>
            
            <Link 
              to="/personalizar"
              className="group bg-[#12121A] border border-[#00FF88]/10 rounded-lg overflow-hidden hover:border-[#00FF88]/30 transition-all"
              data-testid="product-preview-1"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?crop=entropy&cs=srgb&fm=jpg&q=85&w=500"
                  alt="Funda Dos Piezas"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-1 rounded border border-[#00D4FF]/30">
                    Uso Rudo
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2 text-white group-hover:text-[#00D4FF] transition-colors">
                  Funda Dos Piezas
                </h3>
                <ul className="text-sm text-gray-400 space-y-1 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#00D4FF] rounded-full" />
                    Máxima protección
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#00D4FF] rounded-full" />
                    Doble capa
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#00D4FF] rounded-full" />
                    Ideal para aventuras
                  </li>
                </ul>
                <p className="text-[#00D4FF] font-bold text-2xl">$280</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Lo que dicen nuestros <span className="text-[#00FF88]">clientes</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-[#12121A] border border-[#00FF88]/10 rounded-lg p-6"
                data-testid={`testimonial-${index}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#00FF88] text-[#00FF88]" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-white text-sm">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FF88]/10 to-[#00D4FF]/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            ¿Listo para crear tu funda única?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Sube tu imagen favorita y diseña la funda perfecta para tu teléfono. 
            Es fácil, rápido y el resultado es increíble.
          </p>
          <Link to="/personalizar">
            <Button className="bg-gradient-to-r from-[#00FF88] to-[#00D4FF] text-[#0A0A0F] font-bold px-8 h-12 rounded hover:opacity-90 transition-opacity" data-testid="cta-create-case">
              Comenzar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Emergent Acknowledgment Section */}
      <section className="py-16 border-t border-[#00FF88]/10 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00FF88]/5 to-[#00D4FF]/5 border border-[#00FF88]/20 rounded-lg px-8 py-6">
              <Sparkles className="h-8 w-8 text-[#00FF88]" />
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Powered by</p>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#00FF88] to-[#00D4FF] bg-clip-text text-transparent">
                  EMERGENT AI
                </h3>
                <p className="text-sm text-gray-400 mt-1">Tu IA con la que fue creada esta aplicación</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
              Agradecemos a Emergent por hacer posible esta experiencia tecnológica de vanguardia.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
