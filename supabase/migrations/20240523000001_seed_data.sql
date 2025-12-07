



-- Seed Menu Items
-- Starters
INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Tom Yum Goong', 'Classic spicy prawn soup with lemongrass, galangal & lime', '€12', true, 1 FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Fresh Spring Rolls', 'Rice paper rolls with prawns, herbs & peanut sauce', '€10', false, 2 FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Satay Chicken', 'Grilled skewers with house-made peanut sauce', '€11', false, 3 FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Larb Gai', 'Minced chicken salad with mint, chili & toasted rice', '€13', true, 4 FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Prawn Crackers', 'House-made with sweet chili dip', '€6', false, 5 FROM categories WHERE slug = 'starters';

-- Mains
INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Green Curry', 'Creamy coconut curry with Thai basil, your choice of protein', '€22', true, 1 FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Pad Thai', 'Rice noodles with prawns, tofu, peanuts & tamarind sauce', '€20', false, 2 FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Massaman Curry', 'Rich curry with potatoes, peanuts & slow-cooked beef', '€24', false, 3 FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Pad Krapow', 'Holy basil stir-fry with crispy fried egg', '€19', true, 4 FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Grilled Sea Bass', 'Whole fish with chili, lime & garlic sauce', '€28', false, 5 FROM categories WHERE slug = 'mains';

-- Fusion
INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Miso Glazed Salmon', 'Thai herbs with Japanese miso, served on coconut rice', '€26', false, 1 FROM categories WHERE slug = 'fusion';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Korean-Thai Fried Chicken', 'Gochujang glaze with Thai basil mayo', '€18', true, 2 FROM categories WHERE slug = 'fusion';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Vietnamese Pho-Thai', 'Aromatic broth with Thai spices & rice noodles', '€17', false, 3 FROM categories WHERE slug = 'fusion';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Wagyu Crying Tiger', 'Grilled wagyu with Northeast Thai dipping sauce', '€38', true, 4 FROM categories WHERE slug = 'fusion';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Coconut Laksa', 'Malaysian-Thai curry noodle soup', '€19', false, 5 FROM categories WHERE slug = 'fusion';

-- Desserts
INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Mango Sticky Rice', 'Sweet coconut rice with fresh mango & sesame', '€10', false, 1 FROM categories WHERE slug = 'desserts';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Thai Tea Crème Brûlée', 'Classic French technique, Thai tea flavour', '€11', false, 2 FROM categories WHERE slug = 'desserts';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Coconut Panna Cotta', 'With passion fruit coulis & toasted coconut', '€10', false, 3 FROM categories WHERE slug = 'desserts';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Banana Roti', 'Crispy flatbread with condensed milk & banana', '€9', false, 4 FROM categories WHERE slug = 'desserts';
