-- MN COLLECTION DATABASE SCHEMA FOR SUPABASE
-- Run these DDL queries in your Supabase SQL Editor to create the necessary tables.

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id bigint PRIMARY KEY,
    name text NOT NULL,
    price numeric NOT NULL,
    "originalPrice" numeric,
    category text NOT NULL,
    description text NOT NULL,
    badge text,
    image text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    role text NOT NULL DEFAULT 'User',
    status text NOT NULL DEFAULT 'Active',
    avatar text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id text PRIMARY KEY,
    "userId" text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    "productId" bigint NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity bigint NOT NULL,
    "totalPrice" numeric NOT NULL,
    status text NOT NULL DEFAULT 'Pending',
    date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "shippingDetails" jsonb,
    "paymentDetails" jsonb
);

-- 4. Create Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
    id text PRIMARY KEY,
    "time" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    message text NOT NULL,
    type text NOT NULL
);

-- Enable Row Level Security (RLS) or add public read/write policies for demonstration ease.
-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow public select/insert/update/delete for the boutique demo.
CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.users FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.orders FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.activities FOR ALL USING (true);
