# 🚀 STREAMRESELL B2B — Portal Mayorista de Streaming y Licencias Digitales

Plataforma SaaS B2B completa para mayoristas y distribuidores de cuentas de streaming (Netflix, YouTube Premium, Disney+, Amazon Prime, Spotify, Max HBO, Canva Pro, etc.).

---

## 🛠️ Stack Tecnológico
- **Framework**: Next.js 15 (App Router) + React 19
- **Tipado**: TypeScript
- **Estilos**: Tailwind CSS (Dark Mode Glassmorphism)
- **Iconos**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL + Row Level Security + RPCs Atómicas)
- **Persistencia**: Sincronización híbrida (Supabase Cloud + Local Store reactivo para demo inmediata)

---

## 🌟 Características Implementadas

### 1. 🔒 Landing Page Privada
- Interfaz elegante y oscura sin exposición de productos ni precios a usuarios no autenticados.
- Login y Registro con selector de roles y botones de acceso rápido de prueba.

### 2. 💼 Panel del Vendedor (Seller Dashboard)
- **Header con Saldo en Bolsa**: Saldo en tiempo real con botón de **Recargar Saldo**.
- **Pestaña Catálogo & Carrito**:
  - Grid categorizado de servicios (Perfiles/Pantallas, Cuentas Completas, Combos, Licencias).
  - Indicador de stock en tiempo real.
  - Calculadora de rentabilidad mayorista (Costo distribuidor vs Precio sugerido vs Margen de ganancia %).
  - Carrito flotante lateral con compra atómica y descuento automático de saldo en bolsa.
- **Pestaña Mis Ventas & Entregas**:
  - Cuentas compradas con copia rápida de Correo, Clave y PIN en 1 clic.
  - Contador dinámico de días restantes con barra de estado por colores.
  - Botón interactivo **"Ver Código de Hogar"** (Netflix TV Code Simulator).
  - Botón **"Reportar Falla"** para abrir tickets de garantía en tiempo real.
- **Pestaña Recargas**:
  - Pasarelas simuladas: Wompi, PSE, Bancolombia QR, Binance Pay (USDT).
  - Simulación de Webhook de acreditación automática de saldo en tiempo real.

### 3. 🛡️ Panel del SuperAdmin (Mayorista Master)
- **KPIs Maestros**: Ganancia Pasiva Total acumulada, Saldo total en bolsas de revendedores y Cuentas activas en servicio.
- **Monitor Financiero de Transacciones**: Auditoría exacta: *Usuario X compró Producto Y - Costo Proveedor: $A - Venta Revendedor: $B - Ganancia Pasiva: $C*.
- **Carga Masiva de Inventario**: Modal con importación CSV/Texto o formulario fila por fila con `producto_id`, `email`, `password`, `profile_pin` y `household_code`.
- **Gestión de Soporte & Reasignación Automática**: Triage de tickets con botón de 1-clic para reasignar automáticamente una cuenta nueva desde el stock disponible y cerrar el reporte.

---

## 🗄️ Esquema SQL de Supabase Incluido
El archivo con todo el esquema DDL y funciones RPC está en:
👉 [`supabase/schema.sql`](file:///c:/Users/PC-98541/Downloads/PosiUp/streaming-portal/supabase/schema.sql)

Incluye:
- Tabla `profiles` (id, email, full_name, role, balance)
- Tabla `products` (id, name, category, brand, cost_price, reseller_price, suggested_price, features)
- Tabla `inventory` (id, product_id, email, password, profile_pin, household_code, status)
- Tabla `sales` (id, seller_id, inventory_id, cost_price, sale_price, profit, credentials, expires_at)
- Tabla `topups` (id, seller_id, amount, payment_gateway, transaction_id, status)
- Tabla `support_tickets` (id, sale_id, seller_id, issue_type, status, resolution_notes)
- Políticas de Seguridad RLS (`ROW LEVEL SECURITY`)
- Función RPC atómica PostgreSQL: `purchase_account(p_product_id, p_seller_id)`
- Función RPC de reasignación automática: `reassign_ticket_account(p_ticket_id)`

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:3005
```
