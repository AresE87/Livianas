-- ══════════════════════════════════════════════════════════════
-- SUPABASE MIGRATION: purchases
-- Tabla para registro de ventas y deduplicación de envíos.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS purchases (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id      TEXT NOT NULL UNIQUE,   -- ID del pago en Mercado Pago
  email           TEXT NOT NULL,           -- Email del comprador (external_reference)
  status          TEXT NOT NULL,           -- approved | pending | rejected | in_process
  amount          NUMERIC(10,2),
  currency        TEXT DEFAULT 'UYU',
  payment_method  TEXT,                    -- visa, master, account_money, etc.
  email_sent      BOOLEAN DEFAULT FALSE,   -- ← CLAVE para deduplicación
  email_sent_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_purchases_email       ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_status      ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_email_sent  ON purchases(email_sent);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at  ON purchases(created_at DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS)
-- La tabla solo es accesible con service_role key (nunca desde el frontend)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Ningún acceso público (todo pasa por las API routes del backend)
CREATE POLICY "No public access" ON purchases
  FOR ALL TO anon USING (false);

-- El service role tiene acceso completo (usado en las API routes)
CREATE POLICY "Service role full access" ON purchases
  FOR ALL TO service_role USING (true);


-- ══════════════════════════════════════════════════════════════
-- VISTA de dashboard de ventas (opcional pero útil)
-- Accesible desde Supabase Dashboard → Table Editor
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW sales_summary AS
SELECT
  DATE_TRUNC('day', created_at)        AS fecha,
  COUNT(*)                             AS total_pagos,
  COUNT(*) FILTER (WHERE status = 'approved')   AS aprobados,
  COUNT(*) FILTER (WHERE status = 'pending')    AS pendientes,
  COUNT(*) FILTER (WHERE status = 'rejected')   AS rechazados,
  SUM(amount) FILTER (WHERE status = 'approved') AS revenue_total,
  COUNT(*) FILTER (WHERE email_sent = true)      AS emails_enviados
FROM purchases
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY fecha DESC;
