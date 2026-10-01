'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  CreditCard, 
  Building, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  History, 
  Sparkles,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Topup, PaymentGateway } from '@/lib/types';
import { DynamicQrModal } from '../DynamicQrModal';

interface TopupTabProps {
  currentBalance: number;
  topups: Topup[];
  onProcessTopup: (amount: number, gateway: PaymentGateway, reference?: string) => void;
}

export const TopupTab: React.FC<TopupTabProps> = ({
  currentBalance,
  topups,
  onProcessTopup,
}) => {
  const [amount, setAmount] = useState<number>(100000);
  const [gateway, setGateway] = useState<PaymentGateway>('nequi');
  const [showQrModal, setShowQrModal] = useState(false);

  const handleOpenQr = () => {
    if (amount <= 0 || isNaN(amount)) return;
    setShowQrModal(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Banner: Saldo en Bolsa */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Bolsa de Saldo Disponible
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-mono font-extrabold text-white">
                ${currentBalance.toLocaleString('es-CO')}
              </span>
              <span className="text-sm font-semibold text-emerald-400">COP</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tu saldo se descuenta automáticamente con cada compra en el catálogo.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5 w-full md:w-auto">
          <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pasarelas 100% Automatizadas
          </div>
          <p className="text-slate-400">
            Recargas acreditadas al instante vía Webhook PSE / Wompi / Bancolombia.
          </p>
        </div>
      </div>

      {/* Grid: Pasarela Interactiva + Historial de Recargas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Pasarela de Pagos (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              Realizar Nueva Recarga
            </h3>
            <p className="text-xs text-slate-400">
              Selecciona el monto y método de pago para recargar tu bolsa.
            </p>
          </div>

          {/* Montos Rápidos */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              1. Selecciona el Monto a Recargar (COP):
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[50000, 100000, 200000, 300000, 500000, 1000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    amount === preset
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ${(preset / 1000).toLocaleString('es-CO')}k COP
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold text-base">$</span>
              <input
                type="number"
                min="1"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-16 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-lg focus:outline-none focus:border-indigo-500 transition"
              />
              <span className="absolute right-3.5 top-3 text-xs text-slate-400 font-semibold">COP</span>
            </div>
          </div>

          {/* Métodos de Pago */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              2. Método de Pago Directo:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* NEQUI */}
              <button
                type="button"
                onClick={() => setGateway('nequi')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition cursor-pointer ${
                  gateway === 'nequi'
                    ? 'bg-fuchsia-950/40 border-fuchsia-500 text-white shadow-md shadow-fuchsia-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#E5007D]/20 text-[#E5007D] flex items-center justify-center font-black text-sm border border-[#E5007D]/30 flex-shrink-0">
                  N
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-200">Nequi Directo</span>
                  <span className="text-[10px] text-fuchsia-400">Pasarela Directa</span>
                </div>
              </button>

              {/* DAVIPLATA */}
              <button
                type="button"
                onClick={() => setGateway('daviplata')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition cursor-pointer ${
                  gateway === 'daviplata'
                    ? 'bg-rose-950/40 border-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#ED1C24]/20 text-[#ED1C24] flex items-center justify-center font-black text-sm border border-[#ED1C24]/30 flex-shrink-0">
                  D
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-200">Daviplata</span>
                  <span className="text-[10px] text-rose-400">Transferencia Directa</span>
                </div>
              </button>

              {/* PSE */}
              <button
                type="button"
                onClick={() => setGateway('pse')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition cursor-pointer ${
                  gateway === 'pse'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building className="w-10 h-10 p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0" />
                <div>
                  <span className="font-bold text-xs block text-slate-200">PSE Bancos</span>
                  <span className="text-[10px] text-emerald-400">Débito en Línea Colombia</span>
                </div>
              </button>

              {/* LLAVE / TRANSFIYA */}
              <button
                type="button"
                onClick={() => setGateway('llave')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition cursor-pointer ${
                  gateway === 'llave'
                    ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 flex-shrink-0 text-base">
                  🔑
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-200">Llave / Transfiya</span>
                  <span className="text-[10px] text-indigo-400">Interbancario Bre-B</span>
                </div>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenQr}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            Continuar a Pago & Redirigir a App (${amount.toLocaleString('es-CO')} COP)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Columna Derecha: Historial de Recargas (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              Historial de Recargas
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {topups.length} Transacciones
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
            {topups.map((topup) => (
              <div
                key={topup.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      +${topup.amount.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {topup.transaction_id} • {topup.payment_gateway.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(topup.created_at).toLocaleString('es-CO')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    Aprobada
                  </span>
                </div>
              </div>
            ))}

            {topups.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">
                No hay recargas registradas aún.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Dynamic QR Modal */}
      <DynamicQrModal
        isOpen={showQrModal}
        amount={amount}
        gateway={gateway}
        onClose={() => setShowQrModal(false)}
        onPaymentApproved={(paidAmount, paidGateway, ref) => {
          onProcessTopup(paidAmount, paidGateway, ref);
          setShowQrModal(false);
        }}
      />
    </div>
  );
};
