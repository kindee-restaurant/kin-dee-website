-- Truncate all content tables to clear data for testing
-- This does NOT delete the tables, only the data within them.

TRUNCATE TABLE menu_items CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE hero_section CASCADE;
TRUNCATE TABLE gallery_images CASCADE;
TRUNCATE TABLE bookings CASCADE;
TRUNCATE TABLE business_hours CASCADE;

-- Re-insert default business hours as they are annoying to type from scratch
INSERT INTO business_hours (day_range, hours, display_order) VALUES
('Mon - Thu', '5pm - 10pm', 1),
('Fri - Sat', '5pm - 11pm', 2),
('Sunday', '1pm - 9pm', 3);

-- Re-insert default hero section to avoid empty settings page
INSERT INTO hero_section (title, subtitle, image_url, button_text) VALUES
('Where Thai Tradition Meets Modern Fusion', 'Thai & Asian Fusion', '', 'Reserve Your Table');
