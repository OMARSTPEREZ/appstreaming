-- ============================================================
-- MIGRACIÓN: Catálogo Real de Productos N.T.O. - StreamResell
-- Tabla: products
-- Ejecutar en: Supabase SQL Editor
-- Fecha: 2026-09-30
-- ============================================================

-- 1. Asegurar que la columna brand y features existen
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS brand        TEXT,
  ADD COLUMN IF NOT EXISTS brand_color  TEXT,
  ADD COLUMN IF NOT EXISTS icon_name    TEXT,
  ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS features     TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_active    BOOLEAN DEFAULT true;

-- 2. Actualizar el CHECK constraint de categorías para aceptar los nuevos tipos del catálogo real
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check 
  CHECK (category IN ('Streaming', 'IPTV & TV', 'Música & Vídeo', 'Perfiles / Pantallas', 'Cuentas Completas', 'Combos Especiales', 'Licencias Digitales', 'Música y Entretenimiento'));

-- 3. Limpiar productos anteriores de demo (usando casting a text para columnas UUID)
DELETE FROM products WHERE id::text LIKE 'demo-%' OR name ILIKE '%mock%' OR name ILIKE '%demo%';

-- 3. Insertar catálogo real N.T.O.
-- ============================================================
-- Usamos INSERT ... ON CONFLICT (id) DO UPDATE para ser idempotente.
-- Si la tabla no tiene columna 'id' como UUID generado, usar solo INSERT.
-- ============================================================

INSERT INTO products (id, name, category, brand, brand_color, description, cost_price, reseller_price, suggested_price, duration_days, icon_name, features, is_active)
VALUES

-- ── NETFLIX ──────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'Netflix 4K Original — 1 Pantalla',   'Streaming', 'Netflix Original', '#E50914',
 '1 Pantalla Netflix Original con PIN privado. Calidad 4K Ultra HD garantizada.',
 13000, 16000, 20000, 30, 'Tv',
 ARRAY['4K Ultra HD','1 Pantalla con PIN','Cuenta Original','Garantía completa 30d'], true),

(gen_random_uuid(), 'Netflix Uso Libre — 1 Pantalla',      'Streaming', 'Netflix',          '#E50914',
 'Pantalla de uso libre en cuenta compartida. Acceso completo al catálogo Netflix en HD.',
 7000, 9000, 12000, 30, 'Tv',
 ARRAY['Uso Libre','Catálogo Completo','Entrega inmediata','Renovable mensual'], true),

(gen_random_uuid(), 'Netflix Extra — 1 Miembro',           'Streaming', 'Netflix Extra',    '#CC0000',
 'Cupo de miembro extra oficial de Netflix. Acceso independiente a perfil propio.',
 10000, 13000, 16000, 30, 'Tv',
 ARRAY['Miembro Extra Oficial','Perfil Propio','Contraseña Independiente','Alta demanda'], true),

(gen_random_uuid(), 'Netflix Perfil Estándar',             'Streaming', 'Netflix',          '#E50914',
 '1 Perfil en cuenta compartida. Acceso al catálogo Netflix en calidad estándar HD.',
 6000, 8000, 11000, 30, 'Tv',
 ARRAY['Perfil Compartido','Catálogo Netflix HD','Más económico','Entrega inmediata'], true),

-- ── STELLA TV / IPTV ─────────────────────────────────────────────────────────
(gen_random_uuid(), 'Stella TV — Cuenta Completa',                    'IPTV & TV', 'Stella TV',  '#8B5CF6',
 'Más de 500 canales en vivo, deportes en HD, más de 1.000 series y películas.',
 7000, 10000, 15000, 30, 'Tv',
 ARRAY['+500 Canales en Vivo','Deportes HD','+1.000 VOD','Win Sports incluido'], true),

(gen_random_uuid(), 'Jellyfin — Cuenta Completa (3 Disp)',           'IPTV & TV', 'Jellyfin',   '#7C3AED',
 'Acceso completo para 3 dispositivos simultáneos. Catálogo premium de series y películas.',
 7000, 10000, 15000, 30, 'Tv',
 ARRAY['3 Dispositivos','Catálogo Premium','Sin Publicidad','Calidad 4K'], true),

(gen_random_uuid(), 'Jellyfin — 1 Pantalla',                         'IPTV & TV', 'Jellyfin',   '#7C3AED',
 '1 Dispositivo para contenido bajo demanda. Series y películas en alta calidad.',
 4000, 6000, 9000, 30, 'Tv',
 ARRAY['1 Dispositivo','Series & Películas','Alta Calidad','Económico'], true),

(gen_random_uuid(), 'Jellyfin — 1 Pantalla + Canales',               'IPTV & TV', 'Jellyfin',   '#7C3AED',
 '1 Dispositivo con acceso a catálogo completo y canales en vivo.',
 7000, 10000, 14000, 30, 'Tv',
 ARRAY['1 Dispositivo','VOD + Canales Vivo','Deportes incluidos','Todo en uno'], true),

(gen_random_uuid(), 'Emby — 1 Pantalla + 500 Canales',               'IPTV & TV', 'Emby',       '#52B788',
 '1 Dispositivo con más de 500 canales en vivo. Deportes, noticias y entretenimiento 24/7.',
 8000, 11000, 15000, 30, 'Tv',
 ARRAY['1 Dispositivo','+500 Canales Vivo','Deportes HD','Noticias 24/7'], true),

(gen_random_uuid(), 'Emby — 1 Pantalla sin Canales',                 'IPTV & TV', 'Emby',       '#52B788',
 '1 Dispositivo para series y películas bajo demanda.',
 6000, 9000, 13000, 30, 'Tv',
 ARRAY['1 Dispositivo','Solo VOD','Catálogo Actualizado','Alta Calidad'], true),

(gen_random_uuid(), 'IPTV Premium + Win+ — Cuenta 3 Disp',          'IPTV & TV', 'IPTV Win+',  '#F97316',
 '3 Dispositivos simultáneos. Incluye Win Sports+ para fútbol colombiano y canales deportivos.',
 8500, 12000, 18000, 30, 'Tv',
 ARRAY['3 Dispositivos','Win Sports+ incluido','Fútbol Colombiano','Canales Premium'], true),

(gen_random_uuid(), 'IPTV Premium + Win+ — 1 Dispositivo',          'IPTV & TV', 'IPTV Win+',  '#F97316',
 '1 Dispositivo con canales deportivos y Win Sports+.',
 3000, 5000, 8000, 30, 'Tv',
 ARRAY['1 Dispositivo','Win Sports+','Fútbol en Vivo','Más Económico'], true),

(gen_random_uuid(), 'Plex — Cuenta Completa (4 Disp)',               'IPTV & TV', 'Plex',       '#E5A00D',
 'Acceso completo 30 días en hasta 4 dispositivos simultáneos. Catálogo amplio con canales.',
 7000, 10000, 15000, 30, 'Tv',
 ARRAY['4 Dispositivos','Catálogo Completo','Canales Incluidos','Sin Publicidad Premium'], true),

(gen_random_uuid(), 'Plex — 1 Dispositivo',                          'IPTV & TV', 'Plex',       '#E5A00D',
 '1 Dispositivo con acceso completo por 30 días.',
 2500, 4000, 7000, 30, 'Tv',
 ARRAY['1 Dispositivo','Acceso 30 Días','Fácil de Usar','Económico'], true),

-- ── DISNEY+ ──────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'Disney+ Premium + ESPN — 1 Pantalla Original', 'Streaming', 'Disney+', '#00637C',
 '1 Pantalla Original con deportes de ESPN e itinerario Premium. Disney, Marvel, Star Wars.',
 12000, 16000, 20000, 30, 'Film',
 ARRAY['Pantalla Original','ESPN en Vivo','4K HDR','Marvel & Star Wars'], true),

(gen_random_uuid(), 'Disney+ Premium + ESPN — 1 Pantalla',          'Streaming', 'Disney+', '#00637C',
 '1 Pantalla en cuenta compartida con acceso al catálogo Premium más ESPN.',
 4500, 7000, 10000, 30, 'Film',
 ARRAY['1 Pantalla','ESPN incluido','Catálogo Premium','Precio accesible'], true),

(gen_random_uuid(), 'Disney+ Estándar — 1 Pantalla',                'Streaming', 'Disney+', '#00637C',
 '1 Pantalla en plan estándar. Acceso básico a Disney, Pixar y contenido familiar.',
 2500, 4000, 6000, 30, 'Film',
 ARRAY['1 Pantalla HD','Disney & Pixar','Más Económico','Familiar'], true),

(gen_random_uuid(), 'Disney+ Estándar — Cuenta Completa (6 Perfiles)', 'Streaming', 'Disney+', '#00637C',
 'Cuenta completa de 6 perfiles por 30 días. Ideal para revender múltiples perfiles.',
 7500, 11000, 15000, 30, 'Film',
 ARRAY['6 Perfiles','Cuenta Completa','Ideal Mayoristas','30 Días'], true),

-- ── PRIME VIDEO ──────────────────────────────────────────────────────────────
(gen_random_uuid(), 'Prime Video — Cuenta Completa (6 Perfiles)', 'Streaming', 'Prime Video', '#00A8E1',
 'Cuenta completa de 30 días. 6 perfiles disponibles. Catálogo Amazon Originals.',
 6500, 10000, 15000, 30, 'Play',
 ARRAY['6 Perfiles','Amazon Originals','Cuenta Completa','30 Días'], true),

(gen_random_uuid(), 'Prime Video — 1 Pantalla Original',           'Streaming', 'Prime Video', '#00A8E1',
 '1 Pantalla Original en cuenta Amazon. Prime Music y Reading incluidos.',
 6500, 10000, 14000, 30, 'Play',
 ARRAY['Pantalla Original','Prime Music','HD/4K','Prime Reading'], true),

(gen_random_uuid(), 'Prime Video — 1 Pantalla Compartida',         'Streaming', 'Prime Video', '#00A8E1',
 '1 Pantalla en cuenta compartida. La opción más económica para acceder a Prime Video.',
 2000, 3900, 6000, 30, 'Play',
 ARRAY['1 Pantalla','Acceso Completo','Más Económico','Entrega rápida'], true),

-- ── HBO MAX ───────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'HBO Max — Cuenta Completa (5 Perfiles)', 'Streaming', 'HBO Max', '#7B2FBE',
 'Cuenta completa 30 días para 5 perfiles. HBO Originals, Warner Bros, DC y más.',
 6500, 10000, 15000, 30, 'Monitor',
 ARRAY['5 Perfiles','HBO Originals','Warner & DC','4K HDR'], true),

(gen_random_uuid(), 'HBO Max — 1 Pantalla',                   'Streaming', 'HBO Max', '#7B2FBE',
 '1 Pantalla en cuenta compartida. Acceso completo al catálogo HBO Max.',
 2000, 3800, 6000, 30, 'Monitor',
 ARRAY['1 Pantalla','Catálogo HBO','Precio Mínimo','Entrega inmediata'], true),

-- ── PARAMOUNT+ ────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'Paramount+ — Cuenta Completa (6 Perfiles)', 'Streaming', 'Paramount+', '#0064FF',
 'Cuenta completa 30 días con 6 perfiles. Series exclusivas, deportes y películas.',
 6500, 10000, 14000, 30, 'Sparkles',
 ARRAY['6 Perfiles','Deportes en Vivo','Series Exclusivas','Cuenta Completa'], true),

(gen_random_uuid(), 'Paramount+ — 1 Pantalla',                   'Streaming', 'Paramount+', '#0064FF',
 '1 Pantalla en cuenta compartida. Acceso económico a todo Paramount+.',
 1800, 3200, 5000, 30, 'Sparkles',
 ARRAY['1 Pantalla','Catálogo Completo','Económico','HD'], true),

-- ── CRUNCHYROLL ────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'Crunchyroll — Cuenta Completa (4 Disp)', 'Streaming', 'Crunchyroll', '#FF6600',
 'Cuenta completa 30 días para anime en 4 dispositivos. Todo el catálogo sin restricciones.',
 6500, 10000, 15000, 30, 'Sparkles',
 ARRAY['4 Dispositivos','Anime Completo','Simulcast Japonés','Sin Anuncios'], true),

(gen_random_uuid(), 'Crunchyroll — 1 Pantalla',               'Streaming', 'Crunchyroll', '#FF6600',
 '1 Pantalla para anime en HD. Simulcast con Japón y catálogo clásico completo.',
 2200, 4000, 6000, 30, 'Sparkles',
 ARRAY['1 Pantalla HD','Simulcast JP','Clásicos Anime','Precio Mínimo'], true),

-- ── VIX ────────────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'ViX — Cuenta Completa (4 Disp)', 'Streaming', 'ViX', '#D946EF',
 'Cuenta completa sin división por perfiles para 4 dispositivos. Contenido latino premium.',
 6500, 10000, 14000, 30, 'Film',
 ARRAY['4 Dispositivos','Contenido Latino','Telenovelas','Deportes Latino'], true),

(gen_random_uuid(), 'ViX — 1 Dispositivo',            'Streaming', 'ViX', '#D946EF',
 'Acceso para 1 dispositivo. Todo el catálogo ViX con contenido en español.',
 2000, 3900, 6000, 30, 'Film',
 ARRAY['1 Dispositivo','Español Completo','Novelas & Series','Económico'], true),

-- ── MÚSICA & VÍDEO ─────────────────────────────────────────────────────────────
(gen_random_uuid(), 'YouTube Premium 30 Días — Sin Anuncios', 'Música & Vídeo', 'YouTube', '#FF0000',
 'Suscripción personal 30 días sin anuncios. Incluye YouTube Music y reproducción en segundo plano.',
 3500, 6000, 9000, 30, 'Youtube',
 ARRAY['Sin Publicidad','YouTube Music','Segundo Plano','Tu Correo Google'], true),

(gen_random_uuid(), 'Spotify Personal — 1 Mes',               'Música & Vídeo', 'Spotify',  '#1DB954',
 'Suscripción Premium individual por 1 mes. Música en 320 kbps sin interrupciones.',
 3500, 6000, 9000, 30, 'Music',
 ARRAY['Sin Anuncios','320 kbps','Descargas Offline','1 Dispositivo'], true),

(gen_random_uuid(), 'Spotify Personal — 3 Meses',              'Música & Vídeo', 'Spotify',  '#1DB954',
 'Suscripción Premium individual garantizada por 3 meses. Ideal para clientes fieles.',
 11000, 16000, 22000, 90, 'Music',
 ARRAY['3 Meses Garantizados','Sin Anuncios','Descargas','Mayor Valor'], true)

ON CONFLICT DO NOTHING;

-- ============================================================
-- Verificar la inserción
-- ============================================================
SELECT
  name,
  category,
  brand,
  reseller_price,
  suggested_price,
  (suggested_price - reseller_price)                     AS profit,
  ROUND(((suggested_price - reseller_price)::NUMERIC / reseller_price) * 100, 0) AS margin_pct,
  duration_days,
  is_active
FROM products
ORDER BY category, reseller_price DESC;
