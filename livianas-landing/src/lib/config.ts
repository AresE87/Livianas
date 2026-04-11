// src/lib/config.ts — Fuente unica de verdad para todo el contenido dinamico

export const siteConfig = {
  // WhatsApp
  whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER || '59891086674',

  // Mensajes prellenados
  whatsappMessages: {
    hero: encodeURIComponent('Hola, quiero info sobre LIVIANAS 🌿'),
    pricing: encodeURIComponent('Hola, quiero inscribirme en LIVIANAS 🌿'),
    finalCta: encodeURIComponent('Hola Ana, estoy lista para LIVIANAS 🌿'),
    floating: encodeURIComponent('Hola, quiero saber más sobre LIVIANAS 🌿'),
  },

  // CTA Messages
  ctaMessages: {
    primary: 'Inscribirme ahora',
    secondary: 'Quiero saber más',
    miniPricing: 'Reservar mi lugar',
    finalCta: 'Quiero mi lugar en el círculo',
    afterPainPoints: 'Quiero cambiar esto',
  },

  // Payment Links
  paymentLinks: {
    mercadoPago: import.meta.env.PUBLIC_MERCADOPAGO_LINK || '',
    paypal: import.meta.env.PUBLIC_PAYPAL_LINK || '',
  },

  // Contenido dinamico
  cuposDisponibles: 8,
  fechaCierre: '8 de abril',
  fechaCierreISO: '2026-04-08T23:59:59',
  fechaInicioCírculo: '11 de abril de 2026',
  inscripcionesAbiertas: true,
  textoUrgencia: 'El círculo cierra el 8 de abril — Solo <strong>8 lugares</strong> por grupo',

  // Precio
  precioUSD: 297,
  precioRegularUSD: 450,
  precioSemanal: 74,
  // precioCuota eliminado — MP maneja cuotas automáticamente con tarjeta de crédito
  valorTotal: 450,

  // Tracking
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID || '',
  ga4Id: import.meta.env.PUBLIC_GA4_ID || '',

  // SEO
  siteUrl: 'https://livianas.com',
  siteName: 'LIVIANAS',
  // Programa Livianas (producto de entrada)
  programaLivianas: {
    nombre: 'Programa Livianas',
    precioUSD: 147,
    precioRegularUSD: 247,
    precioUYU: 6200,
    cuposMax: 10,
    fechaInicio: '12 de abril de 2026',
    fechaCierreInscripciones: '10 de abril de 2026',
    horarioClases: 'Sábados 11hs (Uruguay)',
    whatsappMessages: {
      hero: encodeURIComponent('Hola Ana, quiero saber más sobre el Programa Livianas 🌿'),
      pricing: encodeURIComponent('Hola Ana, quiero inscribirme en el Programa Livianas 🌿'),
      finalCta: encodeURIComponent('Hola Ana, estoy lista para el Programa Livianas 🌿'),
    },
  },
  // Masterclass
  masterclass: {
    nombre: 'Las 3 Mentiras',
    subtitulo: 'Lo que nadie te dice sobre las dietas, la comida y tu cuerpo',
    fecha: '26 de abril de 2026',
    fechaISO: '2026-04-26T19:00:00-03:00',
    hora: '19:00 hs (Uruguay)',
    duracion: '90 minutos',
    plataforma: 'Zoom',
    whatsappMessages: {
      hero: encodeURIComponent('Hola Ana, quiero info sobre la masterclass Las 3 Mentiras 🌿'),
    },
  },
  // Consultorio con Ana — Acompañamiento Livianas
  consultorio: {
    nombre: 'Consultorio con Ana',
    descripcion: 'Acompañamiento mensual para transformar tu relación con la comida',
    whatsappMessages: {
      hero: encodeURIComponent('Hola Ana, quiero saber más sobre el Consultorio con Ana 🌿'),
      dudas: encodeURIComponent('Hola Ana, tengo dudas sobre el acompañamiento Livianas 🌿'),
    },
    nuevas: {
      mensual: {
        precio: 1500,
        periodo: 'mes',
        label: 'Probá un mes',
        link: 'https://www.mercadopago.com.uy/subscriptions/checkout?preapproval_plan_id=536a0d909b23484b9ba54904eea2fad5',
      },
      trimestral: {
        precio: 3500,
        periodo: 'trimestre',
        precioMensual: 1167,
        ahorro: 1000,
        label: 'Comprometete con vos',
        link: 'https://www.mercadopago.com.uy/subscriptions/checkout?preapproval_plan_id=db7552a83893489b84da35fdba0677e4',
      },
    },
    internas: {
      mensual: {
        precio: 900,
        periodo: 'mes',
        label: 'Renovar 1 mes',
        link: 'https://www.mercadopago.com.uy/subscriptions/checkout?preapproval_plan_id=d9cf14ead620436fb82cc7d825824549',
      },
      trimestral: {
        precio: 2500,
        periodo: 'trimestre',
        precioMensual: 833,
        ahorro: 200,
        label: 'Renovar 3 meses',
        link: 'https://www.mercadopago.com.uy/subscriptions/checkout?preapproval_plan_id=fc6458f5d9614c1a98e63d4a7f7c2b02',
      },
    },
    includes: [
      { title: '2 sesiones de Q&A en vivo al mes', description: 'Preguntás lo que necesites, Ana te guía en directo por Zoom.' },
      { title: 'Grupo privado de WhatsApp', description: 'Acompañamiento diario con Ana y las demás mujeres del grupo.' },
      { title: 'Orientación integral', description: 'Nutrición equilibrada, manejo del peso y crecimiento personal. Sin calorías, sin restricciones.' },
    ],
    faq: [
      { question: '¿Cómo son las sesiones?', answer: 'Son en vivo por Zoom, dos veces al mes. Tenés espacio para hacer preguntas personales y recibir orientación directa de Ana.' },
      { question: '¿Puedo cancelar cuando quiera?', answer: 'Sí, sin permanencia mínima. Cancelás cuando quieras desde MercadoPago.' },
      { question: '¿Para quién es esto?', answer: 'Para mujeres que quieren mejorar su relación con la comida con acompañamiento real y sostenido en el tiempo.' },
    ],
  },
} as const;

// Helper para generar links de WhatsApp
export function getWhatsAppLink(location: keyof typeof siteConfig.whatsappMessages): string {
  const msg = siteConfig.whatsappMessages[location];
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${msg}`;
}

// Helper para generar links de WhatsApp del Programa Livianas
export function getProgramaWhatsAppLink(location: keyof typeof siteConfig.programaLivianas.whatsappMessages): string {
  const msg = siteConfig.programaLivianas.whatsappMessages[location];
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${msg}`;
}

// Helper para generar links de WhatsApp del Consultorio con Ana
export function getConsultorioWhatsAppLink(location: keyof typeof siteConfig.consultorio.whatsappMessages): string {
  const msg = siteConfig.consultorio.whatsappMessages[location];
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${msg}`;
}

// Helper para obtener link de pago (página interna de checkout)
export function getPaymentLink(): string {
  return '/pago';
}

// Helper para obtener links directos de pago (para la página de pago)
export function getDirectPaymentLink(method: 'mercadoPago' | 'paypal'): string {
  return siteConfig.paymentLinks[method] || '#';
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
    name: 'Transformar',
    description: 'Armá tu estructura de alimentación antiinflamatoria. Sin contar calorías, con guía real y recetas simples.',
    gradient: 'linear-gradient(135deg, #E8EDE4, #D1DCC9)',
  },
  {
    number: 3,
    emoji: '⚡',
    title: 'CONEXIÓN',
    name: 'Sentir',
    description: 'Conectá con tu lado espiritual. Aprendé a soltar la culpa, la ansiedad y el control excesivo desde un lugar más profundo.',
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
    title: 'Guía de movimiento consciente',
    description: 'Recomendaciones simples: caminatas, estiramientos y respiraciones. Sin rutinas exigentes, a tu ritmo.',
  },
  {
    title: 'Trabajo espiritual y de autoconocimiento',
    description: 'Ejercicios semanales para conectar con vos misma, soltar creencias y construir tu nueva narrativa desde adentro.',
  },
  {
    title: 'Acceso de por vida a las grabaciones',
    description: 'Si no podés asistir en vivo, tenés todas las clases grabadas para verlas a tu ritmo.',
  },
];

export const valueStackItems = [
  '4 sesiones de coaching grupal en vivo con Ana',
  'Plan de alimentación antiinflamatoria',
  'Grupo de WhatsApp con acompañamiento diario',
  'Trabajo espiritual y de autoconocimiento',
  'Guía de movimiento consciente',
  'Grabaciones de por vida de todas las sesiones',
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
  'Plan de alimentación antiinflamatoria grupal',
  'Guía de porciones sin contar calorías',
  'Trabajo espiritual y ejercicios de autoconocimiento',
  'Guía de movimiento consciente (caminatas, respiraciones, estiramientos)',
  'Grabaciones de todas las clases',
  'Comunidad de mujeres que te sostienen',
  'Acceso de por vida al material del programa',
];

export const miniPricingFeatures = [
  'Coaching grupal en vivo con Ana cada semana',
  'Comunidad de mujeres + acompañamiento diario',
  'Alimentación + espiritualidad + autoconocimiento',
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
    question: '¿Necesito experiencia previa o hacer ejercicio?',
    answer: 'No. LIVIANAS no es un programa de ejercicio. Incluimos recomendaciones suaves como caminatas, estiramientos y respiraciones, pero el foco está en tu alimentación, tus emociones y tu conexión espiritual.',
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
    answer: 'Podés pagar con Mercado Pago (Uruguay y Latinoamérica) o PayPal (internacional). El pago es único de USD 297. Si pagás con tarjeta de crédito, Mercado Pago te ofrece cuotas automáticamente. Sin suscripciones ni cargos ocultos.',
  },
  {
    question: '¿Qué diferencia tiene esto de una dieta?',
    answer: 'Las dietas te dicen qué comer, pero nunca tocan lo que hay debajo. LIVIANAS te enseña por qué hacés lo que hacés y cómo cambiar desde adentro. Trabajamos las tres dimensiones: conducta, emoción y espiritualidad.',
  },
  {
    question: '¿Cómo es el proceso de pago?',
    answer: 'Hacés click en "Inscribirme ahora", elegís tu medio de pago preferido y completás el pago. Recibís confirmación inmediata por WhatsApp con toda la información del círculo.',
  },
  {
    question: '¿Hay garantía?',
    answer: 'Si durante la primera semana sentís que no es para vos, te devolvemos el 100%. Sin preguntas, sin vueltas. Queremos que estés segura de tu decisión.',
  },
  {
    question: '¿Puedo hablar con Ana antes de inscribirme?',
    answer: 'Por supuesto. Si llegaste hasta acá y todavía tenés dudas, escribile directamente. Ana se toma el tiempo de responder personalmente a cada mujer que está considerando ser parte del círculo.',
    showDirectCta: true,
  },
];

// ===== Programa Livianas — Datos de Secciones =====

export const plBeneficiosData = [
  {
    title: 'Entender qué te frena',
    description: 'Descubrir por qué te cuesta sostener cambios y dejar de culparte por eso.',
  },
  {
    title: 'Reducir la ansiedad',
    description: 'Transformar tu relación emocional con la comida. Sin culpa, sin restricción.',
  },
  {
    title: 'Organizar tu alimentación',
    description: 'Aprender a comer bien de forma simple, sin obsesión y sin contar calorías.',
  },
  {
    title: 'Recuperar tu energía',
    description: 'Sentir liviandad, vitalidad y ganas de cuidarte todos los días.',
  },
];

export const plSemanasData = [
  {
    number: 1,
    title: 'Despertar',
    subtitle: 'lo que te frena sin que lo veas',
    description: 'Identificar sabotajes, patrones emocionales, hambre física vs emocional, creencias limitantes.',
    ejercicio: 'Mapa personal de obstáculos',
  },
  {
    number: 2,
    title: 'Orden',
    subtitle: 'comer bien sin sufrir',
    description: 'Bases antiinflamatorias, guía de porciones con la mano, menú modelo de 4 días, lista de compras.',
    ejercicio: 'Armar tu menú con supervisión de Ana',
  },
  {
    number: 3,
    title: 'Energía',
    subtitle: 'mover el cuerpo sin castigarte',
    description: 'Movimiento mínimo efectivo (20-30 min), cortisol y estrés, rutina de sueño, manejo del estrés.',
    ejercicio: 'Mini circuito en vivo',
  },
  {
    number: 4,
    title: 'Valor',
    subtitle: 'esto no es peso, es amor propio',
    description: 'Autoestima, diálogo interno, cuidado personal no negociable, nueva identidad.',
    ejercicio: 'Carta a tu versión futura',
  },
];

export const plComoFuncionaData = [
  {
    emoji: '📹',
    title: '4 clases en vivo',
    description: 'Por Zoom, 1 hora y media cada una. Sábados 11hs.',
  },
  {
    emoji: '💬',
    title: 'Grupo WhatsApp',
    description: 'Acompañamiento entre semana con Ana y las demás participantes.',
  },
  {
    emoji: '📝',
    title: 'Tareas semanales',
    description: 'Ejercicios prácticos para que el cambio no quede solo en la clase.',
  },
];

export const plParaQuienData = [
  'Empezás dietas con toda la motivación y a las dos semanas las dejás',
  'Sentís que comés por ansiedad, aburrimiento o emociones, no por hambre real',
  'Te cuesta organizar tu alimentación con el ritmo de vida que tenés',
  'Te prometés "empezar el lunes" cada semana y no lo sostenés',
  'Sabés lo que tenés que hacer pero no lográs hacerlo de forma consistente',
  'Querés sentirte liviana, con energía y en paz con tu cuerpo',
];

export const plPricingFeatures = [
  '4 clases en vivo de 1h30 con Ana',
  'Grupo de WhatsApp con acompañamiento diario',
  'Guía de porciones + menú modelo',
  'Lista de compras antiinflamatoria',
  'Tareas prácticas de cada semana',
  'Diario emocional guiado',
  'Grupo reducido para acompañamiento personalizado',
];

export const plFaqData = [
  {
    question: '¿Cuánto dura el programa?',
    answer: '4 semanas exactas. Cada semana hay una clase en vivo de 1h30 por Zoom y acompañamiento diario por WhatsApp.',
  },
  {
    question: '¿Qué pasa si no puedo ir a una clase en vivo?',
    answer: 'Todas las clases quedan grabadas y las podés ver cuando quieras.',
  },
  {
    question: '¿Tengo que contar calorías o pesar la comida?',
    answer: 'Jamás. Trabajamos con guía de porciones usando tu mano como medida.',
  },
  {
    question: '¿Necesito experiencia previa o estar en forma?',
    answer: 'No. Las rutinas son de 20-30 minutos, sin equipo, y se adaptan a cualquier nivel.',
  },
  {
    question: '¿Puedo participar desde fuera de Uruguay?',
    answer: 'Sí. Las clases son online por Zoom y el grupo de WhatsApp funciona desde cualquier país.',
  },
  {
    question: '¿Cuántas personas hay por grupo?',
    answer: 'Grupos reducidos para que Ana pueda acompañar a cada participante de forma personalizada.',
  },
];
