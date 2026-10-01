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
  ShieldCheck, 
  TrendingUp,
  SlidersHorizontal,
  PackageCheck
} from 'lucide-react';
import { Product, ProductCategory } from '@/lib/types';

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

export const CatalogTab: React.FC<CatalogTabProps> = ({
  products,
  inventoryCounts,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ProductCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

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
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'netflix':
        return <Tv className="w-5 h-5 text-red-500" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'disney+':
        return <Film className="w-5 h-5 text-blue-400" />;
      case 'spotify':
        return <Music className="w-5 h-5 text-emerald-400" />;
      case 'canva':
        return <Laptop className="w-5 h-5 text-cyan-400" />;
      case 'combo b2b':
        return <Flame className="w-5 h-5 text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Superior con Calculadora de Rentabilidad B2B */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Catálogo Exclusivo Mayorista
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cuentas, Perfiles y Licencias con Entrega Inmediata
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Compra a precio de distribuidor, entrega credenciales a tus clientes finales en segundos y obtén márgenes de ganancia de hasta el <strong>150%</strong>.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
          <Tv className="w-80 h-80 text-indigo-400" />
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros de Categorías */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por servicio (Netflix, Spotify, Canva, YouTube)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
          />
        </div>

        {/* Category Pills */}
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

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => {
          const stock = inventoryCounts[prod.id] || 0;
          const isAdded = addedAnimationId === prod.id;
          const estimatedProfit = prod.suggested_price - prod.reseller_price;
          const profitPercent = Math.round((estimatedProfit / prod.reseller_price) * 100);

          return (
            <div
              key={prod.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between border border-slate-800 transition-all duration-200 relative group"
            >
              <div>
                {/* Brand Header & Stock Badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                      {getBrandIcon(prod.brand)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 block tracking-wider uppercase">
                        {prod.brand}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {prod.duration_days} días de servicio
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                      stock > 0
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                        : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        stock > 0 ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                      }`}
                    />
                    {stock > 0 ? `${stock} en stock` : 'Agotado'}
                  </span>
                </div>

                {/* Product Title & Description */}
                <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition line-clamp-1 mb-1.5">
                  {prod.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {prod.description}
                </p>

                {/* Features Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {prod.features.slice(0, 3).map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-[10px] font-medium text-slate-300"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Calculation Card & Buy Button */}
              <div className="space-y-3.5 pt-3 border-t border-slate-800/80">
                
                {/* Pricing row */}
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Precio Mayorista
                    </span>
                    <span className="text-xl font-mono font-extrabold text-white">
                      ${prod.reseller_price.toLocaleString('es-CO')}
                      <span className="text-[10px] font-normal text-slate-400 ml-1">COP</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      P. Sugerido
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-400 line-through">
                      ${prod.suggested_price.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                {/* Margen de ganancia B2B */}
                <div className="p-2 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-300 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Margen Revendedor:
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    +${estimatedProfit.toLocaleString('es-CO')} ({profitPercent}%)
                  </span>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleAddWithFeedback(prod)}
                  disabled={stock === 0}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md ${
                    stock === 0
                      ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                      : isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25 active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      ¡Agregado al Carrito!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      {stock === 0 ? 'Sin Stock Disponible' : 'Agregar al Carrito'}
                    </>
                  )}
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 text-slate-500 space-y-2">
          <PackageCheck className="w-12 h-12 mx-auto text-slate-700" />
          <p className="font-semibold text-sm">No se encontraron productos con esos filtros</p>
          <p className="text-xs">Prueba seleccionando otra categoría o limpiando la búsqueda.</p>
        </div>
      )}

    </div>
  );
};
