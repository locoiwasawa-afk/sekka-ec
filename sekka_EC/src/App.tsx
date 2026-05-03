/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ShoppingBag, Menu, X, ArrowDown, Instagram, MessageCircle } from 'lucide-react';

// --- Data Types ---
interface Product {
  id: string;
  name: string;
  material: string;
  price: number;
  image: string;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  { id: '1', name: 'FUBUKI Ring', material: 'Pt950 / Diamond 0.2ct', price: 185000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' },
  { id: '2', name: 'SHIRAYUKI Necklace', material: 'K18WG / Diamond 0.1ct', price: 145000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' },
  { id: '3', name: 'KOORI Pierced Earrings', material: 'Pt950 / Diamond', price: 128000, image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800' },
  { id: '4', name: 'TSURARA Bracelet', material: 'Pt950 / Slim Chain', price: 240000, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' },
  { id: '5', name: 'HANA Ring', material: 'K18YG / Petit Diamond', price: 88000, image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=800' },
  { id: '6', name: 'KIRA Necklace', material: 'Pt950 / Diamond 0.3ct', price: 280000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800' },
];

const NEWS = [
  { date: '2026.05.01', title: '雪華 -SEKKA- グランドオープン' },
  { date: '2026.05.15', title: '伊勢丹新宿店 POP-UP STORE' },
  { date: '2026.06.01', title: 'Summer Collection 発表' },
];

// --- Components ---

const Reveal = ({ children, width = "100%", delay = 0 }: { children: React.ReactNode, width?: string, delay?: number, key?: React.Key }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width }} className={`reveal-on-scroll ${isVisible ? 'visible' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'category' | 'product' | 'producer'>('home');
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 80], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']);
  const headerText = useTransform(scrollY, [0, 80], ['rgba(255, 255, 255, 1)', 'rgba(45, 45, 45, 1)']);
  const headerBorder = useTransform(scrollY, [0, 80], ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.05)']);

  const HERO_IMAGES = [
    "https://placehold.co/1920x1080/f8f8f8/b8a88a?text=SEKKA+Ring+1",
    "https://placehold.co/1920x1080/f8f8f8/b8a88a?text=SEKKA+Ring+2",
    "https://placehold.co/1920x1080/f8f8f8/b8a88a?text=SEKKA+Ring+3",
    "https://placehold.co/1920x1080/f8f8f8/b8a88a?text=SEKKA+Ring+4",
    "https://placehold.co/1920x1080/f8f8f8/b8a88a?text=SEKKA+Ring+5",
    "https://placehold.co/1920x1080/f8f8f8/b8a88a?text=SEKKA+Ring+6",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

  const navigateToCategory = (category: string) => {
    setCurrentCategory(category);
    setCurrentPage('category');
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedProduct(null);
    setCurrentCategory(null);
    window.scrollTo(0, 0);
  };

  const navigateToProducer = () => {
    setCurrentPage('producer');
    setSelectedProduct(null);
    setCurrentCategory(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const filteredProducts = currentCategory 
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(currentCategory.toLowerCase()) || (currentCategory === 'Pierced Earrings' && p.name.includes('Pierced')))
    : PRODUCTS;

  return (
    <div className="min-h-screen relative selection:bg-brand-ice selection:text-white">
      {/* Loading Animation (narin.jp style) */}
      <div className="fixed inset-0 z-[100] bg-white loading-screen flex items-center justify-center">
        <h1 className="text-3xl font-serif font-light tracking-[0.3em] loading-logo">雪華 -SEKKA-</h1>
      </div>

      {/* Header */}
      <motion.header
        style={{ 
          backgroundColor: headerBg, 
          color: headerText,
          borderBottomWidth: 1, 
          borderColor: headerBorder 
        }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between backdrop-blur-sm transition-all duration-500"
      >
        <div className="flex items-center gap-8">
          <button onClick={navigateToHome} className="group">
            <h1 className="text-xl md:text-2xl font-serif tracking-widest leading-none">
              雪華 <span className="eng-text text-sm md:text-base ml-2 border-l border-current pl-3 opacity-90">SEKKA</span>
            </h1>
          </button>
          <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.2em] font-sans font-light uppercase">
            <button onClick={navigateToHome} className="hover:text-brand-gold transition-colors">Collection</button>
            <button onClick={navigateToProducer} className="hover:text-brand-gold transition-colors">Producer</button>
            <button className="hover:text-brand-gold transition-colors">Atelier</button>
            <button className="hover:text-brand-gold transition-colors">News</button>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="p-1 hover:text-brand-gold transition-colors">
            <Instagram size={20} strokeWidth={1} />
          </a>
          <button className="p-1 hover:text-brand-gold relative transition-colors">
            <ShoppingBag size={20} strokeWidth={1} />
            <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white/20">0</span>
          </button>
          <button className="md:hidden p-1" onClick={() => setIsMenuOpen(true)}>
            <Menu size={20} strokeWidth={1} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center gap-12 text-brand-text"
          >
            <button className="absolute top-6 right-6 p-2" onClick={() => setIsMenuOpen(false)}>
              <X size={24} strokeWidth={1} />
            </button>
            <nav className="flex flex-col items-center gap-8 text-lg font-serif tracking-widest text-brand-text">
              <button 
                onClick={() => { navigateToHome(); setIsMenuOpen(false); }}
                className="hover:text-brand-gold"
              >
                Collection
              </button>
              <button onClick={navigateToProducer} className="hover:text-brand-gold">Producer</button>
              <button className="hover:text-brand-gold" onClick={() => setIsMenuOpen(false)}>Atelier</button>
              <button className="hover:text-brand-gold" onClick={() => setIsMenuOpen(false)}>News</button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Section (100vh Fullscreen Crossfade) */}
            <section className="h-screen w-full relative overflow-hidden bg-[#F8F8F8]">
              {HERO_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    opacity: heroIndex === i ? 1 : 0,
                    zIndex: heroIndex === i ? 10 : 1,
                    transition: 'opacity 1.5s ease-in-out'
                  }}
                >
                  <img
                    src={img}
                    alt={`Hero Image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              
              {/* Semi-transparent Overlay */}
              <div className="absolute inset-0 z-20" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}></div>

              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 text-white drop-shadow-md">
                <h1 className="text-4xl md:text-6xl font-serif font-light tracking-[0.3em] mb-6">
                  雪華 <span className="font-display">SEKKA</span>
                </h1>
                <p className="text-sm md:text-lg font-serif font-light tracking-[0.2em]">
                  <span className="jp-phrase">静かに輝く、</span><span className="jp-phrase">あなただけの結晶</span>
                </p>
              </div>

              {/* Scroll Down Arrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white z-30 drop-shadow-md"
              >
                <span className="text-[10px] tracking-widest font-light opacity-80 uppercase">Scroll</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <ArrowDown size={16} strokeWidth={1} className="opacity-80" />
                </motion.div>
              </motion.div>
            </section>

            {/* Loop Scroll (Product Band) */}
            <section className="w-full overflow-hidden bg-white py-10 border-b border-gray-100">
              <div className="flex w-[200%] animate-loop-scroll">
                {[...PRODUCTS, ...PRODUCTS].map((product, index) => (
                  <div key={index} className="w-[16.666%] shrink-0 px-2 group cursor-pointer" onClick={() => navigateToProduct(product)}>
                    <div className="aspect-[4/3] overflow-hidden bg-brand-bg-soft mb-3">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-85" />
                    </div>
                    <div className="text-center">
                      <p className="eng-text text-xs tracking-widest">{product.name}</p>
                      <p className="text-[10px] font-light mt-1">¥{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Collection Grid */}
            <section id="collection" className="py-120 px-6 max-w-7xl mx-auto">
              <Reveal>
                <div className="text-center mb-20 md:mb-32">
                  <h3 className="eng-text text-4xl md:text-5xl font-light mb-4">Collection</h3>
                  <p className="text-[10px] md:text-xs tracking-[0.3em] font-light opacity-50 uppercase">Categories</p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {[
                  { tag: 'Ring', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200' },
                  { tag: 'Necklace', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200' },
                  { tag: 'Pierced Earrings', img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1200' },
                  { tag: 'Bracelet', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1200' },
                ].map((cat, i) => (
                  <Reveal key={cat.tag} delay={i * 0.1}>
                    <button 
                      onClick={() => navigateToCategory(cat.tag)}
                      className="group relative block w-full aspect-square bg-brand-bg-soft overflow-hidden"
                    >
                        <img
                          src={cat.img}
                          alt={cat.tag}
                          className="w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-85 opacity-90"
                        />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="eng-text text-2xl md:text-3xl text-white md:text-brand-text opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                          {cat.tag}
                        </span>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="py-120 bg-brand-bg-soft/50 px-6">
              <div className="max-w-7xl mx-auto">
                <Reveal>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
                    <div>
                      <h3 className="eng-text text-4xl md:text-5xl font-light mb-4">Featured</h3>
                      <p className="text-[10px] md:text-xs tracking-[0.3em] font-light opacity-50 uppercase">Snowflake Curations</p>
                    </div>
                    <button className="text-[10px] tracking-[0.2em] uppercase font-light border-b border-gray-300 pb-1 hover:text-brand-gold hover:border-brand-gold transition-all">View All Collection</button>
                  </div>
                </Reveal>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-12 md:gap-y-24">
                  {PRODUCTS.map((product, i) => (
                    <Reveal key={product.id} delay={i * 0.1}>
                      <div 
                        className="group cursor-pointer"
                        onClick={() => navigateToProduct(product)}
                      >
                        <div className="aspect-[3/4] bg-white overflow-hidden mb-6">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-85"
                          />
                        </div>
                        <div className="text-center space-y-1">
                          <h4 className="eng-text text-lg md:text-xl font-light tracking-wide">{product.name}</h4>
                          <p className="text-xs md:text-sm font-light mt-2 tracking-wider">¥{product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-120 px-6 overflow-hidden">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16 md:gap-32">
                <Reveal>
                  <div className="relative aspect-[4/5] bg-brand-bg-soft">
                    <img
                      src="https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?auto=format&fit=crop&q=80&w=1200"
                      alt="About SEKKA"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute -bottom-8 -right-8 w-24 md:w-32 aspect-square bg-[#fff] p-4 flex items-center justify-center shadow-xl shadow-black/5">
                      <span className="brand-name text-2xl md:text-3xl tracking-widest vertical-text leading-none py-2 font-serif">雪華</span>
                    </div>
                  </div>
                </Reveal>
                <div className="space-y-12 md:space-y-20">
                  <Reveal>
                    <h3 className="text-2xl md:text-3xl font-serif tracking-widest leading-relaxed text-balance">
                      <span className="jp-phrase">雪の結晶は、</span><span className="jp-phrase">空から降りてくるまでに</span><br />
                      <span className="jp-phrase">何億もの水分子が</span><span className="jp-phrase">出会い、結ばれ、</span><br />
                      <span className="jp-phrase">二度と同じ形にはならない。</span>
                    </h3>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <p className="text-sm md:text-base font-light font-sans leading-[2.2] opacity-70 tracking-widest text-pretty">
                      <span className="jp-phrase">私たちのジュエリーも</span><span className="jp-phrase">同じです。</span><br />
                      <span className="jp-phrase">一石一石を厳選し、</span><span className="jp-phrase">熟練の職人が</span><span className="jp-phrase">一から手掛ける。</span><br />
                      <span className="jp-phrase">流行に左右されず、</span><span className="jp-phrase">身に着ける人だけの</span><span className="jp-phrase">輝きを宿し、</span><br />
                      <span className="jp-phrase">人生という旅に</span><span className="jp-phrase">そっと寄り添う結晶を。</span><br /><br />
                      <button 
                        onClick={navigateToProducer}
                        className="eng-text text-xl border-b border-brand-gold/30 pb-2 hover:text-brand-gold transition-colors"
                      >
                        Director yukino
                      </button>
                    </p>
                  </Reveal>
                </div>
              </div>
            </section>

            {/* Quality Section */}
            <section className="bg-brand-bg-soft py-120">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <Reveal>
                  <div className="space-y-6">
                    <h3 className="eng-text text-3xl md:text-4xl">SEKKA DIAMOND</h3>
                    <p className="text-sm md:text-base font-light leading-relaxed tracking-widest opacity-70 text-balance">
                      <span className="jp-phrase">雪華で使用される</span><span className="jp-phrase">すべてのダイヤモンドは、</span><br />
                      <span className="jp-phrase">クラリティVS1以上の</span><span className="jp-phrase">天然ダイヤモンドのみを厳選。</span><br />
                      <span className="jp-phrase">独自の厳しい基準をクリアした、</span><span className="jp-phrase">雪の結晶のように</span><span className="jp-phrase">澄み切った輝きだけを</span><span className="jp-phrase">お届けします。</span>
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="aspect-[16/9] overflow-hidden rounded-sm grayscale-[10%]">
                    <img
                      src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600"
                      alt="Diamond Quality"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Reveal>
              </div>
            </section>

            {/* News Section */}
            <section id="news" className="py-120 px-6 max-w-3xl mx-auto">
              <Reveal>
                <div className="text-center mb-16 md:mb-24">
                  <h3 className="eng-text text-4xl md:text-5xl font-light mb-4">News</h3>
                </div>
              </Reveal>
              <div className="divide-y divide-gray-100">
                {NEWS.map((item, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <a href="#" className="group flex flex-col md:flex-row md:items-center py-8 md:py-10 transition-colors hover:px-2">
                      <span className="text-[10px] md:text-[11px] font-display tracking-[0.2em] font-light opacity-40 mb-2 md:mb-0 md:w-40">{item.date}</span>
                      <span className="text-sm md:text-base font-light tracking-widest flex-1 group-hover:text-brand-gold transition-colors">{item.title}</span>
                      <span className="hidden md:block transition-transform duration-500 group-hover:translate-x-2">
                        <ArrowDown size={14} className="-rotate-90 opacity-20" />
                      </span>
                    </a>
                  </Reveal>
                ))}
              </div>
            </section>
          </motion.main>
        ) : currentPage === 'producer' ? (
          <motion.main
            key="producer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-40 pb-32"
          >
            <div className="max-w-6xl mx-auto px-6">
              {/* Title */}
              <Reveal>
                <h2 className="text-2xl md:text-3xl font-serif tracking-[0.3em] text-center mb-16 opacity-80 uppercase">Producer</h2>
              </Reveal>

              {/* Main Image */}
              <Reveal delay={0.2}>
                <div className="aspect-video md:aspect-[21/9] bg-brand-bg-soft overflow-hidden mb-16 md:mb-24 shadow-sm border border-brand-gold/5">
                  <img 
                    src="https://baseec-img-mng.akamaized.net/images/shop_front/yukinomade-base-shop/1e9e0837b1d3099d523f8fea6444cdd9.jpeg" 
                    alt="Producer Yukino"
                    className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-[3s]"
                  />
                </div>
              </Reveal>

              {/* Grid Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                {/* Left Column: Name */}
                <div className="lg:col-span-4 space-y-4">
                  <Reveal delay={0.4}>
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-serif tracking-widest text-brand-text leading-tight">
                        <span className="jp-phrase">雪 音</span>
                        <span className="eng-text text-xl font-light ml-4 opacity-50 uppercase tracking-[0.3em]">yukino</span>
                      </h3>
                      <p className="text-xs md:text-sm font-serif tracking-[0.2em] opacity-40">
                        <span className="jp-phrase">ジュエリークリエイター / プロデューサー</span>
                      </p>
                    </div>
                  </Reveal>
                </div>

                {/* Right Column: Bio text */}
                <div className="lg:col-span-8">
                  <Reveal delay={0.6}>
                    <div className="text-sm md:text-[15px] font-serif leading-[2.8] opacity-80 tracking-[0.1em] space-y-12 text-brand-text">
                      <p className="text-pretty">
                        <span className="jp-phrase">アパレルデザイナーとして長年キャリアを積み、</span><br />
                        <span className="jp-phrase">素材の持つ質感やシルエットの美しさを追求してきた。</span><br />
                        <span className="jp-phrase">その後、自身の感性をより繊細な形で表現するため</span><span className="jp-phrase">ジュエリーの世界へ転身。</span>
                      </p>
                      
                      <p className="text-pretty">
                        <span className="jp-phrase">2024年よりクリエイターとして本格的な活動を開始。</span><br />
                        <span className="jp-phrase">SNSを通じて発信される、</span><span className="jp-phrase">凛とした佇まいと</span><span className="jp-phrase">温もりを感じさせる</span><span className="jp-phrase">独創的な世界観は、</span><span className="jp-phrase">自分らしく生きる多くの女性から</span><span className="jp-phrase">熱狂的な支持を集めている。</span><br />
                        <span className="jp-phrase">業界屈指のファッショニスタとしても知られ、</span><span className="jp-phrase">その卓越したバランス感覚は</span><span className="jp-phrase">「雪華」のデザインの源泉となっている。</span>
                      </p>

                      <p className="text-pretty">
                        <span className="jp-phrase">自身がディレクションする「yukinomade」では、</span><br />
                        <span className="jp-phrase">単なる装飾を超えた、</span><span className="jp-phrase">ジュエリーを通した新しいライフスタイルを提案。</span>
                      </p>

                      <p className="text-pretty">
                        <span className="jp-phrase">2026年5月、満を持して</span><br />
                        <span className="jp-phrase">新ブランド「雪華（SEKKA.）」を</span><span className="jp-phrase">スタート。</span><br />
                        <span className="jp-phrase">普遍的な美しさと、</span><span className="jp-phrase">一人ひとりの人生に寄り添う</span><span className="jp-phrase">「結晶」のような輝きを届けていく。</span>
                      </p>
                    </div>
                  </Reveal>
                </div>
              </div>

              {/* Bottom Quote / Poetic Text */}
              <div className="mt-32 pt-24 border-t border-brand-gold/10 text-center">
                <Reveal>
                  <p className="text-[13px] md:text-sm font-serif leading-[3.4] tracking-[0.4em] text-brand-text/60 italic">
                    <span className="jp-phrase">いろいろあった一日の終わりにふと眺める</span><br />
                    <span className="jp-phrase">心がワクワクしてキラキラする</span><br />
                    <span className="jp-phrase">自分を大切に思える、そんなジュエリーを。</span>
                  </p>
                  <p className="eng-text text-2xl tracking-[0.4em] mt-12 opacity-30">SEKKA.</p>
                </Reveal>
              </div>
            </div>
          </motion.main>
        ) : currentPage === 'category' ? (
          <motion.main
            key="category"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="pt-40 pb-24 px-6 max-w-7xl mx-auto"
          >
            <div className="text-center mb-24">
              <button 
                onClick={navigateToHome}
                className="text-[10px] tracking-widest font-light opacity-40 uppercase hover:text-brand-gold transition-colors mb-6"
              >
                ← Back to Home
              </button>
              <h2 className="eng-text text-5xl md:text-6xl font-light mb-4">{currentCategory}</h2>
              <p className="text-[10px] md:text-xs tracking-[0.4em] font-light opacity-40 uppercase">Viewing all {currentCategory?.toLowerCase()}</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-16 md:gap-x-12 md:gap-y-32">
              {filteredProducts.map((product, i) => (
                <Reveal key={product.id} delay={i * 0.1}>
                  <div 
                    className="group cursor-pointer"
                    onClick={() => navigateToProduct(product)}
                  >
                    <div className="aspect-[3/4] bg-brand-bg-soft overflow-hidden mb-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-85"
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="eng-text text-lg md:text-xl font-medium tracking-wide">{product.name}</h4>
                      <p className="text-[9px] md:text-[11px] font-light opacity-40 uppercase tracking-widest">{product.material}</p>
                      <p className="text-xs md:text-sm font-light mt-2 tracking-wider">¥{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 opacity-30 tracking-widest">No pieces found in this category.</div>
            )}
          </motion.main>
        ) : (
          /* Product Detail View */
          <motion.main
            key="product"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-32 pb-24 px-6 max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
              <div className="aspect-[4/5] bg-brand-bg-soft overflow-hidden">
                <img 
                  src={selectedProduct?.image} 
                  alt={selectedProduct?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-12">
                <div className="space-y-4">
                  <button 
                    onClick={() => currentCategory ? navigateToCategory(currentCategory) : navigateToHome()}
                    className="text-[10px] tracking-widest font-light opacity-40 uppercase hover:text-brand-gold transition-colors"
                  >
                    ← Back to {currentCategory ? currentCategory : 'Collection'}
                  </button>
                  <h2 className="eng-text text-4xl md:text-5xl font-light">{selectedProduct?.name}</h2>
                  <p className="text-sm tracking-[0.3em] font-light opacity-40 uppercase">{selectedProduct?.material}</p>
                </div>
                
                <p className="text-2xl font-light tracking-wider">¥{selectedProduct?.price.toLocaleString()}</p>
                
                <div className="space-y-6 pt-4">
                  <p className="text-sm leading-relaxed font-light opacity-70 tracking-widest text-pretty">
                    <span className="jp-phrase">厳選された</span>{selectedProduct?.material.split(' / ')[0]}<span className="jp-phrase">を使用し、</span><span className="jp-phrase">日本の職人が</span><span className="jp-phrase">一点一点手作業で</span><span className="jp-phrase">仕上げた芸術的な逸品。</span>
                    <span className="jp-phrase">雪の結晶が持つ</span><span className="jp-phrase">儚くも力強い美しさを、</span><span className="jp-phrase">一生ものの輝きとして</span><span className="jp-phrase">閉じ込めました。</span>
                  </p>
                  <div className="space-y-2 text-xs font-light tracking-widest opacity-40">
                    <p>・<span className="jp-phrase">素材：</span>{selectedProduct?.material}</p>
                    <p>・<span className="jp-phrase">仕上げ：</span><span className="jp-phrase">鏡面仕上げ</span></p>
                    <p>・<span className="jp-phrase">納期：</span><span className="jp-phrase">受注生産（約4週間）</span></p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button className="w-full py-5 bg-brand-text text-white text-[11px] tracking-[0.3em] uppercase font-medium hover:bg-brand-gold transition-all">Add to Shopping Bag</button>
                  <button className="w-full py-5 border border-brand-text text-brand-text text-[11px] tracking-[0.3em] uppercase font-medium hover:bg-brand-bg-soft transition-all">Book an Atelier Visit</button>
                </div>
              </div>
            </div>

            {/* Related items dummy */}
            <div className="mt-32 border-t border-gray-100 pt-24">
              <h3 className="eng-text text-2xl font-light mb-12">You may also like</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {PRODUCTS.slice(0, 4).map((p) => (
                  <div key={p.id} className="cursor-pointer group" onClick={() => navigateToProduct(p)}>
                    <div className="aspect-square bg-brand-bg-soft overflow-hidden mb-4">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-85" />
                    </div>
                    <p className="eng-text text-sm">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-50 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-24">
          <div className="space-y-6">
            <h1 className="text-2xl font-serif tracking-widest">雪華 -SEKKA-</h1>
            <p className="text-[10px] tracking-[0.2em] font-light opacity-40 leading-loose uppercase">
              Quiet brilliance, your unique crystal.<br />
              Since 2026.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.2em] font-medium uppercase opacity-80">Menu</p>
              <nav className="flex flex-col gap-3 text-[11px] font-light tracking-widest opacity-60">
                <button onClick={navigateToHome} className="text-left hover:text-brand-gold">Collection</button>
                <button onClick={navigateToProducer} className="text-left hover:text-brand-gold">Producer</button>
                <button className="text-left hover:text-brand-gold">Atelier</button>
                <button className="text-left hover:text-brand-gold">News</button>
              </nav>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.2em] font-medium uppercase opacity-80">Support</p>
              <nav className="flex flex-col gap-3 text-[11px] font-light tracking-widest opacity-60">
                <button className="text-left hover:text-brand-gold">Contact</button>
                <button className="text-left hover:text-brand-gold">Privacy Policy</button>
                <button className="text-left hover:text-brand-gold">Terms of Service</button>
              </nav>
            </div>
          </div>
          <div className="space-y-8">
            <p className="text-[10px] tracking-[0.2em] font-medium uppercase opacity-80">Follow</p>
            <div className="flex gap-6">
              <a href="#" className="p-2 border border-gray-100 hover:border-brand-gold hover:text-brand-gold transition-all rounded-full">
                <Instagram size={18} strokeWidth={1} />
              </a>
              <a href="#" className="p-2 border border-gray-100 hover:border-brand-gold hover:text-brand-gold transition-all rounded-full">
                <MessageCircle size={18} strokeWidth={1} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-50 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between gap-4">
          <p className="text-[9px] tracking-[0.2em] font-light opacity-30">© 2026 SEKKA by yukino kikaku. All Rights Reserved.</p>
          <p className="text-[9px] tracking-[0.2em] font-light opacity-30 uppercase">Crafted with serenity.</p>
        </div>
      </footer>

      {/* CSS for Vertical Text */}
      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: upright;
        }
      `}</style>
    </div>
  );
}
