# LIVIANAS - Estado del Proyecto

**Fecha:** 3 de marzo de 2026
**Dominio:** livianas.com
**Hosting:** Vercel (produccion activa)
**Repositorio:** github.com/AresE87/Livianas

---

## 1. Resumen Ejecutivo

LIVIANAS es la plataforma web del Metodo Livianas, un programa de transformacion consciente para mujeres liderado por Ana. El sitio funciona como ecosistema de ventas con multiples landing pages, chatbot IA integrado y sistema de pagos.

**Estado actual:** En produccion, todas las paginas funcionales y desplegadas.

---

## 2. Stack Tecnologico

| Componente | Tecnologia | Version |
|---|---|---|
| Framework | Astro (SSR + Static) | 5.17+ |
| Hosting/Deploy | Vercel | Adapter v9.0.4 |
| IA / Chatbot | Anthropic Claude SDK | 0.78+ |
| Animaciones | GSAP + ScrollTrigger | 3.14+ |
| CSS | Tailwind CSS + CSS Scoped | 4.2+ |
| Sitemap | @astrojs/sitemap | 3.7+ |
| Tipografias | Cormorant Garamond + Plus Jakarta Sans | Google Fonts |

---

## 3. Arquitectura de Paginas

### Paginas Publicas (7)

| Ruta | Proposito | Layout | Chatbot |
|---|---|---|---|
| `/` | Landing principal - Programa grupal 30 dias | Layout.astro | Livia (programa) |
| `/individual` | Landing 1:1 - Programa personalizado 3 meses | Layout1a1.astro | Livia (programa) |
| `/materiales` | Catalogo de materiales digitales (PDFs) | Layout.astro | Livia (materiales) |
| `/about` | Biografia de Ana, mision, vision, valores | Layout.astro | Livia (programa) |
| `/pago` | Checkout - Seleccion de metodo de pago | Layout.astro | - |
| `/privacidad` | Politica de privacidad | Layout.astro | - |
| `/terminos` | Terminos y condiciones | Layout.astro | - |

### Endpoints API (3)

| Ruta | Funcion |
|---|---|
| `/api/chat` | Chatbot Livia - programa (grupal + individual) |
| `/api/chat-materiales` | Chatbot Livia - ventas de materiales |
| `/api/whatsapp` | Webhook para WhatsApp Business API |

---

## 4. Sistema de Chatbot "Livia"

El chatbot tiene **dos instancias independientes** con comportamientos distintos:

### Livia - Programa (ChatWidget.astro)
- **Alcance:** Responde sobre el programa grupal e individual
- **Escalacion:** Deriva a Ana via WhatsApp cuando detecta interes de compra
- **API:** `/api/chat`
- **Paginas:** `/`, `/individual`, `/about`

### Livia - Materiales (ChatWidgetMateriales.astro)
- **Alcance:** Solo habla de materiales digitales (guia + recetario)
- **Escalacion:** Nunca menciona a Ana. Dirige al boton de pago en la pagina
- **API:** `/api/chat-materiales`
- **Paginas:** `/materiales`

### Componentes del chatbot
- `src/lib/chatbot/ai-client.ts` - Cliente IA programa
- `src/lib/chatbot/ai-client-materiales.ts` - Cliente IA materiales
- `src/lib/chatbot/system-prompt.ts` - Prompt del programa
- `src/lib/chatbot/system-prompt-materiales.ts` - Prompt de materiales
- `src/lib/chatbot/sessions.ts` - Manejo de sesiones
- `src/lib/chatbot/rate-limiter.ts` - Limitador de peticiones
- `src/lib/chatbot/escalation.ts` - Deteccion de escalacion a Ana
- `src/lib/chatbot/whatsapp-api.ts` - Integracion WhatsApp

---

## 5. Configuracion Centralizada

| Archivo | Alcance |
|---|---|
| `src/lib/config.ts` | Programa grupal (precio, WhatsApp, FAQ, testimonios) |
| `src/lib/config-1a1.ts` | Programa individual (precio, fases, incluye, FAQ) |
| `src/lib/config-materiales.ts` | Materiales digitales (productos, precios, FAQ, links de pago) |

---

## 6. Cambios Realizados (2-3 marzo 2026)

### Nuevas Paginas Creadas

#### /about - Pagina de Ana
- Hero compacto con foto de Ana
- Seccion "Mi historia" con narrativa personal
- Mision, vision y valores del metodo
- Testimonios reales integrados
- Footer premium con navegacion completa

#### /materiales - Catalogo de Materiales Digitales
- Hero de tienda con identidad visual propia
- Tarjeta de producto: Pack Livianas (Guia 32 pag + Recetario 28 pag)
- Precio: USD 15 (precio anterior USD 24 tachado, -38% descuento)
- Botones de pago Mercado Pago y PayPal (configurables via env vars)
- Flujo de 3 pasos: Elegir > Pagar > Descargar
- FAQ especifica de materiales (4 preguntas)
- CTA final de cierre
- Chatbot Livia exclusivo para ventas de materiales

### Mejoras en /individual

#### UX de CTAs
- **Sticky CTA mobile:** Eliminado precio y boton "Quiero mi lugar". Reemplazado por etiqueta "Programa 1:1 personalizado" + boton verde WhatsApp "Habla con Ana"
- **Hero CTA:** Cambiado de WhatsApp directo a "Conoce el programa" con scroll suave a la seccion de precio. Esto evita que el usuario salte directo a contactar sin explorar la landing
- **Pricing section:** Botones de compra reemplazados por CTA de WhatsApp privado

#### Chat Widget Mejorado
- Burbujas de mensaje con estilo WhatsApp (colores diferenciados)
- Mini avatar "L" junto a mensajes de Livia
- Labels de nombre "Livia" / "Vos"
- Colas decorativas en las burbujas (tail corners)

### Consolidacion de Rutas
- Eliminada ruta duplicada `/1a1` - unificada en `/individual`
- Navbar actualizado con prop `basePath` para navegacion entre paginas

### SEO / Open Graph
- **Cada pagina ahora tiene sus propios meta tags OG.** Antes todas compartian la descripcion del programa grupal
- Implementado via props `ogTitle` / `ogDescription` en ambos layouts
- Al compartir en WhatsApp/redes cada pagina muestra su titulo y descripcion correspondiente:

| Pagina | og:title |
|---|---|
| `/` | LIVIANAS - 30 dias de transformacion real |
| `/individual` | LIVIANAS 1:1 - Tu transformacion personalizada |
| `/materiales` | Materiales Digitales - LIVIANAS |
| `/about` | Sobre Ana - LIVIANAS |
| `/pago` | Completar inscripcion - LIVIANAS |

### Infraestructura
- Deploy via Vercel CLI (`npx vercel --prod --yes`) funcionando correctamente
- Resuelto problema de auto-deploy desde GitHub
- Identificado firewall corporativo Fortinet bloqueando livianas.com (workaround: verificar via livianas-landing.vercel.app)

---

## 7. Metricas del Codigo

| Metrica | Valor |
|---|---|
| Lineas de codigo totales | ~11,763 |
| Paginas publicas | 7 |
| Componentes Astro | 34 |
| Endpoints API | 3 |
| Layouts | 2 |
| Archivos de configuracion | 3 |
| Commits totales (2-3 marzo) | 16 |
| Archivos modificados (ultimos 12 commits) | 20 |
| Lineas agregadas/modificadas | +3,155 / -1,582 |

---

## 8. Variables de Entorno Requeridas

### Chatbot (Obligatorias para funcionar)
- `ANTHROPIC_API_KEY` - Clave API de Anthropic para Claude

### Pagos - Programa Grupal
- `PUBLIC_MP_LINK` - Link de Mercado Pago (programa grupal)
- `PUBLIC_PAYPAL_LINK` - Link de PayPal (programa grupal)

### Pagos - Materiales
- `PUBLIC_MATERIALES_MP_LINK` - Link de Mercado Pago (materiales)
- `PUBLIC_MATERIALES_PAYPAL_LINK` - Link de PayPal (materiales)

### Tracking (Opcionales)
- `PUBLIC_META_PIXEL_ID` - Meta Pixel para Facebook Ads
- `PUBLIC_GA4_ID` - Google Analytics 4

### WhatsApp Bot (Opcional)
- `WHATSAPP_VERIFY_TOKEN` - Token de verificacion webhook
- `WHATSAPP_ACCESS_TOKEN` - Token de acceso WhatsApp Business API
- `WHATSAPP_PHONE_ID` - ID del telefono WhatsApp Business

---

## 9. Tareas Pendientes

### Prioridad Alta
- [ ] **Configurar links de pago para /materiales** - Crear links fijos de Mercado Pago y PayPal para el Pack Livianas (USD 15) y configurar las env vars `PUBLIC_MATERIALES_MP_LINK` y `PUBLIC_MATERIALES_PAYPAL_LINK` en Vercel. Actualmente la pagina muestra mensaje "proximamente"
- [ ] **Imagen OG personalizada por pagina** - Actualmente todas las paginas usan `/images/og-image.jpg`. Idealmente cada una tendria su propia imagen de preview social

### Prioridad Media
- [ ] **Automatizacion de entrega de materiales** - Cuenta Gmail disponible: `metodolovianas@gmail.com`. Implementar envio automatico del PDF post-pago (opciones: webhook de MP, integracion con Gumroad, o flujo manual)
- [ ] **WhatsApp Business API** - Activar el bot de Livia en WhatsApp para respuestas automaticas

### Prioridad Baja
- [ ] **Optimizacion de imagenes** - Revisar pesos de imagenes y convertir a WebP/AVIF
- [ ] **Tests automatizados** - Agregar tests basicos de build y endpoints API

---

## 10. Flujo de Deploy

```
Desarrollo local (port 4322)
       |
   git push origin main
       |
   npx vercel --prod --yes
       |
   livianas.com (produccion)
```

**Nota:** El auto-deploy desde GitHub no esta funcionando de forma confiable. Se usa deploy manual via CLI de Vercel.

---

## 11. Diseno Visual

### Paleta de Colores
- **Sage:** #7B8F6B (verde salvia - color principal)
- **Blush:** #D4917E (rosa - acentos)
- **Cream:** #FBF9F5 (crema - fondos)
- **Lavender:** tonos suaves complementarios

### Tipografia
- **Titulos:** Cormorant Garamond (serif, elegante)
- **Cuerpo:** Plus Jakarta Sans (sans-serif, moderna)

### Identidad
Estilo premium, femenino, wellness. Inspiracion en marcas de bienestar de alta gama. Sin emojis excesivos. Comunicacion directa y emocional.

---

*Documento generado automaticamente el 3 de marzo de 2026.*
*Proyecto: LIVIANAS - Metodo Livianas | livianas.com*
