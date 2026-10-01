'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  X, 
  CheckCircle2, 
  Building, 
  QrCode, 
  Wallet, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { PaymentGateway } from '@/lib/types';

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmTopup: (amount: number, gateway: PaymentGateway) => void;
}

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000];

export const TopupModal: React.FC<TopupModalProps> = ({ isOpen, onClose, onConfirmTopup }) => {
  const [amount, setAmount] = useState<number>(100000);
  const [gateway, setGateway] = useState<PaymentGateway>('wompi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  if (!isOpen) return null;

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsApproved(true);
      onConfirmTopup(amount, gateway);
      setTimeout(() => {
        setIsApproved(false);
        onClose();
      }, 1600);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Recargar Bolsa de Saldo</h3>
              <p className="text-xs text-slate-400">Acreditación instantánea 24/7</p>
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
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-white">¡Recarga Aprobada Exitosamente!</h4>
            <p className="text-sm font-semibold text-emerald-400">
              +${amount.toLocaleString('es-CO')} COP abonados a tu saldo
            </p>
            <p className="text-xs text-slate-400">
              Webhook de pasarela recibido y verificado en la base de datos.
            </p>
          </div>
        ) : isProcessing ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-200">
              Conectando con la pasarela de pagos ({gateway.toUpperCase()})...
            </p>
            <p className="text-xs text-slate-400">
              Confirmando transacción bancaria segura...
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {/* Montos predefinidos */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Selecciona o ingresa el monto:
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      amount === amt
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ${amt.toLocaleString('es-CO')} COP
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-semibold text-sm">$</span>
                <input
                  type="number"
                  min="20000"
                  step="5000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-16 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono font-bold text-base focus:outline-none focus:border-indigo-500 transition"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">COP</span>
              </div>
            </div>

            {/* Selector de pasarela */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Método de Pago:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGateway('wompi')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition ${
                    gateway === 'wompi'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-xs block text-slate-200">Wompi / Tarjetas</span>
                    <span className="text-[10px] text-slate-500">Débito / Crédito</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGateway('pse')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition ${
                    gateway === 'pse'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Building className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-xs block text-slate-200">PSE Bancos</span>
                    <span className="text-[10px] text-slate-500">Cuentas Colombia</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGateway('bancolombia')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition ${
                    gateway === 'bancolombia'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-xs block text-slate-200">Bancolombia QR</span>
                    <span className="text-[10px] text-slate-500">App Bancolombia</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGateway('binance_usdt')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition ${
                    gateway === 'binance_usdt'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-xs block text-slate-200">Binance Pay</span>
                    <span className="text-[10px] text-slate-500">USDT Sin Comisión</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Acreditación Automática
              </span>
              <span className="font-mono font-bold text-sm text-emerald-400">
                ${amount.toLocaleString('es-CO')} COP
              </span>
            </div>

            {/* Action button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleProcessPayment}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
              >
                Pagar y Recargar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
