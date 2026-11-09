-- Migration: Special (seasonal) menus, e.g. Christmas.
-- Run this in the Supabase SQL Editor (or `supabase db push`).
-- `type` is free text so new types (valentines, easter, ...) can be added
-- in code (src/lib/specialMenus.ts) without another migration.

CREATE TABLE IF NOT EXISTS special_menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL DEFAULT 'christmas',
    title TEXT NOT NULL,
    description TEXT,
    price_text TEXT,
    image_url TEXT,
    pdf_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT false,
    enable_theme BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE special_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read special menus" ON special_menus
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage special menus" ON special_menus
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
