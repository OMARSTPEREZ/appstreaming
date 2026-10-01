'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Check, 
  Sparkles, 
  Flame, 
  Tv, 
  Film, 
  Youtube, 
  Music, 
  Laptop, 
  TrendingUp,
  PackageCheck,
  Info,
  Zap,
  Award,
  BadgePercent,
  Star,
  ChevronRight
} from 'lucide-react';
import { Product, ProductCategory } from '@/lib/types';
import { ProductDetailModal } from './ProductDetailModal';

interface CatalogTabProps {
  products: Product[];
  inventoryCounts: Record<string, number>;
  onAddToCart: (product: Product) => void;
}

const CATEGORIES: ('Todas' | ProductCategory)[] = [
  'Todas',
  'Perfiles / Pantallas',
  'Cuentas Completas',
  'Combos Especiales',
  'Licencias Digitales',
  'Música y Entretenimiento',
];

// ── Brand visual config ──────────────────────────────────────────────────────
const BRAND_CONFIG: Record<string, {
  cardGradient: string;
  glowColor: string;
  accentColor: string;
  badgeColor: string;
  topGradient: string;
  neonShadow: string;
}> = {
  netflix: {
    cardGradient: 'from-red-950/70 via-slate-950 to-slate-950',
    glowColor: 'rgba(229,9,20,0.25)',
    accentColor: '#E50914',
    badgeColor: 'bg-red-600',
    topGradient: 'from-red-900/60 to-slate-950',
    neonShadow: '0 0 30px rgba(229,9,20,0.25)',
  },
  youtube: {
    cardGradient: 'from-red-950/60 via-slate-950 to-slate-950',
    glowColor: 'rgba(255,0,0,0.20)',
    accentColor: '#FF0000',
    badgeColor: 'bg-red-700',
    topGradient: 'from-red-900/50 to-slate-950',
    neonShadow: '0 0 30px rgba(255,0,0,0.2)',
  },
  'disney+': {
    cardGradient: 'from-blue-950/70 via-slate-950 to-slate-950',
    glowColor: 'rgba(17,60,207,0.30)',
    accentColor: '#113CCF',
    badgeColor: 'bg-blue-700',
    topGradient: 'from-blue-900/60 to-slate-950',
    neonShadow: '0 0 30px rgba(17,60,207,0.25)',
  },
  spotify: {
    cardGradient: 'from-emerald-950/70 via-slate-950 to-slate-950',
    glowColor: 'rgba(29,185,84,0.25)',
    accentColor: '#1DB954',
    badgeColor: 'bg-emerald-600',
    topGradient: 'from-emerald-900/50 to-slate-950',
    neonShadow: '0 0 30px rgba(29,185,84,0.25)',
  },
  'amazon prime': {
    cardGradient: 'from-cyan-950/70 via-slate-950 to-slate-950',
    glowColor: 'rgba(0,168,225,0.25)',
    accentColor: '#00A8E1',
    badgeColor: 'bg-cyan-600',
    topGradient: 'from-cyan-900/50 to-slate-950',
    neonShadow: '0 0 30px rgba(0,168,225,0.25)',
  },
  max: {
    cardGradient: 'from-purple-950/70 via-slate-950 to-slate-950',
    glowColor: 'rgba(123,47,190,0.30)',
    accentColor: '#7B2FBE',
    badgeColor: 'bg-purple-600',
    topGradient: 'from-purple-900/60 to-slate-950',
    neonShadow: '0 0 30px rgba(123,47,190,0.28)',
  },
  canva: {
    cardGradient: 'from-cyan-950/60 via-slate-950 to-slate-950',
    glowColor: 'rgba(0,196,204,0.20)',
    accentColor: '#00C4CC',
    badgeColor: 'bg-cyan-500',
    topGradient: 'from-cyan-900/50 to-slate-950',
    neonShadow: '0 0 30px rgba(0,196,204,0.2)',
  },
  'combo b2b': {
    cardGradient: 'from-amber-950/70 via-slate-950 to-slate-950',
    glowColor: 'rgba(245,158,11,0.25)',
    accentColor: '#F59E0B',
    badgeColor: 'bg-amber-500',
    topGradient: 'from-amber-900/60 to-slate-950',
    neonShadow: '0 0 30px rgba(245,158,11,0.25)',
  },
};

const DEFAULT_BRAND_CONFIG = {
  cardGradient: 'from-indigo-950/70 via-slate-950 to-slate-950',
  glowColor: 'rgba(99,102,241,0.25)',
  accentColor: '#6366F1',
  badgeColor: 'bg-indigo-600',
  topGradient: 'from-indigo-900/50 to-slate-950',
  neonShadow: '0 0 30px rgba(99,102,241,0.25)',
};

const getBrandConfig = (brand: string) =>
  BRAND_CONFIG[brand.toLowerCase()] || DEFAULT_BRAND_CONFIG;

const getBrandIcon = (brand: string, size = 'w-7 h-7') => {
  switch (brand.toLowerCase()) {
    case 'netflix': return <Tv className={`${size} text-red-500`} />;
    case 'youtube': return <Youtube className={`${size} text-red-500`} />;
    case 'disney+': return <Film className={`${size} text-blue-400`} />;
    case 'spotify': return <Music className={`${size} text-emerald-400`} />;
    case 'canva': return <Laptop className={`${size} text-cyan-400`} />;
    case 'combo b2b': return <Flame className={`${size} text-amber-400`} />;
    default: return <Sparkles className={`${size} text-indigo-400`} />;
  }
};

// Auto-badge logic based on product data
const getProductBadges = (prod: Product, stock: number, profitPercent: number) => {
  const badges = [];
  
  // Most sold (high suggested price = popular)
  if (prod.suggested_price >= 18000) {
    badges.push({ label: '🔥 MÁS VENDIDO', style: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' });
  }
  // High margin
  if (profitPercent >= 60) {
    badges.push({ label: '💚 MARGEN ALTO', style: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' });
  }
  // Instant delivery
  if (stock > 0) {
    badges.push({ label: '⚡ ENTREGA INMEDIATA', style: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white' });
  }
  // Combo offer
  if (prod.category === 'Combos Especiales') {
    badges.push({ label: '🎁 COMBO OFERTA', style: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white' });
  }
  return badges.slice(0, 2);
};

// Stock bar config
const getStockBarColor = (stock: number) => {
  if (stock === 0) return 'bg-rose-500';
  if (stock <= 2) return 'bg-rose-400';
  if (stock <= 5) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const getStockLabel = (stock: number) => {
  if (stock === 0) return { text: 'Sin Stock', color: 'text-rose-400' };
  if (stock === 1) return { text: '¡Solo 1 disponible!', color: 'text-amber-400' };
  if (stock <= 3) return { text: `Solo ${stock} disponibles`, color: 'text-amber-400' };
  return { text: `${stock} disponibles`, color: 'text-emerald-400' };
};

// ── Component ────────────────────────────────────────────────────────────────
export const CatalogTab: React.FC<CatalogTabProps> = ({
  products,
  inventoryCounts,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ProductCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'Todas' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddWithFeedback = (product: Product) => {
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1300);
  };

  return (
    <div className="space-y-6">
      
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Catálogo Exclusivo Mayorista
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cuentas, Perfiles y Licencias con Entrega Inmediata ⚡
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Compra a precio de distribuidor, entrega credenciales a tus clientes en segundos.
            Márgenes de ganancia de hasta <strong className="text-emerald-400">150%</strong>.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
          <Tv className="w-80 h-80 text-indigo-400" />
        </div>
      </div>

      {/* ── Search & Filters ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar: Netflix, Spotify, Disney+, YouTube..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => {
          const stock = inventoryCounts[prod.id] || 0;
          const isAdded = addedAnimationId === prod.id;
          const estimatedProfit = prod.suggested_price - prod.reseller_price;
          const profitPercent = Math.round((estimatedProfit / prod.reseller_price) * 100);
          const cfg = getBrandConfig(prod.brand);
          const badges = getProductBadges(prod, stock, profitPercent);
          const stockLabel = getStockLabel(stock);
          const stockBarColor = getStockBarColor(stock);
          const stockBarWidth = Math.min(100, Math.max(stock > 0 ? 8 : 0, Math.round((stock / 10) * 100)));

          return (
            <div
              key={prod.id}
              className={`relative flex flex-col rounded-2xl overflow-hidden border border-slate-800/80 bg-gradient-to-b ${cfg.cardGradient} group transition-all duration-300 hover:-translate-y-1`}
              style={{
                boxShadow: `0 2px 16px rgba(0,0,0,0.4)`,
                '--hover-shadow': cfg.neonShadow,
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = cfg.neonShadow + ', 0 4px 24px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.4)';
              }}
            >
              {/* ── Floating Badges ── */}
              {badges.length > 0 && (
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                  {badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`${badge.style} text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wide shadow-lg`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}

              {/* ── Info button ── */}
              <button
                onClick={() => setDetailProduct(prod)}
                className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-white flex items-center justify-center transition"
                title="Ver ficha técnica completa"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {/* ── Brand Banner Header ── */}
              <div className={`relative p-4 pt-10 bg-gradient-to-b ${cfg.topGradient} overflow-hidden`}>
                {/* Decorative glow circle */}
                <div
                  className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-30 blur-2xl pointer-events-none"
                  style={{ backgroundColor: cfg.accentColor }}
                />

                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border flex-shrink-0"
                    style={{
                      backgroundColor: cfg.accentColor + '18',
                      borderColor: cfg.accentColor + '45',
                    }}
                  >
                    {getBrandIcon(prod.brand)}
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-widest block"
                      style={{ color: cfg.accentColor }}
                    >
                      {prod.brand}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-white transition">
                      {prod.name}
                    </h3>
                  </div>
                </div>

                {/* Duration badge */}
                <span className="relative z-10 inline-flex items-center gap-1 mt-2.5 text-[10px] text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800">
                  ⏱ {prod.duration_days} días de servicio
                </span>
              </div>

              {/* ── Card Body ── */}
              <div className="flex-1 flex flex-col p-4 space-y-3.5">

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-1">
                  {prod.features.slice(0, 3).map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[9px] font-semibold border border-slate-700/70 text-slate-400 bg-slate-900/60"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                {/* ── Live Stock Bar ── */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-medium">Stock en vivo</span>
                    <span className={`font-bold ${stockLabel.color}`}>{stockLabel.text}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stockBarColor} rounded-full transition-all duration-700 ${stock > 0 ? 'animate-none' : ''}`}
                      style={{ width: `${stockBarWidth}%` }}
                    />
                  </div>
                </div>

                {/* ── Pricing ── */}
                <div className="pt-2 border-t border-slate-800/60 space-y-2.5">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Precio Mayorista</span>
                      <span className="text-xl font-mono font-extrabold text-white">
                        ${prod.reseller_price.toLocaleString('es-CO')}
                        <span className="text-[10px] font-normal text-slate-400 ml-1">COP</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Sugerido</span>
                      <span className="text-xs font-mono text-slate-500 line-through">
                        ${prod.suggested_price.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>

                  {/* Profit indicator */}
                  <div
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[10px] border"
                    style={{
                      backgroundColor: cfg.accentColor + '10',
                      borderColor: cfg.accentColor + '30',
                    }}
                  >
                    <span className="text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" /> Tu margen:
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      +${estimatedProfit.toLocaleString('es-CO')} ({profitPercent}%)
                    </span>
                  </div>

                  {/* ── Action Buttons ── */}
                  <div className="flex gap-2 pt-0.5">
                    <button
                      onClick={() => setDetailProduct(prod)}
                      className="flex-1 py-2 rounded-xl text-[11px] font-semibold border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 bg-slate-900/60 hover:bg-slate-800 transition flex items-center justify-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Ver Detalle
                    </button>

                    <button
                      onClick={() => handleAddWithFeedback(prod)}
                      disabled={stock === 0}
                      className={`flex-[2] py-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition shadow-md ${
                        stock === 0
                          ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'text-white active:scale-95'
                      }`}
                      style={
                        stock > 0 && !isAdded
                          ? {
                              background: `linear-gradient(135deg, ${cfg.accentColor}cc, ${cfg.accentColor}99)`,
                              boxShadow: `0 4px 14px ${cfg.accentColor}40`,
                            }
                          : {}
                      }
                    >
                      {isAdded ? (
                        <><Check className="w-3.5 h-3.5" /> ¡Agregado!</>
                      ) : (
                        <><ShoppingCart className="w-3.5 h-3.5" /> {stock === 0 ? 'Agotado' : 'Al Carrito'}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 text-slate-500 space-y-2">
          <PackageCheck className="w-12 h-12 mx-auto text-slate-700" />
          <p className="font-semibold text-sm">No se encontraron productos con esos filtros</p>
          <p className="text-xs">Prueba seleccionando otra categoría o limpiando la búsqueda.</p>
        </div>
      )}

      {/* ── Product Detail Modal / Bottom Sheet ── */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          stock={inventoryCounts[detailProduct.id] || 0}
          isAdded={addedAnimationId === detailProduct.id}
          onClose={() => setDetailProduct(null)}
          onAddToCart={(p) => {
            handleAddWithFeedback(p);
          }}
        />
      )}
    </div>
  );
};
