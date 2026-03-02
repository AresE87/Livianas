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

## PENDIENTES

| ID | Descripción | Prioridad | Dependencia |
|---|---|---|---|
| PEN-001 | Video de Ana presentando el método | Alta | Ana debe grabarlo |
| PEN-002 | Foto profesional de Ana | Alta | Ana debe proveerla |
| PEN-003 | Número de WhatsApp definitivo | Alta | Ana debe confirmarlo |
| PEN-004 | Links de pago (MercadoPago, dLocal, PayPal) | Alta | Configurar cuentas |
| PEN-005 | Dominio propio | Media | Comprar y configurar DNS |
| PEN-006 | Meta Pixel ID | Media | Crear cuenta Business Manager |
| PEN-007 | GA4 Measurement ID | Media | Crear propiedad en Analytics |
| PEN-008 | Bot de WhatsApp (ManyChat/n8n) | Media | Definir flujo conversacional |
| PEN-009 | Testimonios reales | Baja | Completar primer grupo |
| PEN-010 | Supabase para contenido dinámico | Baja | Opcional, config estática funciona |
