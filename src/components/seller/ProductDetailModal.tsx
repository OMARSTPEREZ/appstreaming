'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  Clock, 
  Zap, 
  AlertTriangle, 
  Star,
  TrendingUp,
  Info,
  Tv,
  Film,
  Youtube,
  Music,
  Laptop,
  Sparkles,
  Flame,
  Lock,
  Users,
  Monitor,
  Award
} from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductDetailModalProps {
  product: Product | null;
  stock: number;
  isAdded: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const BRAND_RULES: Record<string, { rules: string[]; guarantee: string; supportNotes: string }> = {
  netflix: {
    rules: [
      '1 dispositivo simultáneo por perfil',
      'No modificar contraseña madre de la cuenta',
      'Usar PIN de perfil asignado para bloquear cambios',
      'No compartir credenciales con terceros externos',
      'Reportar inmediatamente si piden código de hogar',
    ],
    guarantee: '30 días de garantía activa. Si el perfil cae o la clave cambia, se reemplaza la cuenta o el perfil sin costo adicional dentro del período.',
    supportNotes: 'Soporte 7/7 vía ticket. Tiempo de respuesta: < 4 horas en horario hábil. Reemplazo automático en < 2 horas.',
  },
  youtube: {
    rules: [
      'Activar en tu propio correo Google (se envía invitación)',
      'No aceptar solicitudes de pago dentro de la cuenta',
      'No modificar configuración de suscripción familiar',
      'Uso individual — no compartir acceso',
      'Si expira Google te notificará con 3 días de antelación',
    ],
    guarantee: 'Garantía de activación exitosa y 30 días de membresía activa. Si falla la activación, se reenvía link o se reembolsa.',
    supportNotes: 'Soporte por ticket para problemas de activación. Tiempo de respuesta < 6 horas. Reactivación sin costo si el período no venció.',
  },
  'disney+': {
    rules: [
      '1 perfil privado en cuenta compartida premium',
      'No modificar nombre o avatar del perfil asignado',
      'Resolución hasta 4K con Dolby Vision disponible',
      'Incluye ESPN+ y Star+ según región',
      'No intentar acceder al perfil del administrador',
    ],
    guarantee: '30 días de garantía. Reemplazo de perfil si la cuenta es cerrada o el acceso es bloqueado por plataforma.',
    supportNotes: 'Ticket de soporte para cualquier incidencia. Respuesta < 3 horas. Cuenta de respaldo disponible en < 1 hora.',
  },
  spotify: {
    rules: [
      'Activar modo Premium Individual a tu cuenta existente',
      'No aceptar cambios de plan desde dentro de la app',
      'Evitar iniciar sesión simultáneo en más de 3 dispositivos',
      'No modificar método de pago ni datos de facturación',
      'Compatible con Smart TV, Alexa y dispositivos Bluetooth',
    ],
    guarantee: '30 días de escucha ininterrumpida garantizada. Si Spotify detecta actividad sospechosa y suspende, se renueva sin costo.',
    supportNotes: 'Soporte vía ticket. Renovación automática disponible al precio mayorista publicado. Sin sorpresas de precio.',
  },
  default: {
    rules: [
      'Uso personal o para reventa individual — no masificación',
      'No compartir con usuarios no autorizados',
      'Reportar cualquier incidencia en < 24 horas desde que ocurre',
      'Renovación disponible al precio mayorista vigente',
      'Garantía cubre fallas del servicio, no mal uso del cliente',
    ],
    guarantee: 'Garantía estándar de 30 días. Reemplazo o reembolso proporcional si el servicio falla por causas externas al distribuidor.',
    supportNotes: 'Soporte por ticket con SLA de respuesta < 8 horas. Atención 7 días a la semana.',
  },
};

const getBrandGradient = (brand: string): string => {
  switch (brand.toLowerCase()) {
    case 'netflix': return 'from-red-950/60 via-slate-900 to-black';
    case 'youtube': return 'from-red-950/50 via-slate-900 to-black';
    case 'disney+': return 'from-blue-950/60 via-slate-900 to-black';
    case 'spotify': return 'from-emerald-950/60 via-slate-900 to-black';
    case 'amazon prime': return 'from-cyan-950/50 via-slate-900 to-black';
    case 'max': return 'from-purple-950/60 via-slate-900 to-black';
    case 'paramount+': return 'from-blue-950/50 via-slate-900 to-black';
    case 'canva': return 'from-cyan-950/50 via-slate-900 to-black';
    case 'combo b2b': return 'from-amber-950/50 via-slate-900 to-black';
    default: return 'from-indigo-950/60 via-slate-900 to-black';
  }
};

const getBrandAccent = (brand: string): string => {
  switch (brand.toLowerCase()) {
    case 'netflix': return 'text-red-400 border-red-500/40 bg-red-950/30';
    case 'youtube': return 'text-red-400 border-red-500/40 bg-red-950/30';
    case 'disney+': return 'text-blue-400 border-blue-500/40 bg-blue-950/30';
    case 'spotify': return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
    case 'amazon prime': return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30';
    case 'max': return 'text-purple-400 border-purple-500/40 bg-purple-950/30';
    case 'canva': return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30';
    case 'combo b2b': return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    default: return 'text-indigo-400 border-indigo-500/40 bg-indigo-950/30';
  }
};

const getBrandColor = (brand: string): string => {
  switch (brand.toLowerCase()) {
    case 'netflix': return '#E50914';
    case 'youtube': return '#FF0000';
    case 'disney+': return '#113CCF';
    case 'spotify': return '#1DB954';
    case 'amazon prime': return '#00A8E1';
    case 'max': return '#7B2FBE';
    case 'canva': return '#00C4CC';
    case 'combo b2b': return '#F59E0B';
    default: return '#6366F1';
  }
};

const getBrandIcon = (brand: string, size = 'w-6 h-6') => {
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

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  stock,
  isAdded,
  onClose,
  onAddToCart,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!product) return null;

  const brandKey = product.brand.toLowerCase();
  const brandInfo = BRAND_RULES[brandKey] || BRAND_RULES.default;
  const estimatedProfit = product.suggested_price - product.reseller_price;
  const profitPercent = Math.round((estimatedProfit / product.reseller_price) * 100);
  const accentClass = getBrandAccent(product.brand);
  const brandColor = getBrandColor(product.brand);
  const gradientClass = getBrandGradient(product.brand);

  const stockPercent = Math.min(100, Math.round((stock / 10) * 100));
  const stockColor = stock >= 5 ? 'bg-emerald-500' : stock >= 2 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className={`relative w-full bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden
          ${isMobile 
            ? 'rounded-t-3xl max-h-[92vh] overflow-y-auto animate-slide-up' 
            : 'max-w-2xl rounded-3xl'}`}
        onClick={(e) => e.stopPropagation()}
        style={{ borderTopColor: brandColor + '40' }}
      >
        {/* Brand Gradient Header Banner */}
        <div className={`relative bg-gradient-to-br ${gradientClass} p-6 pb-8 overflow-hidden`}>
          {/* Decorative glow */}
          <div 
            className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ backgroundColor: brandColor }}
          />
          
          {/* Drag handle (mobile) */}
          {isMobile && (
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 -mt-1" />
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            {/* Brand Logo */}
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 flex-shrink-0"
              style={{ backgroundColor: brandColor + '20', borderColor: brandColor + '40' }}
            >
              {getBrandIcon(product.brand, 'w-8 h-8')}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
                  style={{ color: brandColor, borderColor: brandColor + '40', backgroundColor: brandColor + '15' }}
                >
                  {product.brand}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 border border-slate-700 px-2 py-0.5 rounded">
                  {product.category}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> 
                {product.duration_days} días continuos de servicio garantizado
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[55vh] md:max-h-none">
          {/* Stock bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Stock disponible en tiempo real</span>
              <span className={`font-bold ${stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock > 0 ? `${stock} ${stock === 1 ? 'unidad' : 'unidades'} disponibles` : 'Agotado'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${stockColor} rounded-full transition-all duration-700`}
                style={{ width: `${Math.max(stockPercent, stock > 0 ? 8 : 0)}%` }}
              />
            </div>
            {stock > 0 && stock <= 3 && (
              <p className="text-[10px] text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> ¡Últimas unidades! El stock puede agotarse pronto.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Features grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" /> Características del Servicio
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules of Use */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Reglas de Uso (para tu cliente)
            </h4>
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
              {brandInfo.rules.map((rule, idx) => (
                <p key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5 flex-shrink-0">›</span>
                  {rule}
                </p>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Garantía y Soporte Incluidos
            </h4>
            <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-emerald-400 font-bold">Garantía: </span>
                {brandInfo.guarantee}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-indigo-400 font-bold">Soporte: </span>
                {brandInfo.supportNotes}
              </p>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className={`p-4 rounded-2xl border ${accentClass} border`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Desglose de Precio & Margen
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 block mb-0.5">Tu Costo</span>
                <span className="text-sm font-mono font-bold text-white">${product.reseller_price.toLocaleString('es-CO')}</span>
                <span className="text-[9px] text-slate-500 block">COP</span>
              </div>
              <div className="text-center border-x border-slate-700/50">
                <span className="text-[10px] text-slate-500 block mb-0.5">P. Sugerido Venta</span>
                <span className="text-sm font-mono font-bold text-slate-400 line-through">${product.suggested_price.toLocaleString('es-CO')}</span>
                <span className="text-[9px] text-slate-500 block">COP</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-500 block mb-0.5">Tu Ganancia</span>
                <span className="text-sm font-mono font-bold text-emerald-400">+${estimatedProfit.toLocaleString('es-CO')}</span>
                <span className="text-[9px] text-emerald-500 block font-bold">{profitPercent}% margen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom CTA */}
        <div className="sticky bottom-0 p-4 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold border border-slate-800 transition"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              if (stock > 0) {
                onAddToCart(product);
                onClose();
              }
            }}
            disabled={stock === 0 || isAdded}
            className={`flex-[2] py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg ${
              stock === 0
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-95'
            }`}
          >
            {isAdded ? (
              <><Check className="w-4 h-4" /> ¡En el Carrito!</>
            ) : stock === 0 ? (
              'Sin Stock Disponible'
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Agregar al Carrito — ${product.reseller_price.toLocaleString('es-CO')} COP</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
