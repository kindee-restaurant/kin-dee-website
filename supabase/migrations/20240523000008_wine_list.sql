-- Wine List Schema and Seed Data
-- Created: 2026-01-27

-- 1. Wine Categories Table
create table wine_categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  label text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 2. Wine Items Table
create table wine_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references wine_categories(id) on delete cascade,
  name text not null,
  origin text,
  size text, -- e.g., "200ml Bottle" or null for standard
  price_glass text, -- e.g., "€ 8.00" or null if not available by glass
  price_bottle text not null, -- e.g., "€ 29.00"
  display_order int default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table wine_categories enable row level security;
alter table wine_items enable row level security;

-- Public Read Access
create policy "Public can view wine categories" on wine_categories for select using (true);
create policy "Public can view wine items" on wine_items for select using (true);

-- Admin Full Access
create policy "Admins can do everything on wine_categories" on wine_categories using (auth.role() = 'authenticated');
create policy "Admins can do everything on wine_items" on wine_items using (auth.role() = 'authenticated');

-- =====================
-- SEED DATA
-- =====================

-- Insert Wine Categories
insert into wine_categories (slug, label, display_order) values
('sparkling', 'Sparkling Wines', 1),
('white', 'White Wines', 2),
('rose', 'Rosé Wine', 3),
('red', 'Red Wines', 4);

-- Insert Wine Items

-- SPARKLING WINES
insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Botter Prosecco DOC', 'Italy', '200ml Bottle', null, '€ 11.00', 1
from wine_categories where slug = 'sparkling';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Botter, Spango Prosecco DOC Frizzante', 'Veneto, Italy', null, null, '€ 38.00', 2
from wine_categories where slug = 'sparkling';

-- WHITE WINES
insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Delle Venezie, I Castelli R&G Pinot Grigio DOC', 'Italy', null, '€ 8.00', '€ 29.00', 1
from wine_categories where slug = 'white';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Paul Mas Chardonnay IGP', 'Languedoc, France', null, '€ 9.00', '€ 33.00', 2
from wine_categories where slug = 'white';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Birds Paradise Sauvignon Blanc', 'Marlborough, New Zealand', null, '€ 10.00', '€ 37.00', 3
from wine_categories where slug = 'white';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Domaine l''Herre, Piche Pedrix', 'Côtes de Gascogne, France', null, '€ 8.75', '€ 34.00', 4
from wine_categories where slug = 'white';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Rías Baixas, Franxmar Albariño', 'Spain', null, '€ 11.00', '€ 41.00', 5
from wine_categories where slug = 'white';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Tombre Single Estate, Organic Pinot Grigio', 'Venezie, Italy', null, '€ 9.75', '€ 38.00', 6
from wine_categories where slug = 'white';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Becksteiner Winzer, Gewürztraminer Trocken Dry', 'Germany', null, '€ 10.75', '€ 39.00', 7
from wine_categories where slug = 'white';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Claude Leblanc, Chardonnay, Mâcon Villages 2023', 'Burgundy, France', null, '€ 14.00', '€ 56.00', 8
from wine_categories where slug = 'white';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Chablis, Des Pèlerins', 'Burgundy, France', null, null, '€ 65.00', 9
from wine_categories where slug = 'white';

-- ROSÉ WINE
insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Les Roches Blanches, Rosé d''Anjou', 'Loire, France', null, '€ 9.30', '€ 38.00', 1
from wine_categories where slug = 'rose';

-- RED WINES
insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Castilla La Mancha, Luciente Tempranillo', 'Spain', null, '€ 8.00', '€ 28.00', 1
from wine_categories where slug = 'red';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Whistling Duck Shiraz', 'New South Wales, Australia', null, '€ 8.50', '€ 30.00', 2
from wine_categories where slug = 'red';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Elsa Bianchi Malbec', 'Mendoza, Argentina', null, '€ 9.50', '€ 33.00', 3
from wine_categories where slug = 'red';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Conde de Tresaguas, Tempranillo Joven', 'Rioja, Spain', null, '€ 9.00', '€ 34.00', 4
from wine_categories where slug = 'red';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Monsieur Plumage Pinot Noir', 'Languedoc, France', null, '€ 9.50', '€ 35.00', 5
from wine_categories where slug = 'red';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Quinta Do Vallado', 'Douro, Portugal', null, '€ 10.00', '€ 39.00', 6
from wine_categories where slug = 'red';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Cantine Terredagoli Chianti DOCG Organic', 'Italy', null, '€ 11.00', '€ 40.00', 7
from wine_categories where slug = 'red';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Château Maucaillou, "Le B Par Maucaillou"', 'Bordeaux Supérieur AOP 2020, France', null, '€ 12.00', '€ 45.00', 8
from wine_categories where slug = 'red';

insert into wine_items (category_id, name, origin, size, price_glass, price_bottle, display_order)
select id, 'Château de Callac Prestige', 'Bordeaux, France', null, '€ 16.00', '€ 55.00', 9
from wine_categories where slug = 'red';
