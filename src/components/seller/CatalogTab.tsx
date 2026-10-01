'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, ShoppingCart, Check, Sparkles, Flame, Tv, Film, Youtube,
  Music, Laptop, TrendingUp, PackageCheck, Info, ChevronUp,
  ShieldCheck, Lock, Star, Clock, X, Monitor, PlayCircle,
  Wifi, Radio, Headphones, Zap
} from 'lucide-react';
import { Product, ProductCategory } from '@/lib/types';

interface CatalogTabProps {
  products: Product[];
  inventoryCounts: Record<string, number>;
  onAddToCart: (product: Product) => void;
}

const CATEGORIES: ('Todas' | ProductCategory | 'IPTV & TV' | 'Música & Vídeo')[] = [
  'Todas', 'Streaming', 'IPTV & TV', 'Música & Vídeo',
];

// ── Brand visual config ────────────────────────────────────────────────────
type BrandConfig = {
  gradient: string; glow: string; accent: string;
  label: string; tagline: string; badge?: string;
  rules: string[]; guarantee: string; support: string;
};

const BRAND: Record<string, BrandConfig> = {
  'netflix original': {
    gradient: 'linear-gradient(135deg, #1a0000 0%, #7a0000 50%, #E50914 100%)',
    glow: 'rgba(229,9,20,0.55)', accent: '#E50914',
    label: 'NETFLIX ORIGINAL', tagline: '4K Ultra HD · PIN Privado · Cuenta Original',
    badge: '⭐ MÁS VENDIDO',
    rules: ['1 dispositivo por pantalla', 'No modificar contraseña madre', 'Usar PIN de perfil asignado', 'Reportar si solicitan código de hogar'],
    guarantee: '30 días. Perfil caído o clave cambiada → reemplazo sin costo.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  'netflix extra': {
    gradient: 'linear-gradient(135deg, #1a0000 0%, #800000 50%, #CC0000 100%)',
    glow: 'rgba(204,0,0,0.50)', accent: '#CC0000',
    label: 'NETFLIX EXTRA', tagline: 'Miembro Extra Oficial · Perfil Propio',
    badge: '🔥 ALTA DEMANDA',
    rules: ['Perfil independiente del administrador', 'No modificar datos de facturación', 'Acceso desde tu correo personal'],
    guarantee: '30 días garantizados. Reemplazo sin costo si el cupo extra es removido.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  netflix: {
    gradient: 'linear-gradient(135deg, #160000 0%, #6b0000 50%, #E50914 100%)',
    glow: 'rgba(229,9,20,0.45)', accent: '#E50914',
    label: 'NETFLIX', tagline: 'Catálogo Completo · Uso Libre',
    rules: ['Uso libre en pantalla asignada', 'No cambiar la cuenta de correo principal', 'Reportar incidencias dentro de las 24 h'],
    guarantee: '30 días garantizados. Reemplazo inmediato si la pantalla deja de funcionar.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  'stella tv': {
    gradient: 'linear-gradient(135deg, #0d0018 0%, #3b0066 50%, #8B5CF6 100%)',
    glow: 'rgba(139,92,246,0.55)', accent: '#8B5CF6',
    label: 'STELLA TV', tagline: '+500 Canales en Vivo · Deportes & VOD',
    badge: '⚽ DEPORTES & CANALES VIVO',
    rules: ['Uso en dispositivos autorizados', 'No compartir credenciales masivamente', 'Reiniciar app si hay buffering'],
    guarantee: '30 días. Canal caído o acceso bloqueado → reemplazo sin costo.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  jellyfin: {
    gradient: 'linear-gradient(135deg, #0a0016 0%, #2d006b 50%, #7C3AED 100%)',
    glow: 'rgba(124,58,237,0.55)', accent: '#7C3AED',
    label: 'JELLYFIN', tagline: 'Servidor Privado · Series & Películas · Canales',
    badge: '⚽ DEPORTES & CANALES VIVO',
    rules: ['No compartir credenciales con terceros externos', 'Máximo de dispositivos según plan contratado', 'Reportar caídas en < 24 h'],
    guarantee: '30 días. Acceso bloqueado → reemplazo del acceso sin costo.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  emby: {
    gradient: 'linear-gradient(135deg, #001a0a 0%, #004d1f 50%, #52B788 100%)',
    glow: 'rgba(82,183,136,0.50)', accent: '#52B788',
    label: 'EMBY', tagline: 'Servidor Premium · Canales & VOD',
    badge: '⚽ DEPORTES & CANALES VIVO',
    rules: ['Uso en el dispositivo asignado', 'No modificar configuración del servidor', 'Canal no disponible → ticket de soporte'],
    guarantee: '30 días garantizados. Reemplazo por fallas del servidor.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  'iptv win+': {
    gradient: 'linear-gradient(135deg, #1a0800 0%, #7a3000 50%, #F97316 100%)',
    glow: 'rgba(249,115,22,0.55)', accent: '#F97316',
    label: 'IPTV + WIN SPORTS+', tagline: 'Canales Premium · Fútbol Colombiano Win+',
    badge: '⚽ DEPORTES & CANALES VIVO',
    rules: ['Win Sports+ requiere conexión estable', 'No compartir credenciales de acceso', 'Usar app autorizada para el plan'],
    guarantee: '30 días. Si Win+ no disponible → reemplazo o reembolso proporcional.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  plex: {
    gradient: 'linear-gradient(135deg, #1a1000 0%, #7a5000 50%, #E5A00D 100%)',
    glow: 'rgba(229,160,13,0.50)', accent: '#E5A00D',
    label: 'PLEX', tagline: 'Catálogo Amplio · Canales Incluidos',
    badge: '📺 STREAMING & TV',
    rules: ['Uso en dispositivos Plex compatibles', 'No revocar permisos del servidor', 'Reportar error en < 24 h'],
    guarantee: '30 días. Acceso perdido → reemplazo sin costo.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  'disney+': {
    gradient: 'linear-gradient(135deg, #000a1a 0%, #00304a 50%, #00637C 100%)',
    glow: 'rgba(0,99,124,0.60)', accent: '#00637C',
    label: 'DISNEY+', tagline: 'Disney · Marvel · Star Wars · ESPN',
    badge: '🏆 PREMIUM + ESPN',
    rules: ['No cambiar nombre ni avatar del perfil', 'No acceder al perfil del administrador', 'Resolución 4K con Dolby Vision disponible'],
    guarantee: '30 días. Perfil eliminado → reemplazo < 1 h.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  'prime video': {
    gradient: 'linear-gradient(135deg, #001a1a 0%, #005a7a 50%, #00A8E1 100%)',
    glow: 'rgba(0,168,225,0.55)', accent: '#00A8E1',
    label: 'PRIME VIDEO', tagline: 'Amazon Originals · HD & 4K',
    rules: ['No compartir credenciales fuera del hogar', 'No modificar método de pago', 'Acceso a Prime Music incluido en cuenta original'],
    guarantee: '30 días. Acceso revocado → reemplazo o reembolso.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  'hbo max': {
    gradient: 'linear-gradient(135deg, #0d001a 0%, #3d0066 50%, #7B2FBE 100%)',
    glow: 'rgba(123,47,190,0.60)', accent: '#7B2FBE',
    label: 'HBO MAX', tagline: 'HBO Originals · Warner · DC · 4K HDR',
    rules: ['Uso del perfil asignado únicamente', 'No modificar configuración de la cuenta', '4K requiere plan Platino en algunos casos'],
    guarantee: '30 días. Perfil caído → reemplazo en < 2 h.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  'paramount+': {
    gradient: 'linear-gradient(135deg, #00001a 0%, #00006b 50%, #0064FF 100%)',
    glow: 'rgba(0,100,255,0.55)', accent: '#0064FF',
    label: 'PARAMOUNT+', tagline: 'Series Exclusivas · Deportes · Películas',
    rules: ['Uso del perfil asignado', 'No compartir con múltiples usuarios externos', 'Reportar incidencias en < 24 h'],
    guarantee: '30 días garantizados. Reemplazo por fallas de acceso.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  crunchyroll: {
    gradient: 'linear-gradient(135deg, #1a0500 0%, #7a2800 50%, #FF6600 100%)',
    glow: 'rgba(255,102,0,0.60)', accent: '#FF6600',
    label: 'CRUNCHYROLL', tagline: 'Todo el Anime · Simulcast Japón 🐉',
    badge: '🐉 ANIME PREMIUM',
    rules: ['No compartir cuenta fuera del plan contratado', 'Simulcast disponible al día siguiente de emisión en JP', 'Máximo de dispositivos según plan'],
    guarantee: '30 días. Acceso perdido → reemplazo en < 2 h.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  vix: {
    gradient: 'linear-gradient(135deg, #1a001a 0%, #6b0066 50%, #D946EF 100%)',
    glow: 'rgba(217,70,239,0.55)', accent: '#D946EF',
    label: 'VIX', tagline: 'Contenido Latino Premium · Novelas & Deportes',
    rules: ['Uso en dispositivos ViX compatibles', 'No modificar datos de la cuenta', 'Contenido en español exclusivo'],
    guarantee: '30 días. Acceso bloqueado → reemplazo sin costo.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  youtube: {
    gradient: 'linear-gradient(135deg, #1a0000 0%, #7a0000 50%, #FF0000 100%)',
    glow: 'rgba(255,0,0,0.50)', accent: '#FF0000',
    label: 'YOUTUBE PREMIUM', tagline: 'Sin Anuncios · YouTube Music Incluido 🎼',
    badge: '🎼 MÚSICA & AD-FREE',
    rules: ['Activar en tu correo Google personal', 'No compartir acceso con terceros', 'Compatible con Chromecast y Smart TV'],
    guarantee: '30 días garantizados. Reactivación sin costo si el período no venció.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
  spotify: {
    gradient: 'linear-gradient(135deg, #001a08 0%, #006b22 50%, #1DB954 100%)',
    glow: 'rgba(29,185,84,0.55)', accent: '#1DB954',
    label: 'SPOTIFY', tagline: 'Música Premium · 320 kbps · Sin Anuncios 🎼',
    badge: '🎼 MÚSICA & AD-FREE',
    rules: ['Activar Premium en tu cuenta existente', 'No modificar método de pago', 'Compatible con Alexa, Chromecast y más'],
    guarantee: '30 días garantizados. Renovación sin costo si Spotify suspende.', support: '24/7 Automatizado · Respuesta Inmediata',
  },
};

const DEFAULT_BRAND: BrandConfig = {
  gradient: 'linear-gradient(135deg, #0d0d1a 0%, #1e1e4a 50%, #6366F1 100%)',
  glow: 'rgba(99,102,241,0.50)', accent: '#6366F1',
  label: 'STREAMING', tagline: 'Servicio Digital · Entrega Inmediata',
  rules: ['Uso personal o reventa individual', 'No compartir con usuarios no autorizados', 'Reportar incidencias en < 24 h'],
  guarantee: '30 días garantizados. Reemplazo o reembolso proporcional.',
  support: '24/7 Automatizado · Respuesta Inmediata',
};

const getBrand = (brand: string): BrandConfig => BRAND[brand.toLowerCase()] ?? DEFAULT_BRAND;

const getBrandIcon = (brand: string, cls = 'w-8 h-8') => {
  const b = brand.toLowerCase();
  if (b.includes('netflix'))   return <Tv          className={`${cls} text-red-400`}     />;
  if (b === 'youtube')         return <Youtube     className={`${cls} text-red-400`}     />;
  if (b === 'disney+')         return <Film        className={`${cls} text-cyan-300`}    />;
  if (b === 'spotify')         return <Music       className={`${cls} text-emerald-400`} />;
  if (b === 'prime video')     return <PlayCircle  className={`${cls} text-cyan-400`}    />;
  if (b === 'hbo max')         return <Monitor     className={`${cls} text-purple-400`}  />;
  if (b === 'paramount+')      return <Sparkles    className={`${cls} text-blue-400`}    />;
  if (b === 'crunchyroll')     return <Sparkles    className={`${cls} text-orange-400`}  />;
  if (b === 'vix')             return <Film        className={`${cls} text-fuchsia-400`} />;
  if (b === 'stella tv')       return <Radio       className={`${cls} text-violet-400`}  />;
  if (b === 'jellyfin')        return <Wifi        className={`${cls} text-purple-400`}  />;
  if (b === 'emby')            return <Wifi        className={`${cls} text-emerald-400`} />;
  if (b === 'iptv win+')       return <Tv          className={`${cls} text-orange-400`}  />;
  if (b === 'plex')            return <PlayCircle  className={`${cls} text-amber-400`}   />;
  return                              <Sparkles    className={`${cls} text-indigo-400`}  />;
};

// ── Detail Overlay ─────────────────────────────────────────────────────────
interface OverlayProps {
  product: Product; stock: number; isAdded: boolean;
  onClose: () => void; onAddToCart: () => void;
}

const DetailOverlay: React.FC<OverlayProps> = ({ product, stock, isAdded, onClose, onAddToCart }) => {
  const cfg = getBrand(product.brand);
  const profit = product.suggested_price - product.reseller_price;
  const profitPct = Math.round((profit / product.reseller_price) * 100);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-700/40 animate-scale-in"
        style={{ boxShadow: `0 0 60px ${cfg.glow}, 0 20px 60px rgba(0,0,0,0.9)` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner header */}
        <div className="relative h-44 flex flex-col items-center justify-center overflow-hidden" style={{ background: cfg.gradient }}>
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `linear-gradient(${cfg.accent}44 1px, transparent 1px), linear-gradient(90deg, ${cfg.accent}44 1px, transparent 1px)`, backgroundSize: '22px 22px' }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${cfg.accent}35 0%, transparent 65%)` }} />

          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/70 hover:text-white flex items-center justify-center border border-white/10 transition">
            <X className="w-4 h-4" />
          </button>

          <span className="absolute top-3 left-4 text-[10px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full border" style={{ color: cfg.accent, borderColor: cfg.accent + '60', background: 'rgba(0,0,0,0.55)' }}>
            {cfg.label}
          </span>

          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="p-3.5 rounded-3xl border" style={{ background: cfg.accent + '22', borderColor: cfg.accent + '50', boxShadow: `0 0 32px ${cfg.glow}` }}>
              {getBrandIcon(product.brand, 'w-14 h-14')}
            </div>
            <span className="text-white/60 text-xs font-medium text-center px-4">{cfg.tagline}</span>
          </div>
        </div>

        {/* Body */}
        <div className="bg-slate-950 p-5 space-y-3.5 max-h-[55vh] overflow-y-auto">
          <div>
            <h2 className="text-lg font-extrabold text-white leading-tight">{product.name}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <Clock className="w-3 h-3 text-indigo-400" /> {product.duration_days} días continuos · Garantía y Despacho 24/7 Ininterrumpido
            </p>
          </div>

          {/* Stock + precio */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${stock > 0 ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-rose-950/60 border-rose-500/40 text-rose-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${stock > 0 ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
              {stock > 0 ? `${stock} disponible${stock !== 1 ? 's' : ''} · Entrega inmediata` : 'Sin stock'}
            </span>
            <div className="text-right">
              <span className="text-2xl font-mono font-extrabold text-white">${product.reseller_price.toLocaleString('es-CO')}</span>
              <span className="text-xs text-slate-500 ml-1">COP</span>
            </div>
          </div>

          {/* Margen */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-sm" style={{ background: cfg.accent + '12', borderColor: cfg.accent + '30' }}>
            <span className="text-slate-300 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-400" /> Tu margen:</span>
            <span className="font-mono font-extrabold text-emerald-400">+${profit.toLocaleString('es-CO')} ({profitPct}%)</span>
          </div>

          {/* P. sugerido */}
          <div className="flex justify-between text-xs text-slate-500 px-1">
            <span>Precio sugerido al cliente final:</span>
            <span className="font-mono text-slate-400 line-through">${product.suggested_price.toLocaleString('es-CO')} COP</span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>

          {/* Features */}
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> Especificaciones del Plan</p>
            <div className="flex flex-wrap gap-1.5">
              {product.features.map((f, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">✓ {f}</span>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-amber-400" /> Reglas de Uso para tu Cliente</p>
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
              {cfg.rules.map((r, i) => (
                <p key={i} className="text-xs text-slate-300 flex gap-2"><span className="text-amber-400 font-bold flex-shrink-0">›</span>{r}</p>
              ))}
            </div>
          </div>

          {/* Guarantee & Support */}
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Garantía & Soporte</p>
            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
              <p className="text-xs text-slate-300"><span className="text-emerald-400 font-bold">Garantía: </span>{cfg.guarantee}</p>
              <p className="text-xs text-slate-400"><span className="text-indigo-400 font-bold">Soporte: </span>{cfg.support}</p>
            </div>
          </div>
        </div>

        {/* CTA fijo */}
        <div className="bg-slate-950 px-5 py-4 border-t border-slate-800 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold border border-slate-800 transition">
            ← Volver
          </button>
          <button
            onClick={() => { onAddToCart(); onClose(); }}
            disabled={stock === 0 || isAdded}
            className={`flex-[2] py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition ${stock === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : isAdded ? 'bg-emerald-600 text-white' : 'text-white active:scale-95'}`}
            style={stock > 0 && !isAdded ? { background: `linear-gradient(135deg, ${cfg.accent}ee, ${cfg.accent}99)`, boxShadow: `0 4px 20px ${cfg.glow}` } : {}}
          >
            {isAdded ? <><Check className="w-4 h-4" /> ¡Agregado!</> : stock === 0 ? 'Sin Stock' : <><ShoppingCart className="w-4 h-4" /> Agregar — ${product.reseller_price.toLocaleString('es-CO')} COP</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export const CatalogTab: React.FC<CatalogTabProps> = ({ products, inventoryCounts, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
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
    <div className="space-y-4">

      {/* ── Banner 24/7 Automatizado ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-xs">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold whitespace-nowrap">
          🟢 Despacho & Plataforma: <span className="text-slate-200 font-semibold">100% Activo 24/7</span>
        </span>
        <span className="hidden sm:block text-slate-700">|</span>
        <span className="flex items-center gap-1.5 text-indigo-400 font-bold whitespace-nowrap">
          ⚡ Entrega Inmediata: <span className="text-slate-200 font-semibold">Credenciales en Tiempo Real</span>
        </span>
        <span className="hidden sm:block text-slate-700">|</span>
        <span className="text-slate-400 font-medium">Lunes a Domingo · Sin horarios · Acreditación 24 Horas</span>
      </div>

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-7 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
            <Sparkles className="w-3 h-3" /> Catálogo Exclusivo Mayorista N.T.O.
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Netflix · Disney+ · HBO Max · Crunchyroll · IPTV · Spotify y más ⚡
          </h2>
          <p className="text-xs text-slate-300">
            Precio de distribuidor · Márgenes hasta <strong className="text-emerald-400">150%</strong> · Entrega de credenciales en segundos.
          </p>
        </div>
        <Tv className="absolute right-4 bottom-0 translate-y-4 opacity-10 w-52 h-52 text-indigo-400 pointer-events-none" />
      </div>

      {/* ── Search & Filters ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar: Netflix, Disney+, Crunchyroll, IPTV..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap border transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
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
            >
              {/* Visual banner */}
              <div
                className="relative h-28 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
                style={{ background: cfg.gradient }}
                onClick={() => setDetailProduct(prod)}
              >
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `linear-gradient(${cfg.accent}44 1px, transparent 1px), linear-gradient(90deg, ${cfg.accent}44 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${cfg.accent}35 0%, transparent 65%)` }} />

                {/* Badge */}
                {cfg.badge && (
                  <span className="absolute top-2 left-2 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-black/60 text-white border border-white/20 leading-tight">
                    {cfg.badge}
                  </span>
                )}

                {/* Stock badge */}
                <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 ${stock > 0 ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400' : 'bg-rose-950/80 border-rose-500/50 text-rose-400'}`}>
                  <span className={`w-1 h-1 rounded-full ${stock > 0 ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
                  {stock > 0 ? stock : '0'}
                </span>

                {/* Brand icon */}
                <div className="relative z-10">
                  <div className="p-2.5 rounded-2xl border" style={{ background: cfg.accent + '20', borderColor: cfg.accent + '45', boxShadow: `0 0 18px ${cfg.glow}` }}>
                    {getBrandIcon(prod.brand)}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-[10px] font-bold bg-black/60 px-2.5 py-1 rounded-full">Ver Detalle</span>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-3 space-y-2">
                <h3 
                  onClick={() => setDetailProduct(prod)}
                  className="font-bold text-[11px] text-white leading-snug line-clamp-2 group-hover:text-indigo-300 transition cursor-pointer"
                >
                  {prod.name}
                </h3>
                <span className="text-[9px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {prod.duration_days} días
                </span>

                {/* Price + margin */}
                <div className="flex items-baseline justify-between mt-auto pt-1">
                  <span className="text-sm font-mono font-extrabold text-white">
                    ${prod.reseller_price.toLocaleString('es-CO')}
                    <span className="text-[9px] font-normal text-slate-500 ml-0.5">COP</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">+{profitPct}%</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setDetailProduct(prod)}
                    className="flex-1 py-2 rounded-xl text-[10px] font-semibold border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 bg-slate-900/60 hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3 h-3" /> Detalle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdd(prod)}
                    disabled={stock === 0}
                    className={`flex-[2] py-2 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition cursor-pointer ${stock === 0 ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed' : isAdded ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}`}
                  >
                    {isAdded ? <><Check className="w-3 h-3" /> Listo</> : <><ShoppingCart className="w-3 h-3" /> {stock === 0 ? 'Agotado' : 'Carrito'}</>}
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

      {/* Detail overlay */}
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
