'use client';

import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  UserPlus, 
  LogIn,
  AlertCircle,
  Building2,
  Zap,
  TrendingUp,
  Flame,
  Shield
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
  CartItem, 
  UserRole, 
  PaymentGateway, 
  IssueType 
} from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { SellerDashboard } from '@/components/seller/SellerDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { CartDrawer } from '@/components/seller/CartDrawer';
import { HouseholdCodeModal } from '@/components/HouseholdCodeModal';
import { ReportIssueModal } from '@/components/ReportIssueModal';
import { TopupModal } from '@/components/TopupModal';

export default function Home() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authRole, setAuthRole] = useState<UserRole>('seller');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [selectedSaleForCode, setSelectedSaleForCode] = useState<Sale | null>(null);
  const [selectedSaleForReport, setSelectedSaleForReport] = useState<Sale | null>(null);

  // Load state on mount
  useEffect(() => {
    const data = getStoredData();
    setAppState(data);
  }, []);

  // Sync state to LocalStorage on updates
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
      <div className="min-h-screen bg-[#080c16] flex items-center justify-center text-slate-400 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Iniciando Portal B2B Mayorista...</span>
        </div>
      </div>
    );
  }

  // Inventory count lookup
  const inventoryCounts = appState.products.reduce((acc, prod) => {
    const count = appState.inventory.filter(
      (i) => i.product_id === prod.id && i.status === 'available'
    ).length;
    acc[prod.id] = count;
    return acc;
  }, {} as Record<string, number>);

  // Auth Handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    setTimeout(() => {
      setAuthLoading(false);
      if (authTab === 'login') {
        const found = appState.profiles.find((p) => p.email.toLowerCase() === authEmail.toLowerCase());
        if (found) {
          updateState((prev) => ({
            ...prev,
            currentRole: found.role,
            currentSeller: found,
          }));
          setIsAuthenticated(true);
        } else {
          // Si no existe, crear o autenticar
          const newProfile = {
            id: 'user-' + Math.random().toString(36).substring(2, 8),
            email: authEmail,
            full_name: authEmail.split('@')[0],
            role: authRole,
            balance: authRole === 'seller' ? 150000 : 2000000,
            created_at: new Date().toISOString(),
          };
          updateState((prev) => ({
            ...prev,
            currentRole: authRole,
            currentSeller: newProfile,
            profiles: [...prev.profiles, newProfile],
          }));
          setIsAuthenticated(true);
        }
      } else {
        // Register
        const newProfile = {
          id: 'user-' + Math.random().toString(36).substring(2, 8),
          email: authEmail,
          full_name: authFullName || authEmail.split('@')[0],
          role: authRole,
          balance: authRole === 'seller' ? 100000 : 2500000,
          created_at: new Date().toISOString(),
        };
        updateState((prev) => ({
          ...prev,
          currentRole: authRole,
          currentSeller: newProfile,
          profiles: [...prev.profiles, newProfile],
        }));
        setIsAuthenticated(true);
      }
    }, 600);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const demoUser = appState.profiles.find((p) => p.role === role) || appState.profiles[0];
    updateState((prev) => ({
      ...prev,
      currentRole: role,
      currentSeller: demoUser,
    }));
    setIsAuthenticated(true);
  };

  // Cart Operations
  const handleAddToCart = (product: Product) => {
    updateState((prev) => {
      const existing = prev.cart.find((c) => c.product.id === product.id);
      let newCart: CartItem[];
      if (existing) {
        newCart = prev.cart.map((c) =>
          c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        newCart = [...prev.cart, { product, quantity: 1 }];
      }
      return { ...prev, cart: newCart };
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateState((prev) => {
      if (quantity <= 0) {
        return { ...prev, cart: prev.cart.filter((c) => c.product.id !== productId) };
      }
      return {
        ...prev,
        cart: prev.cart.map((c) =>
          c.product.id === productId ? { ...c, quantity } : c
        ),
      };
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    updateState((prev) => ({
      ...prev,
      cart: prev.cart.filter((c) => c.product.id !== productId),
    }));
  };

  // Atomic Checkout Transaction
  const handleAtomicCheckout = () => {
    updateState((prev) => {
      const totalCost = prev.cart.reduce(
        (acc, item) => acc + item.product.reseller_price * item.quantity,
        0
      );

      if (prev.currentSeller.balance < totalCost) return prev;

      const newSales: Sale[] = [...prev.sales];
      const updatedInventory: InventoryItem[] = [...prev.inventory];

      prev.cart.forEach((cartItem) => {
        for (let i = 0; i < cartItem.quantity; i++) {
          const invIndex = updatedInventory.findIndex(
            (inv) => inv.product_id === cartItem.product.id && inv.status === 'available'
          );

          if (invIndex !== -1) {
            const inv = updatedInventory[invIndex];
            updatedInventory[invIndex] = {
              ...inv,
              status: 'sold',
              assigned_to: prev.currentSeller.id,
              updated_at: new Date().toISOString(),
            };

            const expiresAt = new Date(
              Date.now() + cartItem.product.duration_days * 86400000
            ).toISOString();

            newSales.unshift({
              id: 'sale-' + Math.random().toString(36).substring(2, 9),
              seller_id: prev.currentSeller.id,
              inventory_id: inv.id,
              product_id: cartItem.product.id,
              product_name: cartItem.product.name,
              product_brand: cartItem.product.brand,
              brand_color: cartItem.product.brand_color,
              cost_price: cartItem.product.cost_price,
              sale_price: cartItem.product.reseller_price,
              suggested_price: cartItem.product.suggested_price,
              profit: cartItem.product.reseller_price - cartItem.product.cost_price,
              account_email: inv.email,
              account_password: inv.password,
              profile_pin: inv.profile_pin,
              household_code: inv.household_code,
              status: 'active',
              purchased_at: new Date().toISOString(),
              expires_at: expiresAt,
            });
          }
        }
      });

      const newBalance = prev.currentSeller.balance - totalCost;
      const updatedSeller = { ...prev.currentSeller, balance: newBalance };

      return {
        ...prev,
        currentSeller: updatedSeller,
        profiles: prev.profiles.map((p) =>
          p.id === updatedSeller.id ? updatedSeller : p
        ),
        sales: newSales,
        inventory: updatedInventory,
        cart: [],
      };
    });
  };

  // Process Topup
  const handleProcessTopup = (amount: number, gateway: PaymentGateway) => {
    updateState((prev) => {
      const newTopup: Topup = {
        id: 'topup-' + Math.random().toString(36).substring(2, 8),
        seller_id: prev.currentSeller.id,
        seller_name: prev.currentSeller.full_name,
        amount,
        payment_gateway: gateway,
        transaction_id: `${gateway.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-TX`,
        status: 'approved',
        created_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
      };

      const newBalance = prev.currentSeller.balance + amount;
      const updatedSeller = { ...prev.currentSeller, balance: newBalance };

      return {
        ...prev,
        currentSeller: updatedSeller,
        profiles: prev.profiles.map((p) =>
          p.id === updatedSeller.id ? updatedSeller : p
        ),
        topups: [newTopup, ...prev.topups],
      };
    });
  };

  // Support Ticket Submission
  const handleSubmitTicket = (saleId: string, issueType: IssueType, description: string) => {
    updateState((prev) => {
      const sale = prev.sales.find((s) => s.id === saleId);
      const newTicket: SupportTicket = {
        id: 'ticket-' + Math.random().toString(36).substring(2, 8),
        sale_id: saleId,
        seller_id: prev.currentSeller.id,
        seller_name: prev.currentSeller.full_name,
        product_name: sale?.product_name,
        account_email: sale?.account_email,
        issue_type: issueType,
        description,
        status: 'open',
        created_at: new Date().toISOString(),
      };

      return {
        ...prev,
        tickets: [newTicket, ...prev.tickets],
        sales: prev.sales.map((s) =>
          s.id === saleId ? { ...s, status: 'reported' } : s
        ),
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
            profile_pin: replacement.profile_pin,
            household_code: replacement.household_code,
            status: 'replaced' as const,
          };
        }
        return s;
      });

      // Cerrar Ticket
      const updatedTickets = prev.tickets.map((t) => {
        if (t.id === ticket.id) {
          return {
            ...t,
            status: 'resolved' as const,
            resolution_notes: 'Reasignación automática exitosa desde stock disponible',
            replaced_inventory_id: replacement.id,
            resolved_at: new Date().toISOString(),
          };
        }
        return t;
      });

      result = {
        success: true,
        message: `¡Cuenta reasignada! Nuevas credenciales enviadas: ${replacement.email}`,
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

  const handleCloseTicketManual = (ticketId: string, resolution: string) => {
    updateState((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'resolved',
              resolution_notes: resolution,
              resolved_at: new Date().toISOString(),
            }
          : t
      ),
    }));
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

  // ============================================================================
  // RENDER: LANDING PÚBLICA PRIVADA (LOGIN / REGISTRO ONLY)
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080c16] flex flex-col justify-between relative overflow-hidden selection:bg-indigo-500 selection:text-white">
        
        {/* Glow Effects Background */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-rose-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Minimal Bar */}
        <div className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                STREAM<span className="text-indigo-400">RESELL</span>
              </span>
              <span className="ml-2 text-[10px] font-bold text-indigo-300 uppercase px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30">
                B2B Privado
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Portal Mayorista de Acceso Restringido</span>
          </div>
        </div>

        {/* Center Auth Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-700/60 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-1">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Acceso Distribuidor Autorizado
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Inicia sesión con tu cuenta de revendedor o mayorista para acceder al catálogo y stock en tiempo real.
              </p>
            </div>

            {/* Quick Demo Access Buttons */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                🚀 Acceso Rápido Demostrativo (1-Clic):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('seller')}
                  className="py-2.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  Distribuidor Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('superadmin')}
                  className="py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-400" />
                  SuperAdmin Master
                </button>
              </div>

              {/* Click-to-fill credential helper */}
              <div 
                onClick={() => {
                  setAuthEmail('distribuidor.demo@streamresell.com');
                  setAuthPassword('Demo1234!');
                  setAuthTab('login');
                }}
                className="cursor-pointer text-[10px] text-slate-400 hover:text-indigo-300 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between transition group"
              >
                <span>🔑 <strong className="text-slate-300">distribuidor.demo@streamresell.com</strong></span>
                <span className="text-indigo-400 font-semibold group-hover:underline">Autocompletar</span>
              </div>
            </div>

            {/* Form Mode Selector */}
            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  authTab === 'login'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  authTab === 'register'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Registrar Distribuidor
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {authTab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre Completo o Empresa:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Distribuciones Streaming Colombia"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico Corporativo:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="vendedor@empresa.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña de Acceso:
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {authTab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Rol Inicial Deseado:
                  </label>
                  <select
                    value={authRole}
                    onChange={(e) => setAuthRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="seller">Revendedor Minorista (Seller)</option>
                    <option value="superadmin">SuperAdmin Mayorista (Proveedor)</option>
                  </select>
                </div>
              )}

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {authTab === 'login' ? 'Entrar al Portal B2B' : 'Crear Cuenta Mayorista'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              Protegido con Supabase PostgreSQL & Row Level Security (RLS).
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-xs text-slate-500 border-t border-slate-900">
          © 2026 STREAMRESELL B2B Technologies — Plataforma Mayorista de Cuentas y Licencias.
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: PORTAL AUTENTICADO (SELLER DASHBOARD & ADMIN DASHBOARD)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#080c16] flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={appState.currentRole}
        currentSeller={appState.currentSeller}
        cartCount={appState.cart.reduce((acc, c) => acc + c.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTopup={() => setIsTopupOpen(true)}
        onSwitchRole={(role) =>
          updateState((prev) => ({
            ...prev,
            currentRole: role,
            currentSeller:
              prev.profiles.find((p) => p.role === role) || prev.currentSeller,
          }))
        }
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {appState.currentRole === 'seller' ? (
          <SellerDashboard
            products={appState.products}
            sales={appState.sales.filter(
              (s) => s.seller_id === appState.currentSeller.id
            )}
            topups={appState.topups.filter(
              (t) => t.seller_id === appState.currentSeller.id
            )}
            inventoryCounts={inventoryCounts}
            currentBalance={appState.currentSeller.balance}
            onAddToCart={handleAddToCart}
            onOpenHouseholdCode={(sale) => setSelectedSaleForCode(sale)}
            onOpenReportIssue={(sale) => setSelectedSaleForReport(sale)}
            onProcessTopup={handleProcessTopup}
          />
        ) : (
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
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={appState.cart}
        userBalance={appState.currentSeller.balance}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleAtomicCheckout}
        onOpenTopup={() => setIsTopupOpen(true)}
      />

      {/* Household Code Modal */}
      <HouseholdCodeModal
        sale={selectedSaleForCode}
        onClose={() => setSelectedSaleForCode(null)}
      />

      {/* Report Issue Modal */}
      <ReportIssueModal
        sale={selectedSaleForReport}
        onClose={() => setSelectedSaleForReport(null)}
        onSubmitTicket={handleSubmitTicket}
      />

      {/* Topup Fast Modal */}
      <TopupModal
        isOpen={isTopupOpen}
        onClose={() => setIsTopupOpen(false)}
        onConfirmTopup={handleProcessTopup}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistema B2B Mayorista en Línea • Supabase PostgreSQL v16</span>
          </div>
          <p>© 2026 STREAMRESELL B2B — Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
