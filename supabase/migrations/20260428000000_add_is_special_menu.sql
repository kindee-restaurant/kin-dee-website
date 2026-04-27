-- Add is_special column to menus table for featured/special menus
ALTER TABLE menus ADD COLUMN is_special boolean DEFAULT false;