# Bitacora de Cambios — LIVIANAS

> Ultima actualizacion: 2026-03-06
> Branch activo: `main` (merge de `redesign-v2` completado)
> Deploy: https://livianas.com (Vercel)
> Repo: https://github.com/AresE87/Livianas

---

## ESTADO ACTUAL DEL PROYECTO

### Arquitectura General

```
livianas.com (Vercel + Astro 5 SSR)
├── /                       → Landing principal del programa (Circulo LIVIANAS)
├── /materiales             → Tienda digital: Pack Guia + Recetario (USD 15 / UYU 650)
├── /materiales/gracias     → Thank you page (fallback redirect de MP)
├── /pago                   → Checkout del programa principal (MP/PayPal links)
├── /api/create-preference  → Crea preferencia de MP para Checkout Bricks
├── /api/process-payment    → Procesa pago del Brick, guarda en Supabase, envia email
├── /api/webhook/mercadopago→ Webhook IPN de MP (backup de envio de email)
├── /api/send-materiales    → Endpoint legacy de envio de email
├── /api/chat               → Chatbot IA "Livia" (web widget)
├── /api/whatsapp           → Chatbot IA "Livia" (WhatsApp Cloud API)
└── /terminos, /privacidad  → Paginas legales (pendientes de contenido)
```

### Stack Tecnologico

| Capa | Tecnologia | Notas |
|------|-----------|-------|
| Framework | Astro 5 | `output: 'server'`, SSR en Vercel |
| Hosting | Vercel | Auto-deploy desde `main`, dominio `livianas.com` |
| Pagos | Mercado Pago Checkout Bricks | Modal embebido, sin salir del sitio |
| Base de datos | Supabase (PostgreSQL) | Tabla `purchases` para deduplicacion |
| Email transaccional | Resend | Dominio `livianas.com` verificado (DKIM/SPF/DMARC) |
| Chatbot IA | Claude Sonnet (Anthropic) | Widget web + WhatsApp |
| Animaciones | GSAP + ScrollTrigger | Hero cinematografico |
| CSS | Custom properties (design system v3) | Paleta sage/blush/lavender |
| Tipografia | Cormorant Garamond + Plus Jakarta Sans | Google Fonts |

---

## FLUJO DE VENTA AUTOMATIZADA `/materiales`

```
USUARIO                              SISTEMA
  │                                     │
  ├─ Entra a /materiales                │
  │  Ve producto, precio, FAQ           │
  │                                     │
  ├─ Click "Comprar Pack — USD 15"      │
  │  → Se abre modal de checkout        │
  │                                     │
  ├─ PASO 1: Ingresa email ─────────── Se guarda email en variable JS
  │  Click "Continuar al pago"          │
  │                                     │
  │                                  ── POST /api/create-preference { email }
  │                                     │── Crea preferencia en MP API
  │                                     │── external_reference = email
  │                                     │── notification_url = /api/webhook/mercadopago
  │                                     │── Retorna preference_id
  │                                     │
  ├─ PASO 2: Checkout Bricks ──────── MP SDK carga formulario de pago
  │  (tarjeta, debito, transferencia)   │── Brick renderiza dentro del modal
  │  Usuario completa y paga            │
  │                                     │
  │  onSubmit del Brick ────────────── POST /api/process-payment
  │                                     │── Crea pago en MP API (PRICE_UYU=650 server-side)
  │                                     │── Upsert en Supabase (purchases)
  │                                     │── Si approved:
  │                                     │   ├─ UPDATE atomico email_sent=true WHERE false
  │                                     │   ├─ Si claimed → sendMateriales(email) via Resend
  │                                     │   └─ Si ya claimed → skip (dedup)
  │                                     │── Retorna { status: 'approved'|'pending'|'rejected' }
  │                                     │
  ├─ PASO 3: Exito ─────────────────── Modal muestra "Pago confirmado!"
  │  "Te enviamos los materiales a       │── email mostrado en pantalla
  │   tu@email.com"                      │
  │                                     │
  │  [EN PARALELO — BACKUP]             │
  │  MP envia webhook POST ──────────── POST /api/webhook/mercadopago
  │                                     │── Verifica pago via MP API
  │                                     │── Upsert en Supabase
  │                                     │── Dedup atomico (misma logica)
  │                                     │── Si no se envio aun → sendMateriales()
  │                                     │
  └─ Recibe email con PDFs              │
     (Guia + Recetario con botones)     │
```

### Seguridad del flujo

| Proteccion | Implementacion |
|-----------|----------------|
| **Precio server-side** | `process-payment.ts` ignora `transaction_amount` del cliente, siempre usa `PRICE_UYU = 650` |
| **Deduplicacion atomica** | `UPDATE purchases SET email_sent=true WHERE payment_id=X AND email_sent=false` — imposible envio doble |
| **Doble canal** | `process-payment` (primario) + `webhook` (backup) — el email siempre llega |
| **Idempotency key** | `X-Idempotency-Key` en MP API evita cobros duplicados |
| **RLS en Supabase** | Tabla `purchases` solo accesible con `service_role` key, no desde frontend |

---

## VARIABLES DE ENTORNO (Vercel)

### Configuradas ✅

| Variable | Entornos | Descripcion |
|----------|----------|-------------|
| `MERCADOPAGO_ACCESS_TOKEN` | All | Access Token de MP (APP_USR-...) |
| `RESEND_API_KEY` | All | API key de Resend para emails transaccionales |
| `MATERIALES_FROM_EMAIL` | All | Email remitente (ej: hola@livianas.com) |
| `PUBLIC_GUIA_DOWNLOAD_URL` | All | URL publica del PDF de la Guia (Supabase Storage) |
| `PUBLIC_RECETARIO_DOWNLOAD_URL` | All | URL publica del PDF del Recetario |
| `PUBLIC_SUPABASE_URL` | Production | https://rnbyxwcrtulxctplerqs.supabase.co |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Service role key de Supabase (sb_secret_...) |
| `PUBLIC_SITE_URL` | Production | https://livianas.com |
| `PUBLIC_WHATSAPP_NUMBER` | Production | 59891086674 (Ana) |
| `ANTHROPIC_API_KEY` | Production | API key de Anthropic para chatbot Livia |

### Pendientes ⏳

| Variable | Descripcion | Como obtenerla |
|----------|-------------|----------------|
| **`PUBLIC_MP_PUBLIC_KEY`** | Public Key de MP para Checkout Bricks (frontend) | MP Dashboard → Credenciales → Public Key (APP_USR-...) |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel para tracking de conversiones | Meta Business Manager → Events Manager |
| `PUBLIC_GA4_ID` | Google Analytics 4 Measurement ID | Google Analytics → Admin → Data Streams |

---

## BASE DE DATOS (Supabase)

### Proyecto: `anabienestar`
- URL: https://rnbyxwcrtulxctplerqs.supabase.co
- Tabla: `purchases` ✅ Creada

### Esquema `purchases`

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| `id` | UUID (PK) | Auto-generado |
| `payment_id` | TEXT UNIQUE | ID del pago en Mercado Pago |
| `email` | TEXT | Email del comprador |
| `status` | TEXT | approved / pending / rejected / in_process |
| `amount` | NUMERIC(10,2) | Monto cobrado |
| `currency` | TEXT | UYU (default) |
| `payment_method` | TEXT | visa, master, account_money, etc. |
| `email_sent` | BOOLEAN | Flag de deduplicacion (clave) |
| `email_sent_at` | TIMESTAMPTZ | Cuando se envio el email |
| `created_at` | TIMESTAMPTZ | Cuando se creo el registro |
| `updated_at` | TIMESTAMPTZ | Auto-update via trigger |

### Vista `sales_summary`
Dashboard de ventas por dia: total pagos, aprobados, pendientes, rechazados, revenue, emails enviados.

### RLS
- `anon` → sin acceso
- `service_role` → acceso completo

---

## ARCHIVOS CLAVE DEL MODULO MATERIALES

| Archivo | Funcion |
|---------|---------|
| `src/pages/materiales/index.astro` | Pagina de venta con producto, pricing, FAQ, social proof |
| `src/components/CheckoutModal.astro` | Modal de checkout: 4 pasos (email → bricks → exito → error) |
| `src/pages/api/create-preference.ts` | Crea preferencia MP con email como external_reference |
| `src/pages/api/process-payment.ts` | Procesa pago Bricks → Supabase → email (canal primario) |
| `src/pages/api/webhook/mercadopago.ts` | Webhook IPN de MP (canal backup) |
| `src/lib/email/send-materiales.ts` | Template HTML + envio via Resend |
| `src/pages/materiales/gracias.astro` | Thank you page (fallback para redirect de MP) |
| `supabase/migrations/create_purchases_table.sql` | DDL de la tabla purchases + indices + RLS + vista |
| `src/lib/config.ts` | Configuracion central (precios, tracking, WhatsApp, etc.) |

---

## HISTORIAL DE CAMBIOS

### CC-009-CHECKOUT-BRICKS (2026-03-06) — ACTUAL

| Campo | Detalle |
|-------|---------|
| **Fecha** | 2026-03-06 |
| **ID** | CC-009-CHECKOUT-BRICKS |
| **Descripcion** | Reemplazo completo del flujo de pago: de `window.open()` con payment link a Checkout Bricks embebido en modal. Integracion con Supabase para deduplicacion. Security hardening. Merge de redesign-v2 a main. |
| **Cambios principales** | (1) CheckoutModal.astro con 4 pasos UI. (2) API create-preference para MP Checkout Bricks. (3) API process-payment con precio server-side y dedup atomica. (4) Webhook MP actualizado con dedup atomica. (5) Supabase purchases table con RLS. (6) sendMateriales() alias para compatibilidad. (7) Eliminado materiales.astro duplicado. (8) Security: precio forzado server-side, dedup atomica UPDATE WHERE false. |
| **Archivos nuevos** | `CheckoutModal.astro`, `create-preference.ts`, `process-payment.ts`, `create_purchases_table.sql`, `.gitignore` |
| **Archivos modificados** | `webhook/mercadopago.ts`, `send-materiales.ts`, `materiales/index.astro`, `materiales/gracias.astro`, `package.json` |
| **Archivos eliminados** | `src/pages/materiales.astro` (ruta duplicada vieja) |
| **Commits** | `4b5bac9`, `9a6c600` (merge), `f78a128` (security fixes) |
| **Env vars agregadas** | `PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PUBLIC_SITE_URL` |
| **Estado** | Deployado en produccion. Pendiente: `PUBLIC_MP_PUBLIC_KEY` para activar el formulario de pago |

### CC-008-MATERIALES-AUTOMATED-DELIVERY (2026-03-05)

| Campo | Detalle |
|-------|---------|
| **Descripcion** | Pipeline inicial de venta: email collection, MP payment link en nueva pestana, webhook, auto-envio via visibilitychange. SUPERADO por CC-009 (Checkout Bricks). |
| **Estado** | Reemplazado por CC-009 |

### CC-007-CHATBOT-IA (2026-03-02)

| Campo | Detalle |
|-------|---------|
| **Descripcion** | Chatbot IA "Livia" para web y WhatsApp. 6 modulos backend, widget flotante, escalacion automatica a Ana. |
| **Estado** | Implementado. ANTHROPIC_API_KEY configurada en Vercel. Pendiente: WhatsApp Cloud API (Meta Business verification). |

### CC-006-DOMAIN-CONFIG (2026-03-02)

| Campo | Detalle |
|-------|---------|
| **Descripcion** | Dominio livianas.com comprado y configurado en Vercel. WhatsApp real. Fechas de lanzamiento actualizadas. |
| **Estado** | Completado |

### CC-005-PAGO-PAGE-NAV-FIXES (2026-03-02)

| Campo | Detalle |
|-------|---------|
| **Descripcion** | Pagina /pago dedicada, fix de anchors del navbar, boton WhatsApp prominente. |
| **Estado** | Completado |

### CC-004-REDESIGN-V2 (2026-03-01)

| Campo | Detalle |
|-------|---------|
| **Descripcion** | Rediseno visual completo. Paleta sage/blush/lavender. Tipografias premium. Componentes cinematograficos. GSAP. |
| **Estado** | Completado — mergeado a main |

### CC-003-CONTENT-FEEDBACK (2026-03-01)

| Campo | Detalle |
|-------|---------|
| **Descripcion** | Correcciones por feedback de Ana: espiritualidad como pilar, pricing simplificado, emojis→SVG, CTAs actualizados. |
| **Estado** | Completado |

### CC-002-LANDING-OPTIMIZATION (2026-03-01)

| Campo | Detalle |
|-------|---------|
| **Descripcion** | Optimizacion de conversion: 14 secciones, dual CTAs, charm pricing, countdown, value stack, StickyMobileCTA. |
| **Estado** | Completado |

### CC-001-PAYMENTS (2026-02-22)

| Campo | Detalle |
|-------|---------|
| **Descripcion** | Documentacion de pasarelas de pago multiregional. |
| **Estado** | Completado |

---

## PENDIENTES

### CRITICOS — Bloquean la venta

| # | Pendiente | Como hacerlo |
|---|-----------|-------------|
| **PEN-021** | **Agregar `PUBLIC_MP_PUBLIC_KEY` en Vercel** | MP Dashboard → Credenciales → copiar Public Key → Vercel Settings → Env Vars → agregar → Redeploy |
| **PEN-022** | **Registrar webhook en MP Dashboard** | MP Dashboard → Tu app → Webhooks → URL: `https://livianas.com/api/webhook/mercadopago` → Eventos: `payment` |

### ALTOS — Necesarios para operacion completa

| # | Pendiente | Notas |
|---|-----------|-------|
| PEN-023 | Test end-to-end con pago real | Despues de configurar PEN-021/022. Usar tarjeta test de MP. |
| PEN-006 | Meta Pixel ID en Vercel | `PUBLIC_META_PIXEL_ID` — para tracking de conversiones en Meta Ads |
| PEN-007 | GA4 ID en Vercel | `PUBLIC_GA4_ID` — para Google Analytics |

### MEDIOS — Mejoras importantes

| # | Pendiente | Notas |
|---|-----------|-------|
| PEN-001 | Video de Ana | Placeholder actual con icono de play |
| PEN-002 | Foto profesional de Ana | Seccion About Ana |
| PEN-012 | WhatsApp Cloud API (Meta Business) | Para que Livia responda por WhatsApp ademas de web |
| PEN-024 | OG Image para social sharing | Falta `/images/og-image.jpg` (1200x630px) — afecta previews en redes |
| PEN-025 | Paginas /terminos y /privacidad | Rutas existen en footer pero no tienen contenido |

### BAJOS — Nice to have

| # | Pendiente | Notas |
|---|-----------|-------|
| PEN-009 | Testimonios reales | Placeholders actuales. Necesita completar primer grupo |
| PEN-026 | Centralizar precio en config.ts | UYU 650 hardcodeado en 3 archivos (modal, create-preference, process-payment) |

### RESUELTOS ✅

| # | Pendiente | Resolucion |
|---|-----------|-----------|
| ~~PEN-003~~ | Numero WhatsApp | 59891086674 |
| ~~PEN-004~~ | Links de pago | Checkout Bricks embebido |
| ~~PEN-005~~ | Dominio propio | livianas.com |
| ~~PEN-008~~ | Bot de WhatsApp | Chatbot IA Livia (CC-007) |
| ~~PEN-010~~ | Supabase | Tabla purchases configurada |
| ~~PEN-011~~ | ANTHROPIC_API_KEY | Configurada en Vercel |
| ~~PEN-015~~ | DNS Resend | DKIM/SPF/DMARC verificados |
| ~~PEN-016~~ | PDFs hosteados | Supabase Storage bucket publico |
| ~~PEN-017~~ | Webhook MP | /api/webhook/mercadopago con dedup |
| ~~PEN-018~~ | Swap link test | Eliminado — ahora usa Checkout Bricks |
| ~~PEN-020~~ | Error 403 Checkout Pro | Resuelto — migramos a Checkout Bricks |
| ~~PEN-005b~~ | Doble envio de email | Resuelto con dedup atomica en Supabase |
| ~~PEN-005c~~ | Pop-up blocker | Resuelto — checkout es modal, no nueva pestana |

---

## DECISIONES ARQUITECTONICAS

| Decision | Contexto | Resolucion |
|----------|----------|-----------|
| **Checkout Bricks vs Payment Link** | Payment link abria nueva pestana, pop-up blockers, email perdido entre pestanas | Bricks embebido en modal. Email capturado ANTES de pagar. Sin salir del sitio. |
| **Supabase para deduplicacion** | Webhook + process-payment podian enviar email doble | UPDATE atomico `WHERE email_sent=false`. Imposible race condition. |
| **Precio server-side** | Client podia enviar transaction_amount manipulado | `process-payment.ts` siempre usa `PRICE_UYU=650`, ignora el valor del cliente |
| **external_reference = email** | MP no expone email del comprador en webhooks | Email viaja como `external_reference` en la preferencia y el pago |
| **Doble canal de envio** | Si process-payment falla, el email no llega | Webhook como backup. Ambos usan dedup atomica. |
| **Astro output: 'server'** | API routes necesitan SSR | Vercel adapter. Todas las paginas son server-rendered. |
| **Claude Sonnet para chatbot** | Control de costos | ~$5-20/mes. Max 500 tokens. Ventana 10 msgs. |
| **UYU 650 (no USD 15)** | Cuenta MP de Ana esta en pesos uruguayos | Todos los montos en UYU. Frontend muestra USD 15 como referencia. |
