-- ── ORDERS TABLE: fix overly permissive policies ──────────────────────
-- Drop the dangerous policies that let anon read/modify ALL orders
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_select_own_order" ON orders;
DROP POLICY IF EXISTS "select_own_orders" ON orders;
DROP POLICY IF EXISTS "service_update_orders" ON orders;

-- Only authenticated users can insert their own orders
CREATE POLICY "insert_own_orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can only see their own orders
CREATE POLICY "select_own_orders" ON orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Only the service role (edge functions) can update order status
CREATE POLICY "service_update_orders" ON orders
  FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

-- Only service role can delete
CREATE POLICY "service_delete_orders" ON orders
  FOR DELETE TO service_role
  USING (true);

-- Revoke anon access entirely
REVOKE ALL ON orders FROM anon;

-- ── USER_PROFILES TABLE: remove anon access ───────────────────────────
REVOKE ALL ON user_profiles FROM anon;

-- Keep existing authenticated policies (they are already correct):
-- insert_own_profile: INSERT WHERE auth.uid() = id
-- select_own_profile: SELECT WHERE auth.uid() = id
-- update_own_profile: UPDATE WHERE auth.uid() = id

-- Add DELETE for own profile
CREATE POLICY "delete_own_profile" ON user_profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = id);

-- ── Add paid_at column to orders if not exists ────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at timestamptz;
