import { useState, useEffect, FormEvent } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Menu, 
  X, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Check,
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  tag?: string;
  image: string;
}

interface CartItem {
  id: number;
  quantity: number;
}

const categories = [
  {
    id: 'cat1',
    name: 'Feminina',
    items: '7 peças',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cat2',
    name: 'Masculino',
    items: '5 peças',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cat3',
    name: 'Acessórios',
    items: '5 peças',
    image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cat4',
    name: 'Oferta',
    items: 'Até 50% off',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop'
  }
];

const products = [
  {
    id: 1,
    name: 'Blusa Linho Clássica',
    category: 'Feminina',
    price: 189,
    tag: 'Mais Vendido',
    image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Calça Alfaiataria Noir',
    category: 'Feminina',
    price: 259,
    oldPrice: 320,
    tag: 'Oferta',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Trench Coat Atemporal',
    category: 'Feminina',
    price: 499,
    tag: 'Novo',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Vestido Slip Seda',
    category: 'Feminina',
    price: 389,
    oldPrice: 480,
    tag: 'Oferta',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Camila Rodrigues',
    role: 'Designer de Interiores',
    text: 'Simplesmente apaixonada pela qualidade das peças! O vestido que comprei chegou impecável, tecido macio e o caimento é perfeito.',
    image: 'https://i.pravatar.cc/150?u=camila'
  },
  {
    id: 2,
    name: 'Lucas Ferreira',
    role: 'Arquiteto',
    text: 'Comprei uma jaqueta de couro e o acabamento superou todas as expectativas. O atendimento foi excelente e a entrega foi super rápida.',
    image: 'https://i.pravatar.cc/150?u=lucas'
  },
  {
    id: 3,
    name: 'Isabela Santos',
    role: 'Professora',
    text: 'Uma das lojas mais elegantes que já comprei online. As fotos são fiéis ao produto real, e o tamanho ficou exato.',
    image: 'https://i.pravatar.cc/150?u=isabela'
  }
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.id);
    return acc + (product ? product.price * item.quantity : 0);
  }, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1000);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-sans text-stone-900 overflow-x-hidden">
      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
          >
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 flex items-center gap-4 border-b border-stone-100">
                <Search className="text-stone-400" size={24} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="O que você está procurando?"
                  className="flex-1 bg-transparent border-none outline-none text-lg text-stone-900 placeholder:text-stone-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              {searchQuery && (
                <div className="max-h-[60vh] overflow-y-auto p-6">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Resultados para "{searchQuery}"</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredProducts.map(product => (
                      <div key={product.id} className="flex gap-4 group cursor-pointer" onClick={() => setIsSearchOpen(false)}>
                        <div className="w-20 h-24 bg-stone-100 rounded-xl overflow-hidden shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-bold text-stone-900 group-hover:text-amber-600 transition-colors">{product.name}</h4>
                          <p className="text-stone-400 text-xs uppercase tracking-widest mt-1">{product.category}</p>
                          <span className="font-black text-stone-900 mt-2">R$ {product.price}</span>
                        </div>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && (
                      <div className="col-span-full py-12 text-center">
                        <p className="text-stone-400 italic">Nenhum produto encontrado para sua busca.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wishlist Modal */}
      <AnimatePresence>
        {isWishlistOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsWishlistOpen(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-stone-900 font-serif">Favoritos</h3>
                <button onClick={() => setIsWishlistOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors cursor-pointer">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                {wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Heart size={48} className="text-stone-100 mb-6" />
                    <p className="text-stone-500 font-light">Sua lista de desejos está vazia.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {wishlist.map(id => {
                      const product = products.find(p => p.id === id);
                      if (!product) return null;
                      return (
                        <div key={id} className="flex gap-4 group">
                          <div className="w-24 h-32 bg-stone-100 rounded-2xl overflow-hidden shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-2">
                            <div>
                              <h4 className="font-bold text-stone-900">{product.name}</h4>
                              <p className="text-stone-400 text-xs uppercase tracking-widest mt-1">{product.category}</p>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-black text-stone-900">R$ {product.price}</span>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => toggleWishlist(id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                                >
                                  <Trash2 size={18} />
                                </button>
                                <button 
                                  onClick={() => {
                                    addToCart(id);
                                    setIsWishlistOpen(false);
                                  }}
                                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
                                >
                                  <ShoppingBag size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-10 h-16 md:h-20 flex items-center justify-between ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <h1 className={`text-2xl font-bold tracking-tighter ${isScrolled ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: 'Playfair Display, serif' }}>
            LUMINA
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { name: 'Feminina', id: 'categorias' },
            { name: 'Masculino', id: 'categorias' },
            { name: 'Acessórios', id: 'categorias' },
            { name: 'Oferta', id: 'shop' },
            { name: 'Sobre', id: 'sobre' }
          ].map((item) => (
            <button 
              key={item.name}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-medium tracking-wide transition-colors hover:opacity-70 cursor-pointer ${
                isScrolled ? 'text-stone-900' : 'text-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className={`p-2 transition-colors hover:opacity-70 cursor-pointer ${isScrolled ? 'text-stone-900' : 'text-white'}`}
          >
            <Search size={20} />
          </button>
          <button 
            onClick={() => setIsWishlistOpen(true)}
            className={`p-2 transition-colors hover:opacity-70 cursor-pointer relative ${isScrolled ? 'text-stone-900' : 'text-white'}`}
          >
            <Heart size={20} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className={`p-2 relative transition-colors hover:opacity-70 cursor-pointer ${isScrolled ? 'text-stone-900' : 'text-white'}`}
          >
            <ShoppingBag size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] flex items-center justify-center rounded-full">
                {cartItemsCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 transition-colors hover:opacity-70 cursor-pointer relative z-[60] ${
              isMenuOpen ? 'text-stone-900' : (isScrolled ? 'text-stone-900' : 'text-white')
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-center">
              {[
                { name: 'Feminina', id: 'categorias' },
                { name: 'Masculino', id: 'categorias' },
                { name: 'Acessórios', id: 'categorias' },
                { name: 'Oferta', id: 'shop' },
                { name: 'Sobre', id: 'sobre' }
              ].map((item) => (
                <button 
                  key={item.name} 
                  onClick={() => scrollToSection(item.id)}
                  className="text-2xl font-serif font-bold text-stone-900"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Fashion" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-[0.3em] uppercase">
              Nova Coleção 2026
            </span>
            <h2 className="text-white font-black leading-[0.9] mb-8" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}>
              Elegância <br />
              <span className="italic font-normal text-white/90">Que Define</span> <br />
              Você
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light">
              Descubra peças exclusivas desenhadas para quem valoriza a sofisticação e o estilo atemporal em cada detalhe.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => scrollToSection('categorias')}
                className="w-full sm:w-auto bg-white text-stone-900 font-bold text-sm px-10 py-5 rounded-full hover:bg-stone-100 transition-all duration-300 tracking-widest uppercase shadow-xl cursor-pointer"
              >
                Explorar Coleção
              </button>
              <button 
                onClick={() => scrollToSection('shop')}
                className="w-full sm:w-auto border border-white/40 text-white font-bold text-sm px-10 py-5 rounded-full hover:bg-white/10 transition-all duration-300 tracking-widest uppercase backdrop-blur-sm cursor-pointer"
              >
                Mais Vendidos
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-50 cursor-pointer" onClick={() => scrollToSection('categorias')}>
          <span className="text-white text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-white/40"></div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categorias" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 block">Curadoria</span>
          <h3 className="text-4xl md:text-5xl font-black text-stone-900" style={{ fontFamily: 'Playfair Display, serif' }}>Nossas Categorias</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => scrollToSection('shop')}
              className="group relative h-[450px] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">{cat.items}</p>
                <h4 className="text-white text-2xl font-bold mb-4 font-serif">{cat.name}</h4>
                <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  Ver Tudo <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Product Section */}
      <section className="bg-stone-900 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 rounded-2xl overflow-hidden aspect-[4/5]"
            >
              <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop" 
                alt="Featured" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -top-10 -left-10 w-40 h-40 border border-white/10 rounded-full hidden md:block"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl"></div>
          </div>

          <div className="w-full lg:w-1/2 text-white">
            <span className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Destaque da Estação</span>
            <h3 className="text-4xl md:text-6xl font-black mb-8 leading-tight font-serif">
              Coleção <br />
              <span className="italic font-normal text-white/80">Seda & Linho</span>
            </h3>
            <p className="text-white/60 text-lg mb-10 leading-relaxed font-light">
              Uma fusão perfeita entre o conforto natural do linho e a sofisticação incomparável da seda. Peças criadas para durar gerações.
            </p>
            <div className="space-y-4 mb-12">
              {['Acabamento artesanal premium', 'Tecidos 100% naturais', 'Design minimalista e versátil'].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-amber-600/20 flex items-center justify-center">
                    <Check size={14} className="text-amber-600" />
                  </div>
                  <span className="text-white/80 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => scrollToSection('shop')}
              className="bg-white text-stone-900 font-bold text-sm px-10 py-5 rounded-full hover:bg-stone-100 transition-all duration-300 tracking-widest uppercase cursor-pointer"
            >
              Ver Coleção Completa
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="shop" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 block">Shop</span>
            <h3 className="text-4xl md:text-5xl font-black text-stone-900 font-serif">Mais Vendidos</h3>
          </div>
          <button className="text-stone-500 font-bold text-sm uppercase tracking-widest border-b-2 border-stone-200 pb-1 hover:text-stone-900 hover:border-stone-900 transition-all cursor-pointer">
            Ver Todos os Produtos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {product.tag && (
                  <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase ${
                    product.tag === 'Oferta' ? 'bg-red-500 text-white' : 'bg-stone-900 text-white'
                  }`}>
                    {product.tag}
                  </span>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                >
                  <Heart size={18} className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-stone-600'} />
                </button>
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product.id);
                    }}
                    className="w-full bg-stone-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 shadow-xl cursor-pointer"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-2">{product.category}</p>
              <h4 className="text-stone-900 font-bold text-lg mb-2">{product.name}</h4>
              <div className="flex items-center gap-3">
                <span className="text-stone-900 font-black text-xl">R$ {product.price}</span>
                {product.oldPrice && (
                  <span className="text-stone-400 line-through text-sm">R$ {product.oldPrice}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-stone-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 block">Feedback</span>
            <h3 className="text-4xl md:text-5xl font-black text-stone-900 font-serif">O Que Dizem Nossos Clientes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-600 text-lg leading-relaxed mb-8 italic">"{t.text}"</p>
                <div className="mt-auto flex items-center gap-4 pt-6 border-t border-stone-50">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h5 className="text-stone-900 font-bold">{t.name}</h5>
                    <p className="text-stone-400 text-xs font-medium uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-stone-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h3 className="text-white text-3xl md:text-5xl font-black mb-6 font-serif">Junte-se à Nossa Comunidade</h3>
            <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto font-light">
              Receba novidades exclusivas, acesso antecipado a novas coleções e 10% de desconto na sua primeira compra.
            </p>
            <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white focus:outline-none focus:border-white/30 transition-all"
              />
              <button 
                type="submit"
                disabled={formStatus !== 'idle'}
                className="bg-white text-stone-900 font-bold text-sm px-10 py-5 rounded-full hover:bg-stone-100 transition-all tracking-widest uppercase cursor-pointer disabled:opacity-50"
              >
                {formStatus === 'idle' ? 'Inscrever-se' : formStatus === 'sending' ? 'Enviando...' : 'Bem-vindo!'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="sobre" className="bg-white border-t border-stone-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-8">
              <h1 className="text-3xl font-bold tracking-tighter font-serif">LUMINA</h1>
              <p className="text-stone-500 leading-relaxed font-light">
                Moda com propósito. Criamos peças que duram, respeitam o planeta e fazem você se sentir em sua melhor versão.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white transition-all cursor-pointer">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-stone-900 font-bold text-xs uppercase tracking-[0.2em] mb-8">Comprar</h5>
              <ul className="space-y-4">
                {['Feminina', 'Masculino', 'Acessórios', 'Ofertas', 'Novidades'].map((item) => (
                  <li key={item}>
                    <button onClick={() => scrollToSection('shop')} className="text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium cursor-pointer">{item}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-stone-900 font-bold text-xs uppercase tracking-[0.2em] mb-8">Ajuda</h5>
              <ul className="space-y-4">
                {['Central de Ajuda', 'Envios e Devoluções', 'Tamanhos e Medidas', 'Fale Conosco', 'Privacidade'].map((item) => (
                  <li key={item}>
                    <button className="text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium cursor-pointer">{item}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-stone-900 font-bold text-xs uppercase tracking-[0.2em] mb-8">Contato</h5>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin size={18} className="text-amber-600 shrink-0" />
                  <span className="text-stone-500 text-sm leading-relaxed">Rua Augusta, 1234 — São Paulo, SP</span>
                </li>
                <li className="flex items-start gap-4">
                  <Phone size={18} className="text-amber-600 shrink-0" />
                  <span className="text-stone-500 text-sm leading-relaxed">+55 (11) 98765-4321</span>
                </li>
                <li className="flex items-start gap-4">
                  <Mail size={18} className="text-amber-600 shrink-0" />
                  <span className="text-stone-500 text-sm leading-relaxed">contato@lumina.com.br</span>
                </li>
                <li className="flex items-start gap-4">
                  <Clock size={18} className="text-amber-600 shrink-0" />
                  <span className="text-stone-500 text-sm leading-relaxed">Seg–Sex: 9h–18h | Sáb: 10h-15h</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6 text-stone-400 text-xs font-medium uppercase tracking-widest">
            <p>© 2026 Lumina Fashion. Todos os direitos reservados.</p>
            <div className="flex gap-8">
              <button className="hover:text-stone-900 transition-colors cursor-pointer">Termos</button>
              <button className="hover:text-stone-900 transition-colors cursor-pointer">Privacidade</button>
              <button className="hover:text-stone-900 transition-colors cursor-pointer">Cookies</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] cursor-pointer"
            />
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-8 border-b border-stone-100">
                <div className="flex items-center gap-4">
                  <ShoppingBag size={24} className="text-stone-900" />
                  <h2 className="text-2xl font-bold font-serif">Meu Carrinho</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-8">
                      <ShoppingBag size={40} className="text-stone-200" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-4 font-serif">Seu carrinho está vazio</h3>
                    <p className="text-stone-500 mb-10 leading-relaxed font-light">
                      Parece que você ainda não adicionou nenhuma peça incrível ao seu carrinho.
                    </p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="w-full bg-stone-900 text-white font-bold text-sm px-10 py-5 rounded-full hover:bg-stone-800 transition-all tracking-widest uppercase shadow-lg cursor-pointer"
                    >
                      Começar a Comprar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map((item) => {
                      const product = products.find(p => p.id === item.id);
                      if (!product) return null;
                      return (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-24 h-32 bg-stone-100 rounded-xl overflow-hidden shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-stone-900">{product.name}</h4>
                                <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer">
                                  <X size={16} />
                                </button>
                              </div>
                              <p className="text-stone-400 text-xs uppercase tracking-widest mt-1">{product.category}</p>
                            </div>
                            <div className="flex justify-between items-end">
                              <div className="flex items-center border border-stone-200 rounded-full px-3 py-1 gap-4">
                                <button onClick={() => updateQuantity(item.id, -1)} className="text-stone-400 hover:text-stone-900 cursor-pointer">-</button>
                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="text-stone-400 hover:text-stone-900 cursor-pointer">+</button>
                              </div>
                              <span className="font-black text-stone-900">R$ {product.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-stone-100 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-medium">Subtotal</span>
                    <span className="text-2xl font-black text-stone-900">R$ {cartTotal}</span>
                  </div>
                  <button className="w-full bg-amber-600 text-white font-bold text-sm px-10 py-5 rounded-full hover:bg-amber-700 transition-all tracking-widest uppercase shadow-lg cursor-pointer">
                    Finalizar Compra
                  </button>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-stone-900 text-white font-bold text-sm px-10 py-5 rounded-full hover:bg-stone-800 transition-all tracking-widest uppercase shadow-lg cursor-pointer"
                  >
                    Continuar Comprando
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
