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
  const [gateway, setGateway] = useState<PaymentGateway>('wompi');
  const [showQrModal, setShowQrModal] = useState(false);

  const handleOpenQr = () => {
    if (amount < 10000) return;
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
                min="10000"
                step="5000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
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
              <button
                type="button"
                onClick={() => setGateway('wompi')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition ${
                  gateway === 'wompi'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-200">Wompi Gateway</span>
                  <span className="text-[10px] text-slate-500">Tarjetas y Nequi</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGateway('pse')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition ${
                  gateway === 'pse'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-200">PSE Débito</span>
                  <span className="text-[10px] text-slate-500">Todos los bancos</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGateway('bancolombia')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition ${
                  gateway === 'bancolombia'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-200">Bancolombia QR</span>
                  <span className="text-[10px] text-slate-500">Sin comisiones</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGateway('binance_usdt')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition ${
                  gateway === 'binance_usdt'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-200">Binance Pay</span>
                  <span className="text-[10px] text-slate-500">USDT Internacional</span>
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={handleOpenQr}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            Generar QR Dinámico de ${amount.toLocaleString('es-CO')} COP
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
