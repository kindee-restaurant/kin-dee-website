-- Migration to support Lunch and Dinner menus

-- 1. Add menu_type column to menu_items
ALTER TABLE menu_items ADD COLUMN menu_type text NOT NULL DEFAULT 'dinner';

-- Existing items are essentially the 'dinner' menu, so the default applies.

-- 2. Insert Lunch Menu Items

-- Starters (All €9.00 or 3 for €24.00)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Gyoza', 'Wicklow pork, water chestnut, aged balsamic & soy dip (1a, 6, 12)', '€9.00', false, 1, 'lunch' FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Beef Larb', 'Char-grilled Irish fillet, lime leaf, coriander, mint, roast rice, chilli flake, lime juice (4)', '€9.00', true, 2, 'lunch' FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Kanom Jeeb', 'Steamed Dublin Bay prawn dumplings, scallion, sweet soy (1a, 2, 6)', '€9.00', false, 3, 'lunch' FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Thai “Scotch Egg”', 'Isaan style sausage, nduja, lemongrass, garlic, coriander, pickled shimeji (1a, 2, 6)', '€9.00', true, 4, 'lunch' FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Satay', 'BBQ marinated chicken, peanut sauce, cucumber relish, fresh herbs (1a, 4, 5)', '€9.00', false, 5, 'lunch' FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Salmon Crudo', 'Irish Salmon belly, coriander, lime, chilli, pineapple, miso, sesame oil (4, 6, 11)', '€9.00', true, 6, 'lunch' FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Boneless Ribs', '18-hour braised Wicklow pork, smoky Thai BBQ sauce, green mango salad (6, 9, 11, 12)', '€9.00', false, 7, 'lunch' FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Duck Spring Rolls', 'Confit Upton duck, mangetout, Wom Bok, carrot, ginger, chilli, beansprouts, sweet & sour dip (1a, 6)', '€9.00', false, 8, 'lunch' FROM categories WHERE slug = 'starters';

-- Mains (All €18.00)
INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Curry', 'Red/Yellow/Green. Chicken, Beef, Prawn (2), Tofu (6), Vegetable. (4)', '€18.00', true, 1, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Rendang', 'Slow braised Irish beef, sweet potato, roti (1 Wheat, 4)', '€18.00', true, 2, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Shaking Beef', 'Robinson’s Irish fillet, red onion, scallion, mange toute, baby watercress. (6, 7, 12)', '€18.00', true, 3, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Beef Chilli', 'Slivers of Irish fillet, green beans, garlic, sweet peppers, Thai basil (6)', '€18.00', true, 4, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Chicken Cashew', 'Corn fed boneless thighs, mild roast chilli, sweet peppers, scallions (6, 8)', '€18.00', false, 5, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Ginger Chicken', 'Corn fed boneless thighs, Shiitake mushroom, sweet peppers, scallions, red onion (6, 8)', '€18.00', true, 6, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Phad Thai', 'Prawn, chicken or tofu, scallion, Asian greens, egg, Tamarind, lime, roast peanuts (2, 3, 4)', '€18.00', false, 7, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Pork Pak Boong', 'Twice cooked Wicklow pork belly, morning glory, beansprouts, scallions, chilli, Thai basil (6, 12)', '€18.00', true, 8, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Mekong Duck', 'Twice cooked duck, garlic, Shaoxing, Asian greens, scallion, chilli, morning glory (6, 8, 12)', '€18.00', true, 9, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Kung Op', 'Clay pot baked Shrimp & glass noodles, Chinese celery, black pepper, scallions (2, 6, 9, 12)', '€18.00', true, 10, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Crab Fried Rice', 'Jasmin rice, tiger prawn, scallion, coriander, egg, soy, white pepper, chilli, lime, Prik Nahm Pla (2, 3, 4, 6)', '€18.00', true, 11, 'lunch' FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order, menu_type)
SELECT id, 'Chicken Salad', 'Grilled chicken, Wom Bok, carrot, coriander, coconut, lime, roast peanuts & crisp shallots. (5 Peanuts)', '€18.00', false, 12, 'lunch' FROM categories WHERE slug = 'mains';
