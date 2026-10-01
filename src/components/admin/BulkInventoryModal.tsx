'use client';

import React, { useState } from 'react';
import { 
  PackagePlus, 
  X, 
  Upload, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Product, InventoryItem } from '@/lib/types';

interface BulkInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddBatchInventory: (items: Omit<InventoryItem, 'id' | 'status' | 'created_at' | 'updated_at'>[]) => void;
}

export const BulkInventoryModal: React.FC<BulkInventoryModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddBatchInventory,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [inputMode, setInputMode] = useState<'text' | 'form'>('text');
  
  // Text area for bulk copy-paste format: email,password,pin,household_code
  const [bulkText, setBulkText] = useState(
    'cuenta1.vip@gmail.com,Clave2026!,4821,HTV-84920\ncuenta2.vip@gmail.com,Clave2026!,1904,HTV-31294\ncuenta3.vip@gmail.com,Clave2026!,7723,HTV-55109'
  );

  // Form rows for manual entry
  const [rows, setRows] = useState([
    { email: '', password: '', profile_pin: '', household_code: '' },
  ]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setRows([...rows, { email: '', password: '', profile_pin: '', household_code: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index: number, field: string, value: string) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemsToAdd: Omit<InventoryItem, 'id' | 'status' | 'created_at' | 'updated_at'>[] = [];

    if (inputMode === 'text') {
      const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
      lines.forEach((line) => {
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length >= 2) {
          itemsToAdd.push({
            product_id: selectedProductId,
            email: parts[0],
            password: parts[1],
            profile_pin: parts[2] || 'N/A',
            household_code: parts[3] || 'HTV-' + Math.floor(10000 + Math.random() * 90000),
          });
        }
      });
    } else {
      rows.forEach((row) => {
        if (row.email && row.password) {
          itemsToAdd.push({
            product_id: selectedProductId,
            email: row.email,
            password: row.password,
            profile_pin: row.profile_pin || 'N/A',
            household_code: row.household_code || 'HTV-' + Math.floor(10000 + Math.random() * 90000),
          });
        }
      });
    }

    if (itemsToAdd.length === 0) return;

    onAddBatchInventory(itemsToAdd);
    setImportedCount(itemsToAdd.length);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Carga Masiva de Cuentas al Inventario</h3>
              <p className="text-xs text-slate-400">Ingreso automático de stock con claves, pines y códigos de hogar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-white">¡Stock Ingresado con Éxito!</h4>
            <p className="text-sm text-emerald-400 font-semibold">
              +{importedCount} cuentas agregadas al catálogo en tiempo real.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            
            {/* Selector de Producto */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Selecciona el Producto / Servicio de Streaming:
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              >
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} ({prod.brand}) — Costo: ${prod.cost_price.toLocaleString('es-CO')} COP
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  inputMode === 'text'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                Pegar Texto / CSV por Lotes
              </button>
              <button
                type="button"
                onClick={() => setInputMode('form')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  inputMode === 'form'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                Formulario Fila por Fila
              </button>
            </div>

            {inputMode === 'text' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Formato: <code>correo,clave,pin,codigo_hogar</code> (1 cuenta por línea)</span>
                </div>
                <textarea
                  rows={6}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="ejemplo@gmail.com,Pass1234,4821,HTV-84920"
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                />
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {rows.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="Correo"
                      required
                      value={row.email}
                      onChange={(e) => handleRowChange(idx, 'email', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Clave"
                      required
                      value={row.password}
                      onChange={(e) => handleRowChange(idx, 'password', e.target.value)}
                      className="w-32 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="PIN (opcional)"
                      value={row.profile_pin}
                      onChange={(e) => handleRowChange(idx, 'profile_pin', e.target.value)}
                      className="w-24 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      disabled={rows.length === 1}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar otra fila
                </button>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30"
              >
                <Upload className="w-4 h-4" />
                Guardar e Inyectar al Inventario
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
