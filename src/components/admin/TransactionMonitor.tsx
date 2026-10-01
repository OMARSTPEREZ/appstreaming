'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Search, 
  Calendar, 
  ArrowUpRight, 
  ShieldCheck, 
  UserCheck, 
  FileSpreadsheet,
  Tv
} from 'lucide-react';
import { Sale } from '@/lib/types';

interface TransactionMonitorProps {
  sales: Sale[];
}

export const TransactionMonitor: React.FC<TransactionMonitorProps> = ({ sales }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSales = sales.filter((sale) => {
    return (
      sale.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.account_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.seller_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPassiveProfit = sales.reduce((acc, sale) => acc + (sale.profit || (sale.sale_price - sale.cost_price)), 0);
  const totalVolume = sales.reduce((acc, sale) => acc + sale.sale_price, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">
            Ganancia Pasiva Mayorista Acumulada
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-extrabold text-emerald-400">
              +${totalPassiveProfit.toLocaleString('es-CO')}
            </span>
            <span className="text-xs font-semibold text-slate-400">COP</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Margen neto recibido sin tocar inventario manual</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">
            Volumen Total Transaccionado
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-extrabold text-white">
              ${totalVolume.toLocaleString('es-CO')}
            </span>
            <span className="text-xs font-semibold text-slate-400">COP</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ventas totales procesadas en bolsa</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">
            Total de Cuentas Despachadas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-extrabold text-indigo-400">
              {sales.length}
            </span>
            <span className="text-xs font-semibold text-slate-400">licencias / perfiles</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Entregas 100% automáticas</p>
        </div>
      </div>

      {/* Monitor Table & Search */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Monitor Financiero de Transacciones Mayoristas
            </h3>
            <p className="text-xs text-slate-400">
              Auditoría en tiempo real: Usuario, Producto, Costo Proveedor, Venta Revendedor y Ganancia Pasiva.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por revendedor o producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Fecha / Hora</th>
                <th className="py-3 px-3">Revendedor (Vendedor)</th>
                <th className="py-3 px-3">Producto / Servicio</th>
                <th className="py-3 px-3 text-right">Costo Proveedor ($A)</th>
                <th className="py-3 px-3 text-right">Venta Revendedor ($B)</th>
                <th className="py-3 px-3 text-right text-emerald-400">Ganancia Pasiva ($C)</th>
                <th className="py-3 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredSales.map((sale) => {
                const profit = sale.profit || (sale.sale_price - sale.cost_price);
                return (
                  <tr key={sale.id} className="hover:bg-slate-900/60 transition">
                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(sale.purchased_at).toLocaleDateString('es-CO')}{' '}
                      <span className="text-[10px] text-slate-500">
                        {new Date(sale.purchased_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-sans font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Revendedor VIP ({sale.seller_id})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-sans font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: sale.brand_color }}
                        />
                        <span className="truncate max-w-[180px]">{sale.product_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400">
                      ${sale.cost_price.toLocaleString('es-CO')}
                    </td>
                    <td className="py-3.5 px-3 text-right text-white font-bold">
                      ${sale.sale_price.toLocaleString('es-CO')}
                    </td>
                    <td className="py-3.5 px-3 text-right text-emerald-400 font-bold bg-emerald-950/20 rounded-lg">
                      +${profit.toLocaleString('es-CO')} COP
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                        Completada
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredSales.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No hay transacciones que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
