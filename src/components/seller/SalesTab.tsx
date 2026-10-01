'use client';

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Tv, 
  AlertTriangle, 
  Clock, 
  Key, 
  Mail, 
  ShieldCheck, 
  Search, 
  Filter, 
  Eye, 
  EyeOff,
  Sparkles,
  CalendarDays,
  ExternalLink
} from 'lucide-react';
import { Sale } from '@/lib/types';

interface SalesTabProps {
  sales: Sale[];
  onOpenHouseholdCode: (sale: Sale) => void;
  onOpenReportIssue: (sale: Sale) => void;
}

export const SalesTab: React.FC<SalesTabProps> = ({
  sales,
  onOpenHouseholdCode,
  onOpenReportIssue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'reported' | 'expired'>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const togglePasswordVisibility = (saleId: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [saleId]: !prev[saleId] }));
  };

  const calculateDaysRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredSales = sales.filter((sale) => {
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    const matchesSearch =
      sale.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.account_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sale.profile_pin && sale.profile_pin.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            Mis Cuentas & Entregas a Clientes
          </h2>
          <p className="text-xs text-slate-400">
            Gestiona contraseñas, PIN de perfiles, códigos de hogar y garantías en tiempo real.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por correo, PIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="reported">En Soporte / Reportadas</option>
            <option value="expired">Vencidas</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredSales.map((sale) => {
          const daysLeft = calculateDaysRemaining(sale.expires_at);
          const isExpiringSoon = daysLeft <= 5;
          const isExpired = daysLeft <= 0;
          const showPassword = visiblePasswords[sale.id];

          return (
            <div
              key={sale.id}
              className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700/90 transition shadow-xl"
            >
              <div>
                {/* Header Row: Product name & Status */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: sale.brand_color }}
                      />
                      <h3 className="font-bold text-base text-white">
                        {sale.product_name}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                      Comprada: {new Date(sale.purchased_at).toLocaleDateString('es-CO')}
                    </span>
                  </div>

                  {/* Dynamic Countdown Pill */}
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono inline-flex items-center gap-1.5 border shadow-sm ${
                        isExpired
                          ? 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                          : isExpiringSoon
                          ? 'bg-amber-950/70 border-amber-500/50 text-amber-300 animate-pulse'
                          : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {isExpired
                        ? 'Servicio Vencido'
                        : `${daysLeft} días restantes`}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Vence: {new Date(sale.expires_at).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>

                {/* Credentials Section with 1-Click Copy */}
                <div className="mt-4 space-y-2.5 bg-slate-900/90 p-4 rounded-xl border border-slate-800/90">
                  
                  {/* Correo / Usuario */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 w-24">
                      <Mail className="w-3.5 h-3.5 text-slate-500" /> Correo:
                    </span>
                    <span className="font-mono text-slate-200 truncate max-w-[200px] sm:max-w-[260px] select-all font-medium">
                      {sale.account_email}
                    </span>
                    <button
                      onClick={() => handleCopy(sale.account_email, `${sale.id}-email`)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Copiar correo"
                    >
                      {copiedField === `${sale.id}-email` ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Contraseña */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 w-24">
                      <Key className="w-3.5 h-3.5 text-slate-500" /> Clave:
                    </span>
                    <span className="font-mono text-slate-200 select-all font-semibold">
                      {showPassword ? sale.account_password : '••••••••••••'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePasswordVisibility(sale.id)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCopy(sale.account_password, `${sale.id}-pass`)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Copiar contraseña"
                      >
                        {copiedField === `${sale.id}-pass` ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Perfil / PIN */}
                  {sale.profile_pin && sale.profile_pin !== 'N/A' && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5 w-24">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Perfil / PIN:
                      </span>
                      <span className="font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 select-all">
                        PIN: {sale.profile_pin}
                      </span>
                      <button
                        onClick={() => handleCopy(sale.profile_pin || '', `${sale.id}-pin`)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Copiar PIN"
                      >
                        {copiedField === `${sale.id}-pin` ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* Action Buttons: Código de Hogar + Reportar Falla */}
              <div className="flex items-center justify-between gap-3 pt-2">
                
                {/* Botón Ver Código de Hogar */}
                <button
                  onClick={() => onOpenHouseholdCode(sale)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm hover:border-indigo-500/50"
                >
                  <Tv className="w-4 h-4 text-red-400" />
                  Ver Código de Hogar
                </button>

                {/* Botón Reportar Falla */}
                <button
                  onClick={() => onOpenReportIssue(sale)}
                  className="py-2 px-3.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Reportar Falla
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {filteredSales.length === 0 && (
        <div className="text-center py-16 text-slate-500 space-y-2">
          <Key className="w-12 h-12 mx-auto text-slate-700" />
          <p className="font-semibold text-sm">No se encontraron cuentas compradas</p>
          <p className="text-xs">Realiza compras en la pestaña Catálogo para ver aquí todas tus cuentas y credenciales.</p>
        </div>
      )}

    </div>
  );
};
