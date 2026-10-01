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
  ChevronDown
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
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>('bancolombia');

  const PAYMENT_PHONE = '312 456 7890';
  const PAYMENT_NAME = 'PosiUp Streaming Colombia S.A.S';

  // Branding configuration per gateway
  const gatewayConfig = {
    nequi: {
      name: 'Nequi Directo',
      shortName: 'Nequi',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
      brandGradient: 'from-fuchsia-600 to-pink-600',
      accentText: 'text-fuchsia-400',
      subtext: 'Envía desde tu app Nequi escaneando el código o al celular directo.',
      directType: 'Celular Nequi'
    },
    daviplata: {
      name: 'Daviplata Directo',
      shortName: 'Daviplata',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      brandGradient: 'from-rose-600 to-red-600',
      accentText: 'text-rose-400',
      subtext: 'Pasa plata desde tu app Daviplata usando el número de celular o escaneando.',
      directType: 'Número Daviplata'
    },
    pse: {
      name: 'PSE Débito en Línea',
      shortName: 'PSE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      brandGradient: 'from-emerald-600 to-teal-600',
      accentText: 'text-emerald-400',
      subtext: 'Débito seguro desde cualquier cuenta de ahorros o corriente de Colombia.',
      directType: 'Pasarela PSE'
    },
    llave: {
      name: 'Llave / Transfiya (Bre-B)',
      shortName: 'Transfiya / Llave',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      brandGradient: 'from-indigo-600 to-blue-600',
      accentText: 'text-indigo-400',
      subtext: 'Transferencia interbancaria inmediata con Llave o Transfiya sin costo.',
      directType: 'Llave Celular'
    },
    wompi: {
      name: 'Wompi Bancolombia',
      shortName: 'Wompi',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      brandGradient: 'from-indigo-600 to-purple-600',
      accentText: 'text-indigo-400',
      subtext: 'Pasarela oficial Bancolombia.',
      directType: 'Cuenta de Ahorros'
    },
    bancolombia: {
      name: 'Bancolombia Directo',
      shortName: 'Bancolombia',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      brandGradient: 'from-amber-600 to-yellow-600',
      accentText: 'text-amber-400',
      subtext: 'Transferencia directa o QR Bancolombia.',
      directType: 'Cuenta Bancolombia'
    },
    binance_usdt: {
      name: 'Binance Pay USDT',
      shortName: 'Binance',
      badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      brandGradient: 'from-yellow-600 to-amber-600',
      accentText: 'text-yellow-400',
      subtext: 'Pago cripto USDT TRC20 / BEP20.',
      directType: 'Binance Pay ID'
    },
    manual: {
      name: 'Transferencia Manual',
      shortName: 'Manual',
      badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      brandGradient: 'from-slate-600 to-slate-700',
      accentText: 'text-slate-300',
      subtext: 'Comprobante manual validado por soporte.',
      directType: 'Comprobante'
    }
  }[gateway] || {
    name: 'Pago Directo',
    shortName: 'Directo',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    brandGradient: 'from-indigo-600 to-purple-600',
    accentText: 'text-indigo-400',
    subtext: 'Acreditación instantánea 24/7.',
    directType: 'Cuenta'
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
        qrPayload = `nequi://pay?phone=3124567890&amount=${amount}&ref=${uniqueRef}`;
      } else if (gateway === 'daviplata') {
        qrPayload = `daviplata://transfer?phone=3124567890&amount=${amount}&ref=${uniqueRef}`;
      } else if (gateway === 'pse') {
        qrPayload = `https://registro.pse.com.co/payment?merchant=PosiUp&amount=${amount}&ref=${uniqueRef}`;
      } else if (gateway === 'llave') {
        qrPayload = `transfiya://key/3124567890?amount=${amount}&ref=${uniqueRef}&memo=BolsaPosiUp`;
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

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PAYMENT_PHONE.replace(/\s+/g, ''));
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
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
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-[11px] text-slate-400">Tipo de Persona:</span>
                    <span className="text-slate-200">Natural / Jurídica</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Nequi, Daviplata, Llave: Mostrar Celular y Datos directos */
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      {gatewayConfig.directType}:
                    </span>
                    <strong className="text-base font-mono text-white tracking-wider">
                      {PAYMENT_PHONE}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-slate-700"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPhone ? '¡Copiado!' : 'Copiar Número'}
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex justify-between">
                  <span>Titular: <strong>{PAYMENT_NAME}</strong></span>
                  <span className={gatewayConfig.accentText}>Verificado ✓</span>
                </div>
              </div>
            )}

            {/* QR Code Container */}
            <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center shadow-inner mx-auto max-w-[240px]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR ${gatewayConfig.name}`}
                  className="w-44 h-44 rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
                  Generando QR...
                </div>
              )}
              <span className="text-[9px] font-bold text-slate-800 mt-2 font-mono uppercase tracking-wide">
                Escanea desde tu App {gatewayConfig.shortName}
              </span>
            </div>

            {/* Referencia Única */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block uppercase">Referencia Única:</span>
                <strong className="text-indigo-300 text-sm font-bold">{reference}</strong>
              </div>
              <button
                type="button"
                onClick={handleCopyReference}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-[11px] cursor-pointer border border-slate-700"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedRef ? '¡Copiada!' : 'Copiar Referencia'}
              </button>
            </div>

            {/* Botón Simular Escaneo & Webhook */}
            <button
              type="button"
              onClick={handleSimulateScanAndPay}
              disabled={simulatingWebhook}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r ${gatewayConfig.brandGradient} hover:opacity-95 text-white transition shadow-lg flex items-center justify-center gap-2 cursor-pointer`}
            >
              {simulatingWebhook ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verificando acreditación con {gatewayConfig.shortName}...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Simular Pago y Acreditar Saldo Inmediato
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
