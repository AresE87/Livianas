# LIVIANAS Landing Optimization — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Evolve the existing Astro landing page to maximize autonomous conversions through improved page flow, dual CTAs (direct payment + WhatsApp bot), charm pricing, countdown timer, and emotionally resonant copy.

**Architecture:** Astro 5.x static site with Tailwind CSS 4.x (CSS-first config). All dynamic content lives in `src/lib/config.ts`. New components are added for Mini-Pricing, CountdownTimer, StickyMobileCTA, and PaymentButtons. Existing components are modified in place. No new dependencies required.

**Tech Stack:** Astro 5.x, Tailwind CSS 4.x (@theme in CSS), vanilla JS for countdown/scroll logic, self-hosted woff2 fonts.

**Project root:** `C:\Users\AresE\Documents\Livianas\livianas-landing\`

**Dev server:** `node node_modules/astro/astro.js dev` on port 4321 (npm/npx ENOENT on this Windows machine — use node directly)

---

## Task 1: Update config.ts — new fields, charm pricing, language change

**Files:**
- Modify: `src/lib/config.ts`
- Modify: `.env`

**Step 1: Update `.env` with new payment link variables**

Add these lines to `.env`:

```env
PUBLIC_MERCADOPAGO_LINK=
PUBLIC_DLOCAL_LINK=
PUBLIC_PAYPAL_LINK=
```

**Step 2: Rewrite `src/lib/config.ts` with all changes**

Replace the entire `siteConfig` object and add new data exports. Key changes:
- `fechaInicioCohorte` → `fechaInicioCírculo`
- `precioUSD: 300` → `precioUSD: 297` (charm pricing)
- Add `precioSemanal: 74`, `precioCuota: 99`, `valorTotal: 1050`
- Add `ctaMessages` object
- Add `paymentLinks` object from env vars
- Add `valueStackData` array
- Add `paraQuienEsData` array (replaces testimonials for launch)
- Update `includesData` titles to benefit-first
- Add 3 new FAQ items
- Update `textoUrgencia` to use "circulo" language
- Add `fechaCierreISO` for countdown timer (ISO 8601 date string)

The full updated config:

```typescript
// src/lib/config.ts — Fuente unica de verdad para todo el contenido dinamico

export const siteConfig = {
  // WhatsApp
  whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER || '598XXXXXXXXX',

  // Mensajes prellenados
  whatsappMessages: {
    hero: encodeURIComponent('Hola Ana, quiero info sobre LIVIANAS 🌿'),
    pricing: encodeURIComponent('Hola Ana, quiero inscribirme en LIVIANAS 🌿'),
    finalCta: encodeURIComponent('Hola Ana, estoy lista para LIVIANAS 🌿'),
    floating: encodeURIComponent('Hola, quiero saber más sobre LIVIANAS 🌿'),
  },

  // CTA Messages
  ctaMessages: {
    primary: 'Inscribirme ahora',
    secondary: 'Hablar con Ana',
    miniPricing: 'Reservar mi lugar',
    finalCta: 'Quiero mi lugar en el círculo',
    afterPainPoints: 'Quiero cambiar esto',
  },

  // Payment Links
  paymentLinks: {
    mercadoPago: import.meta.env.PUBLIC_MERCADOPAGO_LINK || '',
    dlocalGo: import.meta.env.PUBLIC_DLOCAL_LINK || '',
    paypal: import.meta.env.PUBLIC_PAYPAL_LINK || '',
  },

  // Contenido dinamico
  cuposDisponibles: 8,
  fechaCierre: '28 de marzo',
  fechaCierreISO: '2026-03-28T23:59:59',
  fechaInicioCírculo: '31 de marzo de 2026',
  inscripcionesAbiertas: true,
  textoUrgencia: 'El círculo cierra el 28 de marzo — Solo <strong>8 lugares</strong> por grupo',

  // Precio
  precioUSD: 297,
  precioRegularUSD: 450,
  precioSemanal: 74,
  precioCuota: 99,
  valorTotal: 1050,

  // Tracking
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID || '',
  ga4Id: import.meta.env.PUBLIC_GA4_ID || '',

  // SEO
  siteUrl: 'https://livianas.com',
  siteName: 'LIVIANAS',
} as const;

// Helper para generar links de WhatsApp
export function getWhatsAppLink(location: keyof typeof siteConfig.whatsappMessages): string {
  const msg = siteConfig.whatsappMessages[location];
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${msg}`;
}

// Helper para obtener link de pago (prioriza MercadoPago > dLocal > PayPal)
export function getPaymentLink(): string {
  const { mercadoPago, dlocalGo, paypal } = siteConfig.paymentLinks;
  return mercadoPago || dlocalGo || paypal || '#precio';
}

// ===== Datos de Secciones =====

export const painPointsData = [
  {
    emoji: '😤',
    title: 'Lunes de nuevo',
    description: 'Otra dieta nueva, otra app de calorías, otra promesa de "esta vez sí".',
    highlight: 'Para el miércoles ya abandonaste. Y el domingo volvés a empezar.',
    detail: 'El problema nunca fue la fuerza de voluntad.',
  },
  {
    emoji: '😔',
    title: 'Presa de la balanza',
    description: 'Te pesás cada mañana y ese número decide tu estado de ánimo.',
    highlight: 'Subiste 300 gramos y el día se arruinó.',
    detail: 'Tu valor no puede depender de un aparato.',
  },
  {
    emoji: '😰',
    title: 'Comer para apagar emociones',
    description: 'No es hambre, es ansiedad. Es abrir la heladera después de un día difícil y no poder parar.',
    highlight: 'Después viene la culpa.',
    detail: 'Y nadie entiende por qué no podés "simplemente controlarte".',
  },
  {
    emoji: '😞',
    title: 'Sola en esto',
    description: 'Todas te preguntan si bajaste de peso, nadie te pregunta cómo estás.',
    highlight: 'Las dietas son en soledad.',
    detail: 'Te sentís la única que no puede con algo que parece tan "fácil".',
  },
];

export const transformationData = [
  {
    from: 'Empezar una dieta nueva cada lunes',
    to: 'Tener una estructura que sostenés sin esfuerzo',
  },
  {
    from: 'Comer por ansiedad y sentir culpa después',
    to: 'Reconocer qué sentís y elegir cómo responder',
  },
  {
    from: 'Odiarte cada vez que te mirás al espejo',
    to: 'Tratarte con la compasión que le darías a una amiga',
  },
  {
    from: 'Sentirte sola y que nadie entiende',
    to: 'Tener un grupo de mujeres que te sostiene',
  },
];

export const weeksData = [
  {
    number: 1,
    emoji: '🌱',
    title: 'CONSCIENCIA',
    name: 'Despertar',
    description: 'Identificá tus sabotajes, patrones emocionales y creencias limitantes sobre tu cuerpo y la comida.',
    gradient: 'linear-gradient(135deg, #F5EDE3, #EDDCC8)',
  },
  {
    number: 2,
    emoji: '🔥',
    title: 'ACCIÓN',
    name: 'Mover',
    description: 'Armá tu estructura de alimentación antiinflamatoria y movimiento. Sin contar calorías, con guía real.',
    gradient: 'linear-gradient(135deg, #E8EDE4, #D1DCC9)',
  },
  {
    number: 3,
    emoji: '⚡',
    title: 'ENERGÍA',
    name: 'Fluir',
    description: 'Trabajá sobre tu energía emocional. Aprendé a soltar la culpa, la ansiedad y el control excesivo.',
    gradient: 'linear-gradient(135deg, #E4EDF5, #C9D6E8)',
  },
  {
    number: 4,
    emoji: '👑',
    title: 'IDENTIDAD',
    name: 'Ser',
    description: 'Integrá todo lo aprendido en tu nueva identidad. Dejá de ser "la que hace dieta" y convertite en la mujer que elegís ser.',
    gradient: 'linear-gradient(135deg, #F2E4E4, #E8C9C9)',
  },
];

export const includesData = [
  {
    title: 'Coaching grupal en vivo cada semana',
    description: '4 sesiones de 1h30 con Ana. Teoría + ejercicio práctico + espacio de preguntas.',
  },
  {
    title: 'Comunidad diaria que te sostiene',
    description: 'Grupo privado de WhatsApp con acompañamiento durante las 4 semanas. Mujeres que te entienden.',
  },
  {
    title: 'Plan de alimentación sin restricciones',
    description: 'Guía antiinflamatoria de porciones con tu mano como medida. Menú semanal con recetas simples.',
  },
  {
    title: 'Movimiento que te energiza',
    description: 'Rutinas de 20-30 min, sin equipo, para cualquier nivel. Diseñadas para energizarte, no castigarte.',
  },
  {
    title: 'Workbook de autoconocimiento',
    description: 'Ejercicios semanales para identificar patrones, soltar creencias y construir tu nueva narrativa.',
  },
  {
    title: 'Acceso de por vida a las grabaciones',
    description: 'Si no podés asistir en vivo, tenés todas las clases grabadas para verlas a tu ritmo.',
  },
];

export const valueStackData = [
  { item: '4 sesiones de coaching grupal en vivo', value: 400 },
  { item: 'Plan de alimentación antiinflamatoria', value: 150 },
  { item: 'Grupo de WhatsApp con acompañamiento diario', value: 200 },
  { item: 'Workbook de autoconocimiento', value: 80 },
  { item: 'Rutinas de movimiento (4 semanas)', value: 120 },
  { item: 'Grabaciones de por vida', value: 100 },
];

export const paraQuienEsData = [
  'Sentís que la comida te controla en vez de nutrirte',
  'Empezás dietas los lunes y las abandonás a mitad de semana',
  'Comés por ansiedad, aburrimiento o tristeza — y después te sentís culpable',
  'Tu estado de ánimo depende de lo que dice la balanza',
  'Sabés que el problema no es la comida, pero no sabés cómo cambiar',
  'Estás cansada de hacerlo sola y querés un espacio seguro con otras mujeres',
  'Sentís que tu relación con tu cuerpo necesita sanar desde adentro',
  'Buscás un cambio real, no otra dieta con fecha de vencimiento',
];

export const pricingFeatures = [
  '4 sesiones de coaching grupal en vivo con Ana',
  'Grupo privado de WhatsApp con acompañamiento diario',
  'Plan de alimentación antiinflamatoria personalizable',
  'Guía de porciones sin contar calorías',
  'Rutinas de movimiento de 20-30 min (sin equipo)',
  'Workbook de autoconocimiento semanal',
  'Grabaciones de todas las clases',
  'Comunidad de mujeres que te sostienen',
  'Acceso de por vida al material del programa',
];

export const miniPricingFeatures = [
  'Coaching grupal en vivo con Ana cada semana',
  'Comunidad de mujeres + acompañamiento diario',
  'Plan de alimentación + rutinas de movimiento',
  'Acceso de por vida al material completo',
];

export const faqData = [
  {
    question: '¿Cuánto dura el programa?',
    answer: 'El programa dura 4 semanas exactas. Cada semana tenés una sesión en vivo de 1h30 con Ana y acompañamiento diario por el grupo privado de WhatsApp.',
  },
  {
    question: '¿Qué pasa si no puedo asistir a una clase en vivo?',
    answer: 'Todas las clases quedan grabadas con acceso de por vida. Las podés ver las veces que quieras, a tu ritmo.',
  },
  {
    question: '¿Necesito experiencia previa o algún nivel de fitness?',
    answer: 'No. Las rutinas son de 20-30 minutos, sin equipo, y se adaptan a cualquier nivel. Muchas participantes nunca habían hecho ejercicio regular.',
  },
  {
    question: '¿Voy a tener que contar calorías o pesar la comida?',
    answer: 'Jamás. Trabajamos con guía de porciones usando tu mano como medida y alimentación consciente antiinflamatoria. Sin restricciones, sin culpa.',
  },
  {
    question: '¿Cuántas personas hay por grupo?',
    answer: 'Máximo 8 mujeres. Los grupos pequeños garantizan que Ana pueda darte atención personalizada y que se genere un espacio de confianza real.',
  },
  {
    question: '¿Puedo participar desde fuera de Uruguay?',
    answer: 'Sí. Las clases son 100% online en vivo por Zoom y el grupo de WhatsApp funciona desde cualquier país. Tenemos participantes de toda Latinoamérica.',
  },
  {
    question: '¿Qué pasa después de las 4 semanas?',
    answer: 'Mantenés acceso de por vida al material, las grabaciones y los recursos. Lo que aprendés en LIVIANAS es tuyo para siempre.',
  },
  {
    question: '¿Es solo para bajar de peso?',
    answer: 'No. LIVIANAS trabaja tu relación con la comida, tu cuerpo y tus emociones. Muchas mujeres bajan de peso como consecuencia natural, pero el verdadero cambio es cómo te sentís con vos misma.',
  },
  {
    question: '¿Cómo es la forma de pago?',
    answer: 'Podés pagar con MercadoPago (Uruguay), dLocal Go (Latinoamérica) o PayPal (internacional). El pago es único de USD 297, o en 3 cuotas de USD 99. Sin suscripciones ni cargos ocultos.',
  },
  {
    question: '¿Qué diferencia tiene esto de una dieta o un gym?',
    answer: 'Las dietas te dicen qué comer. El gym te dice qué mover. LIVIANAS te enseña por qué hacés lo que hacés y cómo cambiar desde adentro. Trabajamos las tres dimensiones: conducta, emoción y espiritualidad.',
  },
  {
    question: '¿Cómo es el proceso de pago?',
    answer: 'Hacés click en "Inscribirme ahora", elegís tu medio de pago preferido y completás el pago. Recibís confirmación inmediata por WhatsApp con toda la información del círculo.',
  },
  {
    question: '¿Hay garantía?',
    answer: 'Si después de la primera semana sentís que no es para vos, hablamos. Queremos que estés 100% comprometida y cómoda con tu decisión.',
  },
  {
    question: '¿Puedo hablar con Ana antes de inscribirme?',
    answer: 'Sí. Podés escribirle por WhatsApp tocando el botón "Hablar con Ana" y ella te responde personalmente.',
  },
];
```

**Step 3: Verify build compiles**

Run: `node node_modules/astro/astro.js check` (from `livianas-landing/`)
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add src/lib/config.ts .env
git commit -m "feat: update config with charm pricing, circulo language, dual CTA support, value stack data"
```

---

## Task 2: Create CountdownTimer component

**Files:**
- Create: `src/components/CountdownTimer.astro`

**Step 1: Create the component**

This is a reusable countdown timer that counts down to `fechaCierreISO`. It takes a `variant` prop for styling in different contexts (topbar vs pricing section).

```astro
---
import { siteConfig } from '../lib/config';

interface Props {
  variant?: 'topbar' | 'section';
}

const { variant = 'section' } = Astro.props;
const targetDate = siteConfig.fechaCierreISO;
---

<div
  class:list={['countdown', `countdown--${variant}`]}
  data-target={targetDate}
  aria-label="Cuenta regresiva para cierre de inscripciones"
>
  <div class="countdown-unit">
    <span class="countdown-number" data-days>00</span>
    <span class="countdown-label">días</span>
  </div>
  <span class="countdown-separator">:</span>
  <div class="countdown-unit">
    <span class="countdown-number" data-hours>00</span>
    <span class="countdown-label">hrs</span>
  </div>
  <span class="countdown-separator">:</span>
  <div class="countdown-unit">
    <span class="countdown-number" data-minutes>00</span>
    <span class="countdown-label">min</span>
  </div>
  <span class="countdown-separator countdown-separator--seconds">:</span>
  <div class="countdown-unit">
    <span class="countdown-number countdown-number--seconds" data-seconds>00</span>
    <span class="countdown-label">seg</span>
  </div>
</div>

<style>
  .countdown {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .countdown-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 36px;
  }

  .countdown-number {
    font-family: var(--font-body);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .countdown-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
    line-height: 1;
    margin-top: 2px;
  }

  .countdown-separator {
    font-weight: 700;
    opacity: 0.5;
    align-self: flex-start;
    line-height: 1;
  }

  /* Topbar variant */
  .countdown--topbar {
    gap: 1px;
  }

  .countdown--topbar .countdown-number {
    font-size: 0.95rem;
    color: var(--color-warm);
  }

  .countdown--topbar .countdown-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.55rem;
  }

  .countdown--topbar .countdown-separator {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.95rem;
  }

  .countdown--topbar .countdown-unit {
    min-width: 28px;
  }

  /* Section variant */
  .countdown--section .countdown-number {
    font-size: 1.5rem;
    color: var(--color-dark);
    background: var(--color-sage-wash);
    border-radius: var(--radius-sm);
    padding: var(--space-1) var(--space-2);
  }

  .countdown--section .countdown-label {
    color: var(--color-gray);
  }

  .countdown--section .countdown-separator {
    font-size: 1.5rem;
    color: var(--color-sage);
  }

  .countdown--section .countdown-unit {
    min-width: 48px;
  }

  /* Pulse on seconds */
  .countdown-number--seconds {
    animation: pulse-dot 1s ease-in-out infinite;
  }

  /* Hide seconds on topbar mobile for space */
  @media (max-width: 479px) {
    .countdown--topbar .countdown-separator--seconds,
    .countdown--topbar [data-seconds] {
      display: none;
    }
    .countdown--topbar .countdown-unit:last-child {
      display: none;
    }
  }
</style>

<script>
  function initCountdowns() {
    document.querySelectorAll('.countdown').forEach((el) => {
      const target = new Date((el as HTMLElement).dataset.target!).getTime();

      function update() {
        const now = Date.now();
        const diff = Math.max(0, target - now);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = el.querySelector('[data-days]');
        const hoursEl = el.querySelector('[data-hours]');
        const minutesEl = el.querySelector('[data-minutes]');
        const secondsEl = el.querySelector('[data-seconds]');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
      }

      update();
      setInterval(update, 1000);
    });
  }

  initCountdowns();
</script>
```

**Step 2: Verify build compiles**

Run: `node node_modules/astro/astro.js check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/CountdownTimer.astro
git commit -m "feat: add reusable CountdownTimer component with topbar and section variants"
```

---

## Task 3: Create PaymentButtons component

**Files:**
- Create: `src/components/PaymentButtons.astro`

**Step 1: Create the component**

Renders payment method buttons/links. Falls back to WhatsApp if no payment links are configured.

```astro
---
import { siteConfig, getPaymentLink, getWhatsAppLink } from '../lib/config';

interface Props {
  variant?: 'full' | 'compact';
}

const { variant = 'full' } = Astro.props;
const { mercadoPago, dlocalGo, paypal } = siteConfig.paymentLinks;
const hasPaymentLinks = mercadoPago || dlocalGo || paypal;
const fallbackLink = getWhatsAppLink('pricing');
---

{hasPaymentLinks ? (
  <div class:list={['payment-buttons', `payment-buttons--${variant}`]}>
    {mercadoPago && (
      <a href={mercadoPago} target="_blank" rel="noopener noreferrer" class="payment-btn payment-btn--mp" data-utm="payment-mercadopago">
        <span class="payment-btn-label">MercadoPago</span>
        <span class="payment-btn-region">Uruguay</span>
      </a>
    )}
    {dlocalGo && (
      <a href={dlocalGo} target="_blank" rel="noopener noreferrer" class="payment-btn payment-btn--dlocal" data-utm="payment-dlocal">
        <span class="payment-btn-label">dLocal Go</span>
        <span class="payment-btn-region">Latinoamérica</span>
      </a>
    )}
    {paypal && (
      <a href={paypal} target="_blank" rel="noopener noreferrer" class="payment-btn payment-btn--paypal" data-utm="payment-paypal">
        <span class="payment-btn-label">PayPal</span>
        <span class="payment-btn-region">Internacional</span>
      </a>
    )}
  </div>
) : (
  <a
    href={fallbackLink}
    target="_blank"
    rel="noopener noreferrer"
    data-utm="pricing"
    class="inline-flex items-center justify-center gap-2 font-bold text-lg rounded-[var(--radius-md)] bg-[var(--color-whatsapp)] text-white px-6 py-4 w-full hover:bg-[var(--color-whatsapp-hover)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)] cursor-pointer no-underline"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    {siteConfig.ctaMessages.primary}
  </a>
)}

<style>
  .payment-buttons {
    display: flex;
    gap: var(--space-3);
    width: 100%;
  }

  .payment-buttons--full {
    flex-direction: column;
  }

  .payment-buttons--compact {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .payment-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    font-weight: 700;
    text-decoration: none;
    transition: all var(--transition-base);
    cursor: pointer;
    flex: 1;
    min-height: 56px;
  }

  .payment-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .payment-btn-label {
    font-size: 1rem;
    line-height: 1.2;
  }

  .payment-btn-region {
    font-size: 0.7rem;
    font-weight: 500;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .payment-btn--mp {
    background: #009ee3;
    color: white;
  }

  .payment-btn--mp:hover {
    background: #007eb5;
  }

  .payment-btn--dlocal {
    background: #1a1a2e;
    color: white;
  }

  .payment-btn--dlocal:hover {
    background: #0f0f1a;
  }

  .payment-btn--paypal {
    background: #0070ba;
    color: white;
  }

  .payment-btn--paypal:hover {
    background: #005ea6;
  }

  .payment-buttons--compact .payment-btn {
    flex: 0 1 auto;
    min-width: 130px;
    padding: var(--space-2) var(--space-3);
    min-height: 44px;
  }

  .payment-buttons--compact .payment-btn-label {
    font-size: 0.85rem;
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/PaymentButtons.astro
git commit -m "feat: add PaymentButtons component with MercadoPago, dLocal Go, PayPal support"
```

---

## Task 4: Create MiniPricing component

**Files:**
- Create: `src/components/MiniPricing.astro`

**Step 1: Create the component**

Compact pricing section at position 6 (after Transformation). Shows price, 4 key features, CTA, and link to full pricing.

```astro
---
import { siteConfig, miniPricingFeatures, getPaymentLink } from '../lib/config';

const paymentLink = getPaymentLink();
---

<section id="mini-precio" aria-labelledby="mini-precio-title" class="section mini-pricing-section">
  <div class="container animate-on-scroll">
    <div class="mini-pricing-card">
      <p class="text-sm font-medium text-[var(--color-sage)] uppercase tracking-[0.1em] mb-2">
        Tu inversión
      </p>

      <h2 id="mini-precio-title" class="font-[var(--font-display)] font-bold text-[var(--text-3xl)] text-[var(--color-dark)] mb-1">
        Transformación integral por
      </h2>

      <div class="mb-1">
        <span class="text-base text-[var(--color-gray)] line-through">USD {siteConfig.precioRegularUSD}</span>
      </div>

      <div class="mb-2">
        <span class="text-lg text-[var(--color-sage)]">USD</span>
        <span class="font-[var(--font-display)] font-bold text-[var(--text-5xl)] text-[var(--color-dark)]">{siteConfig.precioUSD}</span>
      </div>

      <p class="text-sm text-[var(--color-gray)] mb-6">
        Solo USD {siteConfig.precioSemanal} por semana &bull; Conducta + emoción + espiritualidad
      </p>

      <ul class="mini-pricing-features">
        {miniPricingFeatures.map((feature) => (
          <li class="flex items-center gap-2 text-[var(--color-dark)] text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        data-utm="mini-pricing"
        class="mini-pricing-cta"
      >
        {siteConfig.ctaMessages.miniPricing}
      </a>

      <p class="text-xs text-[var(--color-gray)] mt-3">
        o <strong>3 cuotas de USD {siteConfig.precioCuota}</strong> &bull; Pago seguro
      </p>

      <a href="#precio" class="mini-pricing-link">
        Ver todo lo que incluye ↓
      </a>
    </div>
  </div>
</section>

<style>
  .mini-pricing-section {
    background: var(--color-sage-wash);
  }

  .mini-pricing-card {
    max-width: 560px;
    margin: 0 auto;
    text-align: center;
    background: white;
    border-radius: var(--radius-xl);
    padding: var(--space-8) var(--space-6);
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(123, 143, 107, 0.15);
  }

  .mini-pricing-features {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    text-align: left;
    max-width: 360px;
    margin: 0 auto var(--space-6);
  }

  .mini-pricing-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 320px;
    padding: var(--space-3) var(--space-6);
    background: var(--color-sage);
    color: white;
    font-weight: 700;
    font-size: 1.05rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all var(--transition-base);
    cursor: pointer;
  }

  .mini-pricing-cta:hover {
    background: var(--color-sage-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .mini-pricing-link {
    display: inline-block;
    margin-top: var(--space-4);
    font-size: 0.875rem;
    color: var(--color-sage);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color var(--transition-fast);
  }

  .mini-pricing-link:hover {
    color: var(--color-sage-dark);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/MiniPricing.astro
git commit -m "feat: add MiniPricing compact section for early price visibility"
```

---

## Task 5: Create StickyMobileCTA component

**Files:**
- Create: `src/components/StickyMobileCTA.astro`

**Step 1: Create the component**

A sticky bottom bar visible only on mobile, appears after scrolling past the Hero section.

```astro
---
import { siteConfig, getPaymentLink } from '../lib/config';

const paymentLink = getPaymentLink();
---

<div class="sticky-cta" id="sticky-cta" aria-hidden="true">
  <div class="sticky-cta-inner">
    <div class="sticky-cta-price">
      <span class="sticky-cta-price-label">Desde</span>
      <span class="sticky-cta-price-value">USD {siteConfig.precioUSD}</span>
    </div>
    <a
      href={paymentLink}
      target="_blank"
      rel="noopener noreferrer"
      data-utm="sticky-mobile"
      class="sticky-cta-button"
    >
      {siteConfig.ctaMessages.primary}
    </a>
  </div>
</div>

<style>
  .sticky-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background: white;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    padding: var(--space-2) var(--space-4);
    transform: translateY(100%);
    transition: transform var(--transition-base);
  }

  .sticky-cta.is-visible {
    transform: translateY(0);
  }

  .sticky-cta-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    max-width: var(--container-max);
    margin: 0 auto;
  }

  .sticky-cta-price {
    display: flex;
    flex-direction: column;
  }

  .sticky-cta-price-label {
    font-size: 0.7rem;
    color: var(--color-gray);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1;
  }

  .sticky-cta-price-value {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--color-dark);
    line-height: 1.2;
  }

  .sticky-cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2) var(--space-4);
    background: var(--color-sage);
    color: white;
    font-weight: 700;
    font-size: 0.9rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    white-space: nowrap;
    transition: background var(--transition-fast);
  }

  .sticky-cta-button:hover {
    background: var(--color-sage-dark);
  }

  /* Only visible on mobile/tablet */
  @media (min-width: 768px) {
    .sticky-cta {
      display: none;
    }
  }
</style>

<script>
  const stickyCta = document.getElementById('sticky-cta');
  const hero = document.getElementById('hero');

  if (stickyCta && hero) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          stickyCta.classList.remove('is-visible');
          stickyCta.setAttribute('aria-hidden', 'true');
        } else {
          stickyCta.classList.add('is-visible');
          stickyCta.setAttribute('aria-hidden', 'false');
        }
      },
      { threshold: 0 }
    );
    observer.observe(hero);
  }
</script>
```

**Step 2: Commit**

```bash
git add src/components/StickyMobileCTA.astro
git commit -m "feat: add StickyMobileCTA bottom bar for mobile conversion"
```

---

## Task 6: Create ParaQuienEs component (launch replacement for Testimonials)

**Files:**
- Create: `src/components/ParaQuienEs.astro`

**Step 1: Create the component**

Replaces Testimonials section for launch (no real testimonials yet). Uses checklist identification format.

```astro
---
import SectionLabel from './SectionLabel.astro';
import { paraQuienEsData, siteConfig, getPaymentLink } from '../lib/config';

const paymentLink = getPaymentLink();
---

<section id="para-quien" aria-labelledby="para-quien-title" class="section">
  <div class="container animate-on-scroll">
    <div class="text-center mb-10">
      <SectionLabel text="¿ES PARA VOS?" />
      <h2 id="para-quien-title" class="font-[var(--font-display)] font-bold text-[var(--text-3xl)] md:text-[var(--text-4xl)] text-[var(--color-dark)]">
        Esto es para vos si...
      </h2>
    </div>

    <div class="para-quien-card">
      <ul class="para-quien-list" role="list">
        {paraQuienEsData.map((item, index) => (
          <li class="para-quien-item" role="listitem" style={`animation-delay: ${index * 80}ms;`}>
            <span class="para-quien-check" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span class="text-base text-[var(--color-dark)]">{item}</span>
          </li>
        ))}
      </ul>

      <div class="para-quien-cta">
        <p class="text-base text-[var(--color-sage-dark)] font-medium italic mb-4">
          Si marcaste aunque sea una, LIVIANAS fue creado para vos.
        </p>
        <a
          href={paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          data-utm="para-quien"
          class="inline-flex items-center justify-center gap-2 font-bold text-lg rounded-[var(--radius-md)] bg-[var(--color-sage)] text-white px-6 py-3 hover:bg-[var(--color-sage-dark)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)] cursor-pointer no-underline"
        >
          Quiero ser parte del círculo
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .para-quien-card {
    max-width: 640px;
    margin: 0 auto;
    background: white;
    border-radius: var(--radius-xl);
    padding: var(--space-8) var(--space-6);
    box-shadow: var(--shadow-md);
  }

  .para-quien-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-8);
  }

  .para-quien-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .para-quien-check {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--color-sage);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }

  .para-quien-cta {
    text-align: center;
    padding-top: var(--space-6);
    border-top: 1px solid var(--color-sage-wash);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/ParaQuienEs.astro
git commit -m "feat: add ParaQuienEs section (launch replacement for testimonials)"
```

---

## Task 7: Update TopBar with countdown timer

**Files:**
- Modify: `src/components/TopBar.astro`

**Step 1: Update the component**

Replace static text with countdown timer integration.

Replace the full content of `TopBar.astro` with:

```astro
---
import { siteConfig } from '../lib/config';
import CountdownTimer from './CountdownTimer.astro';
---

<a href="#hero" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-[var(--color-dark)]">
  Saltar al contenido principal
</a>

<div role="banner" aria-label="Información de inscripción" class="topbar">
  <div class="container topbar-content">
    <p class="topbar-text">
      <span class="topbar-text-full">Inscripciones cierran en</span>
      <span class="topbar-text-short">Cierra en</span>
    </p>
    <CountdownTimer variant="topbar" />
    <span class="topbar-badge">
      <span class="pulse-dot" aria-hidden="true"></span>
      {siteConfig.cuposDisponibles} lugares
    </span>
  </div>
</div>

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: var(--color-sage-dark);
    padding: var(--space-2) var(--space-4);
  }

  .topbar-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .topbar-text {
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .topbar-text-short {
    display: none;
  }

  .topbar-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.15);
    padding: 3px 10px;
    border-radius: var(--radius-full);
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--color-whatsapp);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @media (max-width: 479px) {
    .topbar-text-full {
      display: none;
    }
    .topbar-text-short {
      display: inline;
    }
    .topbar-content {
      gap: var(--space-2);
    }
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/TopBar.astro
git commit -m "feat: update TopBar with countdown timer and compact mobile layout"
```

---

## Task 8: Update Hero with new copy, dual CTAs, and badge

**Files:**
- Modify: `src/components/Hero.astro`

**Step 1: Update the component**

Replace full content of `Hero.astro`:

```astro
---
import { siteConfig, getPaymentLink, getWhatsAppLink } from '../lib/config';

const paymentLink = getPaymentLink();
const whatsappLink = getWhatsAppLink('hero');
---

<section id="hero" aria-labelledby="hero-title" class="hero section relative overflow-hidden">
  <div class="hero-circle hero-circle--1" aria-hidden="true"></div>
  <div class="hero-circle hero-circle--2" aria-hidden="true"></div>

  <div class="container relative z-10 flex flex-col items-center text-center">
    <span class="hero-badge">
      Conducta &middot; Emoción &middot; Espiritualidad — Solo {siteConfig.cuposDisponibles} mujeres por grupo
    </span>

    <h1 id="hero-title" class="hero-title font-[var(--font-display)] font-bold leading-[1.15] mb-6">
      No es una dieta.<br />
      Es la decisión de<br />
      <em class="italic text-[var(--color-sage-dark)]">dejar de abandonarte.</em>
    </h1>

    <p class="text-lg md:text-xl text-[var(--color-gray)] max-w-[640px] mb-8 leading-relaxed" style="text-wrap: balance;">
      La comida no es tu problema. Es tu síntoma. LIVIANAS trabaja donde las dietas no llegan: tu conducta, tus emociones y tu conexión espiritual. 4 semanas en grupo reducido con Ana. 8 mujeres. Un proceso real.
    </p>

    <div class="hero-ctas">
      <a
        href={paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        data-utm="hero-primary"
        class="hero-cta-primary"
      >
        {siteConfig.ctaMessages.primary}
      </a>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        data-utm="hero-secondary"
        class="hero-cta-secondary"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        {siteConfig.ctaMessages.secondary}
      </a>
    </div>

    <div class="hero-trust">
      <span class="hero-trust-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Respuesta inmediata
      </span>
      <span class="hero-trust-sep" aria-hidden="true">&middot;</span>
      <span class="hero-trust-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        Grupos de {siteConfig.cuposDisponibles}
      </span>
      <span class="hero-trust-sep" aria-hidden="true">&middot;</span>
      <span class="hero-trust-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Sin compromiso
      </span>
    </div>
  </div>
</section>

<style>
  .hero {
    background: linear-gradient(180deg, var(--color-sage-wash) 0%, var(--color-cream) 50%, var(--color-warm-pale) 100%);
    padding: var(--space-16) 0 var(--space-12);
    min-height: auto;
  }

  @media (min-width: 768px) {
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: var(--space-16) 0;
    }
  }

  .hero-title {
    font-size: clamp(2rem, 1.2rem + 3.5vw, 3.25rem);
    color: var(--color-dark);
  }

  .hero-badge {
    display: inline-block;
    background: var(--color-sage);
    color: white;
    border-radius: var(--radius-full);
    padding: 6px 16px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: var(--space-6);
    text-align: center;
    line-height: 1.4;
  }

  .hero-ctas {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    align-items: center;
    width: 100%;
    max-width: 380px;
  }

  @media (min-width: 480px) {
    .hero-ctas {
      flex-direction: row;
      max-width: none;
      justify-content: center;
    }
  }

  .hero-cta-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    font-weight: 700;
    font-size: 1.05rem;
    padding: 14px 28px;
    border-radius: var(--radius-md);
    background: var(--color-sage);
    color: white;
    text-decoration: none;
    cursor: pointer;
    transition: all var(--transition-base);
    width: 100%;
  }

  @media (min-width: 480px) {
    .hero-cta-primary {
      width: auto;
    }
  }

  .hero-cta-primary:hover {
    background: var(--color-sage-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .hero-cta-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    font-weight: 600;
    font-size: 0.95rem;
    padding: 12px 24px;
    border-radius: var(--radius-md);
    border: 2px solid var(--color-sage);
    color: var(--color-sage-dark);
    background: transparent;
    text-decoration: none;
    cursor: pointer;
    transition: all var(--transition-base);
    width: 100%;
  }

  @media (min-width: 480px) {
    .hero-cta-secondary {
      width: auto;
    }
  }

  .hero-cta-secondary:hover {
    background: var(--color-sage-wash);
    transform: translateY(-2px);
  }

  .hero-trust {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    margin-top: var(--space-6);
  }

  .hero-trust-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.825rem;
    color: var(--color-gray);
  }

  .hero-trust-sep {
    color: var(--color-sage);
    font-size: 0.75rem;
  }

  .hero-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
  }

  .hero-circle--1 {
    width: 300px;
    height: 300px;
    background: rgba(123, 143, 107, 0.15);
    top: 10%;
    left: -5%;
  }

  .hero-circle--2 {
    width: 250px;
    height: 250px;
    background: rgba(212, 165, 116, 0.15);
    bottom: 10%;
    right: -5%;
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: update Hero with dual CTAs, new copy, and differentiator badge"
```

---

## Task 9: Update PainPoints with new copy and bridge text

**Files:**
- Modify: `src/components/PainPoints.astro`

**Step 1: Update the component**

Key changes: new title ("Sé lo que se siente..."), highlighted phrases, left-border hover, bridge text + mini CTA.

Replace full content of `PainPoints.astro`:

```astro
---
import SectionLabel from './SectionLabel.astro';
import { painPointsData } from '../lib/config';
---

<section id="problema" aria-labelledby="problema-title" class="section" style="background: #FAFAF7;">
  <div class="container animate-on-scroll">
    <div class="text-center mb-10">
      <SectionLabel text="¿TE SUENA FAMILIAR?" />
      <h2 id="problema-title" class="font-[var(--font-display)] font-bold text-[var(--text-3xl)] md:text-[var(--text-4xl)] text-[var(--color-dark)]">
        Sé lo que se siente...
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
      {painPointsData.map((item) => (
        <article class="pain-card" role="listitem">
          <div class="w-12 h-12 bg-[var(--color-warm-pale)] rounded-[var(--radius-sm)] flex items-center justify-center text-2xl mb-4" aria-hidden="true">
            {item.emoji}
          </div>
          <h3 class="font-bold text-lg text-[var(--color-dark)] mb-2">
            {item.title}
          </h3>
          <p class="text-base text-[var(--color-gray)] leading-relaxed">
            {item.description}
            {' '}<strong class="text-[var(--color-rose)]">{item.highlight}</strong>
            {' '}{item.detail}
          </p>
        </article>
      ))}
    </div>

    <div class="pain-bridge animate-on-scroll">
      <p class="font-[var(--font-display)] font-bold italic text-[var(--text-xl)] md:text-[var(--text-2xl)] text-[var(--color-dark)] mb-4 leading-snug">
        Si te identificaste con alguna de estas, no es tu culpa. Y no estás sola.
      </p>
      <a href="#mini-precio" class="pain-bridge-cta">
        Quiero cambiar esto
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
      </a>
    </div>
  </div>
</section>

<style>
  .pain-card {
    background: white;
    border-left: 4px solid transparent;
    border-radius: var(--radius-md);
    padding: var(--space-6);
    transition: all var(--transition-base);
  }

  .pain-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-left-color: var(--color-rose);
  }

  .pain-bridge {
    text-align: center;
    margin-top: var(--space-10);
    padding-top: var(--space-8);
  }

  .pain-bridge-cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-sage-dark);
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    border: 2px solid var(--color-sage);
    transition: all var(--transition-base);
  }

  .pain-bridge-cta:hover {
    background: var(--color-sage-wash);
    transform: translateY(-2px);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/PainPoints.astro
git commit -m "feat: update PainPoints with empathetic title, highlights, and bridge CTA"
```

---

## Task 10: Update Transformation with new copy and subtitle

**Files:**
- Modify: `src/components/Transformation.astro`

**Step 1: Update the section title and subtitle**

In `Transformation.astro`, replace the header section (lines 9-13) — specifically the `<h2>` text:

Change the `<h2>` text from:
```
En 30 días, vas a pasar de acá...
```
to:
```
En 30 días, esto cambia:
```

And add a subtitle `<p>` after the `</h2>` closing tag:
```html
<p class="text-lg text-[var(--color-gray)] mt-3 max-w-[600px] mx-auto">
  Trabajamos las 3 dimensiones: conducta, emoción y espiritualidad
</p>
```

**Step 2: Commit**

```bash
git add src/components/Transformation.astro
git commit -m "feat: update Transformation title and add 3-dimension subtitle"
```

---

## Task 11: Update Pricing Full with value stack, countdown, payment plan, guarantee

**Files:**
- Modify: `src/components/Pricing.astro`

**Step 1: Rewrite the component**

Replace full content of `Pricing.astro`:

```astro
---
import SectionLabel from './SectionLabel.astro';
import CountdownTimer from './CountdownTimer.astro';
import PaymentButtons from './PaymentButtons.astro';
import { siteConfig, pricingFeatures, valueStackData } from '../lib/config';
---

<section id="precio" aria-labelledby="precio-title" class="section pricing-section">
  <div class="container text-center">
    <SectionLabel text="TU INVERSIÓN" />

    <h2 id="precio-title" class="font-[var(--font-display)] font-bold text-[var(--text-3xl)] md:text-[var(--text-4xl)] text-[var(--color-dark)] mb-3">
      30 días de transformación real
    </h2>

    <p class="text-lg text-[var(--color-gray)] mb-4 max-w-[600px] mx-auto" style="text-wrap: balance;">
      No es un gasto. Es la decisión de invertir en la mujer que querés ser.
    </p>

    <!-- Countdown -->
    <div class="mb-8">
      <p class="text-sm text-[var(--color-gray)] mb-2">El círculo cierra en:</p>
      <CountdownTimer variant="section" />
    </div>

    <div class="pricing-card">
      <div class="h-1.5 w-full" style="background: linear-gradient(90deg, var(--color-sage), var(--color-warm));"></div>

      <div class="p-6 md:p-8">
        <span class="inline-block bg-[var(--color-warm)] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.1em] mb-6">
          Precio de lanzamiento — hasta el {siteConfig.fechaCierre}
        </span>

        <h3 class="font-bold text-xl text-[var(--color-dark)] mb-1">
          LIVIANAS — Experiencia 30 Días
        </h3>

        <p class="text-[var(--color-gray)] text-base mb-6">
          Programa completo con acompañamiento premium
        </p>

        <!-- Value Stack -->
        <div class="value-stack">
          <p class="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-gray)] mb-3">Todo lo que recibís:</p>
          {valueStackData.map((item) => (
            <div class="value-stack-row">
              <span class="text-sm text-[var(--color-dark)]">{item.item}</span>
              <span class="text-sm text-[var(--color-gray)]">USD {item.value}</span>
            </div>
          ))}
          <div class="value-stack-total">
            <span class="font-bold text-[var(--color-dark)]">Valor total</span>
            <span class="font-bold text-[var(--color-dark)]">USD {siteConfig.valorTotal}</span>
          </div>
        </div>

        <!-- Price -->
        <div class="mb-2 mt-6">
          <p class="text-sm text-[var(--color-gray)] mb-1">Tu inversión hoy:</p>
          <div class="mb-1">
            <span class="text-base text-[var(--color-gray)] line-through">USD {siteConfig.precioRegularUSD}</span>
          </div>
          <span class="text-lg text-[var(--color-sage)]">USD</span>
          <span class="font-[var(--font-display)] font-bold text-[var(--text-5xl)] text-[var(--color-dark)]">
            {siteConfig.precioUSD}
          </span>
        </div>

        <p class="text-sm text-[var(--color-sage-dark)] font-medium mb-1">
          o <strong>3 cuotas de USD {siteConfig.precioCuota}</strong>
        </p>

        <p class="text-sm text-[var(--color-gray)] mb-6">
          Pago único &bull; Acceso completo &bull; Material de por vida
        </p>

        <!-- Features -->
        <ul class="text-left space-y-3 mb-8">
          {pricingFeatures.map((feature) => (
            <li class="flex items-start gap-3 text-[var(--color-dark)]">
              <span class="flex-shrink-0 w-6 h-6 bg-[var(--color-sage)] rounded-[var(--radius-sm)] flex items-center justify-center mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span class="text-base">{feature}</span>
            </li>
          ))}
        </ul>

        <!-- Payment -->
        <PaymentButtons variant="full" />

        <!-- Guarantee -->
        <div class="guarantee">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p class="text-sm text-[var(--color-gray)]">
            <strong class="text-[var(--color-dark)]">Garantía:</strong> Si después de la semana 1 sentís que no es para vos, hablamos.
          </p>
        </div>

        <!-- Trust signals -->
        <div class="mt-5 pt-4 border-t border-[var(--color-sage-wash)]">
          <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--color-gray)]">
            <span class="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Pago seguro
            </span>
            <span class="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              MercadoPago &bull; dLocal Go &bull; PayPal
            </span>
          </div>
        </div>
      </div>
    </div>

    <p class="mt-6 text-sm text-[var(--color-gray)] max-w-[400px] mx-auto" style="text-wrap: balance;">
      Son solo USD {siteConfig.precioSemanal} por semana de coaching grupal, acompañamiento diario, plan de alimentación y material de por vida.
    </p>
  </div>
</section>

<style>
  .pricing-section {
    background: linear-gradient(180deg, var(--color-sage-wash), var(--color-cream), var(--color-warm-pale));
  }

  .pricing-card {
    max-width: 560px;
    margin: 0 auto;
    border: 2px solid var(--color-sage);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    background: white;
  }

  .value-stack {
    background: var(--color-cream);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    margin-bottom: var(--space-2);
  }

  .value-stack-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-1) 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .value-stack-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) 0 0;
    margin-top: var(--space-1);
    border-top: 2px solid var(--color-sage);
  }

  .guarantee {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    margin-top: var(--space-4);
    padding: var(--space-3);
    background: var(--color-sage-wash);
    border-radius: var(--radius-sm);
    text-align: left;
  }

  .guarantee svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/Pricing.astro
git commit -m "feat: update Pricing with value stack, countdown, payment plan, and guarantee"
```

---

## Task 12: Update FinalCTA with new copy

**Files:**
- Modify: `src/components/FinalCTA.astro`

**Step 1: Update CTA text and add countdown reference**

Replace full content of `FinalCTA.astro`:

```astro
---
import { siteConfig, getPaymentLink, getWhatsAppLink } from '../lib/config';
import CountdownTimer from './CountdownTimer.astro';

const paymentLink = getPaymentLink();
const whatsappLink = getWhatsAppLink('finalCta');
---

<section id="cta-final" aria-labelledby="cta-final-title" class="section relative overflow-hidden">
  <div class="absolute top-0 left-0 w-48 h-48 rounded-full bg-white/5 -translate-x-1/3 -translate-y-1/3 pointer-events-none" aria-hidden="true"></div>
  <div class="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3 pointer-events-none" aria-hidden="true"></div>

  <div class="container container--narrow relative z-10 text-center">
    <h2 id="cta-final-title" class="font-[var(--font-display)] font-bold italic text-[var(--text-3xl)] md:text-[var(--text-4xl)] text-white mb-4 leading-tight">
      Tu cuerpo no es el enemigo.<br/>Es el espejo.
    </h2>

    <p class="text-lg text-white/85 mb-6 max-w-[540px] mx-auto leading-relaxed" style="text-wrap: balance;">
      En 30 días podés seguir peleando con la balanza, o podés elegir una forma nueva de tratarte. LIVIANAS es esa elección.
    </p>

    <div class="mb-8">
      <p class="text-sm text-white/60 mb-2">El círculo cierra en:</p>
      <div class="final-countdown">
        <CountdownTimer variant="topbar" />
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
      <a
        href={paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        data-utm="final-primary"
        class="inline-flex items-center justify-center gap-2 font-bold text-lg rounded-[var(--radius-md)] bg-white text-[var(--color-sage-dark)] px-6 py-3 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)] cursor-pointer no-underline"
      >
        {siteConfig.ctaMessages.finalCta}
      </a>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        data-utm="final-secondary"
        class="inline-flex items-center justify-center gap-2 font-medium text-base rounded-[var(--radius-md)] border-2 border-white/30 text-white px-5 py-2.5 hover:bg-white/10 transition-all duration-[var(--transition-base)] cursor-pointer no-underline"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Hablar con Ana
      </a>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/60">
      <span class="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Respuesta en minutos
      </span>
      <span class="hidden sm:inline text-white/30">|</span>
      <span class="flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Cupos limitados
      </span>
    </div>
  </div>
</section>

<style>
  section {
    background: var(--color-sage-dark);
    background-image:
      radial-gradient(circle at 30% 50%, rgba(123, 143, 107, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 70% 50%, rgba(212, 165, 116, 0.15) 0%, transparent 50%);
  }

  .final-countdown {
    display: inline-block;
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/FinalCTA.astro
git commit -m "feat: update FinalCTA with dual CTAs, countdown timer, and circulo language"
```

---

## Task 13: Update stagger animations in global.css

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Add staggered animation utility**

After the `.animation-pulse` rule (around line 268), add:

```css
/* Staggered scroll animation for card grids */
.stagger-children .animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease-out, transform 600ms ease-out;
}

.stagger-children .animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.stagger-children > *:nth-child(1) { transition-delay: 0ms; }
.stagger-children > *:nth-child(2) { transition-delay: 100ms; }
.stagger-children > *:nth-child(3) { transition-delay: 200ms; }
.stagger-children > *:nth-child(4) { transition-delay: 300ms; }
.stagger-children > *:nth-child(5) { transition-delay: 400ms; }
.stagger-children > *:nth-child(6) { transition-delay: 500ms; }
.stagger-children > *:nth-child(7) { transition-delay: 600ms; }
.stagger-children > *:nth-child(8) { transition-delay: 700ms; }
```

**Step 2: Add CTA hover enhancement**

After the stagger rules, add:

```css
/* CTA hover enhancements */
[data-utm]:hover {
  transform: translateY(-2px) scale(1.02);
}
```

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add staggered animations and CTA hover enhancements to global.css"
```

---

## Task 14: Update index.astro with new page flow

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace index.astro content**

New component order per the design. Removes UrgencyBar, adds MiniPricing, ParaQuienEs, StickyMobileCTA.

```astro
---
import Layout from '../layouts/Layout.astro';
import TopBar from '../components/TopBar.astro';
import Hero from '../components/Hero.astro';
import VideoAna from '../components/VideoAna.astro';
import PainPoints from '../components/PainPoints.astro';
import Transformation from '../components/Transformation.astro';
import MiniPricing from '../components/MiniPricing.astro';
import WeeksProgram from '../components/WeeksProgram.astro';
import Includes from '../components/Includes.astro';
import ParaQuienEs from '../components/ParaQuienEs.astro';
import AboutAna from '../components/AboutAna.astro';
import Pricing from '../components/Pricing.astro';
import FAQ from '../components/FAQ.astro';
import FinalCTA from '../components/FinalCTA.astro';
import Footer from '../components/Footer.astro';
import WhatsAppButton from '../components/WhatsAppButton.astro';
import StickyMobileCTA from '../components/StickyMobileCTA.astro';
---

<Layout>
  <TopBar />
  <Hero />
  <VideoAna />
  <PainPoints />
  <Transformation />
  <MiniPricing />
  <WeeksProgram />
  <Includes />
  <ParaQuienEs />
  <AboutAna />
  <Pricing />
  <FAQ />
  <FinalCTA />
  <Footer />
  <WhatsAppButton />
  <StickyMobileCTA />
</Layout>
```

**Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: update page flow — add MiniPricing, ParaQuienEs, StickyMobileCTA, remove UrgencyBar"
```

---

## Task 15: Update Layout.astro tracking for payment link clicks

**Files:**
- Modify: `src/layouts/Layout.astro`

**Step 1: Add payment click tracking**

In `Layout.astro`, in the tracking `<script>` block (around line 155-216), find the WhatsApp click tracking section and expand it to also track payment button clicks. Add this after the existing WhatsApp click tracking `forEach` block (after line 181):

```typescript
// Payment link click tracking
document.querySelectorAll('[data-utm^="payment-"]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const source = (btn as HTMLElement).dataset.utm;

    if (typeof (window as any).fbq !== 'undefined') {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'Payment Click',
        content_category: source,
        value: 297,
        currency: 'USD',
      });
    }

    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'payment_click', {
        button_location: source,
      });
    }
  });
});
```

**Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add payment link click tracking for Meta Pixel and GA4"
```

---

## Task 16: Verify full build and dev server

**Step 1: Run build check**

Run from `livianas-landing/`:
```bash
node node_modules/astro/astro.js check
```
Expected: No TypeScript errors

**Step 2: Run production build**

```bash
node node_modules/astro/astro.js build
```
Expected: Build completes with all pages rendered

**Step 3: Start dev server and visually verify**

```bash
node node_modules/astro/astro.js dev
```
Expected: Server starts on port 4321, landing loads with new flow

**Step 4: Verify the page flow order in browser**

Navigate to `http://localhost:4321` and confirm:
1. TopBar has countdown timer
2. Hero has dual CTAs and new badge
3. VideoAna (manifesto section) unchanged
4. PainPoints has bridge text + CTA
5. Transformation has new subtitle
6. MiniPricing appears with price
7. WeeksProgram unchanged
8. Includes unchanged
9. ParaQuienEs ("Esto es para vos si...") replaces old Testimonials
10. AboutAna unchanged
11. Pricing Full has value stack + countdown + guarantee
12. FAQ unchanged
13. FinalCTA has countdown + dual CTAs
14. Sticky mobile CTA appears on scroll (test in mobile viewport)

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete landing optimization — new flow, dual CTAs, charm pricing, countdown timers"
```

---

## Summary of all files

### Created (5 new components):
- `src/components/CountdownTimer.astro`
- `src/components/PaymentButtons.astro`
- `src/components/MiniPricing.astro`
- `src/components/StickyMobileCTA.astro`
- `src/components/ParaQuienEs.astro`

### Modified (10 files):
- `src/lib/config.ts` — charm pricing, circulo language, value stack data, new CTA messages
- `src/components/TopBar.astro` — countdown timer
- `src/components/Hero.astro` — dual CTAs, new copy, badge
- `src/components/PainPoints.astro` — empathetic title, highlights, bridge CTA
- `src/components/Transformation.astro` — new title + subtitle
- `src/components/Pricing.astro` — value stack, countdown, payment plan, guarantee
- `src/components/FinalCTA.astro` — countdown, dual CTAs
- `src/pages/index.astro` — new page flow
- `src/layouts/Layout.astro` — payment tracking
- `src/styles/global.css` — stagger animations
- `.env` — payment link variables

### Unchanged:
- `src/components/VideoAna.astro`
- `src/components/WeeksProgram.astro`
- `src/components/Includes.astro`
- `src/components/AboutAna.astro`
- `src/components/FAQ.astro`
- `src/components/Footer.astro`
- `src/components/WhatsAppButton.astro`
- `src/components/WhatsAppCTA.astro` (no longer imported by modified components)
- `src/components/SectionLabel.astro`
- `src/components/UrgencyBar.astro` (kept in repo but no longer imported)

### Deleted:
- None (UrgencyBar kept but unused — can be cleaned up later)
