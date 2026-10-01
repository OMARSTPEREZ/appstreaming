'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  X, 
  Clock, 
  Copy, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Wallet, 
  RefreshCw,
  Sparkles,
  Smartphone,
  ExternalLink,
  ChevronDown,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { PaymentGateway } from '@/lib/types';

interface DynamicQrModalProps {
  isOpen: boolean;
  amount: number;
  gateway: PaymentGateway;
  onClose: () => void;
  onPaymentApproved: (amount: number, gateway: PaymentGateway, reference: string) => void;
}

const COLOMBIAN_BANKS = [
  { id: 'bancolombia', name: 'Bancolombia (Ahorros / Corriente)' },
  { id: 'davivienda', name: 'Banco Davivienda' },
  { id: 'bbva', name: 'BBVA Colombia' },
  { id: 'bogota', name: 'Banco de Bogotá' },
  { id: 'nu', name: 'Nu Colombia (Cuenta Nu)' },
  { id: 'occidente', name: 'Banco de Occidente' },
  { id: 'scotiabank', name: 'Scotiabank Colpatria' },
  { id: 'lulo', name: 'Lulo Bank' },
  { id: 'popular', name: 'Banco Popular' },
  { id: 'falabella', name: 'Banco Falabella' },
  { id: 'itau', name: 'Banco Itaú' },
  { id: 'avvillas', name: 'Banco AV Villas' }
];

export const DynamicQrModal: React.FC<DynamicQrModalProps> = ({
  isOpen,
  amount,
  gateway,
  onClose,
  onPaymentApproved,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 minutos = 900s
  const [reference, setReference] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>('bancolombia');

  const PAYMENT_NAME = 'PosiUp Streaming Colombia S.A.S';

  // Branding configuration & Redirect URLs per gateway
  const gatewayConfig = {
    nequi: {
      name: 'Nequi Directo',
      shortName: 'Nequi',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
      brandGradient: 'from-fuchsia-600 to-pink-600',
      accentText: 'text-fuchsia-400',
      subtext: 'Pasarela oficial y conexión automática con Nequi.',
      redirectUrl: 'https://recarga.nequi.com.co/',
      appActionText: 'Abrir App Nequi / Portal de Pago'
    },
    daviplata: {
      name: 'Daviplata Directo',
      shortName: 'Daviplata',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      brandGradient: 'from-rose-600 to-red-600',
      accentText: 'text-rose-400',
      subtext: 'Pasarela oficial y conexión automática con Daviplata.',
      redirectUrl: 'https://portal.daviplata.com/',
      appActionText: 'Abrir App Daviplata / Portal de Pago'
    },
    pse: {
      name: 'PSE Débito en Línea',
      shortName: 'PSE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      brandGradient: 'from-emerald-600 to-teal-600',
      accentText: 'text-emerald-400',
      subtext: 'Débito seguro desde cualquier banco de Colombia.',
      redirectUrl: 'https://registro.pse.com.co/',
      appActionText: 'Ir a la Pasarela Oficial PSE'
    },
    llave: {
      name: 'Llave / Transfiya (Bre-B)',
      shortName: 'Transfiya / Llave',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      brandGradient: 'from-indigo-600 to-blue-600',
      accentText: 'text-indigo-400',
      subtext: 'Transferencia interbancaria inmediata con Llave o Transfiya.',
      redirectUrl: 'https://www.transfiya.com.co/',
      appActionText: 'Abrir Transfiya / Bre-B'
    },
    wompi: {
      name: 'Wompi Bancolombia',
      shortName: 'Wompi',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      brandGradient: 'from-indigo-600 to-purple-600',
      accentText: 'text-indigo-400',
      subtext: 'Pasarela oficial Bancolombia.',
      redirectUrl: 'https://checkout.wompi.co/',
      appActionText: 'Ir a Pasarela Wompi'
    },
    bancolombia: {
      name: 'Bancolombia Directo',
      shortName: 'Bancolombia',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      brandGradient: 'from-amber-600 to-yellow-600',
      accentText: 'text-amber-400',
      subtext: 'Transferencia directa o App Bancolombia.',
      redirectUrl: 'https://www.bancolombia.com/personas',
      appActionText: 'Abrir Sucursal Virtual Bancolombia'
    },
    binance_usdt: {
      name: 'Binance Pay USDT',
      shortName: 'Binance',
      badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      brandGradient: 'from-yellow-600 to-amber-600',
      accentText: 'text-yellow-400',
      subtext: 'Pago cripto USDT TRC20 / BEP20.',
      redirectUrl: 'https://pay.binance.com/',
      appActionText: 'Abrir Binance Pay'
    },
    manual: {
      name: 'Transferencia Manual',
      shortName: 'Manual',
      badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      brandGradient: 'from-slate-600 to-slate-700',
      accentText: 'text-slate-300',
      subtext: 'Comprobante manual validado por soporte.',
      redirectUrl: 'https://wa.me/573124567890',
      appActionText: 'Enviar Comprobante WhatsApp'
    }
  }[gateway] || {
    name: 'Pago Directo',
    shortName: 'Directo',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    brandGradient: 'from-indigo-600 to-purple-600',
    accentText: 'text-indigo-400',
    subtext: 'Acreditación instantánea 24/7.',
    redirectUrl: 'https://recarga.nequi.com.co/',
    appActionText: 'Abrir App de Pago'
  };

  // Generate unique dynamic reference and QR code on open
  useEffect(() => {
    if (isOpen) {
      const prefix = gateway.slice(0, 3).toUpperCase();
      const uniqueRef = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      setReference(uniqueRef);
      setTimeLeft(900);
      setIsApproved(false);
      setSimulatingWebhook(false);

      // Generate realistic payload according to method
      let qrPayload = '';
      if (gateway === 'nequi') {
        qrPayload = `nequi://pay?merchant=PosiUp&amount=${amount}&ref=${uniqueRef}`;
      } else if (gateway === 'daviplata') {
        qrPayload = `daviplata://pay?merchant=PosiUp&amount=${amount}&ref=${uniqueRef}`;
      } else if (gateway === 'pse') {
        qrPayload = `https://registro.pse.com.co/payment?merchant=PosiUp&amount=${amount}&ref=${uniqueRef}`;
      } else if (gateway === 'llave') {
        qrPayload = `transfiya://key?merchant=PosiUp&amount=${amount}&ref=${uniqueRef}&memo=BolsaPosiUp`;
      } else {
        qrPayload = JSON.stringify({
          gateway: gateway.toUpperCase(),
          reference: uniqueRef,
          amount_cop: amount,
          account: '031-984218-77',
          expires_in: 900,
        });
      }

      QRCode.toDataURL(qrPayload, {
        width: 260,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generando QR:', err));
    }
  }, [isOpen, amount, gateway]);

  // Countdown Timer
  useEffect(() => {
    if (!isOpen || isApproved || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isApproved, timeLeft]);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  // Direct Redirection to payment App / Portal
  const handleDirectRedirect = () => {
    if (typeof window !== 'undefined') {
      window.open(gatewayConfig.redirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Simular pago escaneado / Webhook de Pasarela
  const handleSimulateScanAndPay = () => {
    setSimulatingWebhook(true);
    setTimeout(() => {
      setSimulatingWebhook(false);
      setIsApproved(true);
      onPaymentApproved(amount, gateway, reference);
      setTimeout(() => {
        setIsApproved(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700/80 shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${gatewayConfig.badgeColor}`}>
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{gatewayConfig.name}</h3>
              <p className="text-[11px] text-slate-400">{gatewayConfig.subtext}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isApproved ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">¡Pago Confirmado y Saldo Acreditado!</h4>
            <p className="text-sm font-semibold text-emerald-400 font-mono">
              +${amount.toLocaleString('es-CO')} COP abonados a tu bolsa
            </p>
            <p className="text-xs text-slate-400">
              Aprobación automática vía {gatewayConfig.name}. Referencia {reference}.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-center">
            
            {/* Monto y Temporizador */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total a Pagar</span>
                <span className="text-xl font-mono font-extrabold text-emerald-400">
                  ${amount.toLocaleString('es-CO')} <span className="text-xs font-medium text-slate-400">COP</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Expira en</span>
                <span className="text-sm font-mono font-bold text-amber-400 flex items-center gap-1 justify-end">
                  <Clock className="w-3.5 h-3.5" /> {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* BOTÓN PRINCIPAL DE REDIRECCIÓN DIRECTA A LA APP / PORTAL */}
            <button
              type="button"
              onClick={handleDirectRedirect}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r ${gatewayConfig.brandGradient} hover:opacity-95 text-white transition shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01] active:scale-95`}
            >
              <span>{gatewayConfig.appActionText}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* SECCIÓN ESPECÍFICA SEGÚN MÉTODO */}
            {gateway === 'pse' ? (
              <div className="space-y-3 text-left">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Selecciona tu Banco:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 transition cursor-pointer appearance-none pr-8"
                    >
                      {COLOMBIAN_BANKS.map((b) => (
                        <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[11px] text-slate-400">Comercio:</span>
                    <span className="font-semibold text-white">{PAYMENT_NAME}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[11px] text-slate-400">NIT / Identificación:</span>
                    <span className="font-mono text-emerald-300">901.847.129-4</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Tarjeta de Conexión Segura con la Pasarela (Sin números de teléfono manuales) */
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white text-xs">Pasarela Automatizada {gatewayConfig.shortName}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    En Línea 24/7
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex justify-between items-center">
                  <span>Comercio Oficial: <strong>{PAYMENT_NAME}</strong></span>
                  <span className={gatewayConfig.accentText}>Acreditación Instantánea</span>
                </div>
              </div>
            )}

            {/* QR Code Container para escanear si está en PC */}
            <div className="p-3.5 rounded-2xl bg-white flex flex-col items-center justify-center shadow-inner mx-auto max-w-[210px]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR ${gatewayConfig.name}`}
                  className="w-36 h-36 rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs">
                  Generando QR...
                </div>
              )}
              <span className="text-[9px] font-bold text-slate-800 mt-1 font-mono uppercase tracking-wide">
                O Escanea desde tu App {gatewayConfig.shortName}
              </span>
            </div>

            {/* Referencia Única */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block uppercase">Referencia de Pago:</span>
                <strong className="text-indigo-300 text-sm font-bold">{reference}</strong>
              </div>
              <button
                type="button"
                onClick={handleCopyReference}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-[11px] cursor-pointer border border-slate-700"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedRef ? '¡Copiada!' : 'Copiar Ref'}
              </button>
            </div>

            {/* Botón Acreditar Saldo Inmediato */}
            <button
              type="button"
              onClick={handleSimulateScanAndPay}
              disabled={simulatingWebhook}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {simulatingWebhook ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  Verificando acreditación con {gatewayConfig.shortName}...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Simular Pago y Acreditar Saldo Inmediatamente
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
