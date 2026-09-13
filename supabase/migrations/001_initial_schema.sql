-- NetPulse Database Migration Schema
-- Version: 001_initial_schema.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Speed Tests Table
CREATE TABLE IF NOT EXISTS public.speed_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    download_mbps NUMERIC(10, 2) NOT NULL,
    upload_mbps NUMERIC(10, 2) NOT NULL,
    ping_ms NUMERIC(10, 2) NOT NULL,
    jitter_ms NUMERIC(10, 2) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    score_rating TEXT NOT NULL CHECK (score_rating IN ('Poor', 'Fair', 'Good', 'Excellent')),
    connection_type TEXT,
    effective_type TEXT,
    downlink NUMERIC(10, 2),
    rtt INTEGER,
    server_id TEXT NOT NULL DEFAULT 'auto',
    server_name TEXT NOT NULL DEFAULT 'Auto Selected Edge Server',
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_speed_tests_user_id ON public.speed_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_speed_tests_created_at ON public.speed_tests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_speed_tests_is_public ON public.speed_tests(is_public) WHERE is_public = true;

-- Enable Row Level Security (RLS)
ALTER TABLE public.speed_tests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- 1. Anyone can view public speed tests, or users can view their own tests
CREATE POLICY "Public or owner can view speed tests" 
ON public.speed_tests 
FOR SELECT 
USING (
    is_public = true 
    OR (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
    OR user_id IS NULL
);

-- 2. Anyone (anon or auth) can insert a test result
CREATE POLICY "Anyone can create a speed test" 
ON public.speed_tests 
FOR INSERT 
WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL) 
    OR (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL))
);

-- 3. Users can update their own tests
CREATE POLICY "Users can update their own speed tests" 
ON public.speed_tests 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 4. Users can delete their own tests
CREATE POLICY "Users can delete their own speed tests" 
ON public.speed_tests 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);
