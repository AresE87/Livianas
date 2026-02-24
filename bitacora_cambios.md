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
