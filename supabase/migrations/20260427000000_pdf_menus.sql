-- Migration: Create menus table for PDF-based menus
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    pdf_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- Create policy for public read
CREATE POLICY "Public can read menus" ON menus
    FOR SELECT USING (true);

-- Create policy for authenticated update
CREATE POLICY "Admins can manage menus" ON menus
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );