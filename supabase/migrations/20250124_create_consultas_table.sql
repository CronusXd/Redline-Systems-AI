-- Create consultas table to store WhatsApp simulation results
create table if not exists public.consultas (
  id uuid default gen_random_uuid() primary key,
  phone_number text not null unique,
  messages_count int not null,
  images_count int not null,
  videos_count int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.consultas enable row level security;

-- Policy: Anyone can read consultations
create policy "Anyone can read consultas"
  on public.consultas for select
  using (true);

-- Policy: Only authenticated users can insert
create policy "Authenticated users can insert consultas"
  on public.consultas for insert
  with check (auth.role() = 'authenticated');

-- Add index on phone_number for faster lookups
create index if not exists consultas_phone_number_idx on public.consultas (phone_number);

-- Add email column to profiles table
alter table public.profiles 
add column if not exists email text;

-- Create index on email for faster lookups
create index if not exists profiles_email_idx on public.profiles (email);
