/*
# Add reviews, order tracking, and admin support

## Overview
Adds reviews (with moderation), order tracking columns, and admin support.

## New Tables
### reviews
- id, product_id, product_name, rating(1-5), name, email, comment, status(pending/approved/rejected), honeypot_field, created_at

## Modified Tables
### orders
- Added carrier, tracking_number, tracking_status columns

## Security
- reviews: public SELECT on approved only, anyone can INSERT (pending), service_role UPDATE/DELETE
- order_tracking: user reads own, service_role all
*/

-- ── ORDERS: add tracking columns ─────────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_status text DEFAULT 'preparation';

-- ── REVIEWS TABLE ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  product_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  name text NOT NULL,
  email text NOT NULL,
  comment text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  honeypot_field text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_approved_reviews" ON reviews;
CREATE POLICY "public_read_approved_reviews"
  ON reviews FOR SELECT TO anon, authenticated
  USING (status = 'approved');

DROP POLICY IF EXISTS "anyone_insert_review" ON reviews;
CREATE POLICY "anyone_insert_review"
  ON reviews FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_update_reviews" ON reviews;
CREATE POLICY "service_update_reviews"
  ON reviews FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_delete_reviews" ON reviews;
CREATE POLICY "service_delete_reviews"
  ON reviews FOR DELETE TO service_role
  USING (true);

-- ── ORDER_TRACKING TABLE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  carrier text,
  tracking_number text,
  tracking_url text,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_read_own_tracking" ON order_tracking;
CREATE POLICY "user_read_own_tracking"
  ON order_tracking FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_tracking.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "service_all_tracking" ON order_tracking;
CREATE POLICY "service_all_tracking"
  ON order_tracking FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ── INDEXES ──────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_status ON orders(tracking_status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
