'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Tv, 
  PackagePlus, 
  LifeBuoy, 
  ShieldCheck, 
  Users, 
  Layers, 
  Boxes,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Flame
} from 'lucide-react';
import { 
  Product, 
  Sale, 
  InventoryItem, 
  SupportTicket, 
  Profile, 
  Topup 
} from '@/lib/types';
import { TransactionMonitor } from './TransactionMonitor';
import { SupportTriage } from './SupportTriage';
import { BulkInventoryModal } from './BulkInventoryModal';

interface AdminDashboardProps {
  products: Product[];
  sales: Sale[];
  inventory: InventoryItem[];
  tickets: SupportTicket[];
  profiles: Profile[];
  topups: Topup[];
  onAddBatchInventory: (items: Omit<InventoryItem, 'id' | 'status' | 'created_at' | 'updated_at'>[]) => void;
  onAutoReassign: (ticketId: string) => { success: boolean; message: string };
  onCloseTicket: (ticketId: string, resolution: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  sales,
  inventory,
  tickets,
  profiles,
  topups,
  onAddBatchInventory,
  onAutoReassign,
  onCloseTicket,
}) => {
  const [adminTab, setAdminTab] = useState<'monitor' | 'support' | 'inventory_stock'>('monitor');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Cálculos de Métricas de SuperAdmin
  const totalPassiveProfit = sales.reduce(
    (acc, s) => acc + (s.profit || (s.sale_price - s.cost_price)),
    0
  );
  
  const totalResellerBalance = profiles
    .filter((p) => p.role === 'seller')
    .reduce((acc, p) => acc + p.balance, 0);

  const activeAccountsCount = sales.filter((s) => s.status === 'active').length;
  const availableStockCount = inventory.filter((i) => i.status === 'available').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;

  return (
    <div className="space-y-8">
      
      {/* SuperAdmin Master KPIs Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Ganancia Pasiva Total */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Ganancia Pasiva Total
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
              +${totalPassiveProfit.toLocaleString('es-CO')}
            </span>
            <span className="text-xs font-semibold text-slate-400">COP</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> Margen neto recaudado por el sistema
          </p>
        </div>

        {/* KPI 2: Saldo Total de Revendedores */}
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
              Saldo en Bolsas Revendedores
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
              ${totalResellerBalance.toLocaleString('es-CO')}
            </span>
            <span className="text-xs font-semibold text-slate-400">COP</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Total prepagado por los revendedores
          </p>
        </div>

        {/* KPI 3: Cuentas Activas Despachadas */}
        <div className="glass-panel p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">
              Cuentas / Perfiles Activos
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Tv className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
              {activeAccountsCount}
            </span>
            <span className="text-xs font-semibold text-slate-400">en servicio</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Clientes finales disfrutando el streaming
          </p>
        </div>

        {/* KPI 4: Stock Disponible & Acción Carga Masiva */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                Stock Listo para Venta
              </span>
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Boxes className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
                {availableStockCount}
              </span>
              <span className="text-xs font-semibold text-slate-400">disponibles</span>
            </div>
          </div>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-indigo-600/30"
          >
            <PackagePlus className="w-4 h-4" />
            + Carga Masiva de Stock
          </button>
        </div>

      </div>

      {/* Admin Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto gap-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
          
          <button
            onClick={() => setAdminTab('monitor')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              adminTab === 'monitor'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Monitor de Transacciones
          </button>

          <button
            onClick={() => setAdminTab('support')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              adminTab === 'support'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            Gestión de Soporte & Reasignación
            {openTicketsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                {openTicketsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('inventory_stock')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              adminTab === 'inventory_stock'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Control de Stock por Producto
          </button>

        </div>

        <button
          onClick={() => setIsBulkModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/25"
        >
          <PackagePlus className="w-4 h-4" />
          Ingresar Lote de Cuentas
        </button>
      </div>

      {/* Admin Tab Panels */}
      {adminTab === 'monitor' && <TransactionMonitor sales={sales} />}

      {adminTab === 'support' && (
        <SupportTriage
          tickets={tickets}
          sales={sales}
          inventory={inventory}
          onAutoReassign={onAutoReassign}
          onCloseTicket={onCloseTicket}
        />
      )}

      {adminTab === 'inventory_stock' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-indigo-400" />
                Inventario Disponible por Servicio
              </h3>
              <p className="text-xs text-slate-400">
                Resumen de stock disponible vs vendido y costos de proveedor configurados.
              </p>
            </div>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
            >
              + Añadir Cuentas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => {
              const available = inventory.filter(
                (i) => i.product_id === prod.id && i.status === 'available'
              ).length;
              const sold = inventory.filter(
                (i) => i.product_id === prod.id && i.status === 'sold'
              ).length;

              return (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {prod.brand}
                      </span>
                      <h4 className="font-bold text-sm text-white">{prod.name}</h4>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        available > 0
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                          : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                      }`}
                    >
                      {available} disponibles
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Costo Proveedor:</span>
                      <span className="text-slate-300 font-bold">
                        ${prod.cost_price.toLocaleString('es-CO')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Venta Mayorista:</span>
                      <span className="text-indigo-400 font-bold">
                        ${prod.reseller_price.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Cuentas Vendidas: <strong className="text-white">{sold}</strong></span>
                    <span className="text-emerald-400 font-bold">
                      Margen: +${(prod.reseller_price - prod.cost_price).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bulk Inventory Modal */}
      <BulkInventoryModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        products={products}
        onAddBatchInventory={onAddBatchInventory}
      />

    </div>
  );
};
