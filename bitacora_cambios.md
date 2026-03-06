# Bitácora de Cambios — LIVIANAS

---

## CC-001-PAYMENTS

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-02-22 |
| **ID de Cambio** | CC-001-PAYMENTS |
| **Descripción** | Actualización de pasarelas de pago para soporte multiregional (UY/LATAM/INT). Se reemplazó la referencia a "MercadoPago/Stripe" por tres pasarelas validadas: Mercado Pago (Uruguay), dLocal Go (LATAM) y PayPal (Internacional). Se agregó fila en la tabla de Stack con detalle de integración vía SDK/Webhooks. |
| **Archivos afectados** | `arquitectura_tecnica_livianas.md` (secciones 1.1 y 8.4) |
| **Impacto** | Alta viabilidad de cobro en Uruguay y resto de Latinoamérica sin depender de Stripe Atlas. Cobertura internacional via PayPal. |
| **Estado** | Aplicado |

---

## CC-002-LANDING-OPTIMIZATION

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-01 |
| **ID de Cambio** | CC-002-LANDING-OPTIMIZATION |
| **Descripción** | Optimización completa de conversión de la landing page. Incluye: reorden del flujo de 14 secciones, dual CTAs (pago directo + WhatsApp bot), charm pricing (USD 297 vs USD 450 tachado), countdown timers reutilizables, value stack simplificado, MiniPricing en posición 6, StickyMobileCTA para mobile, ParaQuienEs reemplazando testimonios vacíos. |
| **Archivos afectados** | 5 componentes nuevos (`CountdownTimer`, `PaymentButtons`, `MiniPricing`, `StickyMobileCTA`, `ParaQuienEs`), 10 componentes actualizados, `config.ts`, `global.css`, `index.astro` |
| **Commits** | `544841c`, `0531dd0`, `95309cf`, `cb80930` |
| **Impacto** | Landing optimizada para conversión con múltiples puntos de captura, urgencia y anclaje de precio. |
| **Estado** | Aplicado |

---

## CC-003-CONTENT-FEEDBACK

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-01 |
| **ID de Cambio** | CC-003-CONTENT-FEEDBACK |
| **Descripción** | Correcciones por feedback directo de Ana: (1) Desenfatizar ejercicio y agregar espiritualidad como pilar central en semanas 2-3, includes y pricing. (2) Value stack: eliminar desglose itemizado de USD 1050, mostrar USD 450 tachado rojo → USD 297. (3) Eliminar "personalizable" (es grupal). (4) Botón oculto de WhatsApp directo a Ana en última FAQ para prospectos de alto valor. (5) Emojis de PainPoints reemplazados por SVG icons elegantes. (6) CTAs cambiados de "Hablar con Ana" a "Quiero saber más" (van al bot). (7) Placeholder visual de video con ícono de play en VideoAna. |
| **Archivos afectados** | `config.ts`, `Pricing.astro`, `FAQ.astro`, `PainPoints.astro`, `MiniPricing.astro`, `FinalCTA.astro`, `VideoAna.astro` |
| **Commits** | `355efe8` |
| **Impacto** | Contenido alineado con la visión de Ana. Espiritualidad como pilar central. Pricing menos intimidante. Estrategia de bot vs contacto directo con Ana bien diferenciada. |
| **Estado** | Aplicado |

---

## CC-004-REDESIGN-V2

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-01 |
| **ID de Cambio** | CC-004-REDESIGN-V2 |
| **Descripción** | Rediseño completo visual en rama `redesign-v2`. Paleta femenina sage/blush/lavender. Nuevo sistema de diseño con CSS custom properties. Tipografías Cormorant Garamond + Plus Jakarta Sans. Componentes cinematográficos: `CinematicHero`, `Features`, `Manifesto`, `ProgramArchive`, `PremiumAboutAna`, `PremiumPricing`, `PremiumFAQ`, `PremiumFinalCTA`, `PremiumFooter`. Animaciones GSAP en hero. |
| **Archivos afectados** | `global.css` (design system v3), 10+ componentes nuevos/actualizados, `Layout.astro`, `index.astro` |
| **Commits** | `cf93e0f`, `bca9720` |
| **Impacto** | Identidad visual profesional y femenina. Diseño orgánico y cálido alineado con el público objetivo. |
| **Estado** | Aplicado |

---

## CC-005-PAGO-PAGE-NAV-FIXES

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-02 |
| **ID de Cambio** | CC-005-PAGO-PAGE-NAV-FIXES |
| **Descripción** | (1) Página `/pago` — checkout dedicado con selector MercadoPago/PayPal, garantía, WhatsApp de ayuda. (2) Fix de anchors del navbar: `#metodo` → VideoAna, `#programa` → ProgramArchive, `#precio` → PremiumPricing. (3) Botón WhatsApp prominente en `/pago` (verde, con ícono WP). (4) Texto de ayuda: "¿Tenés dudas o complicaciones con el pago?". (5) Eliminado botón secundario "Quiero saber más" del hero (mandaba a WP antes de ver la landing). |
| **Archivos afectados** | `pago.astro`, `VideoAna.astro` (id→metodo), `ProgramArchive.astro` (id→programa), `CinematicHero.astro` |
| **Commits** | `dcae50d`, `6e9a87a` |
| **Impacto** | Flujo de pago separado. Navegación interna funcional. UX mejorada para no perder visitantes antes de ver el contenido. |
| **Estado** | Aplicado |

---

## CC-006-DOMAIN-CONFIG

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-02 |
| **ID de Cambio** | CC-006-DOMAIN-CONFIG |
| **Descripción** | Dominio `livianas.com` comprado y configurado en Vercel. Rama `redesign-v2` desplegada a producción. Número de WhatsApp real (59891086674) configurado tanto en `.env` como variable de entorno en Vercel. Fecha de lanzamiento actualizada al 11 de abril de 2026 (cierre de inscripciones: 8 de abril). |
| **Archivos afectados** | `.env`, `config.ts` (fechas + WP fallback), Vercel env vars |
| **Commits** | `3a67ef7` |
| **Impacto** | Sitio en producción en livianas.com. Datos reales de contacto y fechas. |
| **Estado** | Aplicado |

---

## CC-007-CHATBOT-IA

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-02 |
| **ID de Cambio** | CC-007-CHATBOT-IA |
| **Descripción** | Chatbot IA conversacional "Livia" para web y WhatsApp. Arquitectura completa: (1) **Backend IA** — 6 módulos en `src/lib/chatbot/`: system-prompt (construye contexto desde config.ts con FAQ, precios, programa), ai-client (Claude Sonnet, max 500 tokens), sessions (memoria en RAM, TTL 30min, max 20 msgs), rate-limiter (sliding window 20/min web, 10/min WP), escalation (detección de keywords clínicos, pagos, pedidos explícitos de Ana), whatsapp-api (Cloud API helpers). (2) **API Routes** — `POST /api/chat` (widget web, CORS, rate limiting), `GET/POST /api/whatsapp` (webhook Meta, verificación + mensajes entrantes). (3) **ChatWidget.astro** — burbuja flotante sage al lado del botón WP, panel de chat 380x520px (fullscreen mobile), header con avatar "L", mensaje de bienvenida, 3 sugerencias rápidas (Programa, Precio, Fechas), indicador "escribiendo..." animado, URLs clickeables en respuestas, cierre con X o Escape. (4) **Infraestructura** — Astro adapter Vercel para server functions, `@anthropic-ai/sdk` como dependencia. |
| **Archivos nuevos** | `src/lib/chatbot/system-prompt.ts`, `src/lib/chatbot/ai-client.ts`, `src/lib/chatbot/sessions.ts`, `src/lib/chatbot/rate-limiter.ts`, `src/lib/chatbot/escalation.ts`, `src/lib/chatbot/whatsapp-api.ts`, `src/pages/api/chat.ts`, `src/pages/api/whatsapp.ts`, `src/components/ChatWidget.astro` |
| **Archivos modificados** | `astro.config.mjs` (adapter Vercel), `package.json` (+2 deps), `index.astro` (+ChatWidget), `.env` (+4 vars chatbot) |
| **Impacto** | Atención 24/7 automatizada. Livia responde preguntas sobre el programa, precios, fechas usando IA. Escala a Ana automáticamente para temas clínicos, de pago o por pedido explícito. Reduce carga de Ana para consultas repetitivas. |
| **Estado** | Implementado — Pendiente: configurar ANTHROPIC_API_KEY en Vercel para activar IA |

---

## CC-008-MATERIALES-AUTOMATED-DELIVERY

| Campo | Detalle |
|---|---|
| **Fecha** | 2026-03-05 |
| **ID de Cambio** | CC-008-MATERIALES-AUTOMATED-DELIVERY |
| **Descripción** | Pipeline automatizado completo de venta digital: pago → email con materiales PDF. Incluye: (1) **DNS + Resend verificado** — 4 registros DNS (DKIM, SPF, MX, DMARC) en Vercel para `livianas.com`, dominio verificado en Resend. (2) **Supabase Storage** — PDFs alojados en bucket público `materiales` (guia + recetario). (3) **Mercado Pago webhook** — `POST /api/webhook/mercadopago` recibe IPN, verifica pago vía API de MP, envía email si `approved`. (4) **Flujo de email collection** — Campo de email obligatorio en `/materiales` ANTES de redirigir a MP (soluciona que MP payment links no exponen email del comprador). Email guardado en localStorage. (5) **Auto-envío en /gracias** — Al volver de la pestaña de MP, `visibilitychange` dispara automáticamente el envío via `/api/send-materiales`. Fallback: formulario manual si no hay email en localStorage. (6) **Email branded** — Template HTML con botones de descarga para Guía y Recetario, next steps, link a WhatsApp. |
| **Archivos nuevos** | `src/pages/api/send-materiales.ts`, `src/lib/email/send-materiales.ts` |
| **Archivos modificados** | `astro.config.mjs` (`output: 'server'`), `src/pages/api/webhook/mercadopago.ts` (200 en errores, fallback email desde `external_reference`), `src/pages/materiales/index.astro` (email input + localStorage + MP en nueva pestaña), `src/pages/materiales/gracias.astro` (auto-send + visibilitychange + manual fallback) |
| **Commits** | `64ab17d`, `fe781a4`, `f691afc`, `1d472e7`, `8f0d612`, `ad37856` |
| **Variables de entorno (Vercel)** | `RESEND_API_KEY`, `MATERIALES_FROM_EMAIL`, `MERCADOPAGO_ACCESS_TOKEN`, `PUBLIC_GUIA_DOWNLOAD_URL`, `PUBLIC_RECETARIO_DOWNLOAD_URL` |
| **Impacto** | Venta 100% automatizada: usuario paga → recibe materiales por email sin intervención manual. |
| **Estado** | Desplegado en producción — Pendiente: test end-to-end con pago real + swap link test por link prod |

### Estado actual del flujo `/materiales` (2026-03-05)

```
USUARIO                          SISTEMA
  │                                 │
  ├─ Entra a /materiales            │
  │  Ve producto + precio           │
  │                                 │
  ├─ Ingresa email ──────────────── localStorage.setItem('livianas_email')
  ├─ Click "Comprar Pack"           │
  │                                 │
  ├─ MP se abre en NUEVA PESTAÑA    │
  ├─ /materiales/gracias se carga ──│── Muestra "Completá tu pago en MP..."
  │  en pestaña actual              │   (estado: waiting)
  │                                 │
  ├─ Paga en MP ────────────────── MP envía webhook POST
  │                                 │── /api/webhook/mercadopago verifica pago
  │                                 │── Si approved + tiene email → envía email (backup)
  │                                 │
  ├─ Vuelve a pestaña /gracias ──── visibilitychange event
  │                                 │── /api/send-materiales envía email (primario)
  │                                 │── Muestra "Materiales enviados a tu@email.com"
  │                                 │
  └─ Recibe email con PDFs          │
```

### Cosas pendientes para esta feature

| # | Pendiente | Prioridad |
|---|---|---|
| 1 | **Swap link test → producción**: Cambiar `https://mpago.la/2v6mMqJ` (10 pesos test) por el link real de USD 15 en `src/pages/materiales/index.astro` línea 7 | **ALTA — antes de lanzar** |
| 2 | **Test end-to-end con pago real**: Hacer una compra completa y verificar que el email llega con los links de descarga | Alta |
| 3 | **Verificar PDFs en Supabase**: Confirmar que ambos links de descarga funcionan (guía + recetario) | Alta |
| 4 | **Checkout Pro 403**: El token de MP da error 403 (PA_UNAUTHORIZED) al crear preferencias de Checkout Pro. Por ahora se usa payment link estático. Investigar si se necesita activar Checkout Pro en el dashboard de MP o si el token necesita más permisos | Media |
| 5 | **Doble envío**: Si el webhook Y la página gracias envían, el usuario recibe 2 emails. Considerar deduplicación (ej: flag en Supabase o Vercel KV) | Baja |
| 6 | **Pop-up blocker**: `window.open()` puede ser bloqueado por el navegador. Si eso pasa, el link de MP no se abre. Considerar fallback con `<a target="_blank">` | Media |

---

## DECISIONES ARQUITECTÓNICAS

| Decisión | Contexto | Resolución |
|---|---|---|
| **Astro output: 'server'** | API routes (webhook, email, chat) necesitan server-side rendering. | Se cambió a `output: 'server'` con `@astrojs/vercel` adapter. Todas las páginas se renderizan en el server salvo las que tengan `prerender = true`. |
| **Claude Sonnet (no Opus)** | Control de costos del chatbot. | Sonnet es rápido y económico (~$5-20/mes para 50 conv/día). Max 500 tokens por respuesta. Ventana de 10 mensajes. |
| **Sesiones en memoria (no DB)** | Simplicidad para MVP. | `Map<string, Session>` con TTL 30min. Suficiente para Vercel serverless (se pierde entre cold starts, aceptable para chat). |
| **Escalación por keywords** | Proteger usuarios vulnerables. | Lista de keywords clínicos (anorexia, depresión, autolesión) + pagos + pedidos explícitos. Respuesta empática + link directo a Ana. |
| **Widget flotante vs página dedicada** | UX accesible sin interrumpir flujo. | Burbuja flotante (sage) al lado del botón WP (verde). Panel overlay. No hay página /chat separada. |
| **WhatsApp Cloud API (no ManyChat)** | Control total, sin vendor lock-in. | API directa de Meta. Mismo backend IA que el widget web. Requiere verificación de Meta Business. |

---

## PENDIENTES

| ID | Descripción | Prioridad | Dependencia |
|---|---|---|---|
| PEN-001 | Video de Ana presentando el método | Alta | Ana debe grabarlo |
| PEN-002 | Foto profesional de Ana | Alta | Ana debe proveerla |
| ~~PEN-003~~ | ~~Número de WhatsApp definitivo~~ | ~~Alta~~ | ~~Resuelto: 59891086674~~ |
| ~~PEN-004~~ | ~~Links de pago~~ | ~~Alta~~ | ~~Resuelto: MercadoPago configurado~~ |
| ~~PEN-005~~ | ~~Dominio propio~~ | ~~Media~~ | ~~Resuelto: livianas.com en Vercel~~ |
| PEN-006 | Meta Pixel ID | Media | Crear cuenta Business Manager |
| PEN-007 | GA4 Measurement ID | Media | Crear propiedad en Analytics |
| ~~PEN-008~~ | ~~Bot de WhatsApp~~ | ~~Media~~ | ~~Resuelto: CC-007 chatbot IA propio~~ |
| PEN-009 | Testimonios reales | Baja | Completar primer grupo |
| PEN-010 | Supabase para contenido dinámico | Baja | Opcional, config estática funciona |
| PEN-011 | Configurar ANTHROPIC_API_KEY en Vercel | Alta | Tener la key y hacer `npx vercel env add` |
| PEN-012 | Configurar Meta Business + WhatsApp Cloud API | Media | Verificar negocio en Meta, obtener Phone Number ID + Access Token |
| PEN-013 | Configurar webhook de WhatsApp en Meta | Media | Depende de PEN-012. URL: `https://livianas.com/api/whatsapp` |
| PEN-014 | Deploy a producción con chatbot | Alta | Depende de PEN-011 |
| ~~PEN-015~~ | ~~Configurar DNS para Resend (DKIM, SPF, MX, DMARC)~~ | ~~Alta~~ | ~~Resuelto: dominio verificado en Resend~~ |
| ~~PEN-016~~ | ~~Hostear PDFs de materiales~~ | ~~Alta~~ | ~~Resuelto: Supabase Storage, bucket público~~ |
| ~~PEN-017~~ | ~~Webhook de Mercado Pago~~ | ~~Alta~~ | ~~Resuelto: /api/webhook/mercadopago configurado y funcionando~~ |
| PEN-018 | Swap link MP test → producción en /materiales | **ALTA** | Antes de lanzar. Línea 7 de `materiales/index.astro` |
| PEN-019 | Test end-to-end compra real + email | Alta | Depende de PEN-018 |
| PEN-020 | Investigar error 403 Checkout Pro (token MP) | Media | Opcional si payment links funcionan bien |
