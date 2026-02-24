# LIVIANAS – Experiencia 30 Días
## Documento de Arquitectura Técnica, SEO y Tracking

**Proyecto:** AnaBienestarGrupal  
**Fecha:** Febrero 2026  
**Documento:** Especificación técnica para desarrollo con Claude Code  
**Confidencial**

---

## Índice

1. [Decisiones de Arquitectura (Stack, Hosting, Deploy)](#1-decisiones-de-arquitectura)
2. [Sistema de Diseño](#2-sistema-de-diseño)
3. [Especificación Técnica por Sección](#3-especificación-técnica-por-sección)
4. [Guía de SEO Técnico](#4-guía-de-seo-técnico)
5. [Plan de Tracking (Píxel de Meta + GA4)](#5-plan-de-tracking)
6. [Checklist de Performance](#6-checklist-de-performance)
7. [Instrucciones para Claude Code](#7-instrucciones-para-claude-code)
8. [Apéndices](#8-apéndices)

---

## 1. Decisiones de Arquitectura

### 1.1 Stack Seleccionado

| Componente | Tecnología | Justificación |
|---|---|---|
| **Framework** | **Astro 5.x** | Zero JS por defecto = carga ultra rápida. Ideal para landing pages estáticas con islas interactivas mínimas. Mobile-first desde el core. |
| **Hosting/Deploy** | **Vercel** | Edge network global, HTTPS automático, deploy desde GitHub, dominio custom gratis, preview deploys. Free tier cubre este proyecto. |
| **Repositorio** | **GitHub** | Versionado, integración directa con Vercel (auto-deploy en push a main). |
| **Backend/CMS ligero** | **Supabase** | Tabla simple para contenido dinámico (cupos, fechas, textos de urgencia) que Ana pueda editar sin tocar código. También para almacenar leads opcionalmente. |
| **Estilos** | **Tailwind CSS 4.x** | Viene integrado con Astro. Utility-first, purge automático = CSS mínimo. |
| **Fuentes** | **Google Fonts (self-hosted)** | Playfair Display + DM Sans descargadas localmente, no desde CDN externo. |
| **Pasarelas de pago** | **Mercado Pago (UY) + dLocal Go (LATAM) + PayPal (Internacional)** | Integración vía SDK/Webhooks. Mercado Pago cubre Uruguay, dLocal Go habilita cobros en toda LATAM sin Stripe Atlas, PayPal para pagos internacionales. |

### 1.2 ¿Por qué Astro y no otras opciones?

| Opción | Veredicto | Razón |
|---|---|---|
| HTML estático puro | ❌ Descartado | Sin sistema de componentes, difícil mantener, sin optimización automática de imágenes. |
| Next.js | ❌ Descartado | Overkill para una landing. Envía React runtime (~80KB) innecesario. Más lento en First Paint. |
| WordPress | ❌ Descartado | Pesado, requiere hosting PHP, superficie de ataque grande, lento sin optimización agresiva. |
| **Astro** | ✅ **Elegido** | 0KB JS por defecto, componentes reutilizables, Image optimization built-in, integración Tailwind nativa, SSG perfecto para landing. |

### 1.3 Estructura del Proyecto

```
livianas-landing/
├── public/
│   ├── fonts/                    # Playfair Display + DM Sans (woff2)
│   ├── images/
│   │   ├── ana-foto.webp         # Foto de Ana (múltiples tamaños)
│   │   ├── og-image.jpg          # Open Graph 1200x630
│   │   └── favicon.svg           # Favicon SVG
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── TopBar.astro          # Sección 0: Barra superior
│   │   ├── Hero.astro            # Sección 1
│   │   ├── VideoAna.astro        # Sección 2
│   │   ├── PainPoints.astro      # Sección 3: El dolor
│   │   ├── Transformation.astro  # Sección 4
│   │   ├── WeeksProgram.astro    # Sección 5: Las 4 semanas
│   │   ├── Includes.astro        # Sección 6: Qué incluye
│   │   ├── Testimonials.astro    # Sección 7
│   │   ├── AboutAna.astro        # Sección 8
│   │   ├── UrgencyBar.astro      # Sección 9
│   │   ├── Pricing.astro         # Sección 10
│   │   ├── FAQ.astro             # Sección 11
│   │   ├── FinalCTA.astro        # Sección 12
│   │   ├── Footer.astro
│   │   ├── WhatsAppButton.astro  # Botón flotante global
│   │   ├── WhatsAppCTA.astro     # Componente reutilizable de CTA
│   │   └── SectionLabel.astro    # Label reutilizable (ej: "¿TE SUENA FAMILIAR?")
│   ├── layouts/
│   │   └── Layout.astro          # Layout base con head, meta tags, scripts
│   ├── pages/
│   │   ├── index.astro           # Landing principal
│   │   ├── privacidad.astro      # Política de privacidad
│   │   └── terminos.astro        # Términos y condiciones
│   ├── styles/
│   │   └── global.css            # Variables CSS, font-face, animaciones
│   └── lib/
│       ├── config.ts             # Configuración centralizada (tel WhatsApp, fechas, cupos)
│       └── supabase.ts           # Cliente Supabase (opcional, para contenido dinámico)
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── .env                          # Variables: SUPABASE_URL, SUPABASE_KEY, META_PIXEL_ID, GA4_ID, WHATSAPP_NUMBER
```

### 1.4 Uso de Supabase (Contenido Dinámico)

Crear una tabla `site_config` en Supabase con la siguiente estructura:

```sql
CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO site_config (key, value) VALUES
  ('cupos_disponibles', '8'),
  ('fecha_cierre', '2026-03-28'),
  ('fecha_inicio_cohorte', '2026-03-31'),
  ('inscripciones_abiertas', 'true'),
  ('texto_urgencia', 'Cupos limitados — Solo 8 mujeres por grupo — Próxima cohorte abre pronto'),
  ('precio_usd', '300'),
  ('whatsapp_number', '598XXXXXXXXX');
```

**Cómo funciona:** Astro puede hacer fetch a Supabase en build time (SSG) o en runtime con una isla interactiva. Para máxima velocidad, se recomienda SSG con rebuild manual o webhook desde Supabase cuando Ana actualice datos. Vercel permite redeploy por webhook en < 30 segundos.

**Alternativa simple:** Si Supabase resulta complejo para Ana, usar un archivo `src/lib/config.ts` con las variables hardcodeadas. Ana puede pedir al equipo técnico que actualice y haga deploy (1 minuto con Vercel).

---

## 2. Sistema de Diseño

### 2.1 Design Tokens (Variables CSS)

```css
:root {
  /* Colores - del documento de copy */
  --color-sage: #7B8F6B;
  --color-sage-dark: #5A7450;
  --color-sage-wash: #E8EDE4;        /* sage al 15% opacidad sobre cream */
  --color-cream: #FDF8F0;
  --color-warm: #D4A574;
  --color-warm-pale: #F5EDE3;        /* warm al 15% sobre cream */
  --color-rose: #C17B7B;
  --color-rose-pale: #F2E4E4;        /* rose al 15% sobre cream */
  --color-whatsapp: #25D366;
  --color-whatsapp-hover: #1EBE5A;
  --color-dark: #2C2C2C;
  --color-gray: #6E6E6E;
  --color-white: #FFFFFF;

  /* Tipografías */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, -apple-system, sans-serif;

  /* Escala tipográfica (mobile-first) */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px - solo desktop */

  /* Espaciado */
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */

  /* Sección padding vertical (mobile / desktop) */
  --section-py-mobile: var(--space-12);   /* 48px */
  --section-py-desktop: var(--space-20);  /* 80px */

  /* Bordes y sombras */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  --shadow-xl: 0 12px 36px rgba(0,0,0,0.15);

  /* Transiciones */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;

  /* Contenedor */
  --container-max: 1120px;
  --container-narrow: 720px;
  --container-px-mobile: var(--space-4);   /* 16px */
  --container-px-desktop: var(--space-8);  /* 32px */
}
```

### 2.2 Breakpoints

```
Mobile:   < 480px   (diseño base, mobile-first)
Tablet:   480-768px
Desktop:  > 768px
Wide:     > 1024px  (solo para refinamientos menores)
```

Tailwind config:
```js
screens: {
  'sm': '480px',
  'md': '768px',
  'lg': '1024px',
}
```

### 2.3 Tipografías - Carga Optimizada

Descargar solo los pesos necesarios en formato `woff2`:

| Fuente | Pesos | Uso |
|---|---|---|
| Playfair Display | 700 (Bold), 700 Italic | Títulos H1, H2, frases emocionales |
| DM Sans | 400 (Regular), 500 (Medium), 700 (Bold) | Cuerpo, botones, labels |

```css
/* En global.css */
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/PlayfairDisplay-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/PlayfairDisplay-BoldItalic.woff2') format('woff2');
  font-weight: 700;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'DM Sans';
  src: url('/fonts/DMSans-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'DM Sans';
  src: url('/fonts/DMSans-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'DM Sans';
  src: url('/fonts/DMSans-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

**CRÍTICO:** Precargar las fuentes en el `<head>`:
```html
<link rel="preload" href="/fonts/DMSans-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/PlayfairDisplay-Bold.woff2" as="font" type="font/woff2" crossorigin>
```

### 2.4 Animaciones Definidas

| Animación | Dónde | CSS | Timing |
|---|---|---|---|
| **Pulse** | Botón flotante WhatsApp, badge "Cupos limitísimos" | `box-shadow` que crece/decrece | `2s ease-in-out infinite` |
| **Float** | Emojis de las 4 semanas | `translateY(-6px)` ida y vuelta | `3s ease-in-out infinite`, escalonado 0.5s entre cada uno |
| **Fade-in-up** | Cada sección al entrar en viewport | `opacity 0→1, translateY(20px→0)` | `600ms ease-out`, trigger: Intersection Observer al 15% visible |
| **Card hover** | Cards de dolor, semanas, incluye | `translateY(-6px) + shadow-lg` | `var(--transition-base)` |
| **Rotate icon** | FAQ accordion `+` → `×` | `rotate(0→45deg)` | `var(--transition-fast)` |
| **Accordion expand** | FAQ respuestas | `max-height: 0 → auto` con `grid-template-rows: 0fr → 1fr` | `var(--transition-slow)` |

**IMPORTANTE:** Todas las animaciones deben respetar `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. Especificación Técnica por Sección

### Sección 0: Barra Superior (Top Bar)

**HTML semántico:**
```html
<div role="banner" aria-label="Información de cupos" class="topbar">
  <p>Cupos limitados — Solo <strong>8 mujeres</strong> por grupo — Próxima cohorte abre pronto</p>
</div>
```

**Especificaciones:**
- **Posición:** `position: sticky; top: 0; z-index: 50`
- **Fondo:** `var(--color-sage)` (#7B8F6B)
- **Texto:** blanco, DM Sans 500, `var(--text-sm)`
- **"8 mujeres":** color `var(--color-warm)` (#D4A574), font-weight 700
- **Padding:** `var(--space-2) var(--space-4)` (8px 16px)
- **Texto centrado**
- **Mobile:** Una línea si cabe, dos líneas con text-wrap: balance si no
- **Contenido dinámico:** Este texto debe poder cambiarse desde `config.ts` o Supabase

---

### Sección 1: Hero

**HTML semántico:**
```html
<section id="hero" aria-labelledby="hero-title">
  <div class="container">
    <span class="badge">TRANSFORMACIÓN GRUPAL EN 30 DÍAS</span>
    <h1 id="hero-title">
      No es una dieta.<br>
      Es la decisión de<br>
      <em>dejar de abandonarte.</em>
    </h1>
    <p class="subtitle">Un programa grupal de 4 semanas para mujeres que quieren ordenar su alimentación, entender sus emociones y reconectar con su valor. Sin contar calorías. Con acompañamiento real.</p>
    <!-- Componente WhatsAppCTA -->
    <a href="https://wa.me/598XXXXXXXXX?text=..." class="cta-whatsapp" data-utm="hero">
      <svg><!-- WhatsApp icon --></svg>
      Quiero mi lugar
    </a>
    <small>Respuesta inmediata por WhatsApp</small>
  </div>
</section>
```

**Especificaciones:**
- **Altura:** `min-height: 100vh` en desktop, `min-height: auto` en mobile con `padding: var(--space-16) 0`
- **Fondo:** Gradiente: `linear-gradient(180deg, var(--color-sage-wash) 0%, var(--color-cream) 50%, var(--color-warm-pale) 100%)`
- **Decoración:** 2-3 círculos con `backdrop-filter: blur(60px)` posicionados absolute, colores sage y warm al 20% opacidad. **No deben distraer.**
- **Badge (pill):** `background: var(--color-sage); color: white; border-radius: var(--radius-full); padding: var(--space-1) var(--space-4); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--font-body); font-weight: 700`
- **H1:** Playfair Display 700, `var(--text-4xl)` mobile → `var(--text-5xl)` desktop. Color `var(--color-dark)`. El `<em>` en Playfair Display 700 italic, color `var(--color-sage-dark)`.
- **Subtítulo:** DM Sans 400, `var(--text-lg)`, color `var(--color-gray)`, `max-width: 600px`
- **Botón CTA:** Ver especificación global de botón WhatsApp abajo
- **Microcopy:** DM Sans 400, `var(--text-sm)`, color `var(--color-gray)`

---

### Sección 2: Video de Ana

**HTML semántico:**
```html
<section id="video" aria-label="Video de presentación">
  <div class="container container--narrow">
    <div class="video-wrapper" style="aspect-ratio: 16/9;">
      <!-- Placeholder hasta que Ana grabe -->
      <button class="video-play" aria-label="Reproducir video de presentación">
        <svg><!-- Play icon --></svg>
      </button>
      <!-- Cuando haya video: <lite-youtube> o iframe lazy -->
    </div>
    <p class="video-caption">Conocé el programa en 90 segundos</p>
  </div>
</section>
```

**Especificaciones:**
- **Contenedor:** `max-width: var(--container-narrow)` (720px), centrado
- **Video wrapper:** `aspect-ratio: 16/9; border-radius: var(--radius-lg); overflow: hidden; max-width: 640px; margin: 0 auto`
- **Fondo placeholder:** Gradiente sage/warm suave
- **Botón play:** Círculo blanco 72px con sombra, icono play sage, centrado sobre el placeholder
- **Caption:** DM Sans 400, `var(--text-sm)`, color `var(--color-gray)`, centrado, `margin-top: var(--space-3)`
- **Lazy loading:** Usar componente `lite-youtube` o `lite-vimeo` cuando haya video real. NO cargar iframe de YouTube directamente (ahorra ~500KB de JS).
- **CRÍTICO Performance:** El video NO debe cargar hasta que el usuario haga click (facade pattern)

---

### Sección 3: El Dolor (Problema)

**HTML semántico:**
```html
<section id="problema" aria-labelledby="problema-title">
  <div class="container">
    <span class="section-label">¿TE SUENA FAMILIAR?</span>
    <h2 id="problema-title">Quizás estás viviendo esto...</h2>
    <div class="pain-grid" role="list">
      <article class="pain-card" role="listitem">
        <div class="pain-emoji" aria-hidden="true">😤</div>
        <h3>El ciclo interminable</h3>
        <p>Empezás el lunes con toda la motivación...</p>
      </article>
      <!-- 3 cards más -->
    </div>
  </div>
</section>
```

**Especificaciones:**
- **Section label:** (componente reutilizable) DM Sans 700, `var(--text-xs)`, uppercase, `letter-spacing: 0.15em`, color `var(--color-sage)`
- **H2:** Playfair Display 700, `var(--text-3xl)` mobile → `var(--text-4xl)` desktop, color `var(--color-dark)`
- **Grid:** `grid-template-columns: 1fr` mobile → `repeat(2, 1fr)` desktop. `gap: var(--space-6)`
- **Cards:** `background: white; border: 1px solid var(--color-rose-pale); border-radius: var(--radius-md); padding: var(--space-6)`
- **Card hover:** `transform: translateY(-6px); box-shadow: var(--shadow-lg); border-top: 3px solid` con gradiente rose→warm
- **Emoji container:** `width: 48px; height: 48px; background: var(--color-warm-pale); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 24px`
- **H3 card:** DM Sans 700, `var(--text-lg)`, color `var(--color-dark)`
- **P card:** DM Sans 400, `var(--text-base)`, color `var(--color-gray)`, `line-height: 1.6`
- **Fondo sección:** `var(--color-cream)` o `#FAFAF7` (off-white muy sutil)

---

### Sección 4: La Transformación

**HTML semántico:**
```html
<section id="transformacion" aria-labelledby="transformacion-title">
  <div class="container container--narrow">
    <span class="section-label">LA TRANSFORMACIÓN</span>
    <h2 id="transformacion-title">En 30 días, vas a pasar de acá...</h2>
    <div class="transform-pairs">
      <div class="transform-row">
        <div class="transform-from" aria-label="Antes">
          <s>Mujer que vive empezando el lunes</s>
        </div>
        <div class="transform-arrow" aria-hidden="true">→</div>
        <div class="transform-to" aria-label="Después">
          <strong>Mujer que se organiza, se respeta y se sostiene</strong>
        </div>
      </div>
      <!-- 2 pares más -->
    </div>
  </div>
</section>
```

**Especificaciones:**
- **Layout pares:** Flex row en desktop (from → arrow → to), stack vertical en mobile (from ↓ arrow rotada ↓ to)
- **"DE" (from):** `background: var(--color-rose-pale); text-decoration: line-through; padding: var(--space-3) var(--space-4); border-radius: var(--radius-sm); color: var(--color-gray)`
- **"A" (to):** `background: var(--color-sage-wash); font-weight: 700; padding: var(--space-3) var(--space-4); border-radius: var(--radius-sm); color: var(--color-dark)`
- **Flecha:** `color: var(--color-warm); font-size: var(--text-2xl)`. En mobile: `transform: rotate(90deg)`
- **Gap entre pares:** `var(--space-6)`

---

### Sección 5: Las 4 Semanas

**HTML semántico:**
```html
<section id="programa" aria-labelledby="programa-title">
  <div class="container">
    <span class="section-label">EL PROGRAMA</span>
    <h2 id="programa-title">4 semanas que cambian todo</h2>
    <p class="section-subtitle">Cada semana trabaja una dimensión diferente...</p>
    <div class="weeks-grid" role="list">
      <article class="week-card week-card--1" role="listitem">
        <div class="week-number">Semana 1</div>
        <div class="week-emoji" aria-hidden="true">🌱</div>
        <h3>CONSCIENCIA</h3>
        <p class="week-name">Despertar</p>
        <p class="week-desc">Identificá tus sabotajes, patrones emocionales...</p>
      </article>
      <!-- 3 cards más -->
    </div>
  </div>
</section>
```

**Especificaciones:**
- **Grid:** `grid-template-columns: 1fr` mobile → `repeat(2, 1fr)` tablet → `repeat(4, 1fr)` desktop. `gap: var(--space-6)`
- **Cards:** `border-radius: var(--radius-lg); padding: var(--space-6); text-align: center`
- **Gradientes por card:**
  - Semana 1 (Consciencia): `linear-gradient(135deg, #F5EDE3, #EDDCC8)` (warm/dorado)
  - Semana 2 (Acción): `linear-gradient(135deg, #E8EDE4, #D1DCC9)` (sage/verde)
  - Semana 3 (Energía): `linear-gradient(135deg, #E4EDF5, #C9D6E8)` (azul suave)
  - Semana 4 (Identidad): `linear-gradient(135deg, #F2E4E4, #E8C9C9)` (rose/rosa)
- **Emoji:** `font-size: 32px;` con animación float (ver 2.4). Escalonamiento: card 1 delay 0s, card 2 delay 0.5s, etc.
- **Card hover:** `transform: translateY(-6px); box-shadow: var(--shadow-lg)`
- **H3:** DM Sans 700, `var(--text-xl)`, uppercase, `letter-spacing: 0.05em`
- **Nombre de semana:** DM Sans 500, `var(--text-base)`, color `var(--color-sage-dark)`

---

### Sección 6: Qué Incluye

**HTML semántico:**
```html
<section id="incluye" aria-labelledby="incluye-title">
  <div class="container">
    <span class="section-label">TODO LO QUE INCLUYE</span>
    <h2 id="incluye-title">Una experiencia completa de transformación</h2>
    <div class="includes-grid" role="list">
      <div class="include-item" role="listitem">
        <div class="include-check" aria-hidden="true">
          <svg><!-- Checkmark icon --></svg>
        </div>
        <div>
          <h3>4 clases en vivo de 1h30</h3>
          <p>Coaching grupal semanal con Ana. Teoría + ejercicio práctico + espacio de preguntas.</p>
        </div>
      </div>
      <!-- 5 items más -->
    </div>
  </div>
</section>
```

**Especificaciones:**
- **Grid:** `grid-template-columns: 1fr` mobile → `repeat(2, 1fr)` desktop. `gap: var(--space-4)`
- **Fondo sección:** `var(--color-sage-wash)`
- **Items:** `background: white; border-radius: var(--radius-md); padding: var(--space-4) var(--space-6); display: flex; gap: var(--space-4); align-items: flex-start`
- **Item hover:** `box-shadow: var(--shadow-md)`
- **Check icon:** Cuadrado 32x32, `background: var(--color-sage); border-radius: var(--radius-sm)`, icono check blanco SVG inline
- **H3 item:** DM Sans 700, `var(--text-base)`, color `var(--color-dark)`
- **P item:** DM Sans 400, `var(--text-sm)`, color `var(--color-gray)`

---

### Sección 7: Testimonios

**HTML semántico:**
```html
<section id="testimonios" aria-labelledby="testimonios-title">
  <div class="container">
    <span class="section-label">LO QUE DICEN ELLAS</span>
    <h2 id="testimonios-title">Historias reales de mujeres reales</h2>
    <div class="testimonials-grid" role="list">
      <blockquote class="testimonial-card" role="listitem">
        <div class="testimonial-stars" aria-label="5 estrellas">★★★★★</div>
        <p>"Por primera vez entendí que mi problema no era la comida..."</p>
        <footer>
          <div class="testimonial-avatar" aria-hidden="true">MF</div>
          <cite>María F., 42 años, Montevideo</cite>
        </footer>
      </blockquote>
      <!-- 2 testimonios más -->
    </div>
  </div>
</section>
```

**Especificaciones:**
- **Layout:** `grid-template-columns: 1fr` mobile → `repeat(3, 1fr)` desktop. `gap: var(--space-6)`. En mobile: scroll horizontal (carousel) con `overflow-x: auto; scroll-snap-type: x mandatory; scroll-snap-align: start` en cada card.
- **Cards:** `background: white; border-radius: var(--radius-lg); padding: var(--space-6); box-shadow: var(--shadow-sm)`
- **Comillas:** Pseudo-elemento `::before` con `content: '"'; font-family: var(--font-display); font-size: 64px; color: var(--color-sage-wash); position: absolute; top: var(--space-4); left: var(--space-4)`
- **Estrellas:** color `var(--color-warm)`, `font-size: var(--text-lg)`, `letter-spacing: 2px`
- **Avatar:** Círculo 48px, `background: linear-gradient(135deg, var(--color-sage), var(--color-warm))`, iniciales en blanco DM Sans 700
- **Cite:** DM Sans 500, `var(--text-sm)`, color `var(--color-gray)`, `font-style: normal`
- **NOTA:** Los testimonios actuales son PLACEHOLDER. Reemplazar con reales de Ana.

---

### Sección 8: Sobre Ana

**HTML semántico:**
```html
<section id="sobre-ana" aria-labelledby="ana-title">
  <div class="container">
    <div class="about-grid">
      <div class="about-image">
        <img src="/images/ana-foto.webp" alt="Ana, creadora de LIVIANAS" width="480" height="600" loading="lazy">
      </div>
      <div class="about-content">
        <span class="section-label">QUIEN TE GUÍA</span>
        <h2 id="ana-title">Hola, soy Ana</h2>
        <p>Creadora del Método Livianas. Acompaño a mujeres a transformar...</p>
        <p>No creo en la fuerza de voluntad. Creo en entenderte...</p>
        <div class="about-tags">
          <span class="tag">Método Livianas</span>
          <span class="tag">Nutrición Consciente</span>
          <span class="tag">Coaching Emocional</span>
          <span class="tag">Enfoque Antiinflamatorio</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Especificaciones:**
- **Grid:** 2 columnas en desktop (foto izq 40%, texto der 60%), stack en mobile (foto arriba, texto abajo)
- **Foto:** `border-radius: var(--radius-xl)` (24px). WebP con fallback JPG. Tamaños: 480px mobile, 640px desktop. `object-fit: cover`. **PENDIENTE de Ana.**
- **Tags:** `display: inline-flex; background: var(--color-sage-wash); color: var(--color-sage-dark); padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: var(--text-sm); font-weight: 500; gap: var(--space-2); flex-wrap: wrap`

---

### Sección 9: Barra de Urgencia

**HTML semántico:**
```html
<div role="status" aria-live="polite" class="urgency-bar">
  <p>La próxima cohorte abre pronto. Grupos de máximo <strong>8 mujeres</strong> — cuando se llenan, se cierran.</p>
  <span class="urgency-badge">
    <span class="pulse-dot" aria-hidden="true"></span>
    Cupos limitísimos
  </span>
</div>
```

**Especificaciones:**
- **Full-width**, `background: var(--color-sage)`, texto blanco
- **"8 mujeres":** bold, color `var(--color-warm)`
- **Badge:** `background: rgba(255,255,255,0.15); padding: var(--space-1) var(--space-3); border-radius: var(--radius-full)`
- **Pulse dot:** Círculo 8px, `background: var(--color-whatsapp)`, animación `pulse` (scale 1→1.5 + opacity 1→0 en loop)
- **Contenido dinámico desde config**

---

### Sección 10: Precio y CTA Principal

**HTML semántico:**
```html
<section id="precio" aria-labelledby="precio-title">
  <div class="container">
    <span class="section-label">TU INVERSIÓN</span>
    <h2 id="precio-title">30 días de transformación real</h2>
    <p class="section-subtitle">No es un gasto. Es la decisión de invertir en la mujer que querés ser.</p>
    <div class="pricing-card">
      <div class="pricing-badge">PRECIO DE LANZAMIENTO</div>
      <h3>LIVIANAS — Experiencia 30 Días</h3>
      <p>Programa completo con acompañamiento premium</p>
      <div class="pricing-amount">
        <span class="currency">USD</span>
        <span class="price">300</span>
      </div>
      <p class="pricing-terms">Pago único • Acceso completo a las 4 semanas</p>
      <ul class="pricing-features">
        <li>4 clases en vivo de 1h30 con Ana</li>
        <!-- 8 items más -->
      </ul>
      <a href="https://wa.me/..." class="cta-whatsapp cta-whatsapp--full" data-utm="pricing">
        <svg><!-- WhatsApp icon --></svg>
        Quiero inscribirme ahora
      </a>
      <p class="pricing-security">🔒 Pago seguro por MercadoPago o transferencia</p>
    </div>
  </div>
</section>
```

**Especificaciones:**
- **Card:** `max-width: 520px; margin: 0 auto; border: 2px solid var(--color-sage); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-xl)`
- **Barra superior card:** `background: linear-gradient(90deg, var(--color-sage), var(--color-warm)); height: 4px`
- **Badge:** `background: var(--color-sage-wash); color: var(--color-sage-dark); padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em`
- **Precio:** `font-family: var(--font-display); font-size: var(--text-5xl); font-weight: 700; color: var(--color-dark)`. "USD" en `var(--text-lg)`, color `var(--color-gray)`
- **Features list:** Check verde a la izquierda de cada item (mismo icono que sección 6)
- **Botón CTA:** `width: 100%` — el botón más grande y prominente de toda la página. Ver spec global abajo.
- **Fondo sección:** Gradiente `var(--color-sage-wash) → var(--color-cream) → var(--color-warm-pale)`

---

### Sección 11: FAQ

**HTML semántico:**
```html
<section id="faq" aria-labelledby="faq-title">
  <div class="container container--narrow">
    <span class="section-label">PREGUNTAS FRECUENTES</span>
    <h2 id="faq-title">¿Tenés dudas? Es normal</h2>
    <div class="faq-list">
      <details class="faq-item">
        <summary>
          <span>¿Cuánto dura el programa?</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </summary>
        <div class="faq-answer">
          <p>El programa dura 4 semanas exactas...</p>
        </div>
      </details>
      <!-- 6 items más -->
    </div>
  </div>
</section>
```

**Especificaciones:**
- **Contenedor:** `max-width: var(--container-narrow)` (720px)
- **Usar `<details>`/`<summary>`:** Funciona sin JavaScript (progressive enhancement). Solo una abierta a la vez requiere mínimo JS (cerrar las demás al abrir una).
- **Summary:** `display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) 0; cursor: pointer; border-bottom: 1px solid #E5E5E5`
- **Pregunta texto:** DM Sans 500, `var(--text-base)`, color `var(--color-dark)`
- **Icono +:** `font-size: var(--text-xl); color: var(--color-sage); transition: transform var(--transition-fast)`. Cuando `details[open]`: `transform: rotate(45deg)` → se ve como ×
- **Respuesta:** DM Sans 400, `var(--text-base)`, color `var(--color-gray)`, `padding: var(--space-2) 0 var(--space-4); line-height: 1.6`
- **Animación:** Usar `grid-template-rows: 0fr → 1fr` para transición suave (CSS puro, sin JS para la animación)
- **Schema markup:** Implementar FAQ schema (ver sección 4)

---

### Sección 12: CTA Final

**HTML semántico:**
```html
<section id="cta-final" aria-labelledby="cta-final-title">
  <div class="container container--narrow" style="text-align: center;">
    <h2 id="cta-final-title">Tu cuerpo no es el enemigo. Es el espejo.</h2>
    <p>En 30 días podés seguir peleando con la balanza, o podés elegir una forma nueva de tratarte. LIVIANAS es esa elección.</p>
    <a href="https://wa.me/..." class="cta-whatsapp cta-whatsapp--inverted" data-utm="final_cta">
      <svg><!-- WhatsApp icon --></svg>
      Empezar mi transformación
    </a>
    <small>Cupos limitados • Respuesta inmediata</small>
  </div>
</section>
```

**Especificaciones:**
- **Fondo:** `var(--color-sage-dark)` (#5A7450) con gradiente radial sutil más claro en el centro
- **Decoración:** Círculo decorativo semi-transparente blanco (10% opacidad), `position: absolute`, en esquina inferior derecha, no distractor
- **H2:** Playfair Display 700 Italic, `var(--text-3xl)`, color blanco
- **P:** DM Sans 400, `var(--text-lg)`, color `rgba(255,255,255,0.85)`
- **Botón invertido:** `background: white; color: var(--color-sage-dark)`. El icono WhatsApp en color `var(--color-whatsapp)`
- **Tono:** Cierre emocional, no venta agresiva

---

### Footer

```html
<footer role="contentinfo">
  <div class="container">
    <p>© 2026 LIVIANAS — Método Livianas por Ana • Todos los derechos reservados</p>
    <nav aria-label="Legal">
      <a href="/privacidad">Política de privacidad</a>
      <a href="/terminos">Términos y condiciones</a>
    </nav>
  </div>
</footer>
```

- **Fondo:** `var(--color-dark)` (#2C2C2C)
- **Texto:** `var(--color-gray)`, DM Sans 400, `var(--text-sm)`
- **Links:** color `#9E9E9E`, hover: white

---

### Botón Flotante de WhatsApp (Global)

```html
<a href="https://wa.me/598XXXXXXXXX?text=..." class="whatsapp-float" aria-label="Contactar por WhatsApp" data-utm="floating">
  <svg><!-- WhatsApp logo SVG --></svg>
</a>
```

**Especificaciones:**
- **Posición:** `position: fixed; bottom: 24px; right: 24px; z-index: 1000`
- **Tamaño:** `width: 64px; height: 64px; border-radius: 50%`
- **Color:** `background: var(--color-whatsapp)`
- **Sombra:** `0 4px 12px rgba(37, 211, 102, 0.4)`
- **Animación pulse:** `box-shadow` que crece de 0 a 20px y decrece, `2s ease-in-out infinite`
- **Hover:** `transform: scale(1.1)`, detiene pulse
- **Icono:** SVG blanco, 32px
- **Mobile:** Mismo tamaño, asegurar que no tape contenido crítico. `bottom: 24px; right: 16px`
- **CRÍTICO:** Nunca ocultar este botón. Puede representar hasta 40% de clics a WhatsApp en mobile.

---

### Especificación Global: Botón CTA WhatsApp

Componente reutilizable `WhatsAppCTA.astro`:

```
Props: text (string), utm (string), variant ('default' | 'full' | 'inverted'), message (string)
```

**Estilo default:**
- `background: var(--color-whatsapp); color: white; border: none; border-radius: var(--radius-md); padding: var(--space-3) var(--space-6); font-family: var(--font-body); font-weight: 700; font-size: var(--text-lg); cursor: pointer; display: inline-flex; align-items: center; gap: var(--space-2); text-decoration: none; transition: background var(--transition-base), transform var(--transition-fast)`
- **Hover:** `background: var(--color-whatsapp-hover); transform: translateY(-2px); box-shadow: var(--shadow-md)`
- **Icono:** SVG WhatsApp blanco 24px a la izquierda del texto
- **Min-height mobile:** 48px (tap-friendly)
- **Variant 'full':** `width: 100%`, padding mayor
- **Variant 'inverted':** `background: white; color: var(--color-sage-dark)`

---

## 4. Guía de SEO Técnico

### 4.1 Meta Tags Completos

En `Layout.astro`, incluir en el `<head>`:

```html
<!-- Básicos -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LIVIANAS — Experiencia 30 Días | Transformación Grupal para Mujeres</title>
<meta name="description" content="Programa grupal de 4 semanas para mujeres. Alimentación antiinflamatoria, coaching emocional y acompañamiento diario. Grupos reducidos de 8. Sin dietas. Con resultados.">
<link rel="canonical" href="https://livianas.com/experiencia-30-dias">
<meta name="robots" content="index, follow">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://livianas.com/experiencia-30-dias">
<meta property="og:title" content="LIVIANAS — 30 días de transformación real">
<meta property="og:description" content="No es una dieta. Es la decisión de dejar de abandonarte. Grupos de 8 mujeres con acompañamiento real.">
<meta property="og:image" content="https://livianas.com/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="es_UY">
<meta property="og:site_name" content="LIVIANAS">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="LIVIANAS — 30 días de transformación real">
<meta name="twitter:description" content="No es una dieta. Es la decisión de dejar de abandonarte.">
<meta name="twitter:image" content="https://livianas.com/images/og-image.jpg">

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">

<!-- Preconnect -->
<link rel="preconnect" href="https://www.googletagmanager.com">

<!-- Fuentes (preload) -->
<link rel="preload" href="/fonts/DMSans-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/PlayfairDisplay-Bold.woff2" as="font" type="font/woff2" crossorigin>
```

### 4.2 Schema Markup (Structured Data)

Incluir como `<script type="application/ld+json">` al final del `<head>`:

**FAQ Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto dura el programa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El programa dura 4 semanas exactas. Cada semana hay una clase en vivo de 1h30 y acompañamiento diario por WhatsApp."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué pasa si no puedo asistir a una clase en vivo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Todas las clases quedan grabadas y las podés ver cuando quieras."
      }
    },
    {
      "@type": "Question",
      "name": "¿Necesito experiencia previa o algún nivel de fitness?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Las rutinas son de 20-30 minutos, sin equipo, y se adaptan a cualquier nivel."
      }
    },
    {
      "@type": "Question",
      "name": "¿Voy a tener que contar calorías o pesar la comida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jamás. Trabajamos con guía de porciones usando tu mano como medida y alimentación consciente."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuántas personas hay por grupo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Máximo 8 mujeres por grupo para garantizar atención personalizada."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo participar desde fuera de Uruguay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí. Las clases son online y el grupo de WhatsApp funciona desde cualquier país."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo es la forma de pago?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Podés pagar con MercadoPago, Stripe para pagos internacionales, o transferencia bancaria directa."
      }
    }
  ]
}
```

**Organization Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LIVIANAS - Método Livianas",
  "url": "https://livianas.com",
  "logo": "https://livianas.com/images/logo-livianas.png",
  "description": "Transformación grupal consciente para mujeres",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Montevideo",
    "addressCountry": "UY"
  },
  "sameAs": [
    "https://www.instagram.com/[HANDLE_ANA]",
    "https://www.facebook.com/[PAGE_ANA]"
  ]
}
```

**Product Schema (para el programa):**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "LIVIANAS — Experiencia 30 Días",
  "description": "Programa grupal de 4 semanas para mujeres. Alimentación antiinflamatoria, coaching emocional y acompañamiento diario.",
  "brand": {
    "@type": "Brand",
    "name": "LIVIANAS"
  },
  "offers": {
    "@type": "Offer",
    "price": "300",
    "priceCurrency": "USD",
    "availability": "https://schema.org/LimitedAvailability",
    "validFrom": "2026-03-16"
  }
}
```

### 4.3 Keyword Mapping por Sección

| Sección | Keyword Principal | Keywords Secundarias |
|---|---|---|
| Hero (H1) | "dejar de abandonarte" (branding) | transformación grupal mujeres, programa 30 días |
| Problema (S3) | hambre emocional | ciclo de dietas, culpa por comer, ansiedad con la comida |
| Transformación (S4) | adelgazamiento consciente | bajar de peso sin dieta, cambio de hábitos |
| Las 4 semanas (S5) | programa grupal bienestar femenino | coaching nutricional grupal, alimentación antiinflamatoria |
| Qué incluye (S6) | acompañamiento nutricional online | plan de menú antiinflamatorio, guía de porciones |
| Sobre Ana (S8) | método livianas | nutrición consciente, coaching emocional alimentación |
| FAQ (S11) | programa grupal adelgazamiento consciente | grupo adelgazamiento online, bienestar femenino |

**Densidad recomendada:** 1-2% para keyword principal por sección. Usar variaciones semánticas naturales, no repetir mecánicamente.

### 4.4 Estructura de URLs

| Página | URL | Indexar |
|---|---|---|
| Landing principal | `/experiencia-30-dias` (o `/`) | ✅ index, follow |
| Política de privacidad | `/privacidad` | ✅ index, follow |
| Términos y condiciones | `/terminos` | ✅ index, follow |
| Thank you page (futuro) | `/gracias` | ❌ noindex, nofollow |
| Pasarela de pago | Externa | N/A |

### 4.5 Hreflang

No necesario por ahora. El sitio es en español para toda LATAM. Si en el futuro se crean versiones regionales (ej: con precios en ARS), implementar:
```html
<link rel="alternate" hreflang="es-UY" href="https://livianas.com/experiencia-30-dias">
<link rel="alternate" hreflang="es-AR" href="https://livianas.com/ar/experiencia-30-dias">
<link rel="alternate" hreflang="es" href="https://livianas.com/experiencia-30-dias">
```

### 4.6 robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://livianas.com/sitemap.xml
```

### 4.7 Sitemap

Astro genera sitemap automáticamente con `@astrojs/sitemap`. Configurar en `astro.config.mjs`:
```js
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://livianas.com',
  integrations: [sitemap()],
});
```

### 4.8 SEO Local (Montevideo)

El Organization schema ya incluye Montevideo. Adicionalmente:
- Registrar en Google Business Profile si Ana tiene local físico
- Incluir "Montevideo" en meta description si el espacio lo permite
- El contenido usa español rioplatense (vos, ustedes) lo cual es correcto para el target

---

## 5. Plan de Tracking

### 5.1 Píxel de Meta (Facebook Pixel)

**Instalación:** En el `<head>` de `Layout.astro`, ANTES del cierre de `</head>`:

```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL_ID_AQUI');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=PIXEL_ID_AQUI&ev=PageView&noscript=1"/></noscript>
```

**CRÍTICO:** El `PIXEL_ID` viene de `.env`, no hardcodeado. En Astro:
```js
const pixelId = import.meta.env.PUBLIC_META_PIXEL_ID;
```

**Eventos a disparar:**

| Evento | Trigger | Código |
|---|---|---|
| `PageView` | Carga de página | Automático con el snippet |
| `ViewContent` | Scroll al 50% de la página | `fbq('track', 'ViewContent', {content_name: 'Landing LIVIANAS'})` |
| `Lead` | Click en CUALQUIER botón WhatsApp | `fbq('track', 'Lead', {content_name: 'WhatsApp Click', content_category: utm_content})` |
| `Contact` | Click en botón WhatsApp de pricing | `fbq('track', 'Contact', {content_name: 'Pricing CTA'})` |

**Implementación de Lead por ubicación:**
```javascript
document.querySelectorAll('[data-utm]').forEach(btn => {
  btn.addEventListener('click', () => {
    const source = btn.dataset.utm; // 'hero', 'pricing', 'final_cta', 'floating'
    fbq('track', 'Lead', {
      content_name: 'WhatsApp Click',
      content_category: source,
      value: 300,
      currency: 'USD'
    });
    // Si es pricing, también disparar Contact
    if (source === 'pricing') {
      fbq('track', 'Contact', { content_name: 'Pricing CTA' });
    }
  });
});
```

### 5.2 Google Analytics 4

Instalar via `<script>` en el `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Eventos personalizados GA4:**

| Evento | Trigger | Parámetros |
|---|---|---|
| `whatsapp_click` | Click en cualquier CTA WhatsApp | `{ button_location: 'hero'/'pricing'/'final_cta'/'floating' }` |
| `scroll_depth` | 25%, 50%, 75%, 100% | `{ percent: 25 }` (built-in en GA4, activar en configuración) |
| `video_play` | Click en play del video | `{ video_title: 'Presentación Ana' }` |
| `faq_open` | Abrir una pregunta FAQ | `{ question: 'Cuanto dura el programa' }` |
| `page_engagement` | Tiempo en página > 30s, > 60s, > 120s | `{ engagement_time: 30 }` |

```javascript
// Ejemplo: tracking de CTA clicks en GA4
document.querySelectorAll('[data-utm]').forEach(btn => {
  btn.addEventListener('click', () => {
    gtag('event', 'whatsapp_click', {
      button_location: btn.dataset.utm
    });
  });
});
```

### 5.3 UTM Strategy para WhatsApp

Cada botón de WhatsApp tiene un mensaje prellenado diferente Y parámetros UTM en el link:

| Ubicación | Mensaje Prellenado | Link |
|---|---|---|
| Hero | `Hola Ana, quiero info sobre LIVIANAS 🌿` | `wa.me/598XXX?text=...&utm_source=landing&utm_content=hero` |
| Pricing | `Hola Ana, quiero inscribirme en LIVIANAS 🌿` | `wa.me/598XXX?text=...&utm_source=landing&utm_content=pricing` |
| CTA Final | `Hola Ana, estoy lista para LIVIANAS 🌿` | `wa.me/598XXX?text=...&utm_source=landing&utm_content=final_cta` |
| Flotante | `Hola, quiero saber más sobre LIVIANAS 🌿` | `wa.me/598XXX?text=...&utm_source=landing&utm_content=floating` |

**NOTA:** WhatsApp ignora UTM params en el link wa.me, pero se pueden incluir para el tracking del lado del sitio (el evento se dispara ANTES de que el usuario salga de la página). Alternativamente, el diferenciador real es el mensaje prellenado diferente.

### 5.4 DataLayer (opcional, para GTM futuro)

Si se quiere migrar a Google Tag Manager en el futuro:
```javascript
window.dataLayer = window.dataLayer || [];
// Empujar datos al dataLayer en cada interacción
dataLayer.push({
  event: 'whatsapp_click',
  click_location: 'hero',
  page_section: 'hero'
});
```

---

## 6. Checklist de Performance

### 6.1 Métricas Objetivo (Core Web Vitals)

| Métrica | Objetivo | Alerta |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.0s | > 2.5s |
| **FID/INP** (Interaction to Next Paint) | < 100ms | > 200ms |
| **CLS** (Cumulative Layout Shift) | < 0.05 | > 0.1 |
| **Peso total página** | < 500KB (sin video) | > 800KB |
| **Requests** | < 15 | > 25 |
| **Time to First Byte** | < 200ms (Vercel edge) | > 500ms |

### 6.2 Optimización de Imágenes

| Imagen | Formato | Tamaños | Loading |
|---|---|---|---|
| Foto de Ana | WebP + JPG fallback | 480w (mobile), 640w (desktop) | `loading="lazy"` |
| OG Image | JPG (obligatorio para redes) | 1200x630 fijo | N/A (solo meta) |
| Favicon | SVG (principal) + PNG 192x192 | Fijo | `<link>` en head |
| Hero background | CSS gradient (sin imagen) | N/A | N/A |
| Testimonial avatars | SVG/CSS generado (iniciales) | N/A | N/A |

**Astro Image optimization:**
```astro
---
import { Image } from 'astro:assets';
import anaFoto from '../images/ana-foto.jpg';
---
<Image src={anaFoto} alt="Ana" widths={[480, 640]} formats={['webp', 'jpg']} loading="lazy" />
```

### 6.3 Optimización de Fuentes

- **Self-hosted** (no Google Fonts CDN): elimina request DNS + conexión a fonts.googleapis.com
- **Solo woff2**: soporte universal moderno, ~30% más ligero que woff
- **font-display: swap**: texto visible inmediatamente con fallback
- **Preload** solo las 2 fuentes más críticas (DM Sans Regular + Playfair Bold)
- **Subsetear** si es posible: solo caracteres latinos (elimina cirílico, griego = ahorro ~40%)

### 6.4 Checklist Pre-Launch

- [ ] Lighthouse mobile score > 90 en todas las categorías
- [ ] Testar en 3G lenta simulada (Chrome DevTools: Slow 3G)
- [ ] Verificar que la página es funcional SIN JavaScript (contenido visible, links funcionan)
- [ ] Todas las imágenes tienen `width` y `height` explícitos (evitar CLS)
- [ ] Video usa facade pattern (no carga iframe hasta click)
- [ ] No hay pop-ups que bloqueen contenido en mobile
- [ ] HTTPS activo y forzado (Vercel lo hace automáticamente)
- [ ] Botón flotante WhatsApp visible y funcional en mobile y desktop
- [ ] Todos los links de WhatsApp abren correctamente con mensaje prellenado
- [ ] Meta Pixel dispara eventos correctamente (verificar en Meta Events Manager > Test Events)
- [ ] GA4 recibe eventos (verificar en Realtime report)
- [ ] Schema markup validado en https://search.google.com/structured-data/testing-tool
- [ ] OG tags validados en https://developers.facebook.com/tools/debug/
- [ ] Responsive testeado en: iPhone SE, iPhone 14, Samsung Galaxy, iPad, Desktop 1440px
- [ ] Contraste de colores AA mínimo en todas las combinaciones texto/fondo
- [ ] Todos los `<img>` tienen `alt` descriptivo
- [ ] Navegación por teclado funcional (Tab a través de CTAs, Enter para activar)
- [ ] robots.txt y sitemap.xml accesibles
- [ ] Páginas de privacidad y términos creadas y linkeadas
- [ ] Variables de entorno configuradas en Vercel (PIXEL_ID, GA4_ID, WHATSAPP_NUMBER)
- [ ] DNS configurado para dominio custom

---

## 7. Instrucciones para Claude Code

### 7.1 Orden de Implementación (Prioridad)

**Fase 1 — Core (crítico para lanzamiento):**
1. Inicializar proyecto Astro + Tailwind + config
2. `Layout.astro` con todos los meta tags, pixel, GA4, fuentes
3. `config.ts` con todas las variables centralizadas
4. Componente `WhatsAppCTA.astro` y `WhatsAppButton.astro` (flotante)
5. Secciones 0 (TopBar), 1 (Hero), 10 (Pricing), 12 (CTA Final) — las más críticas para conversión
6. Secciones 3 (Dolor), 4 (Transformación), 5 (4 Semanas)
7. Secciones 6 (Incluye), 7 (Testimonios), 8 (Sobre Ana)
8. Sección 11 (FAQ) con schema markup
9. Sección 9 (Urgency Bar), Footer
10. Sección 2 (Video) — placeholder hasta que Ana grabe

**Fase 2 — Polish:**
11. Animaciones (fade-in-up con Intersection Observer, float emojis, pulse)
12. Tracking events (click handlers para WhatsApp, scroll depth)
13. Responsive testing y ajustes
14. Performance audit con Lighthouse

**Fase 3 — Complementos:**
15. Páginas `/privacidad` y `/terminos`
16. Integración Supabase (si se decide usar para contenido dinámico)
17. Deploy a Vercel + dominio custom

### 7.2 Reglas para Code

1. **Mobile-first siempre.** Diseñar para 375px primero, escalar hacia arriba.
2. **Cero JavaScript innecesario.** El FAQ usa `<details>/<summary>`. Las animaciones son CSS. Solo JS para: tracking events, cerrar otros FAQ al abrir uno, Intersection Observer para fade-in.
3. **Todo el contenido visible sin JS.** Progressive enhancement.
4. **Componentes Astro, no React.** No necesitamos framework de cliente.
5. **Variables centralizadas en `config.ts`.** Número de WhatsApp, fechas, cupos, precios. NUNCA hardcodear estos valores en componentes.
6. **Colores SOLO desde CSS variables.** No usar hex directo en componentes.
7. **Imágenes siempre con width/height.** Para evitar CLS.
8. **Íconos SVG inline** (no icon fonts). Solo necesitamos: WhatsApp logo, check, play, arrow, plus/close.
9. **No instalar dependencias innecesarias.** El proyecto debe ser lean.

### 7.3 Archivo config.ts (Referencia)

```typescript
// src/lib/config.ts
export const siteConfig = {
  // WhatsApp
  whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER || '598XXXXXXXXX',
  
  // Mensajes prellenados (URL-encoded)
  whatsappMessages: {
    hero: encodeURIComponent('Hola Ana, quiero info sobre LIVIANAS 🌿'),
    pricing: encodeURIComponent('Hola Ana, quiero inscribirme en LIVIANAS 🌿'),
    finalCta: encodeURIComponent('Hola Ana, estoy lista para LIVIANAS 🌿'),
    floating: encodeURIComponent('Hola, quiero saber más sobre LIVIANAS 🌿'),
  },
  
  // Contenido dinámico
  cuposDisponibles: 8,
  fechaCierre: '28 de marzo',
  fechaInicioCohorte: '31 de marzo de 2026',
  inscripcionesAbiertas: true,
  textoUrgencia: 'Cupos limitados — Solo 8 mujeres por grupo — Próxima cohorte abre pronto',
  
  // Precio
  precioUSD: 300,
  
  // Tracking
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID || '',
  ga4Id: import.meta.env.PUBLIC_GA4_ID || '',
  
  // SEO
  siteUrl: 'https://livianas.com',
  siteName: 'LIVIANAS',
} as const;

// Helper para generar WhatsApp links
export function getWhatsAppLink(location: keyof typeof siteConfig.whatsappMessages): string {
  const msg = siteConfig.whatsappMessages[location];
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${msg}`;
}
```

### 7.4 Variables de Entorno (.env)

```env
PUBLIC_WHATSAPP_NUMBER=598XXXXXXXXX
PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXX
PUBLIC_GA4_ID=G-XXXXXXXXXX
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 8. Apéndices

### 8.1 Dependencias del Proyecto

```json
{
  "dependencies": {
    "astro": "^5.x",
    "@astrojs/tailwind": "^5.x",
    "@astrojs/sitemap": "^3.x"
  },
  "devDependencies": {
    "tailwindcss": "^4.x"
  }
}
```

**Opcional (solo si se usa Supabase):**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x"
  }
}
```

### 8.2 Contraste de Colores (Accesibilidad)

| Combinación | Ratio | WCAG AA |
|---|---|---|
| Dark (#2C2C2C) sobre Cream (#FDF8F0) | 12.5:1 | ✅ |
| Gray (#6E6E6E) sobre Cream (#FDF8F0) | 4.8:1 | ✅ |
| White sobre Sage (#7B8F6B) | 3.8:1 | ⚠️ Usar bold/large text |
| White sobre Sage Dark (#5A7450) | 5.2:1 | ✅ |
| White sobre WhatsApp (#25D366) | 2.1:1 | ❌ Agregar sombra o usar bold+large |
| Dark sobre Sage Wash (#E8EDE4) | 11.2:1 | ✅ |

**Acción requerida:** El botón WhatsApp (#25D366 fondo, blanco texto) no pasa AA para texto normal. Solución: usar `font-weight: 700` y `font-size >= 18px` (pasa AA para large text) + agregar `text-shadow: 0 1px 2px rgba(0,0,0,0.1)`.

### 8.3 Resumen de Inversión en Ads (del Plan Estratégico)

Para referencia de Code/equipo al configurar tracking:

| Escenario | Inversión Ads | Revenue esperado | ROAS |
|---|---|---|---|
| Primera oleada | USD 500-800 | USD 9,600 | 12-19x |
| Óptimo (3 oleadas) | USD 1,440 | USD 24,000 | 17x |
| Máximo | USD 3,000 | USD 60,000 | 20x |

**Presupuesto recomendado para inicio:** USD 500-800 distribuidos en: 60% tráfico frío a LP, 25% retargeting, 15% lookalike. El tracking debe permitir medir CPA real para escalar.

### 8.4 Checklist de Personalización (pendiente de Ana)

Estos items son BLOQUEANTES para el deploy final:

| Item | Prioridad | Estado |
|---|---|---|
| Número de WhatsApp con código de país | CRÍTICA | ⏳ Pendiente |
| Video de presentación (60-90s) | ALTA | ⏳ Pendiente |
| Foto profesional de Ana | ALTA | ⏳ Pendiente |
| 3-5 testimonios reales | ALTA | ⏳ Pendiente |
| Credenciales profesionales | MEDIA | ⏳ Pendiente |
| Fecha de primera cohorte | ALTA | ⏳ Pendiente |
| Pasarela de pago: Mercado Pago (UY), dLocal Go (LATAM), PayPal (Internacional) | ALTA | ⏳ Pendiente |
| Dominio / URL definitiva | ALTA | ⏳ Pendiente |
| Logo de LIVIANAS (o confirmar usar tipografía) | MEDIA | ⏳ Pendiente |
| ID del Píxel de Meta | ALTA | ⏳ Pendiente |
| ID de GA4 | MEDIA | ⏳ Pendiente |
| Handles de Instagram/Facebook | MEDIA | ⏳ Pendiente |

**El sitio puede desarrollarse y desplegarse con placeholders.** Solo los items marcados CRÍTICA impiden el funcionamiento básico del embudo de conversión.

---

**Fin del Documento de Arquitectura Técnica**

*Este documento debe leerse en conjunto con:*
- `plan_estrategico_livianas.docx` (estrategia de negocio)
- `copy_landing_livianas.docx` (contenido y copy exacto)

*Próximo paso: Implementación con Claude Code siguiendo el orden de la sección 7.1*
