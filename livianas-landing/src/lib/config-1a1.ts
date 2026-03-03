// src/lib/config-1a1.ts — Config para programa 1-a-1 personalizado

export const site1a1Config = {
  // WhatsApp
  whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER || '59891086674',

  // Mensajes prellenados
  whatsappMessages: {
    hero: encodeURIComponent('Hola Ana, quiero info sobre el programa 1 a 1 de LIVIANAS 🌿'),
    pricing: encodeURIComponent('Hola Ana, quiero inscribirme en el programa 1 a 1 de LIVIANAS 🌿'),
    finalCta: encodeURIComponent('Hola Ana, estoy lista para el programa personalizado 1 a 1 🌿'),
    floating: encodeURIComponent('Hola, quiero saber más sobre LIVIANAS 1 a 1 🌿'),
  },

  // CTA Messages
  ctaMessages: {
    primary: 'Quiero mi lugar',
    secondary: 'Hablar con Ana',
    finalCta: 'Quiero empezar mi transformación',
    afterPainPoints: 'Quiero cambiar esto',
  },

  // Payment Links
  paymentLinks: {
    mercadoPago: import.meta.env.PUBLIC_MERCADOPAGO_LINK_1A1 || '',
    paypal: import.meta.env.PUBLIC_PAYPAL_LINK_1A1 || '',
  },

  // Contenido dinamico
  cuposDisponibles: 3,
  fechaCierre: '15 de abril',
  fechaCierreISO: '2026-04-15T23:59:59',
  fechaInicio: '21 de abril de 2026',
  inscripcionesAbiertas: true,
  textoUrgencia: 'Cupos muy limitados — Solo <strong>3 lugares</strong> disponibles',

  // Precio
  precioUSD: 1200,
  precioRegularUSD: 1800,
  precioMensual: 400,
  valorTotal: 1800,

  // Duracion
  duracionMeses: 3,
  duracionSemanas: 12,

  // Tracking
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID || '',
  ga4Id: import.meta.env.PUBLIC_GA4_ID || '',

  // SEO
  siteUrl: 'https://livianas.com',
  siteName: 'LIVIANAS',
} as const;

// Helper para generar links de WhatsApp
export function getWhatsAppLink1a1(location: keyof typeof site1a1Config.whatsappMessages): string {
  const msg = site1a1Config.whatsappMessages[location];
  return `https://wa.me/${site1a1Config.whatsappNumber}?text=${msg}`;
}

// Helper para obtener link de pago
export function getPaymentLink1a1(): string {
  return '/1a1/pago';
}

// Helper para obtener links directos de pago
export function getDirectPaymentLink1a1(method: 'mercadoPago' | 'paypal'): string {
  return site1a1Config.paymentLinks[method] || '#';
}

// ===== Datos de Secciones 1-a-1 =====

export const painPoints1a1Data = [
  {
    emoji: '😤',
    title: 'Ya probaste de todo',
    description: 'Dietas, apps, nutricionistas, programas grupales. Nada se sostiene.',
    highlight: 'Porque nadie miró lo que hay debajo.',
    detail: 'Necesitás un enfoque hecho a tu medida.',
  },
  {
    emoji: '😔',
    title: 'Te sentís estancada',
    description: 'Sabés qué tenés que hacer, pero no podés. Algo te frena y no sabés qué es.',
    highlight: 'El problema no es la información, es la raíz emocional.',
    detail: 'Y eso no se resuelve con más recetas.',
  },
  {
    emoji: '😰',
    title: 'Necesitás atención real',
    description: 'En los programas grupales te perdés. Necesitás que alguien te mire a vos, escuche tu historia y te guíe paso a paso.',
    highlight: 'Querés un acompañamiento 100% personalizado.',
    detail: 'Alguien que esté ahí, de verdad.',
  },
  {
    emoji: '😞',
    title: 'Querés un cambio profundo',
    description: 'No buscás bajar 3 kilos. Querés cambiar tu relación con la comida, tu cuerpo y tus emociones de raíz.',
    highlight: 'Querés una transformación que dure para siempre.',
    detail: 'No parches temporales.',
  },
];

export const transformation1a1Data = [
  {
    from: 'Sentirte perdida y sin saber por dónde empezar',
    to: 'Tener un plan personalizado diseñado para vos',
  },
  {
    from: 'Repetir patrones sin entender por qué',
    to: 'Desactivar tus sabotajes emocionales uno a uno',
  },
  {
    from: 'Buscar soluciones genéricas que no funcionan',
    to: 'Un enfoque 100% adaptado a tu historia y tu cuerpo',
  },
  {
    from: 'Hacer el proceso sola y abandonar a mitad de camino',
    to: 'Tener a Ana a tu lado durante 3 meses completos',
  },
];

export const phases1a1Data = [
  {
    number: 1,
    emoji: '🌱',
    title: 'DIAGNÓSTICO',
    name: 'Conocerte',
    duration: 'Mes 1',
    description: 'Evaluación profunda de tu historia, patrones alimentarios, emocionales y espirituales. Ana diseña tu plan completamente personalizado.',
    gradient: 'linear-gradient(135deg, #F5EDE3, #EDDCC8)',
  },
  {
    number: 2,
    emoji: '🔥',
    title: 'TRANSFORMACIÓN',
    name: 'Reconstruir',
    duration: 'Mes 2',
    description: 'Implementación activa de tu plan. Sesiones semanales de coaching individual, ajustes en tiempo real y trabajo emocional profundo.',
    gradient: 'linear-gradient(135deg, #E8EDE4, #D1DCC9)',
  },
  {
    number: 3,
    emoji: '👑',
    title: 'INTEGRACIÓN',
    name: 'Consolidar',
    duration: 'Mes 3',
    description: 'Consolidación de hábitos, autonomía progresiva y tu nueva identidad. Dejás de depender de un programa para sostenerte sola.',
    gradient: 'linear-gradient(135deg, #F2E4E4, #E8C9C9)',
  },
];

export const includes1a1Data = [
  {
    title: '12 sesiones individuales con Ana',
    description: 'Una sesión de 1 hora por semana durante 3 meses. Coaching profundo, cara a cara, solo vos y Ana.',
  },
  {
    title: 'Plan de alimentación 100% personalizado',
    description: 'Diseñado específicamente para tu cuerpo, tus gustos, tu rutina y tus objetivos. Ajustado mes a mes.',
  },
  {
    title: 'Acompañamiento por WhatsApp ilimitado',
    description: 'Acceso directo a Ana entre sesiones. Dudas, crisis, logros — siempre tenés a alguien que te responde.',
  },
  {
    title: 'Trabajo emocional y espiritual profundo',
    description: 'Sesiones dedicadas a desactivar tus patrones emocionales, creencias limitantes y la relación con tu cuerpo.',
  },
  {
    title: 'Seguimiento semanal de progreso',
    description: 'Revisión de avances, ajustes del plan y celebración de logros. Nada queda al azar.',
  },
  {
    title: 'Material exclusivo y grabaciones',
    description: 'Recursos personalizados, ejercicios, meditaciones y todas las sesiones grabadas para revisitar cuando quieras.',
  },
];

export const valueStack1a1Items = [
  '12 sesiones individuales de 1h con Ana',
  'Plan de alimentación 100% personalizado',
  'Acompañamiento ilimitado por WhatsApp',
  'Trabajo emocional y espiritual profundo',
  'Seguimiento semanal de progreso',
  'Material exclusivo y grabaciones de sesiones',
];

export const paraQuienEs1a1Data = [
  'Ya probaste programas grupales y necesitás algo más personalizado',
  'Querés un acompañamiento 1 a 1 con toda la atención puesta en vos',
  'Sentís que tu historia es compleja y necesita un enfoque individual',
  'Estás lista para invertir en un cambio profundo y duradero',
  'Querés trabajar tus emociones, no solo tu alimentación',
  'Buscás a alguien que te guíe paso a paso durante 3 meses completos',
  'Necesitás flexibilidad de horarios y un plan adaptado a tu vida',
  'Querés resultados reales, no promesas genéricas',
];

export const pricingFeatures1a1 = [
  '12 sesiones individuales de coaching con Ana (1h c/u)',
  'Plan de alimentación 100% personalizado y ajustable',
  'Acompañamiento ilimitado por WhatsApp durante 3 meses',
  'Trabajo emocional y espiritual profundo individualizado',
  'Seguimiento semanal de tu progreso',
  'Evaluación inicial completa (historia, patrones, objetivos)',
  'Material exclusivo adaptado a tu proceso',
  'Grabaciones de todas las sesiones',
  'Flexibilidad total de horarios',
];

export const faq1a1Data = [
  {
    question: '¿En qué se diferencia del programa grupal?',
    answer: 'El programa 1 a 1 es completamente personalizado. No compartís sesiones con nadie. Todo el enfoque, el plan de alimentación, el trabajo emocional y el acompañamiento están diseñados exclusivamente para vos. Son 3 meses en vez de 1, y tenés acceso directo a Ana por WhatsApp en cualquier momento.',
  },
  {
    question: '¿Cuánto dura el programa?',
    answer: '3 meses completos. Cada semana tenés una sesión individual de 1 hora con Ana, más acompañamiento ilimitado por WhatsApp entre sesiones.',
  },
  {
    question: '¿Cómo son las sesiones?',
    answer: 'Son sesiones de 1 hora por videollamada (Zoom), solo vos y Ana. Cada sesión combina coaching, trabajo emocional, revisión de tu plan y ajustes según tu progreso. Se coordinan en el horario que mejor te funcione.',
  },
  {
    question: '¿Qué pasa si necesito cambiar un horario?',
    answer: 'Tenés flexibilidad total. Podés reprogramar sesiones con 24 horas de anticipación. El programa se adapta a tu vida, no al revés.',
  },
  {
    question: '¿Voy a tener un plan de alimentación personalizado?',
    answer: 'Sí, 100% personalizado. Ana diseña tu plan basándose en tu historia, tu cuerpo, tus gustos, tu rutina y tus objetivos. Se ajusta mes a mes según tus avances.',
  },
  {
    question: '¿Puedo escribirle a Ana en cualquier momento?',
    answer: 'Sí. Tenés acceso ilimitado por WhatsApp durante los 3 meses. Dudas, momentos difíciles, logros — Ana está ahí para vos entre sesiones.',
  },
  {
    question: '¿Cómo es la forma de pago?',
    answer: 'Podés pagar con Mercado Pago (Uruguay y Latinoamérica) o PayPal (internacional). El pago es único de USD 1.200. Si pagás con tarjeta de crédito, Mercado Pago te ofrece cuotas automáticamente.',
  },
  {
    question: '¿Hay garantía?',
    answer: 'Si durante las primeras 2 semanas sentís que no es para vos, te devolvemos el 100%. Sin preguntas, sin vueltas. Queremos que estés segura de tu decisión.',
  },
  {
    question: '¿Puedo participar desde fuera de Uruguay?',
    answer: 'Sí. Las sesiones son 100% online por Zoom y el acompañamiento por WhatsApp funciona desde cualquier país.',
  },
  {
    question: '¿Cuántos cupos hay?',
    answer: 'Muy pocos. Ana trabaja con un máximo de 3 personas en formato 1 a 1 al mismo tiempo para garantizar la calidad del acompañamiento. Cuando se llenan, hay lista de espera.',
  },
  {
    question: '¿Puedo hablar con Ana antes de decidir?',
    answer: 'Por supuesto. Si llegaste hasta acá y querés saber si el programa 1 a 1 es para vos, escribile directamente. Ana se toma el tiempo de conversar con cada mujer antes de empezar.',
    showDirectCta: true,
  },
];
