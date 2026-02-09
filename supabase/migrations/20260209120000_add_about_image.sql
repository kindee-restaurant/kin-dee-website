-- Add about_image column to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_image TEXT;
