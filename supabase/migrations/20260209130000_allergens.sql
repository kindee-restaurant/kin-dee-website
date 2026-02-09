-- Allergens table
create table allergens (
  id uuid primary key default uuid_generate_v4(),
  number text unique not null,    -- e.g. '1a', '2', '14'
  name text not null,             -- e.g. 'Wheat', 'Crustaceans'
  display_order int default 0,
  created_at timestamptz default now()
);

-- Junction table: menu items <-> allergens
create table menu_item_allergens (
  id uuid primary key default uuid_generate_v4(),
  menu_item_id uuid references menu_items(id) on delete cascade,
  allergen_id uuid references allergens(id) on delete cascade,
  unique(menu_item_id, allergen_id)
);

-- RLS
alter table allergens enable row level security;
alter table menu_item_allergens enable row level security;

create policy "Public can view allergens" on allergens for select using (true);
create policy "Public can view menu_item_allergens" on menu_item_allergens for select using (true);
create policy "Admins can do everything on allergens" on allergens using (auth.role() = 'authenticated');
create policy "Admins can do everything on menu_item_allergens" on menu_item_allergens using (auth.role() = 'authenticated');

-- Seed the 14 standard allergens
insert into allergens (number, name, display_order) values
('1a', 'Wheat', 1),
('1b', 'Barley', 2),
('1c', 'Oats', 3),
('1d', 'Rye', 4),
('2', 'Crustaceans', 5),
('3', 'Egg', 6),
('4', 'Fish', 7),
('5', 'Peanuts', 8),
('6', 'Soybeans', 9),
('7', 'Dairy/Milk', 10),
('8', 'Nuts', 11),
('9', 'Celery', 12),
('10', 'Mustard', 13),
('11', 'Sesame Seed', 14),
('12', 'Sulphites/Sulphur Dioxide', 15),
('13', 'Lupin', 16),
('14', 'Molluscs', 17);
