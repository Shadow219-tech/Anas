/*
# Create user_profiles table + link orders to users

## Changes

### New Table: user_profiles
Stores public profile info for authenticated users.
- id: matches auth.users.id
- email: user email
- full_name: display name
- phone: optional phone
- address, city, postal_code, country: saved shipping address
- avatar_initials: 1-2 letters for avatar display
- created_at / updated_at: timestamps

### Modified Table: orders
- Add optional user_id column (uuid, nullable) so logged-in user orders are linked

## Security
- RLS enabled on user_profiles
- Each user can only read/update their own profile
- orders: add policy for authenticated users to select their own orders
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'France',
  avatar_initials text NOT NULL DEFAULT '?',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Add user_id to orders (nullable — guest orders have NULL)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
  END IF;
END $$;

-- Policy: authenticated users can see their own orders (by user_id)
DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
TO authenticated USING (auth.uid() = user_id);
