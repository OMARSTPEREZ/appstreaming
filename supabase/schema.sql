-- ==============================================================================
-- SAAS B2B STREAMRESELL - ESQUEMA DE BASE DE DATOS SUPABASE (POSTGRESQL + RLS)
-- ==============================================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA: profiles (Perfiles de revendedores y administradores)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'seller')) DEFAULT 'seller',
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TABLA: products (Catálogo de servicios de streaming y licencias digitales)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Perfiles / Pantallas', 'Cuentas Completas', 'Combos Especiales', 'Licencias Digitales', 'Música y Entretenimiento')),
    brand TEXT NOT NULL,
    description TEXT,
    cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reseller_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    suggested_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    duration_days INTEGER NOT NULL DEFAULT 30,
    icon_name TEXT DEFAULT 'Tv',
    brand_color TEXT DEFAULT '#E50914',
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABLA: inventory (Stock de credenciales y pines ingresados por el mayorista)
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    profile_pin TEXT,
    household_code TEXT DEFAULT 'HTV-' || floor(random() * 90000 + 10000)::text,
    status TEXT NOT NULL CHECK (status IN ('available', 'sold', 'reported', 'expired')) DEFAULT 'available',
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABLA: sales (Compras realizadas por los revendedores)
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    cost_price NUMERIC(12, 2) NOT NULL,
    sale_price NUMERIC(12, 2) NOT NULL,
    suggested_price NUMERIC(12, 2) NOT NULL,
    profit NUMERIC(12, 2) GENERATED ALWAYS AS (sale_price - cost_price) STORED,
    account_email TEXT NOT NULL,
    account_password TEXT NOT NULL,
    profile_pin TEXT,
    household_code TEXT,
    customer_notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'reported', 'expired', 'replaced')) DEFAULT 'active',
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ NOT NULL
);

-- 5. TABLA: topups (Recargas de saldo en bolsa)
CREATE TABLE IF NOT EXISTS public.topups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_gateway TEXT NOT NULL CHECK (payment_gateway IN ('wompi', 'pse', 'bancolombia', 'binance_usdt', 'manual')),
    transaction_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    approved_at TIMESTAMPTZ
);

-- 6. TABLA: support_tickets (Tickets de falla y reasignación de cuentas)
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    issue_type TEXT NOT NULL CHECK (issue_type IN ('caida_clave', 'cambio_pin', 'hogar_bloqueado', 'cuenta_cerrada', 'otro')),
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'in_review', 'resolved', 'rejected')) DEFAULT 'open',
    resolution_notes TEXT,
    replaced_inventory_id UUID REFERENCES public.inventory(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    resolved_at TIMESTAMPTZ
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Helper: Determinar si el usuario es superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'superadmin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Los usuarios pueden ver su propio perfil; el superadmin ve todos
CREATE POLICY "profiles_select" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_superadmin());

CREATE POLICY "profiles_update" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR public.is_superadmin());

-- Products: Todos los usuarios autenticados pueden ver productos activos; superadmin administra
CREATE POLICY "products_select" ON public.products
    FOR SELECT TO authenticated USING (is_active = true OR public.is_superadmin());

CREATE POLICY "products_all_superadmin" ON public.products
    FOR ALL TO authenticated USING (public.is_superadmin());

-- Inventory: Solo superadmin ve inventario completo y no vendido
CREATE POLICY "inventory_superadmin" ON public.inventory
    FOR ALL TO authenticated USING (public.is_superadmin());

-- Sales: Los vendedores ven sus propias ventas; superadmin ve todas
CREATE POLICY "sales_select" ON public.sales
    FOR SELECT TO authenticated USING (seller_id = auth.uid() OR public.is_superadmin());

-- Topups: Los vendedores ven sus recargas; superadmin administra todas
CREATE POLICY "topups_select" ON public.topups
    FOR SELECT TO authenticated USING (seller_id = auth.uid() OR public.is_superadmin());

CREATE POLICY "topups_insert" ON public.topups
    FOR INSERT TO authenticated WITH CHECK (seller_id = auth.uid() OR public.is_superadmin());

CREATE POLICY "topups_update_superadmin" ON public.topups
    FOR UPDATE TO authenticated USING (public.is_superadmin());

-- Support Tickets: Revendedores gestionan sus tickets; superadmin ve y resuelve
CREATE POLICY "tickets_select" ON public.support_tickets
    FOR SELECT TO authenticated USING (seller_id = auth.uid() OR public.is_superadmin());

CREATE POLICY "tickets_insert" ON public.support_tickets
    FOR INSERT TO authenticated WITH CHECK (seller_id = auth.uid());

CREATE POLICY "tickets_all_superadmin" ON public.support_tickets
    FOR ALL TO authenticated USING (public.is_superadmin());

-- ==============================================================================
-- FUNCIÓN RPC ATÓMICA: COMPRA DE CARRITO MULTI-PRODUCTO (TRANSACCIÓN SEGURA)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.purchase_cart(
    p_items JSONB, -- Array de objetos: [{"product_id": "...", "quantity": 2}, ...]
    p_seller_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_seller_balance NUMERIC(12, 2);
    v_total_cost NUMERIC(12, 2) := 0;
    v_item JSONB;
    v_product_id UUID;
    v_quantity INT;
    v_product RECORD;
    v_inventory RECORD;
    v_sale_id UUID;
    v_expires_at TIMESTAMPTZ;
    v_sales_created JSONB := '[]'::JSONB;
    v_inv_ids UUID[] := ARRAY[]::UUID[];
    i INT;
BEGIN
    -- 1. Bloquear y verificar perfil del vendedor
    SELECT balance INTO v_seller_balance 
    FROM public.profiles 
    WHERE id = p_seller_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Vendedor no encontrado';
    END IF;

    -- 2. Calcular costo total y verificar existencia de productos
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_quantity := COALESCE((v_item->>'quantity')::INT, 1);

        SELECT * INTO v_product FROM public.products WHERE id = v_product_id AND is_active = true;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Producto con ID % no encontrado o inactivo', v_product_id;
        END IF;

        v_total_cost := v_total_cost + (v_product.reseller_price * v_quantity);
    END LOOP;

    -- 3. Verificar si el saldo es suficiente
    IF v_seller_balance < v_total_cost THEN
        RAISE EXCEPTION 'Saldo insuficiente en bolsa. Saldo: $% - Requerido: $%', v_seller_balance, v_total_cost;
    END IF;

    -- 4. Procesar cada ítem del carrito con bloqueo de stock
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_quantity := COALESCE((v_item->>'quantity')::INT, 1);
        SELECT * INTO v_product FROM public.products WHERE id = v_product_id;

        FOR i IN 1..v_quantity
        LOOP
            -- Bloquear 1 fila de inventario disponible para este producto
            SELECT * INTO v_inventory 
            FROM public.inventory 
            WHERE product_id = v_product_id 
              AND status = 'available'
              AND NOT (id = ANY(v_inv_ids))
            LIMIT 1 
            FOR UPDATE SKIP LOCKED;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Stock insuficiente para el producto % (% disponibles)', v_product.name, (i - 1);
            END IF;

            v_inv_ids := array_append(v_inv_ids, v_inventory.id);
            v_expires_at := timezone('utc'::text, now()) + (v_product.duration_days || ' days')::INTERVAL;

            -- Marcar inventario como vendido
            UPDATE public.inventory 
            SET status = 'sold',
                assigned_to = p_seller_id,
                updated_at = timezone('utc'::text, now())
            WHERE id = v_inventory.id;

            -- Insertar registro de venta
            INSERT INTO public.sales (
                seller_id, inventory_id, product_id, cost_price, sale_price, suggested_price,
                account_email, account_password, profile_pin, household_code, status, purchased_at, expires_at
            ) VALUES (
                p_seller_id, v_inventory.id, v_product_id, v_product.cost_price, v_product.reseller_price, v_product.suggested_price,
                v_inventory.email, v_inventory.password, v_inventory.profile_pin, v_inventory.household_code, 'active', timezone('utc'::text, now()), v_expires_at
            ) RETURNING id INTO v_sale_id;

            v_sales_created := v_sales_created || jsonb_build_object(
                'sale_id', v_sale_id,
                'product_name', v_product.name,
                'email', v_inventory.email,
                'password', v_inventory.password,
                'profile_pin', v_inventory.profile_pin,
                'household_code', v_inventory.household_code,
                'expires_at', v_expires_at
            );
        END LOOP;
    END LOOP;

    -- 5. Descontar saldo total del vendedor
    UPDATE public.profiles 
    SET balance = balance - v_total_cost,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_seller_id;

    RETURN jsonb_build_object(
        'success', true,
        'total_spent', v_total_cost,
        'remaining_balance', v_seller_balance - v_total_cost,
        'items_count', jsonb_array_length(v_sales_created),
        'sales', v_sales_created
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- FUNCIÓN RPC: CONCILIACIÓN AUTOMÁTICA DE RECARGA WEBHOOK
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.process_webhook_approval(
    p_reference TEXT,
    p_gateway TEXT,
    p_transaction_id TEXT,
    p_amount NUMERIC DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_topup RECORD;
    v_amount NUMERIC(12, 2);
BEGIN
    SELECT * INTO v_topup 
    FROM public.topups 
    WHERE transaction_id = p_reference 
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Recarga no encontrada con referencia ' || p_reference);
    END IF;

    IF v_topup.status = 'approved' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Recarga ya aprobada previamente');
    END IF;

    v_amount := COALESCE(p_amount, v_topup.amount);

    -- Actualizar topup a aprobado
    UPDATE public.topups 
    SET status = 'approved',
        payment_gateway = p_gateway,
        approved_at = timezone('utc'::text, now())
    WHERE id = v_topup.id;

    -- Acreditar saldo en el perfil del revendedor
    UPDATE public.profiles 
    SET balance = balance + v_amount,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_topup.seller_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Saldo acreditado exitosamente',
        'seller_id', v_topup.seller_id,
        'amount_credited', v_amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- FUNCIÓN RPC: REASIGNACIÓN AUTOMÁTICA DE SOPORTE (SUPERADMIN)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.reassign_ticket_account(
    p_ticket_id UUID,
    p_admin_notes TEXT DEFAULT 'Reasignación automática por falla técnica'
)
RETURNS JSONB AS $$
DECLARE
    v_ticket RECORD;
    v_sale RECORD;
    v_new_inventory RECORD;
BEGIN
    -- 1. Obtener ticket
    SELECT * INTO v_ticket FROM public.support_tickets WHERE id = p_ticket_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Ticket no encontrado');
    END IF;

    -- 2. Obtener venta asociada
    SELECT * INTO v_sale FROM public.sales WHERE id = v_ticket.sale_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Venta no encontrada');
    END IF;

    -- 3. Buscar nueva cuenta disponible para el mismo producto
    SELECT * INTO v_new_inventory 
    FROM public.inventory 
    WHERE product_id = v_sale.product_id AND status = 'available' 
    LIMIT 1 
    FOR UPDATE SKIP LOCKED;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'No hay stock de reemplazo disponible para este producto');
    END IF;

    -- 4. Marcar inventario anterior como reported
    UPDATE public.inventory 
    SET status = 'reported', updated_at = timezone('utc'::text, now()) 
    WHERE id = v_sale.inventory_id;

    -- 5. Asignar nuevo inventario
    UPDATE public.inventory 
    SET status = 'sold', assigned_to = v_sale.seller_id, updated_at = timezone('utc'::text, now()) 
    WHERE id = v_new_inventory.id;

    -- 6. Actualizar venta con las nuevas credenciales
    UPDATE public.sales 
    SET inventory_id = v_new_inventory.id,
        account_email = v_new_inventory.email,
        account_password = v_new_inventory.password,
        profile_pin = v_new_inventory.profile_pin,
        household_code = v_new_inventory.household_code,
        status = 'replaced'
    WHERE id = v_sale.id;

    -- 7. Cerrar ticket
    UPDATE public.support_tickets 
    SET status = 'resolved',
        resolution_notes = p_admin_notes,
        replaced_inventory_id = v_new_inventory.id,
        resolved_at = timezone('utc'::text, now())
    WHERE id = p_ticket_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Cuenta reasignada con éxito',
        'new_email', v_new_inventory.email,
        'new_pin', v_new_inventory.profile_pin
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- DATOS INICIALES SEMILLA (SEED DATA)
-- ==============================================================================

INSERT INTO public.products (id, name, category, brand, description, cost_price, reseller_price, suggested_price, duration_days, icon_name, brand_color, features)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Netflix Perfil 4K Ultra HD', 'Perfiles / Pantallas', 'Netflix', 'Perfil privado con PIN exclusivo en cuenta 4K UHD. Con código de hogar garantizado.', 8500, 12000, 18000, 30, 'Tv', '#E50914', ARRAY['4K Ultra HD', '1 Pantalla', 'PIN Personalizado', 'Renovable']),
    ('22222222-2222-2222-2222-222222222222', 'YouTube Premium Sin Anuncios (1 Mes)', 'Cuentas Completas', 'YouTube', 'Membresía individual sin publicidad, descargas y YouTube Music incluido.', 6000, 9500, 16000, 30, 'Youtube', '#FF0000', ARRAY['Sin Publicidad', 'YouTube Music', 'Descarga Offline', 'A tu correo']),
    ('33333333-3333-3333-3333-333333333333', 'Disney+ Premium (Perfil 4K)', 'Perfiles / Pantallas', 'Disney+', 'Incluye ESPN y Star. Perfil individual con PIN en Ultra HD.', 5500, 8900, 15000, 30, 'Film', '#113CCF', ARRAY['Incluye ESPN', 'Calidad 4K', 'Audio Dolby Atmos', 'Garantía Total']),
    ('44444444-4444-4444-4444-444444444444', 'Amazon Prime Video (Cuenta Completa 3P)', 'Cuentas Completas', 'Prime Video', 'Cuenta completa con 3 pantallas en simultáneo y catálogo global.', 7000, 11000, 19000, 30, 'Play', '#00A8E1', ARRAY['3 Pantallas simultáneas', 'Envíos Prime', 'Full HD 1080p', 'Entrega inmediata']),
    ('55555555-5555-5555-5555-555555555555', 'Max (HBO) Platino 4K UHD', 'Perfiles / Pantallas', 'Max', 'Perfil con PIN en plan Platino 4K UHD con catálogo HBO, Warner y Discovery.', 5000, 8000, 14000, 30, 'Sparkles', '#7B2CBF', ARRAY['Plan Platino', '4K UHD & HDR', 'Estrenos HBO', 'Garantía 30 días']),
    ('66666666-6666-6666-6666-666666666666', 'Spotify Premium Individual', 'Música y Entretenimiento', 'Spotify', 'Música sin interrupciones, saltos ilimitados y descarga en alta fidelidad.', 4500, 7500, 13000, 30, 'Music', '#1DB954', ARRAY['Sin Anuncios', 'Offline Audio 320kbps', 'Cuentas Privadas', 'Garantía']),
    ('77777777-7777-7777-7777-777777777777', 'Mega Combo Streaming (Netflix + Disney + Prime)', 'Combos Especiales', 'Combo B2B', 'Pack exclusivo para revendedores con 3 servicios líderes en un solo paquete.', 18000, 26900, 45000, 30, 'Flame', '#F59E0B', ARRAY['3 Servicios Top', 'Ahorro del 25%', 'Alta Demanda', 'Máxima Rentabilidad']),
    ('88888888-8888-8888-8888-888888888888', 'Canva Pro Diseñador (1 Año)', 'Licencias Digitales', 'Canva', 'Licencia educativa/equipo con acceso ilimitado a plantillas, IA y exportación pro.', 12000, 22000, 50000, 365, 'Laptop', '#00C4CC', ARRAY['Licencia 12 Meses', 'Herramientas IA Magic', 'Plantillas Pro Ilimitadas', 'Kit de Marcas'])
ON CONFLICT (id) DO NOTHING;
