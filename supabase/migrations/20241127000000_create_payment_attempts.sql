-- Migration: Create payment_attempts table for tracking payment history and limits
-- Created: 2025-11-27

CREATE TABLE IF NOT EXISTS payment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_id TEXT,
  phone_number TEXT NOT NULL,
  qr_code TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'expired', 'cancelled', 'failed')),
  is_simulated_error BOOLEAN DEFAULT FALSE,
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_attempts_user_date ON payment_attempts(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_status ON payment_attempts(status);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_user_status ON payment_attempts(user_id, status);

-- RLS Policies
ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own payment attempts
CREATE POLICY "Users can view own payment attempts"
  ON payment_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own payment attempts
CREATE POLICY "Users can insert own payment attempts"
  ON payment_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own payment attempts
CREATE POLICY "Users can update own payment attempts"
  ON payment_attempts
  FOR UPDATE
  USING (auth.uid() = user_id);
