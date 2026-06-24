/*
# Create orders table for Orygin shop

## Purpose
Stores all customer orders placed through the Orygin website.

## Tables

### orders
- id: uuid primary key
- order_number: human-readable order reference (e.g. ORY-001234)
- status: pending | paid | shipped | delivered | cancelled
- customer_email: customer email address
- customer_name: full name
- customer_phone: phone number (optional)
- shipping_address: JSONB with street, city, postal_code, country
- items: JSONB array of {product_id, product_name, country_code, country_name, type, size, quantity, unit_price}
- subtotal: total before shipping
- shipping_cost: shipping fee
- total: grand total in EUR cents
- stripe_payment_intent_id: Stripe PI id for reconciliation
- stripe_payment_status: Stripe payment status
- created_at: timestamp

## Security
- RLS enabled
- Anon + authenticated can INSERT (public shop, no login required)
- Only service role can SELECT/UPDATE (for backend/edge functions)
- Anon can select their own order by id (for confirmation page)
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  shipping_address jsonb NOT NULL,
  items jsonb NOT NULL,
  subtotal integer NOT NULL,
  shipping_cost integer NOT NULL DEFAULT 0,
  total integer NOT NULL,
  stripe_payment_intent_id text,
  stripe_payment_status text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_email_idx ON orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_stripe_pi_idx ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_own_order" ON orders;
CREATE POLICY "anon_select_own_order" ON orders FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "service_update_orders" ON orders;
CREATE POLICY "service_update_orders" ON orders FOR UPDATE
TO service_role USING (true) WITH CHECK (true);
