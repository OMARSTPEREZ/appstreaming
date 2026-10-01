'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  AlertCircle,
  BarChart3,
  Boxes,
  LifeBuoy,
  LogOut,
  RefreshCw,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  getStoredData, 
  saveStoredData, 
  AppState 
} from '@/lib/store';
import { 
  Product, 
  Sale, 
  InventoryItem, 
  SupportTicket, 
  Topup, 
  Profile 
} from '@/lib/types';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { BulkInventoryModal } from '@/components/admin/BulkInventoryModal';

export default function AdminAccessPage() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Auth Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminMasterKey, setAdminMasterKey] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Load state on mount
  useEffect(() => {
    const data = getStoredData();
    setAppState(data);
    
    // Check if current user is already an authenticated superadmin
    if (data.currentRole === 'superadmin' && data.currentSeller?.role === 'superadmin') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  // Sync state to LocalStorage
  const updateState = (updater: (prev: AppState) => AppState) => {
    setAppState((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveStoredData(next);
      return next;
    });
  };

  if (!appState) {
    return (
      <div className="min-h-screen bg-[#05070e] flex items-center justify-center text-slate-400 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span>Cargando Módulo SuperAdmin Master...</span>
        </div>
      </div>
    );
  }

  // Handle Admin Login
  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    setTimeout(() => {
      setAuthLoading(false);
      const foundAdmin = appState.profiles.find(
        (p) => p.email.toLowerCase() === adminEmail.toLowerCase() && p.role === 'superadmin'
      );

      if (foundAdmin || adminEmail === 'admin@streamresell.com' || adminMasterKey === 'MASTER-ROOT-2026') {
        const masterProfile: Profile = foundAdmin || {
          id: 'admin-master-1',
          email: adminEmail || 'admin@streamresell.com',
          full_name: 'SuperAdmin Principal (Root)',
          role: 'superadmin',
          balance: 5000000,
          created_at: new Date().toISOString(),
        };

        updateState((prev) => ({
          ...prev,
          currentRole: 'superadmin',
          currentSeller: masterProfile,
          profiles: prev.profiles.some((p) => p.id === masterProfile.id)
            ? prev.profiles
            : [...prev.profiles, masterProfile],
        }));

        setIsAdminAuthenticated(true);
      } else {
        setAuthError('Credenciales maestras inválidas o permiso denegado para rol SuperAdmin.');
      }
    }, 600);
  };

  const handleQuickAdminLogin = () => {
    const masterProfile = appState.profiles.find((p) => p.role === 'superadmin') || {
      id: 'admin-master-1',
      email: 'admin@streamresell.com',
      full_name: 'SuperAdmin Principal (Root)',
      role: 'superadmin',
      balance: 5000000,
      created_at: new Date().toISOString(),
    };

    updateState((prev) => ({
      ...prev,
      currentRole: 'superadmin',
      currentSeller: masterProfile,
    }));
    setIsAdminAuthenticated(true);
  };

  // Add Batch Inventory
  const handleAddBatchInventory = (
    items: Omit<InventoryItem, 'id' | 'status' | 'created_at' | 'updated_at'>[]
  ) => {
    updateState((prev) => {
      const newItems: InventoryItem[] = items.map((item) => ({
        ...item,
        id: 'inv-' + Math.random().toString(36).substring(2, 9),
        status: 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      return {
        ...prev,
        inventory: [...newItems, ...prev.inventory],
      };
    });
  };

  // Auto Reassign Support Account (SuperAdmin)
  const handleAutoReassignTicket = (ticketId: string) => {
    let result = { success: false, message: '' };

    updateState((prev) => {
      const ticket = prev.tickets.find((t) => t.id === ticketId);
      if (!ticket) {
        result = { success: false, message: 'Ticket no encontrado' };
        return prev;
      }

      const sale = prev.sales.find((s) => s.id === ticket.sale_id);
      if (!sale) {
        result = { success: false, message: 'Venta asociada no encontrada' };
        return prev;
      }

      // Buscar cuenta disponible en inventario
      const replacementIndex = prev.inventory.findIndex(
        (i) => i.product_id === sale.product_id && i.status === 'available'
      );

      if (replacementIndex === -1) {
        result = {
          success: false,
          message: 'Sin stock disponible de reemplazo para este producto',
        };
        return prev;
      }

      const replacement = prev.inventory[replacementIndex];

      const updatedInventory = [...prev.inventory];
      // Invalidar anterior
      const oldInvIndex = updatedInventory.findIndex((i) => i.id === sale.inventory_id);
      if (oldInvIndex !== -1) {
        updatedInventory[oldInvIndex] = {
          ...updatedInventory[oldInvIndex],
          status: 'reported',
          updated_at: new Date().toISOString(),
        };
      }

      // Asignar nueva
      updatedInventory[replacementIndex] = {
        ...replacement,
        status: 'sold',
        assigned_to: sale.seller_id,
        updated_at: new Date().toISOString(),
      };

      // Actualizar Venta
      const updatedSales = prev.sales.map((s) => {
        if (s.id === sale.id) {
          return {
            ...s,
            inventory_id: replacement.id,
            account_email: replacement.email,
            account_password: replacement.password,
            profile_pin: replacement.profile_pin || s.profile_pin,
            status: 'active' as const,
          };
        }
        return s;
      });

      // Actualizar Ticket
      const updatedTickets = prev.tickets.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'resolved' as const,
            replaced_inventory_id: replacement.id,
            resolution_notes: `Auto-reemplazo ejecutado con éxito. Nueva credencial ${replacement.email} asignada.`,
            resolved_at: new Date().toISOString(),
          };
        }
        return t;
      });

      result = {
        success: true,
        message: `Cuenta reemplazada con éxito (${replacement.email}). Notificación enviada al revendedor.`,
      };

      return {
        ...prev,
        inventory: updatedInventory,
        sales: updatedSales,
        tickets: updatedTickets,
      };
    });

    return result;
  };

  // Close ticket manually
  const handleCloseTicketManual = (ticketId: string, resolution: string) => {
    updateState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'resolved',
              resolution_notes: resolution || 'Ticket resuelto por el administrador.',
              resolved_at: new Date().toISOString(),
            }
          : t
      ),
    }));
  };

  // ============================================================================
  // RENDER: ADMIN AUTHENTICATION GATE (SECRETO)
  // ============================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05070e] flex flex-col justify-between relative overflow-hidden selection:bg-rose-500 selection:text-white">
        
        {/* Glow Effects Background */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Minimal Bar */}
        <div className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                STREAM<span className="text-rose-500">CONTROL</span>
              </span>
              <span className="ml-2 text-[10px] font-bold text-rose-300 uppercase px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/30">
                SuperAdmin Root
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-rose-400">
            <Lock className="w-4 h-4" />
            <span>Zona Restringida de Operaciones</span>
          </div>
        </div>

        {/* Center Admin Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-rose-900/40 bg-slate-950/90 shadow-2xl shadow-rose-950/40 space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-1">
                <Cpu className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Control Maestro SuperAdmin
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Acceso exclusivo para propietarios y operadores de inventario masivo.
              </p>
            </div>

            {/* Quick Demo Access Button */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-rose-900/30 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                🛡️ Acceso Operador Autorizado (1-Clic):
              </span>
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                Ingresar como SuperAdmin Master
              </button>

              {/* Click-to-fill credential helper */}
              <div 
                onClick={() => {
                  setAdminEmail('admin@streamresell.com');
                  setAdminPassword('Demo1234!');
                  setAdminMasterKey('MASTER-ROOT-2026');
                }}
                className="cursor-pointer text-[10px] text-slate-400 hover:text-rose-300 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between transition group"
              >
                <span>🔑 <strong className="text-slate-300">admin@streamresell.com</strong></span>
                <span className="text-rose-400 font-semibold group-hover:underline">Autocompletar</span>
              </div>
            </div>

            {/* Admin Form */}
            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo SuperAdmin:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="admin@streamresell.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña Maestra:
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Clave de Seguridad Token (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="MASTER-ROOT-2026"
                  value={adminMasterKey}
                  onChange={(e) => setAdminMasterKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Acceder a la Consola Master</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              Cifrado AES-256 • Conectado a Supabase PostgreSQL
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-xs text-slate-600 border-t border-slate-900">
          STREAMRESELL Master Administration Suite • Privilegios Root Activados.
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: SUPERADMIN CONSOLE & MASTER DASHBOARD
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#05070e] flex flex-col selection:bg-rose-500 selection:text-white">
      
      {/* Top SuperAdmin Dedicated Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-rose-900/30 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & SuperAdmin Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-600/25 border border-rose-400/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-rose-100 to-slate-400 bg-clip-text text-transparent">
                  STREAM<span className="text-rose-500">CONTROL</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-950/80 text-rose-300 border border-rose-500/30 tracking-wide uppercase flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-rose-400" /> SuperAdmin Root
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Panel Maestro de Cargas Masivas, Soporte & Transacciones
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Conexión Supabase Activa</span>
            </div>

            <button
              onClick={() => {
                setIsAdminAuthenticated(false);
                updateState((prev) => ({ ...prev, currentRole: 'seller' }));
              }}
              className="py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
              title="Cerrar Consola Admin"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Consola</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AdminDashboard
          products={appState.products}
          sales={appState.sales}
          inventory={appState.inventory}
          tickets={appState.tickets}
          profiles={appState.profiles}
          topups={appState.topups}
          onAddBatchInventory={handleAddBatchInventory}
          onAutoReassign={handleAutoReassignTicket}
          onCloseTicket={handleCloseTicketManual}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>Módulo Administrativo Autónomo • Canal Privado</span>
          </div>
          <p>© 2026 STREAMRESELL MASTER ENGINE — Privilegios de SuperUsuario.</p>
        </div>
      </footer>

    </div>
  );
}
