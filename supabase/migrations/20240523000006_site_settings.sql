-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- About Section
    about_title TEXT DEFAULT 'A Culinary Journey from Bangkok to Dublin',
    about_text TEXT DEFAULT '"Kin Dee" means "eat well" in Thai, a philosophy that guides everything we do. Founded by Chef Somchai, who trained in Bangkok''s finest kitchens before bringing his passion to Ireland, Kin Dee represents the perfect harmony of tradition and innovation.',
    stats_experience TEXT DEFAULT '15+',
    stats_dishes TEXT DEFAULT '50+',
    stats_rating TEXT DEFAULT '4.9',
    
    -- Contact Info
    contact_email TEXT DEFAULT 'hello@kindee.ie',
    contact_phone TEXT DEFAULT '+353 1 765 4321',
    contact_address TEXT DEFAULT 'Leeson Street, Dublin 2, D02, Ireland',
    
    -- Social Media
    social_facebook TEXT DEFAULT 'https://facebook.com',
    social_instagram TEXT DEFAULT 'https://instagram.com',
    
    -- SEO
    seo_title TEXT DEFAULT 'Kin Dee | Authentic Thai Cuisine in Dublin',
    seo_description TEXT DEFAULT 'Experience the authentic taste of Thailand in the heart of Dublin. Kin Dee offers a refined dining experience with traditional flavors and modern presentation.'
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated update access" ON site_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert access" ON site_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert default row if not exists
INSERT INTO site_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
