-- Add user_id column to consultas table
ALTER TABLE public.consultas 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Enable RLS
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own consultations" 
ON public.consultas 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own consultations" 
ON public.consultas 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to update their own consultations (if needed)
CREATE POLICY "Users can update their own consultations" 
ON public.consultas 
FOR UPDATE
TO authenticated 
USING (auth.uid() = user_id);
