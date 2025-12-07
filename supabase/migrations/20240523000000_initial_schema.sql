-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Hero Section Table
create table hero_section (
  id uuid primary key default uuid_generate_v4(),
  title text not null default 'Where Thai Tradition Meets Modern Fusion',
  subtitle text,
  image_url text not null,
  button_text text default 'Reserve Your Table',
  button_link text default '#reservations',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Categories Table
create table categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  label text not null,
  image_url text, -- optional category image (e.g., used in menu)
  display_order int default 0,
  created_at timestamptz default now()
);

-- 3. Menu Items Table
create table menu_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  description text,
  price text not null,
  is_spicy boolean default false,
  is_available boolean default true,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 4. Gallery Images Table
create table gallery_images (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  alt_text text,
  span_class text default 'col-span-1 row-span-1', -- e.g. "col-span-2 row-span-2"
  display_order int default 0,
  created_at timestamptz default now()
);

-- 5. Bookings Table
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text not null,
  booking_date date not null,
  booking_time time not null,
  guests int not null,
  message text,
  status text default 'pending', -- pending, confirmed, cancelled, rejected
  created_at timestamptz default now()
);

-- 6. Business Hours Table
create table business_hours (
  id uuid primary key default uuid_generate_v4(),
  day_range text not null, -- e.g. "Mon-Thu"
  hours text not null, -- e.g. "5pm - 10pm"
  display_order int default 0,
  created_at timestamptz default now()
);

-- RLS Policies
-- Enable RLS on all tables
alter table hero_section enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table gallery_images enable row level security;
alter table bookings enable row level security;
alter table business_hours enable row level security;

-- Public Read Access
create policy "Public can view hero content" on hero_section for select using (true);
create policy "Public can view categories" on categories for select using (true);
create policy "Public can view menu items" on menu_items for select using (true);
create policy "Public can view gallery" on gallery_images for select using (true);
create policy "Public can view business hours" on business_hours for select using (true);

-- Public Write Access (for Bookings only)
create policy "Public can create bookings" on bookings for insert with check (true);

-- Admin Full Access (Assuming admins are authenticated users for now)
-- In a real scenario, you'd check for a specific role claim or user ID
create policy "Admins can do everything on hero" on hero_section using (auth.role() = 'authenticated');
create policy "Admins can do everything on categories" on categories using (auth.role() = 'authenticated');
create policy "Admins can do everything on menu_items" on menu_items using (auth.role() = 'authenticated');
create policy "Admins can do everything on gallery" on gallery_images using (auth.role() = 'authenticated');
create policy "Admins can do everything on bookings" on bookings using (auth.role() = 'authenticated');
create policy "Admins can do everything on business_hours" on business_hours using (auth.role() = 'authenticated');

-- Seed Data (Optional, but helpful for initial setup)
-- Insert default Hero
insert into hero_section (image_url) values ('/hero-image.png');

-- Insert default Categories
insert into categories (slug, label, display_order) values 
('starters', 'Starters', 1),
('mains', 'Thai Classics', 2),
('fusion', 'Asian Fusion', 3),
('desserts', 'Desserts', 4);

-- Insert Business Hours
insert into business_hours (day_range, hours, display_order) values
('Mon - Thu', '5pm - 10pm', 1),
('Fri - Sat', '5pm - 11pm', 2),
('Sunday', '1pm - 9pm', 3);
