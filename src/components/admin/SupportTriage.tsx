'use client';

import React, { useState } from 'react';
import { 
  LifeBuoy, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  Mail, 
  Sparkles, 
  Check, 
  X,
  Clock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { SupportTicket, Sale, InventoryItem } from '@/lib/types';

interface SupportTriageProps {
  tickets: SupportTicket[];
  sales: Sale[];
  inventory: InventoryItem[];
  onAutoReassign: (ticketId: string) => { success: boolean; message: string };
  onCloseTicket: (ticketId: string, resolution: string) => void;
}

export const SupportTriage: React.FC<SupportTriageProps> = ({
  tickets,
  sales,
  inventory,
  onAutoReassign,
  onCloseTicket,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('open');
  const [reassigningId, setReassigningId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ id: string; msg: string; type: 'success' | 'error' } | null>(null);

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const handleReassignClick = (ticketId: string) => {
    setReassigningId(ticketId);
    setTimeout(() => {
      const result = onAutoReassign(ticketId);
      setReassigningId(null);
      setActionNotice({
        id: ticketId,
        msg: result.message,
        type: result.success ? 'success' : 'error',
      });
      setTimeout(() => setActionNotice(null), 4000);
    }, 1000);
  };

  const getIssueLabel = (issue: string) => {
    switch (issue) {
      case 'caida_clave':
        return 'Clave Incorrecta / Cambiada';
      case 'cambio_pin':
        return 'PIN de Perfil Bloqueado';
      case 'hogar_bloqueado':
        return 'Hogar Netflix No Actualiza';
      case 'cuenta_cerrada':
        return 'Membresía Pausada';
      default:
        return 'Falla Técnica';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-indigo-400" />
            Centro de Garantías & Reasignación Automática
          </h3>
          <p className="text-xs text-slate-400">
            Resuelve caídas de contraseñas y bloqueos de perfil con 1 solo clic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('open')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterStatus === 'open'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Abiertos ({tickets.filter((t) => t.status === 'open').length})
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterStatus === 'resolved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Resueltos ({tickets.filter((t) => t.status === 'resolved').length})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => {
          const isReassigning = reassigningId === ticket.id;
          const notice = actionNotice?.id === ticket.id ? actionNotice : null;
          const associatedSale = sales.find((s) => s.id === ticket.sale_id);

          return (
            <div
              key={ticket.id}
              className={`glass-panel rounded-2xl p-5 border transition-all duration-200 space-y-4 shadow-lg ${
                ticket.status === 'open'
                  ? 'border-amber-500/40 bg-slate-950/90'
                  : 'border-slate-800 bg-slate-900/60 opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {ticket.product_name || associatedSale?.product_name || 'Servicio Streaming'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30">
                        {getIssueLabel(ticket.issue_type)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Reportado: {new Date(ticket.created_at).toLocaleString('es-CO')} por {ticket.seller_name || 'Revendedor'}
                    </span>
                  </div>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      ticket.status === 'open'
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 animate-pulse'
                        : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {ticket.status === 'open' ? 'Pendiente de Solución' : 'Garantía Resuelta'}
                  </span>
                </div>
              </div>

              {/* Description & Account info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">
                    Motivo Reportado por Revendedor:
                  </span>
                  <p className="text-slate-200 italic leading-relaxed">
                    "{ticket.description}"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 font-mono">
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">
                    Cuenta Afectada:
                  </span>
                  <div className="text-slate-300 truncate">
                    Correo: <strong className="text-slate-100">{ticket.account_email || associatedSale?.account_email}</strong>
                  </div>
                  <div className="text-slate-300">
                    PIN: <strong className="text-amber-400">{associatedSale?.profile_pin || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              {/* Action notice alert */}
              {notice && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
                    notice.type === 'success'
                      ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{notice.msg}</span>
                </div>
              )}

              {/* Footer Actions */}
              {ticket.status === 'open' && (
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => onCloseTicket(ticket.id, 'Resuelto manualmente sin cambio')}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Marcar Resuelto Manual
                  </button>

                  <button
                    onClick={() => handleReassignClick(ticket.id)}
                    disabled={isReassigning}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition shadow-lg shadow-emerald-600/25"
                  >
                    {isReassigning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Reasignando desde Stock...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Reasignar Cuenta Automática (1-Clic)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500/50" />
            <p className="font-bold text-sm text-slate-300">¡Bandeja de Soporte Limpia!</p>
            <p className="text-xs">No hay tickets pendientes de reasignación en este momento.</p>
          </div>
        )}
      </div>

    </div>
  );
};
