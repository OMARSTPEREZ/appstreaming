'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  X, 
  Building, 
  QrCode, 
  Wallet, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { PaymentGateway } from '@/lib/types';
import { DynamicQrModal } from './DynamicQrModal';

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmTopup: (amount: number, gateway: PaymentGateway, reference?: string) => void;
}

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000];

export const TopupModal: React.FC<TopupModalProps> = ({ isOpen, onClose, onConfirmTopup }) => {
  const [amount, setAmount] = useState<number>(100000);
  const [gateway, setGateway] = useState<PaymentGateway>('wompi');
  const [showQrModal, setShowQrModal] = useState(false);

  if (!isOpen) return null;

  const handleOpenQr = () => {
    setShowQrModal(true);
  };

  return (
    <>
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
                Método de Pago Directo:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* NEQUI */}
                <button
                  type="button"
                  onClick={() => setGateway('nequi')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                    gateway === 'nequi'
                      ? 'bg-fuchsia-950/40 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E5007D]/20 text-[#E5007D] flex items-center justify-center border border-[#E5007D]/30 flex-shrink-0 font-black text-xs">
                    N
                  </div>
                  <div>
                    <span className="font-semibold text-xs block text-slate-200">Nequi Directo</span>
                    <span className="text-[10px] text-fuchsia-400">QR & Celular</span>
                  </div>
                </button>

                {/* DAVIPLATA */}
                <button
                  type="button"
                  onClick={() => setGateway('daviplata')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                    gateway === 'daviplata'
                      ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#ED1C24]/20 text-[#ED1C24] flex items-center justify-center border border-[#ED1C24]/30 flex-shrink-0 font-black text-xs">
                    D
                  </div>
                  <div>
                    <span className="font-semibold text-xs block text-slate-200">Daviplata</span>
                    <span className="text-[10px] text-rose-400">Transferencia Directa</span>
                  </div>
                </button>

                {/* PSE */}
                <button
                  type="button"
                  onClick={() => setGateway('pse')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                    gateway === 'pse'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building className="w-8 h-8 p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-xs block text-slate-200">PSE Bancos</span>
                    <span className="text-[10px] text-emerald-400">Todos los Bancos</span>
                  </div>
                </button>

                {/* LLAVE / TRANSFIYA */}
                <button
                  type="button"
                  onClick={() => setGateway('llave')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                    gateway === 'llave'
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 flex-shrink-0 font-bold text-xs">
                    🔑
                  </div>
                  <div>
                    <span className="font-semibold text-xs block text-slate-200">Llave / Transfiya</span>
                    <span className="text-[10px] text-indigo-400">Inmediato Bre-B</span>
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
                onClick={handleOpenQr}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
              >
                Generar QR de Pago
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic QR Modal */}
      <DynamicQrModal
        isOpen={showQrModal}
        amount={amount}
        gateway={gateway}
        onClose={() => {
          setShowQrModal(false);
          onClose();
        }}
        onPaymentApproved={(paidAmount, paidGateway, ref) => {
          onConfirmTopup(paidAmount, paidGateway, ref);
          setShowQrModal(false);
          onClose();
        }}
      />
    </>
  );
};
