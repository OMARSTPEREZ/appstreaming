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
  Smartphone
} from 'lucide-react';
import { PaymentGateway } from '@/lib/types';

interface DynamicQrModalProps {
  isOpen: boolean;
  amount: number;
  gateway: PaymentGateway;
  onClose: () => void;
  onPaymentApproved: (amount: number, gateway: PaymentGateway, reference: string) => void;
}

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

  // Generate unique dynamic reference and QR code on open
  useEffect(() => {
    if (isOpen) {
      const uniqueRef = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
      setReference(uniqueRef);
      setTimeLeft(900);
      setIsApproved(false);
      setSimulatingWebhook(false);

      // Generate real QR payload
      const qrPayload = JSON.stringify({
        gateway: gateway.toUpperCase(),
        reference: uniqueRef,
        amount_cop: amount,
        account: '031-984218-77 (Bancolombia Mayorista)',
        expires_in: 900,
      });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700/80 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">QR Dinámico de Recarga</h3>
              <p className="text-[11px] text-slate-400">Pasarela {gateway.toUpperCase()} • Bancolombia / PSE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isApproved ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">¡Saldo Acreditado en Tiempo Real!</h4>
            <p className="text-sm font-semibold text-emerald-400 font-mono">
              +${amount.toLocaleString('es-CO')} COP abonados a tu bolsa
            </p>
            <p className="text-xs text-slate-400">
              Notificación push recibida y validada por el servidor.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-center">
            
            {/* Monto y Temporizador */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total a Pagar</span>
                <span className="text-lg font-mono font-extrabold text-emerald-400">
                  ${amount.toLocaleString('es-CO')} <span className="text-xs font-medium text-slate-400">COP</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Expira en</span>
                <span className="text-sm font-mono font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center shadow-inner mx-auto max-w-[260px]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Dinámico"
                  className="w-48 h-48 rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                  Generando QR...
                </div>
              )}
              <span className="text-[10px] font-bold text-slate-700 mt-2 font-mono uppercase">
                Escanea desde tu App Bancaria / Nequi
              </span>
            </div>

            {/* Referencia Única */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block uppercase">Referencia Única:</span>
                <strong className="text-indigo-300 text-sm">{reference}</strong>
              </div>
              <button
                type="button"
                onClick={handleCopyReference}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-[11px]"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedRef ? '¡Copiada!' : 'Copiar'}
              </button>
            </div>

            {/* Botón Simular Escaneo & Webhook (Para testing inmediato del flujo) */}
            <button
              type="button"
              onClick={handleSimulateScanAndPay}
              disabled={simulatingWebhook}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              {simulatingWebhook ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Recibiendo Webhook de Pasarela...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Simular Escaneo y Acreditación Inmediata
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
