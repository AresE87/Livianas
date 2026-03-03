// src/lib/config-materiales.ts — Config para la tienda de materiales digitales

export const materialesConfig = {
  // Payment links (fixed per product)
  paymentLinks: {
    mercadoPago: import.meta.env.PUBLIC_MATERIALES_MP_LINK || '',
    paypal: import.meta.env.PUBLIC_MATERIALES_PAYPAL_LINK || '',
  },

  siteUrl: 'https://livianas.com',
};

export interface Material {
  id: string;
  title: string;
  description: string;
  format: string;
  pages?: string;
}

export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  items: Material[];
  price: number;
  oldPrice: number;
  currency: string;
  badge: string;
}

export const bundleData: Bundle = {
  id: 'bundle-guia-recetario',
  name: 'Pack Livianas',
  tagline: 'Tu primer paso hacia una alimentación consciente',
  description:
    'Todo lo que necesitás para arrancar tu camino hacia el bienestar. Una guía práctica con los principios del método y un recetario con opciones reales, ricas y fáciles de hacer.',
  items: [
    {
      id: 'mat-001',
      title: 'Guía Livianas',
      description:
        'Los fundamentos del enfoque antiinflamatorio: qué comer, cómo combinar alimentos y cómo empezar sin estrés. Incluye planificación semanal y lista de compras.',
      format: 'PDF',
      pages: '32 páginas',
    },
    {
      id: 'mat-002',
      title: 'Recetario Livianas',
      description:
        'Recetas antiinflamatorias pensadas para el día a día. Desayunos, almuerzos, cenas y snacks con ingredientes accesibles y preparación simple.',
      format: 'PDF',
      pages: '28 páginas',
    },
  ],
  price: 15,
  oldPrice: 24,
  currency: 'USD',
  badge: 'Oferta de lanzamiento',
};

export const materialesFaqData = [
  {
    question: '¿Cómo recibo los materiales?',
    answer:
      'Después de completar el pago, recibís un link de descarga inmediato. También te llega por email una copia de respaldo.',
  },
  {
    question: '¿En qué formato vienen?',
    answer:
      'Ambos materiales vienen en formato PDF, optimizados para leer en celular, tablet o computadora. Podés imprimirlos si preferís.',
  },
  {
    question: '¿Puedo pagar desde cualquier país?',
    answer:
      'Sí. Aceptamos Mercado Pago (Uruguay y Latinoamérica) y PayPal (internacional). El precio es en dólares americanos.',
  },
  {
    question: '¿Los materiales se actualizan?',
    answer:
      'Sí. Si comprás ahora, tenés acceso a futuras actualizaciones del contenido sin costo adicional.',
  },
];
