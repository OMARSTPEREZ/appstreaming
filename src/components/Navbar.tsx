'use client';

import React from 'react';
import { 
  Tv, 
  Wallet, 
  PlusCircle, 
  ShoppingCart, 
  LogOut, 
  User
} from 'lucide-react';
import { Profile } from '@/lib/types';

interface NavbarProps {
  currentSeller: Profile;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTopup: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSeller,
  cartCount,
  onOpenCart,
  onOpenTopup,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                STREAM<span className="text-indigo-400">RESELL</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 tracking-wide uppercase">
                B2B Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Mayorista de Streaming & Licencias</p>
          </div>
        </div>

        {/* Center/Right Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Saldo en Bolsa */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="text-left pr-1">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block leading-tight">
                Saldo en Bolsa
              </span>
              <span className="text-sm sm:text-base font-mono font-bold text-emerald-400 leading-tight">
                ${currentSeller.balance.toLocaleString('es-CO')} <span className="text-[10px] font-normal text-slate-400">COP</span>
              </span>
            </div>
            <button
              onClick={onOpenTopup}
              title="Recargar saldo en bolsa"
              className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white transition border border-emerald-500/30 flex items-center gap-1 text-xs font-medium ml-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Recargar</span>
            </button>
          </div>

          {/* Carrito Flotante */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-indigo-500 transition group shadow-md"
            title="Ver Carrito de Compras"
          >
            <ShoppingCart className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-rose-500/40">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="hidden lg:block text-right">
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[150px]">
                {currentSeller.full_name}
              </p>
              <span className="text-[10px] text-indigo-400 capitalize font-medium flex items-center justify-end gap-1">
                <User className="w-3 h-3" /> Distribuidor VIP
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition border border-transparent hover:border-rose-500/20"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
