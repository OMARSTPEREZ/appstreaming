'use client';

import React, { useState } from 'react';
import { Tv, Copy, Check, X, ShieldAlert, Sparkles, Smartphone } from 'lucide-react';
import { Sale } from '@/lib/types';

interface HouseholdCodeModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const HouseholdCodeModal: React.FC<HouseholdCodeModalProps> = ({ sale, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentCode, setCurrentCode] = useState<string>(sale?.household_code || 'HTV-84920');

  if (!sale) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateFreshCode = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const fresh = 'HTV-' + Math.floor(10000 + Math.random() * 90000);
      setCurrentCode(fresh);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Código de Hogar / Actualización de TV</h3>
              <p className="text-xs text-slate-400">{sale.product_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Código de Hogar Activo para Cliente
            </span>
            <div className="flex items-center justify-center gap-3 my-2">
              <span className="text-3xl font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/40 px-5 py-2 rounded-lg border border-emerald-500/30">
                {isGenerating ? 'Generando...' : currentCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 font-medium text-sm shadow-lg shadow-indigo-600/20"
                title="Copiar código"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Válido por 15 minutos desde su emisión para vincular la Smart TV.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-1.5">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> Instrucciones rápidas para enviar al cliente:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
              <li>En el Smart TV selecciona: <strong>"Estoy de viaje"</strong> o <strong>"Actualizar Hogar"</strong>.</li>
              <li>Selecciona la opción de recibir código por correo / enlace temporal.</li>
              <li>Ingresa el código <strong>{currentCode}</strong> en la pantalla del televisor.</li>
            </ol>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleGenerateFreshCode}
              disabled={isGenerating}
              className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition py-2 px-3 rounded-lg hover:bg-amber-950/30 border border-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Generando nuevo código...' : 'Solicitar Nuevo Código de Hogar'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
