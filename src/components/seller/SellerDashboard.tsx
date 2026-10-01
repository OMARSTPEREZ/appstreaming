'use client';

import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Key, 
  Wallet, 
  ShoppingCart, 
  Sparkles, 
  Flame, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { Product, Sale, Topup, CartItem, PaymentGateway } from '@/lib/types';
import { CatalogTab } from './CatalogTab';
import { SalesTab } from './SalesTab';
import { TopupTab } from './TopupTab';

interface SellerDashboardProps {
  products: Product[];
  sales: Sale[];
  topups: Topup[];
  inventoryCounts: Record<string, number>;
  currentBalance: number;
  activeTab?: 'catalog' | 'sales' | 'topups';
  onTabChange?: (tab: 'catalog' | 'sales' | 'topups') => void;
  onAddToCart: (product: Product) => void;
  onOpenHouseholdCode: (sale: Sale) => void;
  onOpenReportIssue: (sale: Sale) => void;
  onProcessTopup: (amount: number, gateway: PaymentGateway) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  products,
  sales,
  topups,
  inventoryCounts,
  currentBalance,
  activeTab: propActiveTab,
  onTabChange,
  onAddToCart,
  onOpenHouseholdCode,
  onOpenReportIssue,
  onProcessTopup,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'sales' | 'topups'>(propActiveTab || 'catalog');

  useEffect(() => {
    if (propActiveTab && propActiveTab !== activeTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  const handleTabClick = (tab: 'catalog' | 'sales' | 'topups') => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const activeSalesCount = sales.filter((s) => s.status === 'active').length;

  return (
    <div className="space-y-6">
      
      {/* Navigation Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto gap-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
          <button
            onClick={() => handleTabClick('catalog')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Tv className="w-4 h-4" />
            Catálogo & Compras
          </button>

          <button
            onClick={() => handleTabClick('sales')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'sales'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Key className="w-4 h-4" />
            Mis Ventas & Cuentas
            {activeSalesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                {activeSalesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('topups')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'topups'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Wallet className="w-4 h-4" />
            Recargar Saldo
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'catalog' && (
        <CatalogTab
          products={products}
          inventoryCounts={inventoryCounts}
          onAddToCart={onAddToCart}
        />
      )}

      {activeTab === 'sales' && (
        <SalesTab
          sales={sales}
          onOpenHouseholdCode={onOpenHouseholdCode}
          onOpenReportIssue={onOpenReportIssue}
        />
      )}

      {activeTab === 'topups' && (
        <TopupTab
          currentBalance={currentBalance}
          topups={topups}
          onProcessTopup={onProcessTopup}
        />
      )}

    </div>
  );
};
