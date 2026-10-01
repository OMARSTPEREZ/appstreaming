'use client';

import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import { 
  getStoredData, 
  saveStoredData, 
  getInitialState,
  AppState 
} from '@/lib/store';
import { 
  Product, 
  Sale, 
  InventoryItem, 
  SupportTicket, 
  Topup, 
  CartItem, 
  PaymentGateway, 
  IssueType 
} from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { SellerDashboard } from '@/components/seller/SellerDashboard';
import { CartDrawer } from '@/components/seller/CartDrawer';
import { HouseholdCodeModal } from '@/components/HouseholdCodeModal';
import { ReportIssueModal } from '@/components/ReportIssueModal';
import { TopupModal } from '@/components/TopupModal';
import { MobileBottomNav } from '@/components/MobileBottomNav';

export default function Home() {
  const [appState, setAppState] = useState<AppState>(getInitialState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Tab State
  const [sellerActiveTab, setSellerActiveTab] = useState<'catalog' | 'sales' | 'topups'>('catalog');
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);
  
  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [selectedSaleForCode, setSelectedSaleForCode] = useState<Sale | null>(null);
  const [selectedSaleForReport, setSelectedSaleForReport] = useState<Sale | null>(null);

  // Load state on mount from localStorage
  useEffect(() => {
    try {
      const data = getStoredData();
      if (data) {
        setAppState(data);
      }
      const savedAuth = localStorage.getItem('STREAMRESELL_SELLER_AUTH');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error initializing state:', err);
    }
  }, []);

  // Sync state to LocalStorage on updates
  const updateState = (updater: (prev: AppState) => AppState) => {
    setAppState((prev) => {
      const next = updater(prev);
      saveStoredData(next);
      return next;
    });
  };

  // Inventory count lookup
  const inventoryCounts = appState.products.reduce((acc, prod) => {
    const count = appState.inventory.filter(
      (i) => i.product_id === prod.id && i.status === 'available'
    ).length;
    acc[prod.id] = count;
    return acc;
  }, {} as Record<string, number>);

  // Auth Handler for Sellers (Instant, robust)
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const email = authEmail.trim() || 'distribuidor.demo@streamresell.com';

    if (authTab === 'login') {
      const found = appState.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
      const sellerProfile = found || {
        id: 'seller-' + Math.random().toString(36).substring(2, 8),
        email: email,
        full_name: email.split('@')[0],
        role: 'seller' as const,
        balance: 250000,
        created_at: new Date().toISOString(),
      };
      updateState((prev) => ({
        ...prev,
        currentRole: 'seller',
        currentSeller: sellerProfile,
        profiles: found ? prev.profiles : [...prev.profiles, sellerProfile],
      }));
    } else {
      // Register
      const newProfile = {
        id: 'seller-' + Math.random().toString(36).substring(2, 8),
        email: email,
        full_name: authFullName.trim() || email.split('@')[0],
        role: 'seller' as const,
        balance: 150000,
        created_at: new Date().toISOString(),
      };
      updateState((prev) => ({
        ...prev,
        currentRole: 'seller',
        currentSeller: newProfile,
        profiles: [...prev.profiles, newProfile],
      }));
    }

    try {
      localStorage.setItem('STREAMRESELL_SELLER_AUTH', 'true');
    } catch {}

    setAuthLoading(false);
    setIsAuthenticated(true);
  };

  const handleQuickDemoLogin = () => {
    const demoSeller = appState.profiles.find((p) => p.role === 'seller') || {
      id: 'distribuidor-demo',
      email: 'distribuidor.demo@streamresell.com',
      full_name: 'Distribuidora Streaming Colombia SAS (Demo VIP)',
      role: 'seller',
      balance: 250000,
      phone: '+57 312 456 7890',
      created_at: new Date().toISOString(),
    };
    updateState((prev) => ({
      ...prev,
      currentRole: 'seller',
      currentSeller: demoSeller,
    }));
    try {
      localStorage.setItem('STREAMRESELL_SELLER_AUTH', 'true');
    } catch {}
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('STREAMRESELL_SELLER_AUTH');
    } catch {}
    setIsAuthenticated(false);
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

    setSellerActiveTab('sales');
    setIsCartOpen(false);
    setPurchaseNotice('¡Compra exitosa! Tus nuevas credenciales ya están disponibles para entrega inmediata.');
    setTimeout(() => setPurchaseNotice(null), 6000);
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

  // ============================================================================
  // RENDER: LANDING PÚBLICA PRIVADA DEL DISTRIBUIDOR (LOGIN / REGISTRO)
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080c16] flex flex-col justify-between relative overflow-hidden selection:bg-indigo-500 selection:text-white">
        
        {/* Glow Effects Background */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />
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

            {/* Quick Demo Access Button (Only Seller) */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                🚀 Acceso Rápido Demostrativo (1-Clic):
              </span>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                Ingresar como Distribuidor VIP
              </button>

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
                    Nombre Completo o Razón Comercial:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Distribuciones Streaming SAS"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico de Distribuidor:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="distribuidor@empresa.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña:
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
                    {authTab === 'login' ? 'Entrar al Catálogo Mayorista' : 'Registrar Distribuidor'}
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
  // RENDER: PORTAL AUTENTICADO DE DISTRIBUIDOR (SELLER ONLY)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#080c16] flex flex-col selection:bg-indigo-500 selection:text-white pb-16 md:pb-0">
      
      {/* Top Decoupled Seller Navbar */}
      <Navbar
        currentSeller={appState.currentSeller}
        cartCount={appState.cart.reduce((acc, c) => acc + c.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTopup={() => setIsTopupOpen(true)}
        onLogout={handleLogout}
      />

      {/* Purchase Notice Banner */}
      {purchaseNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between shadow-xl">
            <span className="font-semibold">{purchaseNotice}</span>
            <button 
              onClick={() => setPurchaseNotice(null)} 
              className="text-xs text-emerald-400 underline font-bold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Main Seller Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
          activeTab={sellerActiveTab}
          onTabChange={(tab) => setSellerActiveTab(tab)}
          onAddToCart={handleAddToCart}
          onOpenHouseholdCode={(sale) => setSelectedSaleForCode(sale)}
          onOpenReportIssue={(sale) => setSelectedSaleForReport(sale)}
          onProcessTopup={handleProcessTopup}
        />
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

      {/* Mobile Bottom Nav (Decoupled Seller) */}
      <MobileBottomNav
        activeTab={sellerActiveTab}
        cartCount={appState.cart.reduce((acc, c) => acc + c.quantity, 0)}
        onSelectTab={(tab) => setSellerActiveTab(tab)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTopup={() => setIsTopupOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistema B2B Mayorista en Línea • Entrega Inmediata de Credenciales</span>
          </div>
          <p>© 2026 STREAMRESELL B2B — Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
