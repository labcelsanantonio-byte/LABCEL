import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-['Orbitron']">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold font-['Orbitron'] mb-4">
            Catálogo de <span className="text-[#00FF88]">Fundas</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Explora nuestra selección de fundas personalizables. Elige tu favorita y crea un diseño único.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-[#1E1E2E] border-[#00FF88]/20 focus:border-[#00FF88]"
              data-testid="search-input"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 h-12 bg-[#1E1E2E] border-[#00FF88]/20" data-testid="sort-select">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="bg-[#1E1E2E] border-[#00FF88]/20">
              <SelectItem value="name">Nombre</SelectItem>
              <SelectItem value="price_asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price_desc">Precio: Mayor a Menor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
            {searchTerm && (
              <Button 
                variant="link" 
                onClick={() => setSearchTerm('')}
                className="text-[#00FF88] mt-2"
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-8">
            {filteredProducts.map((product, index) => (
              <Link
                key={product.product_id}
                to={`/personalizar/${product.product_id}`}
                className="group card-futuristic overflow-hidden"
                data-testid={`product-card-${index}`}
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#1E1E2E] relative">
                  {product.base_image_url ? (
                    <img 
                      src={product.base_image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    {product.is_customizable && (
                      <span className="flex items-center gap-1 text-xs bg-[#00FF88]/20 text-[#00FF88] px-3 py-1 rounded border border-[#00FF88]/30 font-medium">
                        <Sparkles className="h-3 w-3" />
                        Personalizable
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2 font-['Orbitron'] group-hover:text-[#00FF88] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#00FF88] font-bold text-2xl font-['JetBrains_Mono']">
                      ${product.price.toFixed(0)}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {product.price === 180 ? 'Uso Normal' : 'Uso Rudo'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
