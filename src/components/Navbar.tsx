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
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSeller,
  cartCount,
  onOpenCart,
  onOpenTopup,
  onLogout,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Dynamic Animated Brand Logo */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none transition-all duration-300 transform hover:scale-[1.02] active:scale-95 select-none"
          title="Ir al Inicio del Catálogo de Productos"
        >
          {/* Animated Icon Container */}
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-fuchsia-600 to-rose-500 p-[2px] shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/60 group-hover:rotate-1 transition-all duration-300">
              <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <Tv className="w-5 h-5 text-indigo-300 group-hover:text-white group-hover:scale-110 transition-all duration-300 relative z-10" />
              </div>
            </div>
            {/* Live Green Pulsing Indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all">
                STREAM<span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-pink-300 font-black">RESELL</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 tracking-wider uppercase group-hover:border-indigo-400 group-hover:bg-indigo-900/60 transition-all shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                B2B PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 group-hover:text-slate-300 font-medium transition-colors flex items-center gap-1.5">
              Mayorista de Streaming & Licencias
              <span className="text-[10px] font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                • Catálogo ⚡
              </span>
            </p>
          </div>
        </button>

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
              type="button"
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-slate-900/60 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition border border-slate-800 hover:border-rose-500/30 cursor-pointer flex items-center justify-center"
              title="Cerrar Sesión"
              aria-label="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
