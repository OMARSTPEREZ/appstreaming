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
    id: 'distribuidor-demo',
    email: 'distribuidor.demo@streamresell.com',
    full_name: 'Distribuidora Streaming Colombia SAS (Demo VIP)',
    role: 'seller',
    balance: 250000,
    phone: '+57 312 456 7890',
    created_at: new Date().toISOString(),
  },
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

// ── Real Product Catalog N.T.O. ────────────────────────────────────────────
const INITIAL_PRODUCTS: Product[] = [

  // ── NETFLIX ────────────────────────────────────────────────────────────────
  {
    id: 'nf-01',
    name: 'Netflix 4K Original — 1 Pantalla',
    category: 'Streaming',
    brand: 'Netflix Original',
    description: '1 Pantalla Netflix Original con PIN privado. Calidad 4K Ultra HD garantizada. La opción premium para clientes exigentes.',
    cost_price: 13000, reseller_price: 16000, suggested_price: 20000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#E50914',
    features: ['4K Ultra HD', '1 Pantalla con PIN', 'Cuenta Original', 'Garantía completa 30d'],
    is_active: true,
  },
  {
    id: 'nf-02',
    name: 'Netflix Uso Libre — 1 Pantalla',
    category: 'Streaming',
    brand: 'Netflix',
    description: 'Pantalla de uso libre en cuenta compartida. Acceso completo al catálogo Netflix en HD.',
    cost_price: 7000, reseller_price: 9000, suggested_price: 12000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#E50914',
    features: ['Uso Libre', 'Catálogo Completo', 'Entrega inmediata', 'Renovable mensual'],
    is_active: true,
  },
  {
    id: 'nf-03',
    name: 'Netflix Extra — 1 Miembro',
    category: 'Streaming',
    brand: 'Netflix Extra',
    description: 'Cupo de miembro extra oficial de Netflix. Acceso independiente a perfil propio.',
    cost_price: 10000, reseller_price: 13000, suggested_price: 16000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#E50914',
    features: ['Miembro Extra Oficial', 'Perfil Propio', 'Contraseña Independiente', 'Alta demanda'],
    is_active: true,
  },
  {
    id: 'nf-04',
    name: 'Netflix Perfil Estándar',
    category: 'Streaming',
    brand: 'Netflix',
    description: '1 Perfil en cuenta compartida. Acceso al catálogo Netflix en calidad estándar HD.',
    cost_price: 6000, reseller_price: 8000, suggested_price: 11000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#E50914',
    features: ['Perfil Compartido', 'Catálogo Netflix HD', 'Más económico', 'Entrega inmediata'],
    is_active: true,
  },

  // ── IPTV & TV / CANALES EN VIVO ───────────────────────────────────────────
  {
    id: 'iptv-01',
    name: 'Stella TV — Cuenta Completa',
    category: 'IPTV & TV',
    brand: 'Stella TV',
    description: 'Más de 500 canales en vivo, deportes en HD, más de 1.000 series y películas. La TV completa.',
    cost_price: 7000, reseller_price: 10000, suggested_price: 15000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#8B5CF6',
    features: ['+500 Canales en Vivo', 'Deportes HD', '+1.000 VOD', 'Win Sports incluido'],
    is_active: true,
  },
  {
    id: 'jf-01',
    name: 'Jellyfin — Cuenta Completa (3 Disp)',
    category: 'IPTV & TV',
    brand: 'Jellyfin',
    description: 'Acceso completo para 3 dispositivos simultáneos. Catálogo premium de series y películas.',
    cost_price: 7000, reseller_price: 10000, suggested_price: 15000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#7C3AED',
    features: ['3 Dispositivos', 'Catálogo Premium', 'Sin Publicidad', 'Calidad 4K'],
    is_active: true,
  },
  {
    id: 'jf-02',
    name: 'Jellyfin — 1 Pantalla',
    category: 'IPTV & TV',
    brand: 'Jellyfin',
    description: '1 Dispositivo para contenido bajo demanda. Series y películas en alta calidad.',
    cost_price: 4000, reseller_price: 6000, suggested_price: 9000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#7C3AED',
    features: ['1 Dispositivo', 'Series & Películas', 'Alta Calidad', 'Económico'],
    is_active: true,
  },
  {
    id: 'jf-03',
    name: 'Jellyfin — 1 Pantalla + Canales',
    category: 'IPTV & TV',
    brand: 'Jellyfin',
    description: '1 Dispositivo con acceso a catálogo completo y canales en vivo. Lo mejor de VOD y TV.',
    cost_price: 7000, reseller_price: 10000, suggested_price: 14000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#7C3AED',
    features: ['1 Dispositivo', 'VOD + Canales Vivo', 'Deportes incluidos', 'Todo en uno'],
    is_active: true,
  },
  {
    id: 'em-01',
    name: 'Emby — 1 Pantalla + 500 Canales',
    category: 'IPTV & TV',
    brand: 'Emby',
    description: '1 Dispositivo con más de 500 canales en vivo. Deportes, noticias y entretenimiento 24/7.',
    cost_price: 8000, reseller_price: 11000, suggested_price: 15000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#52B788',
    features: ['1 Dispositivo', '+500 Canales Vivo', 'Deportes HD', 'Noticias 24/7'],
    is_active: true,
  },
  {
    id: 'em-02',
    name: 'Emby — 1 Pantalla sin Canales',
    category: 'IPTV & TV',
    brand: 'Emby',
    description: '1 Dispositivo para series y películas bajo demanda. Catálogo actualizado constantemente.',
    cost_price: 6000, reseller_price: 9000, suggested_price: 13000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#52B788',
    features: ['1 Dispositivo', 'Solo VOD', 'Catálogo Actualizado', 'Alta Calidad'],
    is_active: true,
  },
  {
    id: 'ip-01',
    name: 'IPTV Premium + Win+ — Cuenta 3 Disp',
    category: 'IPTV & TV',
    brand: 'IPTV Win+',
    description: '3 Dispositivos simultáneos. Incluye Win Sports+ para fútbol colombiano y canales deportivos premium.',
    cost_price: 8500, reseller_price: 12000, suggested_price: 18000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#F97316',
    features: ['3 Dispositivos', 'Win Sports+ incluido', 'Fútbol Colombiano', 'Canales Premium'],
    is_active: true,
  },
  {
    id: 'ip-02',
    name: 'IPTV Premium + Win+ — 1 Dispositivo',
    category: 'IPTV & TV',
    brand: 'IPTV Win+',
    description: '1 Dispositivo con canales deportivos y Win Sports+. La opción económica para amantes del fútbol.',
    cost_price: 3000, reseller_price: 5000, suggested_price: 8000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#F97316',
    features: ['1 Dispositivo', 'Win Sports+', 'Fútbol en Vivo', 'Más Económico'],
    is_active: true,
  },
  {
    id: 'pl-01',
    name: 'Plex — Cuenta Completa (4 Disp)',
    category: 'IPTV & TV',
    brand: 'Plex',
    description: 'Acceso completo 30 días en hasta 4 dispositivos simultáneos. Catálogo amplio con canales.',
    cost_price: 7000, reseller_price: 10000, suggested_price: 15000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#E5A00D',
    features: ['4 Dispositivos', 'Catálogo Completo', 'Canales Incluidos', 'Sin Publicidad Premium'],
    is_active: true,
  },
  {
    id: 'pl-02',
    name: 'Plex — 1 Dispositivo',
    category: 'IPTV & TV',
    brand: 'Plex',
    description: '1 Dispositivo con acceso completo por 30 días. Contenido bajo demanda y entretenimiento.',
    cost_price: 2500, reseller_price: 4000, suggested_price: 7000, duration_days: 30,
    icon_name: 'Tv', brand_color: '#E5A00D',
    features: ['1 Dispositivo', 'Acceso 30 Días', 'Fácil de Usar', 'Económico'],
    is_active: true,
  },

  // ── DISNEY+ ────────────────────────────────────────────────────────────────
  {
    id: 'dp-01',
    name: 'Disney+ Premium + ESPN — 1 Pantalla Original',
    category: 'Streaming',
    brand: 'Disney+',
    description: '1 Pantalla Original con deportes de ESPN e itinerario Premium. Disney, Marvel, Star Wars y más.',
    cost_price: 12000, reseller_price: 16000, suggested_price: 20000, duration_days: 30,
    icon_name: 'Film', brand_color: '#00637C',
    features: ['Pantalla Original', 'ESPN en Vivo', '4K HDR', 'Marvel & Star Wars'],
    is_active: true,
  },
  {
    id: 'dp-02',
    name: 'Disney+ Premium + ESPN — 1 Pantalla',
    category: 'Streaming',
    brand: 'Disney+',
    description: '1 Pantalla en cuenta compartida con acceso a todo el catálogo Premium más ESPN.',
    cost_price: 4500, reseller_price: 7000, suggested_price: 10000, duration_days: 30,
    icon_name: 'Film', brand_color: '#00637C',
    features: ['1 Pantalla', 'ESPN incluido', 'Catálogo Premium', 'Precio accesible'],
    is_active: true,
  },
  {
    id: 'dp-03',
    name: 'Disney+ Estándar — 1 Pantalla',
    category: 'Streaming',
    brand: 'Disney+',
    description: '1 Pantalla en plan estándar. Acceso básico a Disney, Pixar y contenido familiar.',
    cost_price: 2500, reseller_price: 4000, suggested_price: 6000, duration_days: 30,
    icon_name: 'Film', brand_color: '#00637C',
    features: ['1 Pantalla HD', 'Disney & Pixar', 'Más Económico', 'Familiar'],
    is_active: true,
  },
  {
    id: 'dp-04',
    name: 'Disney+ Estándar — Cuenta Completa (6 Perfiles)',
    category: 'Streaming',
    brand: 'Disney+',
    description: 'Cuenta completa de 6 perfiles por 30 días. Ideal para revender múltiples perfiles.',
    cost_price: 7500, reseller_price: 11000, suggested_price: 15000, duration_days: 30,
    icon_name: 'Film', brand_color: '#00637C',
    features: ['6 Perfiles', 'Cuenta Completa', 'Ideal Mayoristas', '30 Días'],
    is_active: true,
  },

  // ── PRIME VIDEO ────────────────────────────────────────────────────────────
  {
    id: 'pv-01',
    name: 'Prime Video — Cuenta Completa (6 Perfiles)',
    category: 'Streaming',
    brand: 'Prime Video',
    description: 'Cuenta completa de 30 días. 6 perfiles disponibles. Catálogo Amazon Originals y más.',
    cost_price: 6500, reseller_price: 10000, suggested_price: 15000, duration_days: 30,
    icon_name: 'Play', brand_color: '#00A8E1',
    features: ['6 Perfiles', 'Amazon Originals', 'Cuenta Completa', '30 Días'],
    is_active: true,
  },
  {
    id: 'pv-02',
    name: 'Prime Video — 1 Pantalla Original',
    category: 'Streaming',
    brand: 'Prime Video',
    description: '1 Pantalla Original en cuenta Amazon. Calidad HD y acceso a Prime Music y Reading.',
    cost_price: 6500, reseller_price: 10000, suggested_price: 14000, duration_days: 30,
    icon_name: 'Play', brand_color: '#00A8E1',
    features: ['Pantalla Original', 'Prime Music', 'HD/4K', 'Prime Reading'],
    is_active: true,
  },
  {
    id: 'pv-03',
    name: 'Prime Video — 1 Pantalla Compartida',
    category: 'Streaming',
    brand: 'Prime Video',
    description: '1 Pantalla en cuenta compartida. La opción más económica para acceder a Prime Video.',
    cost_price: 2000, reseller_price: 3900, suggested_price: 6000, duration_days: 30,
    icon_name: 'Play', brand_color: '#00A8E1',
    features: ['1 Pantalla', 'Acceso Completo', 'Más Económico', 'Entrega rápida'],
    is_active: true,
  },

  // ── HBO MAX ────────────────────────────────────────────────────────────────
  {
    id: 'hbo-01',
    name: 'HBO Max — Cuenta Completa (5 Perfiles)',
    category: 'Streaming',
    brand: 'HBO Max',
    description: 'Cuenta completa 30 días para 5 perfiles. HBO Originals, Warner Bros, DC y más.',
    cost_price: 6500, reseller_price: 10000, suggested_price: 15000, duration_days: 30,
    icon_name: 'Monitor', brand_color: '#7B2FBE',
    features: ['5 Perfiles', 'HBO Originals', 'Warner & DC', '4K HDR'],
    is_active: true,
  },
  {
    id: 'hbo-02',
    name: 'HBO Max — 1 Pantalla',
    category: 'Streaming',
    brand: 'HBO Max',
    description: '1 Pantalla en cuenta compartida. Acceso completo al catálogo HBO Max.',
    cost_price: 2000, reseller_price: 3800, suggested_price: 6000, duration_days: 30,
    icon_name: 'Monitor', brand_color: '#7B2FBE',
    features: ['1 Pantalla', 'Catálogo HBO', 'Precio Mínimo', 'Entrega inmediata'],
    is_active: true,
  },

  // ── PARAMOUNT+ ─────────────────────────────────────────────────────────────
  {
    id: 'pp-01',
    name: 'Paramount+ — Cuenta Completa (6 Perfiles)',
    category: 'Streaming',
    brand: 'Paramount+',
    description: 'Cuenta completa 30 días con 6 perfiles. Series exclusivas, deportes y películas.',
    cost_price: 6500, reseller_price: 10000, suggested_price: 14000, duration_days: 30,
    icon_name: 'Sparkles', brand_color: '#0064FF',
    features: ['6 Perfiles', 'Deportes en Vivo', 'Series Exclusivas', 'Cuenta Completa'],
    is_active: true,
  },
  {
    id: 'pp-02',
    name: 'Paramount+ — 1 Pantalla',
    category: 'Streaming',
    brand: 'Paramount+',
    description: '1 Pantalla en cuenta compartida. Acceso económico a todo Paramount+.',
    cost_price: 1800, reseller_price: 3200, suggested_price: 5000, duration_days: 30,
    icon_name: 'Sparkles', brand_color: '#0064FF',
    features: ['1 Pantalla', 'Catálogo Completo', 'Económico', 'HD'],
    is_active: true,
  },

  // ── CRUNCHYROLL ────────────────────────────────────────────────────────────
  {
    id: 'cr-01',
    name: 'Crunchyroll — Cuenta Completa (4 Disp)',
    category: 'Streaming',
    brand: 'Crunchyroll',
    description: 'Cuenta completa 30 días para anime en 4 dispositivos. Todo el catálogo anime sin restricciones.',
    cost_price: 6500, reseller_price: 10000, suggested_price: 15000, duration_days: 30,
    icon_name: 'Sparkles', brand_color: '#FF6600',
    features: ['4 Dispositivos', 'Anime Completo', 'Simulcast Japonés', 'Sin Anuncios'],
    is_active: true,
  },
  {
    id: 'cr-02',
    name: 'Crunchyroll — 1 Pantalla',
    category: 'Streaming',
    brand: 'Crunchyroll',
    description: '1 Pantalla para anime en HD. Simulcast con Japón y catálogo clásico completo.',
    cost_price: 2200, reseller_price: 4000, suggested_price: 6000, duration_days: 30,
    icon_name: 'Sparkles', brand_color: '#FF6600',
    features: ['1 Pantalla HD', 'Simulcast JP', 'Clásicos Anime', 'Precio Mínimo'],
    is_active: true,
  },

  // ── VIX ────────────────────────────────────────────────────────────────────
  {
    id: 'vx-01',
    name: 'ViX — Cuenta Completa (4 Disp)',
    category: 'Streaming',
    brand: 'ViX',
    description: 'Cuenta completa sin división por perfiles para 4 dispositivos. Contenido latino premium.',
    cost_price: 6500, reseller_price: 10000, suggested_price: 14000, duration_days: 30,
    icon_name: 'Film', brand_color: '#D946EF',
    features: ['4 Dispositivos', 'Contenido Latino', 'Telenovelas', 'Deportes Latino'],
    is_active: true,
  },
  {
    id: 'vx-02',
    name: 'ViX — 1 Dispositivo',
    category: 'Streaming',
    brand: 'ViX',
    description: 'Acceso para 1 dispositivo. Todo el catálogo ViX con contenido en español.',
    cost_price: 2000, reseller_price: 3900, suggested_price: 6000, duration_days: 30,
    icon_name: 'Film', brand_color: '#D946EF',
    features: ['1 Dispositivo', 'Español Completo', 'Novelas & Series', 'Económico'],
    is_active: true,
  },

  // ── MÚSICA & VÍDEO ─────────────────────────────────────────────────────────
  {
    id: 'yt-01',
    name: 'YouTube Premium 30 Días — Sin Anuncios',
    category: 'Música & Vídeo',
    brand: 'YouTube',
    description: 'Suscripción personal 30 días sin anuncios, reproducción en segundo plano e incluye YouTube Music.',
    cost_price: 3500, reseller_price: 6000, suggested_price: 9000, duration_days: 30,
    icon_name: 'Youtube', brand_color: '#FF0000',
    features: ['Sin Publicidad', 'YouTube Music', 'Segundo Plano', 'Tu Correo Google'],
    is_active: true,
  },
  {
    id: 'sp-01',
    name: 'Spotify Personal — 1 Mes',
    category: 'Música & Vídeo',
    brand: 'Spotify',
    description: 'Suscripción Premium individual por 1 mes. Música en 320 kbps sin interrupciones.',
    cost_price: 3500, reseller_price: 6000, suggested_price: 9000, duration_days: 30,
    icon_name: 'Music', brand_color: '#1DB954',
    features: ['Sin Anuncios', '320 kbps', 'Descargas Offline', '1 Dispositivo'],
    is_active: true,
  },
  {
    id: 'sp-02',
    name: 'Spotify Personal — 3 Meses',
    category: 'Música & Vídeo',
    brand: 'Spotify',
    description: 'Suscripción Premium individual garantizada por 3 meses. Ideal para clientes fieles.',
    cost_price: 11000, reseller_price: 16000, suggested_price: 22000, duration_days: 90,
    icon_name: 'Music', brand_color: '#1DB954',
    features: ['3 Meses Garantizados', 'Sin Anuncios', 'Descargas', 'Mayor Valor'],
    is_active: true,
  },
];

// Initial Seed Inventory
// Initial Seed Inventory for all real products
const INITIAL_INVENTORY: InventoryItem[] = [
  // Netflix
  { id: 'inv-nf-01-a', product_id: 'nf-01', email: 'nf.original.vip1@streamresell.com', password: 'NfPass#2026!Orig', profile_pin: '4821', household_code: 'HTV-84920', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-nf-01-b', product_id: 'nf-01', email: 'nf.original.vip2@streamresell.com', password: 'NfPass#2026!Orig', profile_pin: '1904', household_code: 'HTV-31294', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-nf-01-c', product_id: 'nf-01', email: 'nf.original.vip3@streamresell.com', password: 'NfPass#2026!Orig', profile_pin: '7723', household_code: 'HTV-55109', status: 'sold', assigned_to: 'distribuidor-demo', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-nf-02-a', product_id: 'nf-02', email: 'nf.usolibre.01@streamresell.com', password: 'NfLibre#2026!Pass', profile_pin: '1122', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-nf-02-b', product_id: 'nf-02', email: 'nf.usolibre.02@streamresell.com', password: 'NfLibre#2026!Pass', profile_pin: '3344', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-nf-03-a', product_id: 'nf-03', email: 'nf.extra.01@streamresell.com', password: 'NfExtra#2026!Pass', profile_pin: '9081', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-nf-04-a', product_id: 'nf-04', email: 'nf.std.01@streamresell.com', password: 'NfStd#2026!Pass', profile_pin: '5566', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // IPTV / Jellyfin / Emby / Win+
  { id: 'inv-iptv-01-a', product_id: 'iptv-01', email: 'stella.tv.01@streamresell.com', password: 'StellaTV#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-iptv-01-b', product_id: 'iptv-01', email: 'stella.tv.02@streamresell.com', password: 'StellaTV#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-jf-01-a', product_id: 'jf-01', email: 'jellyfin.acc.01@streamresell.com', password: 'Jelly3D#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-jf-02-a', product_id: 'jf-02', email: 'jellyfin.1p.01@streamresell.com', password: 'Jelly1P#2026', profile_pin: '2211', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-jf-03-a', product_id: 'jf-03', email: 'jellyfin.canales.01@streamresell.com', password: 'JellyLive#2026', profile_pin: '7788', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-em-01-a', product_id: 'em-01', email: 'emby.canales.01@streamresell.com', password: 'EmbyLive#2026', profile_pin: '1234', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-em-02-a', product_id: 'em-02', email: 'emby.vod.01@streamresell.com', password: 'EmbyVod#2026', profile_pin: '5678', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-ip-01-a', product_id: 'ip-01', email: 'winplus.3d.01@streamresell.com', password: 'WinPlus3D#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-ip-02-a', product_id: 'ip-02', email: 'winplus.1d.01@streamresell.com', password: 'WinPlus1D#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-pl-01-a', product_id: 'pl-01', email: 'plex.4d.01@streamresell.com', password: 'PlexFull#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-pl-02-a', product_id: 'pl-02', email: 'plex.1d.01@streamresell.com', password: 'Plex1D#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Disney+
  { id: 'inv-dp-01-a', product_id: 'dp-01', email: 'disney.espn.orig1@streamresell.com', password: 'DisneyEspn#2026', profile_pin: '3310', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-dp-02-a', product_id: 'dp-02', email: 'disney.espn.1p1@streamresell.com', password: 'DisneyEspn1P#2026', profile_pin: '8841', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-dp-03-a', product_id: 'dp-03', email: 'disney.std.1p1@streamresell.com', password: 'DisneyStd#2026', profile_pin: '2299', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-dp-04-a', product_id: 'dp-04', email: 'disney.std.full1@streamresell.com', password: 'DisneyFull#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Prime Video
  { id: 'inv-pv-01-a', product_id: 'pv-01', email: 'prime.full.01@streamresell.com', password: 'PrimeFull#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-pv-02-a', product_id: 'pv-02', email: 'prime.orig.01@streamresell.com', password: 'PrimeOrig#2026', profile_pin: '4412', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-pv-03-a', product_id: 'pv-03', email: 'prime.1p.01@streamresell.com', password: 'Prime1P#2026', profile_pin: '9901', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // HBO Max
  { id: 'inv-hbo-01-a', product_id: 'hbo-01', email: 'hbo.full.01@streamresell.com', password: 'HboFull#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-hbo-02-a', product_id: 'hbo-02', email: 'hbo.1p.01@streamresell.com', password: 'Hbo1P#2026', profile_pin: '5029', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Paramount+
  { id: 'inv-pp-01-a', product_id: 'pp-01', email: 'paramount.full.01@streamresell.com', password: 'ParamountFull#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-pp-02-a', product_id: 'pp-02', email: 'paramount.1p.01@streamresell.com', password: 'Paramount1P#2026', profile_pin: '1092', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Crunchyroll
  { id: 'inv-cr-01-a', product_id: 'cr-01', email: 'crunchy.full.01@streamresell.com', password: 'CrunchyFull#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-cr-02-a', product_id: 'cr-02', email: 'crunchy.1p.01@streamresell.com', password: 'Crunchy1P#2026', profile_pin: '7731', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // ViX
  { id: 'inv-vx-01-a', product_id: 'vx-01', email: 'vix.full.01@streamresell.com', password: 'VixFull#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-vx-02-a', product_id: 'vx-02', email: 'vix.1p.01@streamresell.com', password: 'Vix1P#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Música & Vídeo
  { id: 'inv-yt-01-a', product_id: 'yt-01', email: 'yt.premium.01@streamresell.com', password: 'YoutubePro#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-sp-01-a', product_id: 'sp-01', email: 'spotify.1m.01@streamresell.com', password: 'SpotiMusic1M#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'inv-sp-02-a', product_id: 'sp-02', email: 'spotify.3m.01@streamresell.com', password: 'SpotiMusic3M#2026', profile_pin: 'N/A', household_code: 'N/A', status: 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Initial Seed Sales
const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-01',
    seller_id: 'distribuidor-demo',
    inventory_id: 'inv-nf-01-c',
    product_id: 'nf-01',
    product_name: 'Netflix 4K Original — 1 Pantalla',
    product_brand: 'Netflix Original',
    brand_color: '#E50914',
    cost_price: 13000,
    sale_price: 16000,
    suggested_price: 20000,
    profit: 3000,
    account_email: 'nf.original.vip3@streamresell.com',
    account_password: 'NfPass#2026!Orig',
    profile_pin: '7723',
    household_code: 'HTV-55109',
    status: 'active',
    purchased_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 27 * 86400000).toISOString(),
  }
];

// Initial Topups
const INITIAL_TOPUPS: Topup[] = [
  {
    id: 'topup-01',
    seller_id: 'distribuidor-demo',
    seller_name: 'Distribuidora Streaming Colombia SAS (Demo VIP)',
    amount: 250000,
    payment_gateway: 'wompi',
    transaction_id: 'WMP-9842187-TX',
    status: 'approved',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    approved_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  }
];

// Initial Support Tickets
const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'ticket-01',
    sale_id: 'sale-01',
    seller_id: 'distribuidor-demo',
    seller_name: 'Distribuidora Streaming Colombia SAS',
    product_name: 'Netflix 4K Original — 1 Pantalla',
    account_email: 'nf.original.vip3@streamresell.com',
    issue_type: 'caida_clave',
    description: 'Solicitud de verificación de código hogar.',
    status: 'open',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  }
];

export const LOCAL_STORAGE_KEY = 'STREAMRESELL_B2B_DATA_V5_NTO';

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

export const getInitialState = (): AppState => ({
  currentRole: 'seller',
  currentSeller: INITIAL_PROFILES[0],
  profiles: INITIAL_PROFILES,
  products: INITIAL_PRODUCTS,
  inventory: INITIAL_INVENTORY,
  sales: INITIAL_SALES,
  topups: INITIAL_TOPUPS,
  tickets: INITIAL_TICKETS,
  cart: [],
});

export const getStoredData = (): AppState => {
  if (typeof window === 'undefined') {
    return getInitialState();
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw || raw.trim() === '') {
      const initial = getInitialState();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.products) || parsed.products.length === 0) {
      const initial = getInitialState();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Error loading stored state, resetting to initial state:', err);
    const initial = getInitialState();
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    } catch {}
    return initial;
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
