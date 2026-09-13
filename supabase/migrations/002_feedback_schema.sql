-- Supabase Feedback Table Migration

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    category TEXT DEFAULT 'General',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anonymous or authenticated) to submit feedback
CREATE POLICY "Anyone can submit feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);
