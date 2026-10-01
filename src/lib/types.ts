export type UserRole = 'superadmin' | 'seller';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  balance: number;
  phone?: string;
  created_at: string;
}

export type ProductCategory =
  | 'Perfiles / Pantallas'
  | 'Cuentas Completas'
  | 'Combos Especiales'
  | 'Licencias Digitales'
  | 'Música y Entretenimiento';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  description: string;
  cost_price: number;
  reseller_price: number;
  suggested_price: number;
  duration_days: number;
  icon_name: string;
  brand_color: string;
  features: string[];
  is_active: boolean;
  stock_count?: number;
}

export type InventoryStatus = 'available' | 'sold' | 'reported' | 'expired';

export interface InventoryItem {
  id: string;
  product_id: string;
  email: string;
  password: string;
  profile_pin?: string;
  household_code?: string;
  status: InventoryStatus;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type SaleStatus = 'active' | 'reported' | 'expired' | 'replaced';

export interface Sale {
  id: string;
  seller_id: string;
  inventory_id: string;
  product_id: string;
  product_name: string;
  product_brand: string;
  brand_color: string;
  cost_price: number;
  sale_price: number;
  suggested_price: number;
  profit: number;
  account_email: string;
  account_password: string;
  profile_pin?: string;
  household_code?: string;
  customer_notes?: string;
  status: SaleStatus;
  purchased_at: string;
  expires_at: string;
}

export type PaymentGateway = 'wompi' | 'pse' | 'bancolombia' | 'binance_usdt' | 'manual';
export type TopupStatus = 'pending' | 'approved' | 'rejected';

export interface Topup {
  id: string;
  seller_id: string;
  seller_name?: string;
  amount: number;
  payment_gateway: PaymentGateway;
  transaction_id: string;
  status: TopupStatus;
  receipt_url?: string;
  created_at: string;
  approved_at?: string;
}

export type IssueType =
  | 'caida_clave'
  | 'cambio_pin'
  | 'hogar_bloqueado'
  | 'cuenta_cerrada'
  | 'otro';

export type TicketStatus = 'open' | 'in_review' | 'resolved' | 'rejected';

export interface SupportTicket {
  id: string;
  sale_id: string;
  seller_id: string;
  seller_name?: string;
  product_name?: string;
  account_email?: string;
  issue_type: IssueType;
  description: string;
  status: TicketStatus;
  resolution_notes?: string;
  replaced_inventory_id?: string;
  created_at: string;
  resolved_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SuperAdminStats {
  passiveProfit: number;
  totalResellerBalance: number;
  activeAccounts: number;
  availableStock: number;
  totalSalesVolume: number;
}
