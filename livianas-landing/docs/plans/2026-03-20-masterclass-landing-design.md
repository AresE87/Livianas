# Masterclass "Las 3 Mentiras" — Landing Design

## Overview
Landing page de registro gratuito para masterclass en vivo de Ana. Captura nombre + email. Estilo visual Livianas (sage/cream/display fonts).

## Secciones

1. **Hero** — Titulo, subtitulo provocador, fecha/hora, CTA "Reservar mi lugar gratis"
2. **Que vas a aprender** — 3 cards con puntos clave
3. **Para quien es** — Pain points "Si sentis que..."
4. **Sobre Ana** — Bio resumida reutilizando estilo existente
5. **Testimonios** — Carrusel existente (TestimonialsCarousel)
6. **Registro** — Formulario nombre + email → Supabase
7. **Footer** — PremiumFooter

## Flujo tecnico
- POST `/api/masterclass-registro.ts` → tabla Supabase `masterclass_registros` (nombre, email, created_at)
- Redirect a `/masterclass/gracias` con detalles del vivo

## Archivos nuevos
- `src/pages/masterclass.astro`
- `src/pages/masterclass/gracias.astro`
- `src/pages/api/masterclass-registro.ts`
- Config masterclass en `config.ts`

## Reutiliza
- Layout, Navbar, PremiumFooter, TestimonialsCarousel, ChatWidget
- Design system (sage, cream, tipografias)
