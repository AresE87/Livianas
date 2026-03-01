# LIVIANAS Landing — Optimization Design Document

**Date:** 2026-03-01
**Status:** Approved
**Scope:** Evolution (not redesign) — improve conversion, aesthetics, and copy across existing structure

---

## 1. Context & Goals

### Current State
- 14-section Astro landing page (Tailwind 4, static SSG)
- Palette: sage/cream/warm — communicates calm femininity
- All CTAs route to WhatsApp (Ana closes sales manually)
- Pricing appears at section 11 of 14 — too late for conversion
- No payment plan, no charm pricing, no countdown timer
- Testimonials are placeholders (first launch, no real data)

### Key Differentiator (from founder)
LIVIANAS integrates **behavior + emotion + spirituality** — not just nutrition coaching.
Groups of 8 women max to enable deep, real transformation.

### Goals
1. **Maximize autonomous conversions** — landing sells on its own + WhatsApp bot handles questions
2. **Reduce Ana's workload** — only complex questions escalate to her
3. **Elevate aesthetics** — premium, emotionally connected design
4. **Improve copy** — empathetic, differentiated, persuasive

---

## 2. New Page Flow

```
 1. TopBar           — urgency + countdown timer to enrollment deadline
 2. Hero             — "I See You" hook + micro-testimonial + dual CTAs
 3. VideoAna         — Ana's video (emotional impact)
 4. PainPoints       — empathetic pain identification
 5. Transformation   — before → after (emotional, not physical)
 6. MINI-PRICING ★   — NEW: compact price + value stack + CTA
 7. WeeksProgram     — 4 weeks overview
 8. Includes         — benefit-first program inclusions
 9. Testimonials     — social proof (or "Para quién es esto" for launch)
10. AboutAna         — credibility + credentials
11. PRICING FULL ★   — complete pricing with countdown + payment plan
12. FAQ              — expanded to cover all objections
13. FinalCTA         — emotional close
14. Footer           — minimal (no navigation)
15. WhatsAppButton   — floating (maintained)
16. STICKY CTA ★     — NEW: mobile-only bottom sticky bar (appears after Hero)
```

### Removed
- **UrgencyBar** (absorbed into TopBar and Mini-Pricing)

### Added
- **Mini-Pricing** (position 6)
- **Sticky mobile CTA** (bottom bar)
- **Countdown timer** (TopBar + Pricing Full)

---

## 3. Global Language Change

Replace "cohorte" with "circulo" or "experiencia" throughout:
- `fechaInicioCohorte` → `fechaInicioCírculo` in config.ts
- All component references updated
- "El Circulo de Marzo" — warm, feminine, communal language

---

## 4. Dual CTA Strategy (Sales Autonomy)

### Current Flow (Ana-dependent)
```
Landing → "Quiero mi lugar" → WhatsApp → Ana sells → Ana collects payment
```

### New Flow (Autonomous)

**Route A — Ready to buy:**
```
Landing → "Inscribirme ahora" (primary CTA, green)
       → Payment page (MercadoPago / dLocal Go / PayPal)
       → Auto-confirmation
       → WhatsApp bot sends welcome message
```

**Route B — Has questions:**
```
Landing → "Hablar con Ana" (secondary CTA, outlined)
       → WhatsApp Bot (ManyChat or n8n)
       → Bot handles FAQ
       → Bot presents offer + payment link
       → If unresolved → escalate to Ana
```

### CTA Placement (5 touchpoints minimum)
1. Hero section — dual CTAs
2. Mini-Pricing (pos 6) — primary CTA + micro-testimonial
3. After Testimonials (pos 9) — "Quiero ser la proxima"
4. Pricing Full (pos 11) — primary CTA + payment plan option
5. FinalCTA (pos 13) — emotional close CTA
6. Floating WhatsApp — always visible
7. Sticky mobile bar — appears after scrolling past Hero

---

## 5. Section-by-Section Changes

### 5.1 TopBar
- Add **countdown timer** (JS, counts down to `fechaCierre`)
- Pulse animation on timer
- Mobile: reduce text, prioritize countdown
- Sticky behavior maintained

### 5.2 Hero
- **Badge:** "Conducta - Emocion - Espiritualidad — Solo 8 mujeres por grupo"
- **Headline:** Keep "No es una dieta. Es la decision de dejar de abandonarte."
- **Subtitle:** "La comida no es tu problema. Es tu sintoma. LIVIANAS trabaja donde las dietas no llegan: tu conducta, tus emociones y tu conexion espiritual. 4 semanas en grupo reducido con Ana. 8 mujeres. Un proceso real."
- **Micro-testimonial:** 1 short quote + name (or placeholder for launch)
- **Dual CTAs:** "Inscribirme ahora" (green, payment) + "Hablar con Ana" (outlined, WhatsApp)
- **Trust signals:** "Respuesta inmediata - Grupos de 8 - Sin compromiso"
- **Visual:** Maintain gradient + blurred circles, add subtle parallax

### 5.3 VideoAna
- No structural changes (awaiting Ana's video)
- Ensure placeholder is visually polished

### 5.4 PainPoints
- **Title:** "Se lo que se siente..." (I See You approach)
- **Cards:** Add highlighted key phrase in each description (bold/color)
- **Hover:** Replace top-border effect with left-border colored accent (more premium)
- **Bridge text after cards:** "Si te identificaste con alguna de estas, no es tu culpa. Y no estas sola."
- **Mini CTA:** "Quiero cambiar esto" → scrolls to Mini-Pricing

### 5.5 Transformation
- **Title:** "En 30 dias, esto cambia:"
- **Subtitle:** "Trabajamos las 3 dimensiones: conducta, emocion y espiritualidad"
- **Visual:** Animated arrow icon on transition
- Keep before/after card format

### 5.6 Mini-Pricing (NEW)
- **Background:** `sage-wash` for visual differentiation
- **Content:**
  - Price: ~~USD 450~~ → **USD 297**
  - Breakdown: "Solo USD 74 por semana de transformacion integral"
  - 4 key bullet points (top features only)
  - Primary CTA: "Reservar mi lugar" (payment link)
  - Micro-testimonial alongside
  - Link: "Ver todo lo que incluye ↓" → anchors to Pricing Full
- **Style:** Compact, centered, max-width 560px

### 5.7 WeeksProgram
- No major changes
- Staggered scroll animation (cards appear one by one)
- Ensure "Circulo" language if referenced

### 5.8 Includes
- Rewrite titles to be benefit-first:
  - "4 clases en vivo de 1h30" → "Coaching grupal en vivo cada semana"
  - "Grupo privado de WhatsApp" → "Comunidad diaria que te sostiene"
  - etc.
- Add subtle icons instead of (or alongside) text-only list

### 5.9 Testimonials (Launch Strategy)
- **Since this is first launch — no real testimonials yet**
- Replace with **"Para quien es esto"** section:
  - Checklist format: "Esto es para vos si..."
  - 6-8 identification statements
  - Strong emotional connection
- **After first circulo:** Replace with real testimonials
- Remove fake star ratings
- Add badge: "Participante Circulo [Month]" on each future testimonial

### 5.10 AboutAna
- No major content changes
- Await real photo from Ana
- Tags remain: Coaching Emocional, Nutricion Consciente, Enfoque Antiinflamatorio, Grupos Reducidos

### 5.11 Pricing Full
- **Price:** USD 297 (charm pricing, down from 300)
- **Regular price:** USD 450 (maintained as anchor)
- **Value stack BEFORE price:**
  ```
  4 sesiones de coaching grupal en vivo     — valor USD 400
  Plan de alimentacion antiinflamatoria     — valor USD 150
  Grupo de WhatsApp con acompanamiento      — valor USD 200
  Workbook de autoconocimiento              — valor USD  80
  Rutinas de movimiento (4 semanas)         — valor USD 120
  Grabaciones de por vida                   — valor USD 100
                                   Total:    USD 1,050
  ```
  Reveal: "Tu inversion: USD 297"
- **Payment plan:** "o 3 cuotas de USD 99" (visible option)
- **Payment methods:** 3 buttons/links (MercadoPago, dLocal Go, PayPal)
- **Countdown timer:** Synced with TopBar, tied to `fechaCierre`
- **Guarantee:** "Si despues de la semana 1 sentis que no es para vos, hablamos."
- **Micro-testimonial** under CTA
- **Trust signals:** Pago seguro + payment provider logos

### 5.12 FAQ
- Expand to cover all purchase objections
- Add questions:
  - "Como es el proceso de pago?"
  - "Hay garantia?"
  - "Puedo hablar con Ana antes de inscribirme?"
- Schema markup maintained

### 5.13 FinalCTA
- Keep emotional tone
- Update CTA text: "Empezar mi transformacion" → "Quiero mi lugar en el circulo"
- Add countdown timer reference: "El circulo cierra en X dias"

### 5.14 Footer
- Minimize — remove unnecessary navigation
- Keep: privacy, terms, copyright
- One goal, one action

---

## 6. Aesthetic Improvements

### Animations & Micro-interactions
- **Staggered scroll reveals:** Cards appear one by one (150ms delay between each)
- **Parallax:** Subtle on Hero decorative circles
- **Countdown timer:** Pulse animation on seconds
- **CTA buttons:** Gentle scale on hover (1.02) + shadow lift
- **Price reveal:** Counter animation (numbers rolling up) on value stack

### Spacing & Layout
- More white space around CTAs (research: +232% conversion)
- Consistent section transitions with subtle gradient blending
- Cards: slightly larger padding, softer shadows

### Typography
- Maintain Playfair Display (display) + DM Sans (body)
- Increase contrast between headings and body
- Use italic Playfair for emotional emphasis quotes

---

## 7. WhatsApp Bot Flow (ManyChat or n8n)

### Flow Architecture
```
1. GREETING
   "Hola [nombre]! Gracias por tu interes en LIVIANAS"
   "Soy el asistente de Ana. Te puedo ayudar con cualquier pregunta."

2. ROUTING
   "Que te gustaria hacer?"
   → [Inscribirme ahora] → Payment flow
   → [Tengo preguntas] → FAQ menu
   → [Hablar con Ana] → Escalate

3. FAQ MENU
   → Precio y formas de pago
   → Horarios de las clases
   → Que incluye el programa
   → Puedo participar desde otro pais?
   → Hay garantia?
   (Each answer ends with: "Estas lista para reservar tu lugar?")

4. PAYMENT FLOW
   → Send payment links (MercadoPago / dLocal / PayPal)
   → Instructions for each method
   → Confirmation message after payment

5. ESCALATION
   → "Perfecto! Ana te va a responder personalmente."
   → Notify Ana with context of conversation

6. FOLLOW-UP (24h after no purchase)
   → "Hola [nombre]! Vi que te intereso LIVIANAS. Quedan X lugares para el circulo de [mes]. Tenes alguna duda que te pueda resolver?"
```

### Implementation Note
Bot design is documented here. Implementation requires:
- ManyChat or n8n account setup
- Payment gateway integration (MercadoPago API, dLocal Go, PayPal)
- This is a separate workstream from the landing page changes

---

## 8. Config Changes (config.ts)

```typescript
// Renamed
fechaInicioCírculo: '31 de marzo de 2026',  // was fechaInicioCohorte

// New
precioUSD: 297,           // was 300 (charm pricing)
precioSemanal: 74,        // 297/4
precioCuota: 99,          // 297/3
valorTotal: 1050,         // value stack total

// New CTA messages
ctaMessages: {
  primary: 'Inscribirme ahora',
  secondary: 'Hablar con Ana',
  miniPricing: 'Reservar mi lugar',
  finalCta: 'Quiero mi lugar en el circulo',
}

// Payment links (from .env)
paymentLinks: {
  mercadoPago: import.meta.env.PUBLIC_MERCADOPAGO_LINK || '',
  dlocalGo: import.meta.env.PUBLIC_DLOCAL_LINK || '',
  paypal: import.meta.env.PUBLIC_PAYPAL_LINK || '',
}
```

---

## 9. New Environment Variables

```env
# Payment links (direct checkout URLs)
PUBLIC_MERCADOPAGO_LINK=
PUBLIC_DLOCAL_LINK=
PUBLIC_PAYPAL_LINK=

# Existing (unchanged)
PUBLIC_WHATSAPP_NUMBER=598XXXXXXXXX
PUBLIC_META_PIXEL_ID=
PUBLIC_GA4_ID=
```

---

## 10. Files to Create/Modify

### New Components
- `src/components/MiniPricing.astro` — compact pricing section
- `src/components/CountdownTimer.astro` — reusable countdown (used in TopBar + Pricing)
- `src/components/StickyMobileCTA.astro` — bottom sticky bar for mobile
- `src/components/PaymentButtons.astro` — payment method buttons/links
- `src/components/ValueStack.astro` — value stacking display for Pricing Full

### Modified Components (all existing)
- `TopBar.astro` — add countdown timer
- `Hero.astro` — new copy, dual CTAs, micro-testimonial, badge
- `PainPoints.astro` — new title, hover effect, bridge text, mini CTA
- `Transformation.astro` — new title, subtitle, animated arrow
- `Testimonials.astro` → rename to `ParaQuienEs.astro` (launch version)
- `Pricing.astro` — charm pricing, value stack, payment plan, countdown, guarantee
- `FinalCTA.astro` — updated copy, countdown reference
- `Footer.astro` — minimize navigation
- `WhatsAppCTA.astro` — support new variants (primary/secondary)
- `WhatsAppButton.astro` — no changes

### Modified Files
- `src/lib/config.ts` — new fields, renamed fields, charm pricing
- `src/pages/index.astro` — new component order, new imports
- `src/styles/global.css` — new animations (stagger, counter, parallax)

---

## 11. Success Metrics

After implementation, track:
1. **WhatsApp click rate** by CTA position (existing tracking)
2. **Payment link click rate** (new tracking event)
3. **Scroll depth** to Mini-Pricing vs Pricing Full
4. **Time on page** before first CTA click
5. **Bot completion rate** (ManyChat/n8n analytics)
6. **Conversion rate** (payment completions / visitors)

---

## 12. Implementation Priority

1. **P0 (Critical Path):** New page flow + Mini-Pricing + Pricing Full improvements + config changes
2. **P1 (High Impact):** Hero redesign + Dual CTAs + countdown timer + sticky mobile CTA
3. **P2 (Polish):** PainPoints/Transformation copy + animations + stagger effects
4. **P3 (Separate Workstream):** WhatsApp bot (ManyChat/n8n)

---

*Design approved by project owner on 2026-03-01.*
