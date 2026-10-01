'use client';

import { 
  Profile, 
  Product, 
  InventoryItem, 
  Sale, 
  Topup, 
  SupportTicket, 
  CartItem, 
  SuperAdminStats 
} from './types';

// Mock Seed Profiles
const INITIAL_PROFILES: Profile[] = [
  {
    id: 'seller-101',
    email: 'vendedor@streamresell.com',
    full_name: 'Carlos Mendoza (Revendedor VIP)',
    role: 'seller',
    balance: 185000,
    phone: '+57 300 123 4567',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'admin-001',
    email: 'admin@streamresell.com',
    full_name: 'Administrador General Mayorista',
    role: 'superadmin',
    balance: 2450000,
    phone: '+57 310 987 6543',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
];

// Mock Seed Products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Netflix Perfil 4K Ultra HD',
    category: 'Perfiles / Pantallas',
    brand: 'Netflix',
    description: 'Perfil privado con PIN exclusivo en cuenta 4K UHD. Incluye generación de código de hogar garantizado.',
    cost_price: 8500,
    reseller_price: 12000,
    suggested_price: 18000,
    duration_days: 30,
    icon_name: 'Tv',
    brand_color: '#E50914',
    features: ['4K Ultra HD', '1 Pantalla privada', 'PIN personalizado', 'Renovable mes a mes'],
    is_active: true,
  },
  {
    id: 'prod-02',
    name: 'YouTube Premium Anual / Mensual',
    category: 'Cuentas Completas',
    brand: 'YouTube',
    description: 'Membresía individual sin anuncios, reproducción en segundo plano y YouTube Music incluido.',
    cost_price: 6000,
    reseller_price: 9500,
    suggested_price: 16000,
    duration_days: 30,
    icon_name: 'Youtube',
    brand_color: '#FF0000',
    features: ['Cero Publicidad', 'YouTube Music Pro', 'Descargas Offline', 'A tu correo personal'],
    is_active: true,
  },
  {
    id: 'prod-03',
    name: 'Disney+ & ESPN (Perfil 4K)',
    category: 'Perfiles / Pantallas',
    brand: 'Disney+',
    description: 'Acceso total a películas Disney, Pixar, Marvel, Star Wars y deportes en vivo por ESPN.',
    cost_price: 5500,
    reseller_price: 8900,
    suggested_price: 15000,
    duration_days: 30,
    icon_name: 'Film',
    brand_color: '#113CCF',
    features: ['Incluye ESPN en vivo', 'Calidad 4K HDR', 'Audio Dolby Atmos', 'Garantía total 30 días'],
    is_active: true,
  },
  {
    id: 'prod-04',
    name: 'Amazon Prime Video (Cuenta 3P)',
    category: 'Cuentas Completas',
    brand: 'Prime Video',
    description: 'Cuenta completa con 3 pantallas en simultáneo, catálogo internacional y entrega al instante.',
    cost_price: 7000,
    reseller_price: 11000,
    suggested_price: 19000,
    duration_days: 30,
    icon_name: 'Play',
    brand_color: '#00A8E1',
    features: ['3 Pantallas simultáneas', 'Series & Películas HD', 'Entrega inmediata', 'Soporte 24/7'],
    is_active: true,
  },
  {
    id: 'prod-05',
    name: 'Max (HBO) Platino 4K UHD',
    category: 'Perfiles / Pantallas',
    brand: 'Max',
    description: 'Perfil con PIN en plan Platino 4K UHD. Estrenos de cine, Warner Bros, HBO y Discovery.',
    cost_price: 5000,
    reseller_price: 8000,
    suggested_price: 14000,
    duration_days: 30,
    icon_name: 'Sparkles',
    brand_color: '#7B2CBF',
    features: ['Plan Platino Máximo', '4K UHD & HDR 10', 'Descargas offline', 'Garantía 30 días'],
    is_active: true,
  },
  {
    id: 'prod-06',
    name: 'Spotify Premium Individual',
    category: 'Música y Entretenimiento',
    brand: 'Spotify',
    description: 'Música sin interrupciones, saltos ilimitados y descarga en alta fidelidad de 320 kbps.',
    cost_price: 4500,
    reseller_price: 7500,
    suggested_price: 13000,
    duration_days: 30,
    icon_name: 'Music',
    brand_color: '#1DB954',
    features: ['Sin anuncios comerciales', 'Audio Máxima Calidad', 'Cuentas privadas', 'Garantía total'],
    is_active: true,
  },
  {
    id: 'prod-07',
    name: 'Mega Combo Streaming (Netflix + Disney + Prime)',
    category: 'Combos Especiales',
    brand: 'Combo B2B',
    description: 'Pack estrella para mayoristas. Los 3 servicios más vendidos en un solo paquete con 25% de ahorro.',
    cost_price: 18000,
    reseller_price: 26900,
    suggested_price: 45000,
    duration_days: 30,
    icon_name: 'Flame',
    brand_color: '#F59E0B',
    features: ['3 Servicios Líderes', 'Ahorro mayorista 25%', 'Alta rotación', 'Mayor margen'],
    is_active: true,
  },
  {
    id: 'prod-08',
    name: 'Canva Pro Diseñador (1 Año)',
    category: 'Licencias Digitales',
    brand: 'Canva',
    description: 'Licencia para diseñadores y agencias. Acceso ilimitado a plantillas premium, quitafondos e IA.',
    cost_price: 12000,
    reseller_price: 22000,
    suggested_price: 50000,
    duration_days: 365,
    icon_name: 'Laptop',
    brand_color: '#00C4CC',
    features: ['Licencia 12 Meses', 'Herramientas Magic IA', 'Kit de Marcas Pro', 'Activación a tu correo'],
    is_active: true,
  },
];

// Initial Seed Inventory
const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-01',
    product_id: 'prod-01',
    email: 'premium.vip.nf1@gmail.com',
    password: 'PassStream2026!#',
    profile_pin: '4821',
    household_code: 'HTV-84920',
    status: 'sold',
    assigned_to: 'seller-101',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'inv-02',
    product_id: 'prod-01',
    email: 'premium.vip.nf2@gmail.com',
    password: 'PassStream2026!#',
    profile_pin: '1904',
    household_code: 'HTV-31294',
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inv-03',
    product_id: 'prod-01',
    email: 'premium.vip.nf3@gmail.com',
    password: 'PassStream2026!#',
    profile_pin: '7723',
    household_code: 'HTV-55109',
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inv-04',
    product_id: 'prod-02',
    email: 'yt.fam.cuenta01@gmail.com',
    password: 'YoutubePro#2026',
    profile_pin: 'N/A',
    household_code: 'N/A',
    status: 'sold',
    assigned_to: 'seller-101',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'inv-05',
    product_id: 'prod-02',
    email: 'yt.fam.cuenta02@gmail.com',
    password: 'YoutubePro#2026',
    profile_pin: 'N/A',
    household_code: 'N/A',
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inv-06',
    product_id: 'prod-03',
    email: 'disney.espn.acc1@outlook.com',
    password: 'DisneyStarPass$26',
    profile_pin: '3310',
    household_code: 'N/A',
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inv-07',
    product_id: 'prod-04',
    email: 'prime.global3p@gmail.com',
    password: 'AmazonFast2026!',
    profile_pin: '8820',
    household_code: 'N/A',
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inv-08',
    product_id: 'prod-05',
    email: 'max.platino.perfil1@gmail.com',
    password: 'MaxPlatino#2026',
    profile_pin: '5029',
    household_code: 'N/A',
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inv-09',
    product_id: 'prod-06',
    email: 'spotify.hifi.vip1@gmail.com',
    password: 'SpotiMusic2026$',
    profile_pin: 'N/A',
    household_code: 'N/A',
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inv-10',
    product_id: 'prod-07',
    email: 'combo.mega.stream1@gmail.com',
    password: 'ComboPack#2026',
    profile_pin: '9182',
    household_code: 'HTV-99381',
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inv-11',
    product_id: 'prod-08',
    email: 'canva.agency.lic1@design.pro',
    password: 'CanvaMagic#2026',
    profile_pin: 'INVITE_LINK_PRO',
    household_code: 'N/A',
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Initial Seed Sales
const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-01',
    seller_id: 'seller-101',
    inventory_id: 'inv-01',
    product_id: 'prod-01',
    product_name: 'Netflix Perfil 4K Ultra HD',
    product_brand: 'Netflix',
    brand_color: '#E50914',
    cost_price: 8500,
    sale_price: 12000,
    suggested_price: 18000,
    profit: 3500,
    account_email: 'premium.vip.nf1@gmail.com',
    account_password: 'PassStream2026!#',
    profile_pin: '4821',
    household_code: 'HTV-84920',
    status: 'active',
    purchased_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 25 * 86400000).toISOString(),
  },
  {
    id: 'sale-02',
    seller_id: 'seller-101',
    inventory_id: 'inv-04',
    product_id: 'prod-02',
    product_name: 'YouTube Premium Anual / Mensual',
    product_brand: 'YouTube',
    brand_color: '#FF0000',
    cost_price: 6000,
    sale_price: 9500,
    suggested_price: 16000,
    profit: 3500,
    account_email: 'yt.fam.cuenta01@gmail.com',
    account_password: 'YoutubePro#2026',
    profile_pin: 'N/A',
    household_code: 'N/A',
    status: 'active',
    purchased_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 20 * 86400000).toISOString(),
  }
];

// Initial Topups
const INITIAL_TOPUPS: Topup[] = [
  {
    id: 'topup-01',
    seller_id: 'seller-101',
    seller_name: 'Carlos Mendoza (Revendedor VIP)',
    amount: 200000,
    payment_gateway: 'wompi',
    transaction_id: 'WMP-9842187-TX',
    status: 'approved',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    approved_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'topup-02',
    seller_id: 'seller-101',
    seller_name: 'Carlos Mendoza (Revendedor VIP)',
    amount: 100000,
    payment_gateway: 'pse',
    transaction_id: 'PSE-1092837-COL',
    status: 'approved',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    approved_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  }
];

// Initial Support Tickets
const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'ticket-01',
    sale_id: 'sale-02',
    seller_id: 'seller-101',
    seller_name: 'Carlos Mendoza',
    product_name: 'YouTube Premium',
    account_email: 'yt.fam.cuenta01@gmail.com',
    issue_type: 'caida_clave',
    description: 'El cliente indica que le aparece aviso de renovar membresía.',
    status: 'open',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  }
];

const LOCAL_STORAGE_KEY = 'STREAMRESELL_B2B_DATA_V1';

export interface AppState {
  currentRole: 'seller' | 'superadmin';
  currentSeller: Profile;
  profiles: Profile[];
  products: Product[];
  inventory: InventoryItem[];
  sales: Sale[];
  topups: Topup[];
  tickets: SupportTicket[];
  cart: CartItem[];
}

export const getStoredData = (): AppState => {
  if (typeof window === 'undefined') {
    return {
      currentRole: 'seller',
      currentSeller: INITIAL_PROFILES[0],
      profiles: INITIAL_PROFILES,
      products: INITIAL_PRODUCTS,
      inventory: INITIAL_INVENTORY,
      sales: INITIAL_SALES,
      topups: INITIAL_TOPUPS,
      tickets: INITIAL_TICKETS,
      cart: [],
    };
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const initial: AppState = {
        currentRole: 'seller',
        currentSeller: INITIAL_PROFILES[0],
        profiles: INITIAL_PROFILES,
        products: INITIAL_PRODUCTS,
        inventory: INITIAL_INVENTORY,
        sales: INITIAL_SALES,
        topups: INITIAL_TOPUPS,
        tickets: INITIAL_TICKETS,
        cart: [],
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading stored state:', err);
    return {
      currentRole: 'seller',
      currentSeller: INITIAL_PROFILES[0],
      profiles: INITIAL_PROFILES,
      products: INITIAL_PRODUCTS,
      inventory: INITIAL_INVENTORY,
      sales: INITIAL_SALES,
      topups: INITIAL_TOPUPS,
      tickets: INITIAL_TICKETS,
      cart: [],
    };
  }
};

export const saveStoredData = (state: AppState) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Error saving state to localStorage:', err);
    }
  }
};
