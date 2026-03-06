# CONTEXTO: Módulo de Materiales — Venta Autónoma Digital

> Documento de referencia para iterar sobre la pasarela de pagos y el flujo de compra.
> Última actualización: 2026-03-06

---

## 1. VISIÓN DEL MÓDULO

El módulo `/materiales` es la **tienda digital autónoma** de LIVIANAS. Su objetivo es vender productos digitales (PDFs) sin intervención humana: el usuario llega, paga y recibe los materiales automáticamente por email.

### Producto actual
| Producto | Contenido | Precio regular | Precio oferta | Formato |
|----------|-----------|----------------|---------------|---------|
| **Pack Livianas** | Guía Livianas (32 pág) + Recetario Livianas (28 pág) | USD 24 | **USD 15** | PDF descargable |

### Propuesta de valor
- Alimentación antiinflamatoria práctica
- Planificación semanal + lista de compras
- +30 recetas simples (≤20 min)
- Descarga inmediata, sin esperas

---

## 2. ARQUITECTURA TÉCNICA

### Stack
| Capa | Tecnología | Detalle |
|------|-----------|---------|
| **Frontend** | Astro 5 (SSR) | `output: 'server'` con adapter `@astrojs/vercel` |
| **Hosting** | Vercel | Serverless functions para API routes |
| **Pagos** | Mercado Pago | Payment Link estático (no Checkout Pro) |
| **Email** | Resend | API transaccional, dominio `livianas.com` verificado (DKIM, SPF, MX, DMARC) |
| **Storage** | Supabase Storage | Bucket público `materiales` con PDFs |
| **Tracking** | Meta Pixel + GA4 | ViewContent, InitiateCheckout, Purchase |
| **Dominio** | livianas.com | DNS en Vercel |

### Variables de entorno (Vercel)
```
RESEND_API_KEY              → API key de Resend para envío de emails
MATERIALES_FROM_EMAIL       → Remitente (ej: "LIVIANAS <hola@livianas.com>")
MERCADOPAGO_ACCESS_TOKEN    → Token de acceso de MP para verificar pagos via API
PUBLIC_GUIA_DOWNLOAD_URL    → URL del PDF de la Guía en Supabase Storage
PUBLIC_RECETARIO_DOWNLOAD_URL → URL del PDF del Recetario en Supabase Storage
PUBLIC_WHATSAPP_NUMBER      → Número de WhatsApp de Ana
ANTHROPIC_API_KEY           → API key de Claude (para chatbot, no para materiales)
```

---

## 3. FLUJO DE COMPRA ACTUAL (paso a paso)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO ACTUAL DE COMPRA                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USUARIO                              SISTEMA                    │
│    │                                    │                        │
│    ├─ 1. Entra a /materiales            │                        │
│    │     Ve producto, precio,           │                        │
│    │     social proof, FAQ              │                        │
│    │                                    │                        │
│    ├─ 2. Ingresa su EMAIL ───────────── localStorage             │
│    │     (campo obligatorio             │  .setItem(             │
│    │      antes de comprar)             │  'livianas_email')     │
│    │                                    │                        │
│    ├─ 3. Click "Comprar Pack"           │                        │
│    │                                    │                        │
│    │  ┌─ window.open(mpLink) ─────────── MP se abre en           │
│    │  │                                  NUEVA PESTAÑA           │
│    │  │                                    │                     │
│    │  └─ window.location.href ────────── /materiales/gracias     │
│    │     = '/materiales/gracias'          se carga en la         │
│    │                                      pestaña actual         │
│    │                                      (estado: waiting)      │
│    │                                    │                        │
│    ├─ 4. En MP: paga con tarjeta,       │                        │
│    │     débito o transferencia          │                        │
│    │                                    │                        │
│    │  [CANAL BACKUP — Webhook]          │                        │
│    │  MP envía POST ─────────────────── /api/webhook/            │
│    │                                    mercadopago              │
│    │                                    │── Verifica pago        │
│    │                                    │   vía API de MP        │
│    │                                    │── Si approved +        │
│    │                                    │   tiene email →        │
│    │                                    │   envía email          │
│    │                                    │                        │
│    ├─ 5. Vuelve a pestaña /gracias ──── visibilitychange         │
│    │                                    │── POST a               │
│    │                                    │   /api/send-materiales │
│    │                                    │── Envía email con      │
│    │                                    │   links de descarga    │
│    │                                    │                        │
│    ├─ 6. Ve confirmación en pantalla    │                        │
│    │     "Materiales enviados a ..."    │                        │
│    │                                    │                        │
│    └─ 7. Recibe email con botones       │                        │
│          de descarga (Guía + Recetario) │                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Detalle de cada paso:

**Paso 1 — Landing `/materiales`**
- Página independiente (sin navbar del sitio principal)
- Secciones: Header → Product Card → Content Preview → Steps → FAQ → Trust → Help (WhatsApp)
- Social proof: "+200 mujeres ya descargaron el pack"
- Badge: "OFERTA DE LANZAMIENTO -38%"

**Paso 2 — Captura de email**
- Campo `<input type="email">` obligatorio DENTRO de la product card
- Se guarda en `localStorage` con key `livianas_email` + timestamp
- Esto soluciona que **MP Payment Links no exponen el email del comprador**

**Paso 3 — Redirección dual**
- `window.open(mpLink, '_blank')` → abre MP en nueva pestaña
- `window.location.href = '/materiales/gracias'` → redirige la pestaña actual
- ⚠️ PROBLEMA: `window.open()` puede ser bloqueado por pop-up blockers

**Paso 4 — Pago en Mercado Pago**
- Actualmente usa un **Payment Link estático**: `https://mpago.la/2v6mMqJ`
- ⚠️ Es el link de TEST (10 pesos). El de producción está comentado en el código
- El payment link NO permite pasar `external_reference` ni `notification_url` custom
- Medios: tarjeta crédito, débito, transferencia

**Paso 5 — Envío automático al volver**
- `visibilitychange` event detecta cuando el usuario vuelve a la pestaña
- Llama a `POST /api/send-materiales` con el email de localStorage
- Tiene timeout de 3 segundos si la pestaña ya estaba visible
- ⚠️ Asume que si el usuario volvió, ya pagó (no verifica pago)

**Paso 6-7 — Confirmación + Email**
- Pantalla de gracias con descarga directa (si hay URLs configuradas)
- Email branded con botones "Descargar Guía" y "Descargar Recetario"
- Fallback: formulario manual de email si no hay dato en localStorage

---

## 4. ARCHIVOS DEL MÓDULO

```
livianas-landing/
├── src/
│   ├── pages/
│   │   ├── materiales/
│   │   │   ├── index.astro          ← Landing de venta (producto, pricing, CTA)
│   │   │   └── gracias.astro        ← Thank you page (descarga + envío email)
│   │   └── api/
│   │       ├── send-materiales.ts   ← Endpoint POST para enviar email desde /gracias
│   │       └── webhook/
│   │           └── mercadopago.ts   ← Webhook IPN de MP (backup de envío)
│   └── lib/
│       └── email/
│           └── send-materiales.ts   ← Template de email HTML + función de envío via Resend
├── astro.config.mjs                 ← output: 'server', adapter: vercel()
└── package.json                     ← Deps: resend, @astrojs/vercel
```

---

## 5. PROBLEMAS ACTUALES Y FRICCIÓN EN EL FLUJO

### 🔴 Críticos (bloquean lanzamiento)

| # | Problema | Impacto | Detalle |
|---|---------|---------|---------|
| 1 | **Link de MP es de TEST** | No se puede vender | Línea 7 de `materiales/index.astro`: usa `mpago.la/2v6mMqJ` (10 pesos). El link de producción está comentado. |
| 2 | **No hay verificación de pago** | Se envían materiales sin confirmar pago | El flujo de `/gracias` envía email cuando el usuario vuelve a la pestaña, SIN verificar con MP si realmente pagó. |
| 3 | **Test end-to-end pendiente** | No se sabe si el flujo completo funciona | Nunca se hizo una compra real de punta a punta. |

### 🟡 Importantes (afectan UX y confiabilidad)

| # | Problema | Impacto | Detalle |
|---|---------|---------|---------|
| 4 | **Pop-up blocker** | El link de MP no se abre | `window.open()` es bloqueado por muchos navegadores. El usuario no ve el checkout. |
| 5 | **Doble envío de email** | Usuario recibe 2 emails | Si el webhook Y la página gracias disparan, se envían 2 emails idénticos. No hay deduplicación. |
| 6 | **Email en localStorage** | Se pierde si cambian de dispositivo | Si el usuario empieza en celular y paga en desktop (o viceversa), el email no está disponible. |
| 7 | **Payment Link estático** | No se puede personalizar | No permite pasar metadata (email, ID de compra), ni configurar `notification_url` custom, ni webhooks específicos. |
| 8 | **Checkout Pro da 403** | No se puede usar Checkout Pro API | El token de MP devuelve `PA_UNAUTHORIZED` al crear preferencias. Se necesita investigar permisos. |

### 🟢 Mejoras deseables

| # | Mejora | Beneficio |
|---|--------|-----------|
| 9 | Checkout embebido (sin salir del sitio) | Menos fricción, más conversión |
| 10 | Confirmar pago antes de enviar materiales | Evita envíos sin pago |
| 11 | Dashboard de ventas básico | Saber cuánto se vendió |
| 12 | Deduplicación de emails (Supabase o Vercel KV) | Evitar spam al comprador |
| 13 | Tracking de conversión más preciso | Saber si `Purchase` event corresponde a pago real |

---

## 6. PASARELA DE PAGOS — ESTADO ACTUAL DE MERCADO PAGO

### Lo que se usa hoy: Payment Link
- URL estática generada desde el dashboard de MP
- Ventaja: fácil de crear, no requiere código
- Desventaja: no permite pasar datos custom, no se puede personalizar UX, redirect limitado

### Lo que se intentó: Checkout Pro (API)
- Se intentó crear preferencias vía `POST https://api.mercadopago.com/checkout/preferences`
- Error: **403 PA_UNAUTHORIZED**
- Posibles causas:
  - Token sin permisos suficientes (verificar en dashboard de MP → Credenciales)
  - Cuenta no tiene Checkout Pro habilitado
  - Se necesita un token de tipo "Access Token de producción" (no de test)

### Opciones de integración con MP:

| Método | Complejidad | Control | Ventajas | Desventajas |
|--------|------------|---------|----------|-------------|
| **Payment Link** (actual) | Baja | Nulo | Funciona ya | Sin metadata, sin webhook custom, sin redirect custom |
| **Checkout Pro** | Media | Alto | `external_reference`, `notification_url`, `back_urls`, metadata | Necesita resolver 403. Redirige a MP pero vuelve al sitio |
| **Checkout Bricks** | Alta | Máximo | Embebido en el sitio, tarjeta sin salir | Requiere más desarrollo frontend + backend |
| **Payment Link + MP API** | Baja-Media | Medio | Usar payment link pero verificar con API después | Workaround, no es ideal |

---

## 7. IDEAS PARA MEJORAR LA PASARELA

### Opción A: Resolver Checkout Pro (recomendada)
```
1. Verificar credenciales de MP (token de producción vs test)
2. Crear preferencia con:
   - external_reference: "materiales_{email}"
   - notification_url: "https://livianas.com/api/webhook/mercadopago"
   - back_urls.success: "https://livianas.com/materiales/gracias?payment_id={id}"
   - back_urls.failure: "https://livianas.com/materiales?status=failed"
3. Redirigir al usuario al init_point de la preferencia
4. Al volver con ?payment_id, verificar con API antes de enviar email
```

**Ventajas**: Control total del flujo. El email del comprador va en `external_reference`. Se puede verificar pago antes de entregar materiales.

### Opción B: Checkout Bricks (máxima conversión)
```
1. Integrar el Brick de pagos embebido en /materiales
2. El usuario paga sin salir del sitio
3. Callback JS confirma pago → envía email inmediatamente
4. No hay redirección, no hay pop-up, no hay pestaña nueva
```

**Ventajas**: 0 fricción. Todo pasa en la misma página. Máxima conversión.
**Desventajas**: Más desarrollo. Requiere manejar SDK de MP en frontend.

### Opción C: Mantener Payment Link + Mejoras
```
1. Cambiar window.open() por <a target="_blank"> (evita pop-up block)
2. Agregar polling en /gracias que consulta un endpoint propio
   para verificar si el pago fue procesado (via webhook)
3. Solo enviar email después de confirmación del webhook
```

**Ventajas**: Mínimo cambio. Rápido de implementar.
**Desventajas**: Sigue dependiendo de payment link estático. No tiene back_urls.

---

## 8. FLUJO IDEAL (target)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO IDEAL DE COMPRA                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Usuario llega a /materiales                                  │
│  2. Ve el producto, precio, social proof                         │
│  3. Ingresa email + click "Comprar"                              │
│  4. Checkout embebido O redirect controlado a MP                 │
│     ├─ Se pasa email como external_reference                     │
│     └─ Se configura back_url de retorno                          │
│  5. Usuario paga                                                 │
│  6. MP notifica vía webhook → backend verifica pago              │
│  7. Backend confirma pago → envía email con materiales           │
│  8. Usuario vuelve a /materiales/gracias?status=approved         │
│     ├─ Si ya se envió email → muestra "Revisá tu casilla"        │
│     └─ Si no se envió → dispara envío (con verificación)         │
│  9. Tracking: Purchase event solo si pago verificado             │
│                                                                  │
│  DIFERENCIAS CLAVE vs flujo actual:                              │
│  ✅ El pago se VERIFICA antes de entregar materiales             │
│  ✅ No hay pop-up blocker (redirect nativo o embebido)           │
│  ✅ El email viaja como metadata del pago (no solo localStorage) │
│  ✅ Deduplicación de envíos (flag en DB o KV)                    │
│  ✅ Purchase event solo se trackea si el pago es real            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. DATOS PARA EXPLORAR ALTERNATIVAS

### Mercado Pago — URLs de API
```
Crear preferencia:  POST https://api.mercadopago.com/checkout/preferences
Consultar pago:     GET  https://api.mercadopago.com/v1/payments/{id}
Buscar pagos:       GET  https://api.mercadopago.com/v1/payments/search
Webhook docs:       https://www.mercadopago.com.uy/developers/es/docs/your-integrations/notifications/webhooks
Checkout Bricks:    https://www.mercadopago.com.uy/developers/es/docs/checkout-bricks/landing
```

### Resend — Datos de integración
```
SDK: resend (v6.9.3)
From: LIVIANAS <hola@livianas.com>
DNS verificado: DKIM + SPF + MX + DMARC en livianas.com
```

### Supabase Storage — PDFs
```
Bucket: materiales (público)
Archivos: guia-livianas.pdf, recetario-livianas.pdf
URLs: Configuradas en env vars PUBLIC_GUIA_DOWNLOAD_URL y PUBLIC_RECETARIO_DOWNLOAD_URL
```

---

## 10. DECISIONES PENDIENTES

| # | Decisión | Opciones | Recomendación |
|---|---------|----------|---------------|
| 1 | Método de checkout | Payment Link / Checkout Pro / Bricks | Checkout Pro si se resuelve 403, Bricks para máxima conversión |
| 2 | Verificación de pago | Client-side (actual) / Webhook + polling / Webhook only | Webhook + polling es lo más robusto |
| 3 | Deduplicación de emails | Ninguna (actual) / Supabase flag / Vercel KV | Supabase ya está en el stack |
| 4 | Almacenamiento de email del comprador | localStorage (actual) / URL params / external_reference MP | external_reference es lo más confiable |
| 5 | Medio de pago adicional | Solo MP / MP + PayPal / MP + Stripe | MP cubre UY/LATAM; PayPal para internacional si hay demanda |
| 6 | Redirect vs embebido | Redirect a MP (actual) / Embebido en sitio | Embebido es mejor UX pero más desarrollo |

---

## 11. CONTEXTO DE NEGOCIO

- **Público objetivo**: Mujeres de Uruguay y LATAM
- **Precio del pack**: USD 15 (oferta de lanzamiento, regular USD 24)
- **Producto principal**: Programa grupal LIVIANAS (USD 297) — los materiales son un producto de entrada / lead magnet premium
- **WhatsApp de Ana**: +598 91 086 674
- **Sitio en producción**: https://livianas.com
- **Rama activa**: `redesign-v2` (Vercel deploya desde aquí)
- **Fecha de lanzamiento del programa**: 11 de abril de 2026
- **Cierre de inscripciones**: 8 de abril de 2026
