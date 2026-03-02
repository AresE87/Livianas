# LIVIANAS — Estado Completo del Proyecto
## Documento de Traspaso para Continuidad en Claude

**Fecha:** 1 de marzo de 2026
**Versión en producción:** https://livianas-landing.vercel.app
**Repo:** https://github.com/AresE87/Livianas.git
**Último commit:** `355efe8` — fix: content feedback

---

## 1. RESUMEN EJECUTIVO

Landing page de conversión para **"LIVIANAS — Experiencia 30 Días"**, un programa de bienestar grupal para mujeres liderado por Ana. El programa trabaja tres dimensiones: **conducta, emoción y espiritualidad** en torno a la relación con la comida y el cuerpo.

- **Stack:** Astro 5.x + Tailwind CSS 4.x + Vercel (static)
- **Ruta local:** `C:\Users\AresE\Documents\Livianas\livianas-landing\`
- **Dev server:** `node node_modules/astro/astro.js dev` en puerto 4321
- **Estado:** Desplegada en Vercel, pendiente contenido real de Ana

---

## 2. ARQUITECTURA TÉCNICA

### Stack
| Componente | Tecnología |
|---|---|
| Framework | Astro 5.x (zero JS, static output) |
| Estilos | Tailwind CSS 4.x (CSS-first config con `@theme`) |
| Hosting | Vercel (auto-deploy desde GitHub main) |
| Fuentes | Self-hosted woff2: DM Sans (variable) + Playfair Display Bold |
| Pagos | Mercado Pago (UY), dLocal Go (LATAM), PayPal (INT) — NO Stripe |
| Tracking | Meta Pixel + GA4 (condicional por env vars) |

### Estructura del Proyecto
```
livianas-landing/
├── .env                          # Variables de entorno (WhatsApp, Pixel, pagos)
├── .claude/launch.json           # Config dev server para Claude Preview
├── astro.config.mjs              # site: https://livianas.com, sitemap
├── package.json                  # astro, tailwindcss, @astrojs/sitemap
├── public/
│   ├── fonts/                    # DM Sans, Playfair Display (woff2)
│   ├── images/                   # og-image.jpg, favicon.svg, ana-foto.webp
│   └── robots.txt
├── src/
│   ├── lib/config.ts             # ⭐ FUENTE ÚNICA DE VERDAD — todo el contenido
│   ├── styles/global.css         # Design system, @theme, @font-face, keyframes
│   ├── layouts/Layout.astro      # Meta, OG, JSON-LD, tracking, animations
│   ├── pages/
│   │   ├── index.astro           # Landing (14 componentes)
│   │   ├── privacidad.astro
│   │   └── terminos.astro
│   └── components/               # 22 componentes Astro
│       ├── TopBar.astro          # Countdown + urgencia
│       ├── Hero.astro            # Badge + H1 + dual CTAs
│       ├── VideoAna.astro        # 🎬 PLACEHOLDER — aquí va el video de Ana
│       ├── PainPoints.astro      # 4 dolores con SVG icons
│       ├── Transformation.astro  # Antes/después
│       ├── MiniPricing.astro     # Pricing compacto (posición 6)
│       ├── WeeksProgram.astro    # 4 semanas del programa
│       ├── Includes.astro        # 6 beneficios incluidos
│       ├── ParaQuienEs.astro     # "Esto es para vos si..."
│       ├── AboutAna.astro        # Sobre Ana (necesita foto real)
│       ├── Pricing.astro         # Pricing completo + value stack
│       ├── FAQ.astro             # 13 preguntas + botón oculto WhatsApp
│       ├── FinalCTA.astro        # CTA final + countdown
│       ├── Footer.astro          # Legal
│       ├── WhatsAppButton.astro  # Floating button
│       ├── StickyMobileCTA.astro # Barra fija mobile
│       ├── CountdownTimer.astro  # Timer reutilizable
│       ├── PaymentButtons.astro  # 3 pasarelas de pago
│       ├── SectionLabel.astro    # Label reutilizable
│       ├── UrgencyBar.astro      # Barra de urgencia
│       ├── WhatsAppCTA.astro     # CTA de WhatsApp
│       └── Testimonials.astro    # (No usado — reemplazado por ParaQuienEs)
└── dist/                         # Build output
```

### Tailwind 4.x — Importante
- **NO usa `tailwind.config.mjs`** — usa `@theme` block en `global.css`
- Breakpoints custom: `--breakpoint-sm: 480px`, `--breakpoint-md: 768px`, `--breakpoint-lg: 1024px`
- Colores: `--color-sage`, `--color-cream`, `--color-warm`, `--color-rose`, etc.

### Design System (Colores)
| Token | Hex | Uso |
|---|---|---|
| `--color-sage` | #7B8F6B | Primary (botones, acentos) |
| `--color-sage-dark` | #5A7450 | Hover, texto primario |
| `--color-sage-wash` | #E8EDE4 | Backgrounds claros |
| `--color-cream` | #FDF8F0 | Background principal |
| `--color-warm` | #D4A574 | Accent |
| `--color-warm-pale` | #F5EDE3 | Accent claro |
| `--color-rose` | #C17B7B | Secondary (highlights pain points) |
| `--color-rose-pale` | #F2E4E4 | Secondary claro |
| `--color-whatsapp` | #128C7E | Botones WhatsApp |
| `--color-dark` | #2C2C2C | Texto principal |
| `--color-gray` | #6E6E6E | Texto secundario |

---

## 3. FLUJO DE LA LANDING (14 secciones)

```
1.  TopBar          → Countdown + texto de urgencia ("cierra el 28 de marzo")
2.  Hero            → Badge diferenciador + H1 + subtítulo + 2 CTAs + trust badges
3.  VideoAna        → 🎬 PLACEHOLDER del video de Ana + frase + 3 pilares
4.  PainPoints      → "¿Te suena familiar?" — 4 dolores con SVG icons + CTA puente
5.  Transformation  → "De dónde estás a dónde vas" — 4 antes/después
6.  MiniPricing     → Pricing compacto (USD 450 tachado rojo → USD 297) — posición estratégica
7.  WeeksProgram    → 4 semanas: Consciencia, Acción, Conexión, Identidad
8.  Includes        → 6 beneficios incluidos (coaching, comunidad, alimentación, espiritualidad, etc.)
9.  ParaQuienEs     → "Esto es para vos si..." — 8 criterios de identificación
10. AboutAna        → Sobre Ana (necesita foto y bio real)
11. Pricing         → Pricing completo: value stack ✅ + countdown + 3 pasarelas + garantía
12. FAQ             → 13 preguntas con acordeón + botón oculto WhatsApp directo a Ana
13. FinalCTA        → CTA final con countdown + "Quiero mi lugar en el círculo"
14. Footer          → Legal + links

    + WhatsAppButton (floating)
    + StickyMobileCTA (barra fija en mobile)
```

---

## 4. ESTRATEGIA DE CTAs Y WHATSAPP

### Dual CTA System
| Botón | Texto | Destino | Color |
|---|---|---|---|
| **Primario** | "Inscribirme ahora" | Link de pago directo | Verde sage sólido |
| **Secundario** | "Quiero saber más" | WhatsApp Bot | Borde sage, ícono WA |
| **Mini Pricing** | "Reservar mi lugar" | Link de pago | Verde sage |
| **Final CTA** | "Quiero mi lugar en el círculo" | Link de pago | Verde sage |
| **After Pain Points** | "Quiero cambiar esto" | WhatsApp Bot | Borde sage |

### Estrategia WhatsApp
- **La mayoría de CTAs van al bot** (ManyChat/n8n) — no a Ana directamente
- **Único acceso directo a Ana:** Botón oculto dentro de la última FAQ ("¿Puedo hablar con Ana?")
  - Este botón solo se ve cuando el usuario despliega esa pregunta
  - Justificación: si llegó hasta la FAQ final, es un prospect de alto valor
  - Usa `showDirectCta: true` en faqData y mensaje `whatsappMessages.finalCta`

### Mensajes WhatsApp prellenados
```
hero:     "Hola, quiero info sobre LIVIANAS 🌿"
pricing:  "Hola, quiero inscribirme en LIVIANAS 🌿"
finalCta: "Hola Ana, estoy lista para LIVIANAS 🌿"  ← Solo este va a Ana
floating: "Hola, quiero saber más sobre LIVIANAS 🌿"
```

---

## 5. PRICING Y VALUE STACK

### Estructura de precios
| Concepto | Valor |
|---|---|
| Precio regular (tachado) | USD 450 (con `line-through` rojo) |
| Precio oferta | **USD 297** |
| Precio semanal | USD 74/semana |
| Plan de cuotas | 3 × USD 99 |

### Value Stack (sin precios individuales — decisión de feedback)
Se muestra como lista con checkmarks verdes (✅), sin desglose de valores individuales para no intimidar:
1. 4 sesiones de coaching grupal en vivo con Ana
2. Plan de alimentación antiinflamatoria
3. Grupo de WhatsApp con acompañamiento diario
4. Trabajo espiritual y de autoconocimiento
5. Guía de movimiento consciente
6. Grabaciones de por vida de todas las sesiones

**Decisión clave:** Originalmente el value stack sumaba USD 1050 itemizado. Ana consideró que ese número era intimidante y podía espantar la venta. Se simplificó a mostrar USD 450 tachado → USD 297.

---

## 6. CONTENIDO DEL PROGRAMA (4 Semanas)

| Semana | Tema | Nombre | Foco |
|---|---|---|---|
| 1 | CONSCIENCIA | Despertar | Sabotajes, patrones emocionales, creencias limitantes |
| 2 | ACCIÓN | Transformar | Alimentación antiinflamatoria, sin calorías, recetas simples |
| 3 | CONEXIÓN | Sentir | **Espiritualidad**, soltar culpa/ansiedad/control |
| 4 | IDENTIDAD | Ser | Integrar todo, nueva identidad |

**Nota importante:** Semanas 2 y 3 fueron reajustadas por feedback de Ana:
- Semana 2 originalmente se llamaba "Mover" (enfoque en ejercicio) → cambiado a "Transformar" (alimentación)
- Semana 3 originalmente era "ENERGÍA/Fluir" (movimiento) → cambiado a "CONEXIÓN/Sentir" (espiritualidad)
- **Ana no es especialista en ejercicio** — solo da guías PDF/PPT con recomendaciones suaves (caminatas, estiramientos, respiraciones)
- **La espiritualidad es central** en el método de Ana

---

## 7. HISTORIAL DE CAMBIOS (Cronológico)

### Sesión 1 — 23 Feb 2026: Setup inicial
- `dd29812` — Initial commit con archivos base
- `30064ef` — Corrección de estructura y archivos de landing

### Sesión 2 — 1 Mar 2026: Optimización de conversión
- `544841c` — Documento de diseño de optimización
- `0531dd0` — Plan detallado de implementación (16 tareas)
- `95309cf` — Config actualizada: charm pricing, dual CTAs, value stack
- `cb80930` — **Implementación completa** de las 16 tareas:
  - 5 componentes nuevos (CountdownTimer, PaymentButtons, MiniPricing, StickyMobileCTA, ParaQuienEs)
  - 10 componentes actualizados
  - Reorden del flujo de página
  - Countdown timers en TopBar, Pricing y FinalCTA
  - Dual CTAs en Hero, MiniPricing y FinalCTA

### Sesión 3 — 1 Mar 2026 (misma noche): Feedback de Ana
- `355efe8` — **Correcciones por feedback directo de Ana:**

  **Cambio 1: Menos ejercicio, más espiritualidad**
  - Semana 2: "Mover" → "Transformar" (foco en alimentación)
  - Semana 3: "ENERGÍA/Fluir" → "CONEXIÓN/Sentir" (espiritualidad)
  - Includes: "Movimiento que te energiza" → "Guía de movimiento consciente" (caminatas, estiramientos)
  - Includes: "Workbook de autoconocimiento" → "Trabajo espiritual y de autoconocimiento"
  - Pricing features: items de ejercicio reemplazados por espiritualidad
  - FAQ sobre fitness: reescrita para desenfatizar deporte

  **Cambio 2: Value stack menos intimidante**
  - De: lista itemizada sumando USD 1050 → A: lista con checks sin valores + USD 450 tachado rojo → USD 297

  **Cambio 3: No es personalizable**
  - "personalizable" eliminado de todas partes (es programa grupal, no 1-on-1)

  **Cambio 4: Botón oculto para Ana en FAQ**
  - Última FAQ "¿Puedo hablar con Ana?" → tiene botón WhatsApp visible solo al expandir
  - Solo prospectos de alto valor (atravesaron toda la landing) llegan ahí

  **Cambio 5: Emojis → SVG icons elegantes**
  - PainPoints: 😤😔😰😞 reemplazados por íconos SVG en círculos beige
  - Íconos: ciclo/repetición, flechas/escala, corazón/emociones, persona/soledad

  **Cambio 6: CTAs no mencionan a Ana**
  - "Hablar con Ana" → "Quiero saber más" (van al bot, no a Ana)
  - Solo el botón oculto de FAQ dice "Escribirle a Ana directamente"

  **Cambio 7: Video placeholder**
  - VideoAna.astro: sección con recuadro visual de video (ícono play, borde punteado)
  - Título "Conocé el método — Ana te explica cómo funciona"
  - Debajo: frase de Ana + 3 pilares

---

## 8. TRACKING Y ANALYTICS

### Eventos configurados (Layout.astro)
| Evento | Trigger | Datos |
|---|---|---|
| Lead (WA) | Click en cualquier CTA de WhatsApp | location, message |
| InitiateCheckout | Click en botón de pago | payment_method |
| ViewContent | Scroll al 50% de la página | scroll_depth |
| FAQ Open | Click en pregunta de FAQ | question_index |
| PageEngagement | Timer 30s/60s/120s | time_on_page |

### Schemas JSON-LD
- **FAQ Schema** — autogenerado desde `faqData`
- **Organization Schema** — LIVIANAS con datos básicos
- **Product Schema** — Programa con precio USD 297

---

## 9. PENDIENTES CRÍTICOS (Para que Ana proporcione)

### Contenido
- [ ] 🎬 **Video de Ana** presentando el método (YouTube/Vimeo) — reemplaza placeholder en VideoAna.astro
- [ ] 📸 **Foto profesional de Ana** — reemplaza ana-foto.webp
- [ ] 💬 **Testimonios reales** de clientas anteriores (si existen)
- [ ] 📝 **Bio de Ana** verificada para la sección AboutAna

### Configuración técnica
- [ ] 📱 **Número de WhatsApp** definitivo (ahora: 598XXXXXXXXX)
- [ ] 💳 **Links de pago** configurados:
  - Mercado Pago (Uruguay)
  - dLocal Go (LATAM)
  - PayPal (Internacional)
- [ ] 🌐 **Dominio** propio (ahora: livianas-landing.vercel.app)
- [ ] 📊 **Meta Pixel ID** para tracking de Facebook/Instagram Ads
- [ ] 📊 **GA4 Measurement ID** para Google Analytics

### Bot de WhatsApp
- [ ] 🤖 **Configurar bot** (ManyChat o n8n) para los CTAs generales
- [ ] 🔀 **Flujo del bot:** Saludo → Preguntas frecuentes → Derivar a Ana si es necesario

---

## 10. ÁREAS PENDIENTES DEL PLAN ORIGINAL

Basado en la arquitectura técnica (`arquitectura_tecnica_livianas.md`), estas áreas aún no se han abordado:

### A. Supabase (Contenido Dinámico)
- Tabla para que Ana edite cupos, fechas y textos sin código
- Gestión de leads opcionalmente
- **Estado:** No implementado — la landing funciona con config estática

### B. Optimización de Performance
- [ ] Auditar Core Web Vitals (LCP, FID, CLS)
- [ ] Optimizar imágenes (cuando lleguen las fotos reales)
- [ ] Verificar bundle size post-build
- [ ] Test de carga en mobile real

### C. SEO Avanzado
- [ ] Verificar canonical URLs con dominio definitivo
- [ ] Configurar Google Search Console
- [ ] Verificar og:image funcional (1200x630)
- [ ] Testear schema markup en Google Rich Results Test

### D. A/B Testing (Futuro)
- Distintas versiones de H1
- Distintos precios de anclaje
- Con/sin countdown timer
- Orden de secciones

### E. Email Marketing
- Secuencia de follow-up para leads que no convirtieron
- Email de confirmación post-pago
- Recordatorios pre-inicio del programa

---

## 11. DECISIONES DE DISEÑO IMPORTANTES

### Por qué NO hay testimonios
- Ana no tiene testimonios reales todavía (primer grupo)
- Se reemplazó `Testimonials.astro` por `ParaQuienEs.astro` ("Esto es para vos si...")
- Cuando tenga testimonios, se puede crear un componente nuevo

### Por qué el valor tachado es USD 450 y no USD 1050
- Feedback directo de Ana: USD 1050 puede espantar al target
- USD 450 es más creíble como "precio regular" vs USD 297 oferta
- El anclaje funciona igual sin ser exagerado

### Por qué los CTAs no dicen "Ana"
- Los CTAs generales van a un bot, no a Ana directamente
- Decir "Hablar con Ana" y que responda un bot genera fricción
- Solo la FAQ oculta dice "Escribirle a Ana directamente" para prospectos de alto valor

### Enfoque espiritualidad > ejercicio
- Ana habla mucho de espiritualidad en su método
- El ejercicio es solo un complemento (guías PDF con caminatas/estiramientos)
- No es entrenadora personal ni especialista en fitness
- Los 3 pilares son: **conducta, emoción, espiritualidad**

---

## 12. INSTRUCCIONES PARA CONTINUAR EN CLAUDE

### Para iniciar el dev server
```json
// .claude/launch.json
{
  "version": "0.0.1",
  "configurations": [{
    "name": "dev",
    "runtimeExecutable": "node",
    "runtimeArgs": ["node_modules/astro/astro.js", "dev"],
    "port": 4321
  }]
}
```
> Usar `preview_start` con name: "dev" — **NO usar npm/npx** (fallan con ENOENT en Windows)

### Para editar contenido
**TODO el contenido está en `src/lib/config.ts`** — no editar componentes para cambiar textos.

### Para agregar el video de Ana
Editar `src/components/VideoAna.astro`:
1. Reemplazar el `<div class="video-placeholder">` con un `<iframe>` o `<lite-youtube>`
2. Mantener la frase de Ana y los pilares debajo
3. El aspect-ratio 16/9 ya está configurado

### Para conectar pagos
1. Obtener links de checkout de MercadoPago, dLocal Go y PayPal
2. Configurar en `.env`:
   ```
   PUBLIC_MERCADOPAGO_LINK=https://...
   PUBLIC_DLOCAL_LINK=https://...
   PUBLIC_PAYPAL_LINK=https://...
   ```
3. El componente `PaymentButtons.astro` ya maneja la lógica

### Para conectar WhatsApp
1. Configurar en `.env`: `PUBLIC_WHATSAPP_NUMBER=598XXXXXXXX`
2. Los mensajes prellenados ya están en `config.ts`

### Para cambiar fechas
Editar en `config.ts`:
```typescript
fechaCierre: '28 de marzo',
fechaCierreISO: '2026-03-28T23:59:59',
fechaInicioCírculo: '31 de marzo de 2026',
```

---

*Documento generado el 1 de marzo de 2026 — LIVIANAS v0.0.1*
