'use client';

import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { Sale, IssueType } from '@/lib/types';

interface ReportIssueModalProps {
  sale: Sale | null;
  onClose: () => void;
  onSubmitTicket: (saleId: string, issueType: IssueType, description: string) => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  sale,
  onClose,
  onSubmitTicket,
}) => {
  const [issueType, setIssueType] = useState<IssueType>('caida_clave');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!sale) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmitTicket(sale.id, issueType, description);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Reportar Falla / Garantía</h3>
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

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-semibold text-white">¡Ticket de Soporte Enviado!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              El mayorista ha recibido tu reporte. Si el sistema tiene stock disponible de reemplazo, tu cuenta podrá ser reasignada automáticamente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Cuenta Info */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex justify-between items-center text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Correo de la Cuenta</span>
                <span className="font-mono text-slate-200">{sale.account_email}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase">PIN / Perfil</span>
                <span className="font-mono text-amber-400 font-semibold">{sale.profile_pin || 'N/A'}</span>
              </div>
            </div>

            {/* Motivo de la falla */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo de Falla o Inconveniente:
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="caida_clave">Contraseña Incorrecta / Clave Cambiada</option>
                <option value="cambio_pin">PIN de Perfil Bloqueado / Cambiado</option>
                <option value="hogar_bloqueado">Hogar Netflix Bloqueado / No actualiza</option>
                <option value="cuenta_cerrada">Membresía Pausada o Vencida Antes de Tiempo</option>
                <option value="otro">Otro problema técnico</option>
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Detalle del reporte para soporte:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explica qué error le aparece al cliente (ej. al ingresar indica clave incorrecta)..."
                rows={3}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition shadow-lg shadow-amber-600/20"
              >
                <Send className="w-4 h-4" />
                Enviar Reporte a Soporte
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
