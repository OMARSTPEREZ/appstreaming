'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Wallet,
  Sparkles
} from 'lucide-react';
import { CartItem } from '@/lib/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  userBalance: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onOpenTopup: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  userBalance,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onOpenTopup,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const totalCost = cart.reduce((acc, item) => acc + item.product.reseller_price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const hasSufficientBalance = userBalance >= totalCost;
  const balanceAfter = userBalance - totalCost;

  const handleCheckoutClick = () => {
    if (!hasSufficientBalance || cart.length === 0) return;

    setIsCheckingOut(true);
    setTimeout(() => {
      onCheckout();
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Carrito Mayorista</h3>
              <p className="text-xs text-slate-400">{totalItems} productos seleccionados</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {checkoutSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-white">¡Compra Mayorista Exitosa!</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Las credenciales, perfiles y pines han sido asignados y guardados en tu pestaña "Mis Ventas".
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16 text-slate-500">
              <ShoppingCart className="w-12 h-12 text-slate-700" />
              <p className="text-sm font-medium">El carrito de compras está vacío</p>
              <p className="text-xs max-w-xs">Agrega cuentas o perfiles del catálogo para realizar compras al por mayor con tu saldo.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-3 group hover:border-slate-700 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.product.brand_color }}
                    />
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {item.product.brand}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs font-mono font-bold text-indigo-400 mt-0.5">
                    ${(item.product.reseller_price * item.quantity).toLocaleString('es-CO')} COP
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-mono font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition"
                    title="Eliminar ítem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Balance Comparison and Checkout Button */}
        {cart.length > 0 && !checkoutSuccess && (
          <div className="p-5 border-t border-slate-800 bg-slate-900/90 space-y-4">
            
            {/* Saldo vs Total */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Saldo Actual en Bolsa:</span>
                <span className="font-mono font-bold text-slate-200">
                  ${userBalance.toLocaleString('es-CO')} COP
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Costo Total del Pedido:</span>
                <span className="font-mono font-bold text-indigo-400 text-sm">
                  -${totalCost.toLocaleString('es-CO')} COP
                </span>
              </div>
              <div className="h-px bg-slate-800 my-1" />
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Saldo Restante:</span>
                <span
                  className={`font-mono font-bold ${
                    hasSufficientBalance ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  ${balanceAfter.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            {/* Alerta de Saldo Insuficiente */}
            {!hasSufficientBalance && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>Te faltan ${Math.abs(balanceAfter).toLocaleString('es-CO')} COP</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenTopup();
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-[11px] transition shadow-sm"
                >
                  Recargar
                </button>
              </div>
            )}

            {/* Botón de Compra Atómica */}
            <button
              onClick={handleCheckoutClick}
              disabled={!hasSufficientBalance || isCheckingOut}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                hasSufficientBalance
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando Transacción Atómica...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Confirmar y Descontar de Saldo
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
