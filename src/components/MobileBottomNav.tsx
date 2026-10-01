'use client';

import React from 'react';
import { 
  Tv, 
  Key, 
  Wallet, 
  Shield, 
  ShoppingCart, 
  BarChart3, 
  LifeBuoy 
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface MobileBottomNavProps {
  currentRole: UserRole;
  activeTab: string;
  cartCount: number;
  onSelectTab: (tab: any) => void;
  onOpenCart: () => void;
  onOpenTopup: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  activeTab,
  cartCount,
  onSelectTab,
  onOpenCart,
  onOpenTopup,
}) => {
  if (currentRole === 'superadmin') {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => onSelectTab('monitor')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'monitor' ? 'text-indigo-400' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Monitor</span>
        </button>

        <button
          onClick={() => onSelectTab('support')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'support' ? 'text-indigo-400' : 'text-slate-500'
          }`}
        >
          <LifeBuoy className="w-5 h-5" />
          <span>Soporte</span>
        </button>

        <button
          onClick={() => onSelectTab('inventory_stock')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'inventory_stock' ? 'text-indigo-400' : 'text-slate-500'
          }`}
        >
          <Tv className="w-5 h-5" />
          <span>Inventario</span>
        </button>
      </div>
    );
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => onSelectTab('catalog')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
          activeTab === 'catalog' ? 'text-indigo-400' : 'text-slate-500'
        }`}
      >
        <Tv className="w-5 h-5" />
        <span>Catálogo</span>
      </button>

      <button
        onClick={() => onSelectTab('sales')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
          activeTab === 'sales' ? 'text-indigo-400' : 'text-slate-500'
        }`}
      >
        <Key className="w-5 h-5" />
        <span>Mis Ventas</span>
      </button>

      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400"
      >
        <ShoppingCart className="w-5 h-5 text-indigo-400" />
        {cartCount > 0 && (
          <span className="absolute -top-1 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <span>Carrito</span>
      </button>

      <button
        onClick={onOpenTopup}
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-emerald-400"
      >
        <Wallet className="w-5 h-5" />
        <span>Recargar</span>
      </button>
    </div>
  );
};
