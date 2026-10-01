'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ShieldCheck,
  Lock,
  Star,
  Clock,
  X,
  Zap,
  Award,
  Monitor,
  Wifi,
  Download,
  Users,
  PlayCircle
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

// ── Brand visual config ────────────────────────────────────────────────────
const BRAND: Record<string, {
  gradient: string;       // card banner gradient (CSS)
  glow: string;           // glow color rgba
  accent: string;         // hex color
  bg: string;             // dark bg tint
  label: string;          // display label
  tagline: string;        // short promo tagline
  rules: string[];
  guarantee: string;
  support: string;
}> = {
  netflix: {
    gradient: 'linear-gradient(135deg, #1a0000 0%, #6b0000 45%, #E50914 100%)',
    glow: 'rgba(229,9,20,0.55)',
    accent: '#E50914',
    bg: 'from-red-950/30',
    label: 'NETFLIX',
    tagline: 'Perfil Privado con PIN · 4K Ultra HD',
    rules: ['1 dispositivo simultáneo por perfil','No modificar la contraseña madre de la cuenta','Usar el PIN de perfil asignado','Reportar si solicitan código de hogar'],
    guarantee: '30 días garantizados. Perfil caído o clave cambiada → reemplazo sin costo.',
    support: 'Soporte 7/7 · Respuesta < 4 h · Reemplazo automático < 2 h',
  },
  youtube: {
    gradient: 'linear-gradient(135deg, #1a0000 0%, #7a0000 45%, #FF0000 100%)',
    glow: 'rgba(255,0,0,0.50)',
    accent: '#FF0000',
    bg: 'from-red-950/20',
    label: 'YOUTUBE',
    tagline: 'Premium Individual · Sin Publicidad',
    rules: ['Activar en tu correo Google personal','No compartir acceso con terceros','No modificar configuración de suscripción'],
    guarantee: '30 días de membresía activa garantizada.',
    support: 'Soporte por ticket · Respuesta < 6 h · Reactivación sin costo',
  },
  'disney+': {
    gradient: 'linear-gradient(135deg, #00001a 0%, #000b6b 45%, #113CCF 100%)',
    glow: 'rgba(17,60,207,0.60)',
    accent: '#113CCF',
    bg: 'from-blue-950/30',
    label: 'DISNEY+',
    tagline: 'Perfil 4K · Disney, Marvel, Star Wars',
    rules: ['1 perfil privado asignado — no cambiar nombre','No acceder al perfil del administrador','Resolución 4K con Dolby Vision incluido'],
    guarantee: '30 días. Reemplazo si la cuenta es cerrada por la plataforma.',
    support: 'Soporte · Respuesta < 3 h · Cuenta de respaldo < 1 h',
  },
  spotify: {
    gradient: 'linear-gradient(135deg, #001a06 0%, #006b1e 45%, #1DB954 100%)',
    glow: 'rgba(29,185,84,0.55)',
    accent: '#1DB954',
    bg: 'from-emerald-950/30',
    label: 'SPOTIFY',
    tagline: 'Premium Individual · Música sin límites',
    rules: ['Activar Premium en tu cuenta existente','No modificar método de pago','Máximo 3 dispositivos activos'],
    guarantee: '30 días garantizados. Renovación si Spotify suspende.',
    support: 'Soporte por ticket · SLA < 6 h · Renovación mayorista disponible',
  },
  'amazon prime': {
    gradient: 'linear-gradient(135deg, #001a1a 0%, #005f7a 45%, #00A8E1 100%)',
    glow: 'rgba(0,168,225,0.55)',
    accent: '#00A8E1',
    bg: 'from-cyan-950/30',
    label: 'PRIME VIDEO',
    tagline: 'Cuenta Completa · 3 Pantallas 4K',
    rules: ['Uso en hasta 3 dispositivos simultáneos','No modificar datos de la cuenta principal','Acceso a Prime Music y Prime Reading incluido'],
    guarantee: '30 días. Reemplazo de cuenta si acceso es revocado.',
    support: 'Soporte · Respuesta < 4 h · Sin costo de reemplazo',
  },
  max: {
    gradient: 'linear-gradient(135deg, #0d001a 0%, #4a006b 45%, #7B2FBE 100%)',
    glow: 'rgba(123,47,190,0.60)',
    accent: '#7B2FBE',
    bg: 'from-purple-950/30',
    label: 'MAX (HBO)',
    tagline: 'Perfil Privado · Series Originales HBO',
    rules: ['1 perfil exclusivo asignado','No cambiar idioma de interfaz','4K HDR disponible en dispositivos compatibles'],
    guarantee: '30 días. Reemplazo inmediato si el perfil es eliminado.',
    support: 'Soporte 7/7 · Respuesta < 3 h',
  },
  canva: {
    gradient: 'linear-gradient(135deg, #001a1a 0%, #006b6b 45%, #00C4CC 100%)',
    glow: 'rgba(0,196,204,0.50)',
    accent: '#00C4CC',
    bg: 'from-cyan-950/30',
    label: 'CANVA PRO',
    tagline: 'Licencia Pro · Diseño sin límites',
    rules: ['Uso individual en tu cuenta de Canva','No transferir la membresía a terceros','Descarga ilimitada de recursos premium'],
    guarantee: '30 días. Reactivación sin costo si la licencia caduca antes.',
    support: 'Soporte · Respuesta < 8 h',
  },
  'combo b2b': {
    gradient: 'linear-gradient(135deg, #1a0e00 0%, #8a4a00 45%, #F59E0B 100%)',
    glow: 'rgba(245,158,11,0.55)',
    accent: '#F59E0B',
    bg: 'from-amber-950/30',
    label: 'COMBO B2B',
    tagline: 'Pack Multi-Servicio · Máximo Margen',
    rules: ['Entrega de cada servicio por separado','Soporte individual por cada plataforma incluida','Vigencia unificada para todos los servicios'],
    guarantee: '30 días por cada servicio incluido en el combo.',
    support: 'Soporte · Respuesta < 4 h · Gestor B2B dedicado',
  },
};

const DEFAULT_BRAND = {
  gradient: 'linear-gradient(135deg, #0d0d1a 0%, #1e1e4a 45%, #6366F1 100%)',
  glow: 'rgba(99,102,241,0.50)',
  accent: '#6366F1',
  bg: 'from-indigo-950/30',
  label: 'STREAMING',
  tagline: 'Servicio Digital · Entrega Inmediata',
  rules: ['Uso personal o reventa individual','No compartir con usuarios no autorizados','Reportar incidencias en < 24 h'],
  guarantee: '30 días garantizados. Reemplazo o reembolso proporcional.',
  support: 'Soporte 7/7 · Respuesta < 8 h',
};

const getBrand = (brand: string) => BRAND[brand.toLowerCase()] ?? DEFAULT_BRAND;

const getBrandIcon = (brand: string, cls = 'w-12 h-12') => {
  const color: Record<string, string> = {
    netflix: 'text-red-400', youtube: 'text-red-400', 'disney+': 'text-blue-300',
    spotify: 'text-emerald-400', 'amazon prime': 'text-cyan-400',
    max: 'text-purple-400', canva: 'text-cyan-400', 'combo b2b': 'text-amber-400',
  };
  const c = color[brand.toLowerCase()] ?? 'text-indigo-400';
  switch (brand.toLowerCase()) {
    case 'netflix':      return <Tv       className={`${cls} ${c}`} />;
    case 'youtube':      return <Youtube  className={`${cls} ${c}`} />;
    case 'disney+':      return <Film     className={`${cls} ${c}`} />;
    case 'spotify':      return <Music    className={`${cls} ${c}`} />;
    case 'amazon prime': return <PlayCircle className={`${cls} ${c}`} />;
    case 'max':          return <Monitor  className={`${cls} ${c}`} />;
    case 'canva':        return <Laptop   className={`${cls} ${c}`} />;
    case 'combo b2b':    return <Flame    className={`${cls} ${c}`} />;
    default:             return <Sparkles className={`${cls} ${c}`} />;
  }
};

const getSmallIcon = (brand: string) => {
  const cls = 'w-4 h-4';
  switch (brand.toLowerCase()) {
    case 'netflix':      return <Tv       className={`${cls} text-red-400`}     />;
    case 'youtube':      return <Youtube  className={`${cls} text-red-400`}     />;
    case 'disney+':      return <Film     className={`${cls} text-blue-400`}    />;
    case 'spotify':      return <Music    className={`${cls} text-emerald-400`} />;
    case 'amazon prime': return <PlayCircle className={`${cls} text-cyan-400`}  />;
    case 'max':          return <Monitor  className={`${cls} text-purple-400`}  />;
    case 'canva':        return <Laptop   className={`${cls} text-cyan-400`}    />;
    case 'combo b2b':    return <Flame    className={`${cls} text-amber-400`}   />;
    default:             return <Sparkles className={`${cls} text-indigo-400`}  />;
  }
};

// ── Detail Overlay (centered card expansion) ──────────────────────────────
interface DetailOverlayProps {
  product: Product;
  stock: number;
  isAdded: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}

const DetailOverlay: React.FC<DetailOverlayProps> = ({
  product, stock, isAdded, onClose, onAddToCart,
}) => {
  const cfg = getBrand(product.brand);
  const profit = product.suggested_price - product.reseller_price;
  const profitPct = Math.round((profit / product.reseller_price) * 100);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 animate-scale-in"
        style={{ boxShadow: `0 0 60px ${cfg.glow}, 0 20px 60px rgba(0,0,0,0.8)` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Banner image-like header ── */}
        <div
          className="relative h-44 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: cfg.gradient }}
        >
          {/* Glow blob */}
          <div
            className="absolute inset-0 opacity-40 blur-3xl"
            style={{ background: cfg.gradient }}
          />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(${cfg.accent}33 1px, transparent 1px), linear-gradient(90deg, ${cfg.accent}33 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />
          {/* Radial highlight */}
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at center, ${cfg.accent}30 0%, transparent 70%)` }}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white/70 hover:text-white flex items-center justify-center transition border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand label top-left */}
          <span
            className="absolute top-3 left-4 text-[10px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full border"
            style={{ color: cfg.accent, borderColor: cfg.accent + '60', background: 'rgba(0,0,0,0.50)' }}
          >
            {cfg.label}
          </span>

          {/* Big icon */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className="p-4 rounded-3xl border"
              style={{
                background: cfg.accent + '22',
                borderColor: cfg.accent + '50',
                boxShadow: `0 0 32px ${cfg.glow}`,
              }}
            >
              {getBrandIcon(product.brand, 'w-14 h-14')}
            </div>
            <span className="text-white/60 text-xs font-medium">{cfg.tagline}</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="bg-slate-950 p-5 space-y-4 max-h-[55vh] overflow-y-auto">

          {/* Title + duration */}
          <div>
            <h2 className="text-xl font-extrabold text-white leading-tight">{product.name}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {product.duration_days} días continuos de servicio garantizado
            </p>
          </div>

          {/* Stock + price row */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
                stock > 0
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${stock > 0 ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
              {stock > 0 ? `${stock} en stock · Entrega inmediata` : 'Sin stock disponible'}
            </span>
            <div className="text-right">
              <span className="text-2xl font-mono font-extrabold text-white">
                ${product.reseller_price.toLocaleString('es-CO')}
              </span>
              <span className="text-xs text-slate-500 ml-1">COP</span>
            </div>
          </div>

          {/* Margin callout */}
          <div
            className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-sm"
            style={{ background: cfg.accent + '12', borderColor: cfg.accent + '30' }}
          >
            <span className="text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Tu margen estimado:
            </span>
            <span className="font-mono font-extrabold text-emerald-400">
              +${profit.toLocaleString('es-CO')} ({profitPct}%)
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>

          {/* Features */}
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" /> Incluye
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.features.map((f, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Reglas de uso para tu cliente
            </p>
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
              {cfg.rules.map((r, i) => (
                <p key={i} className="text-xs text-slate-300 flex gap-2">
                  <span className="text-amber-400 font-bold flex-shrink-0">›</span>{r}
                </p>
              ))}
            </div>
          </div>

          {/* Guarantee & Support */}
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Garantía & Soporte
            </p>
            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
              <p className="text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">Garantía: </span>{cfg.guarantee}
              </p>
              <p className="text-xs text-slate-400">
                <span className="text-indigo-400 font-bold">Soporte: </span>{cfg.support}
              </p>
            </div>
          </div>
        </div>

        {/* ── Fixed CTA ── */}
        <div className="bg-slate-950 px-5 py-4 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold border border-slate-800 transition"
          >
            ← Volver
          </button>
          <button
            onClick={() => { onAddToCart(); onClose(); }}
            disabled={stock === 0 || isAdded}
            className={`flex-[2] py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition ${
              stock === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'text-white active:scale-95'
            }`}
            style={
              stock > 0 && !isAdded
                ? { background: `linear-gradient(135deg, ${cfg.accent}ee, ${cfg.accent}aa)`, boxShadow: `0 4px 20px ${cfg.glow}` }
                : {}
            }
          >
            {isAdded ? (
              <><Check className="w-4 h-4" /> ¡Agregado al Carrito!</>
            ) : stock === 0 ? (
              'Sin Stock Disponible'
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Agregar — ${product.reseller_price.toLocaleString('es-CO')} COP</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export const CatalogTab: React.FC<CatalogTabProps> = ({
  products, inventoryCounts, onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ProductCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchQ = [p.name, p.brand, p.description].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1300);
  };

  return (
    <div className="space-y-5">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-7 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
            <Sparkles className="w-3 h-3" /> Catálogo Exclusivo Mayorista
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Cuentas, Perfiles y Licencias · Entrega Inmediata ⚡
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Precio de distribuidor · Márgenes hasta <strong className="text-emerald-400">150%</strong> · Credenciales en segundos.
          </p>
        </div>
        <Tv className="absolute right-4 bottom-0 translate-y-4 opacity-10 w-56 h-56 text-indigo-400 pointer-events-none" />
      </div>

      {/* ── Search & Category Filters ────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar: Netflix, Spotify, Disney+..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap border transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-600/30 shadow-md'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map((prod) => {
          const stock = inventoryCounts[prod.id] ?? 0;
          const isAdded = addedId === prod.id;
          const profit = prod.suggested_price - prod.reseller_price;
          const profitPct = Math.round((profit / prod.reseller_price) * 100);
          const cfg = getBrand(prod.brand);

          return (
            <div
              key={prod.id}
              className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col group transition-all duration-200 hover:border-slate-600 hover:-translate-y-0.5"
              style={{ '--glow': cfg.glow } as React.CSSProperties}
            >
              {/* ── Visual Banner (image-like) ── */}
              <div
                className="relative h-28 flex items-center justify-center overflow-hidden cursor-pointer"
                style={{ background: cfg.gradient }}
                onClick={() => setDetailProduct(prod)}
              >
                {/* Grid pattern */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: `linear-gradient(${cfg.accent}44 1px, transparent 1px), linear-gradient(90deg, ${cfg.accent}44 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                  }}
                />
                {/* Radial glow */}
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at center, ${cfg.accent}35 0%, transparent 65%)` }}
                />

                {/* Brand label */}
                <span
                  className="absolute top-2 left-2.5 text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-full"
                  style={{ color: cfg.accent, background: 'rgba(0,0,0,0.55)' }}
                >
                  {cfg.label}
                </span>

                {/* Stock badge top-right */}
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 ${
                    stock > 0
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                      : 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                  }`}
                >
                  <span className={`w-1 h-1 rounded-full ${stock > 0 ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
                  {stock > 0 ? `${stock}` : '0'}
                </span>

                {/* Big brand icon */}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <div
                    className="p-2.5 rounded-2xl border"
                    style={{
                      background: cfg.accent + '20',
                      borderColor: cfg.accent + '45',
                      boxShadow: `0 0 20px ${cfg.glow}`,
                    }}
                  >
                    {getBrandIcon(prod.brand, 'w-8 h-8')}
                  </div>
                </div>

                {/* Hover hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-[10px] font-bold bg-black/50 px-2.5 py-1 rounded-full">
                    Ver Detalle
                  </span>
                </div>
              </div>

              {/* ── Card Body ── */}
              <div className="flex flex-col flex-1 p-3 space-y-2">

                {/* Product name */}
                <h3 className="font-bold text-xs text-white leading-snug line-clamp-2 group-hover:text-indigo-300 transition">
                  {prod.name}
                </h3>

                {/* Duration */}
                <span className="text-[9px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {prod.duration_days} días
                </span>

                {/* Price */}
                <div className="flex items-baseline justify-between mt-auto pt-1">
                  <span className="text-sm font-mono font-extrabold text-white">
                    ${prod.reseller_price.toLocaleString('es-CO')}
                    <span className="text-[9px] font-normal text-slate-500 ml-0.5">COP</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">+{profitPct}%</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => setDetailProduct(prod)}
                    className="flex-1 py-2 rounded-xl text-[10px] font-semibold border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 bg-slate-900/60 hover:bg-slate-800 transition flex items-center justify-center gap-1"
                  >
                    <Info className="w-3 h-3" /> Detalle
                  </button>
                  <button
                    onClick={() => handleAdd(prod)}
                    disabled={stock === 0}
                    className={`flex-[2] py-2 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition ${
                      stock === 0
                        ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                        : isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                    }`}
                  >
                    {isAdded
                      ? <><Check className="w-3 h-3" /> Listo</>
                      : <><ShoppingCart className="w-3 h-3" /> {stock === 0 ? 'Agotado' : 'Carrito'}</>
                    }
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14 text-slate-500 space-y-2">
          <PackageCheck className="w-10 h-10 mx-auto text-slate-700" />
          <p className="font-semibold text-sm">No se encontraron productos</p>
          <p className="text-xs">Prueba con otra categoría o limpia la búsqueda.</p>
        </div>
      )}

      {/* ── Detail Overlay ── */}
      {detailProduct && (
        <DetailOverlay
          product={detailProduct}
          stock={inventoryCounts[detailProduct.id] ?? 0}
          isAdded={addedId === detailProduct.id}
          onClose={() => setDetailProduct(null)}
          onAddToCart={() => handleAdd(detailProduct)}
        />
      )}
    </div>
  );
};
