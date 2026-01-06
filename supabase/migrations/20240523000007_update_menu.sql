-- Migration to update menu items
-- Created based on user request to update menu with new items

-- 1. Reset Menu Data
-- We delete from categories, which will cascade delete menu_items due to the FK constraint.
DELETE FROM categories;

-- 2. Insert New Categories
INSERT INTO categories (slug, label, display_order) VALUES
('starters', 'Starters', 1),
('mains', 'Mains', 2),
('dessert', 'Dessert', 3);

-- 3. Insert Menu Items

-- Starters
INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Gyoza', 'Wicklow pork, water chestnut, aged balsamic & soy dip (1a, 6, 12)', '€10.95', false, 1 FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Beef Larb', 'Char-grilled Irish fillet, lime leaf, coriander, mint, roast rice, chilli flake, lime juice (4)', '€12.95', true, 2 FROM categories WHERE slug = 'starters'; -- **

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Kanom Jeeb', 'Steamed Dublin Bay prawn dumplings, scallion, sweet soy (1a, 2, 6)', '€12.95', false, 3 FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Thai “Scotch Egg”', 'Isaan style sausage, nduja, lemongrass, garlic, coriander, pickled shimeji (1a, 2, 6)', '€11.50', true, 4 FROM categories WHERE slug = 'starters'; -- *

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Satay Taco', 'BBQ marinated chicken, peanut sauce, cucumber relish, fresh herbs, flour tortilla (1a, 4, 5)', '€10.95', false, 5 FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Salmon Crudo', 'Irish Salmon belly, coriander, lime, chilli, pineapple, miso, sesame oil (4, 11)', '€12.00', true, 6 FROM categories WHERE slug = 'starters'; -- *

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Boneless Ribs', '18-hour braised Wicklow pork, smoky Thai BBQ sauce, green mango salad (6, 9, 11, 12)', '€11.95', false, 7 FROM categories WHERE slug = 'starters';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Duck Spring Rolls', 'Confit Upton duck, mangetout, womb bok, carrot, ginger, chilli, beansprouts, sweet & sour dip (1a, 6)', '€11.50', false, 8 FROM categories WHERE slug = 'starters';


-- Mains
INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Shaking Beef', 'Wok fired Irish fillet, red onion, mange toute, courgette, baby watercress, lime dip (6, 7)', '€24.95', false, 1 FROM categories WHERE slug = 'mains';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Chicken Cashew', 'Corn fed boneless thighs, button mushroom, sweet peppers, scallions, roast chilli, garlic, onion (6, 8)', '€23.50', true, 2 FROM categories WHERE slug = 'mains'; -- *

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Beef Rendang', 'Slow braised Irish beef, sweet potato fondant, roast young coconut, Pandan leaf, fried shallots, roti (1a, 4)', '€24.95', true, 3 FROM categories WHERE slug = 'mains'; -- **

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Red Salmon Curry', 'Poached Irish Salmon, bamboo shoots, Thai basil & aubergine, sweet peppers, fine beans (4)', '€0.00', true, 4 FROM categories WHERE slug = 'mains'; -- ** (Price missing in source, using placeholder)

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Green Chicken', 'Sliced breast, fine beans, Thai basil & aubergine, sliced bamboo shoots, baby corn, green peppercorns (4)', '€23.50', true, 5 FROM categories WHERE slug = 'mains'; -- ***

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Geng Gari Prawn', 'Tiger Giant prawns, turmeric, sweet potato, onion, cherry tomato, baby corn, crispy shallots, cucumber relish (2, 4)', '€28.00', true, 6 FROM categories WHERE slug = 'mains'; -- *

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Pork Pak Boong', 'Twice cooked Wicklow pork belly, morning glory, beansprouts, scallions, chilli, Thai basil (6)', '€23.95', true, 7 FROM categories WHERE slug = 'mains'; -- **

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Phad Thai', 'Thai institution! Rice noodles, Asian greens, scallions, bean sprouts, egg, tamarind, lime & roast peanuts. Your choice of Chicken, prawn, or tofu. (2, 3, 4, 5 Peanuts)', '€22.95', true, 8 FROM categories WHERE slug = 'mains'; -- *

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Kung Op', 'Clay pot baked Shrimp & glass noodles, Chinese celery, Pak Choi, crispy pork belly, black pepper, scallions (2, 6, 9)', '€24.00', true, 9 FROM categories WHERE slug = 'mains'; -- *

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Khao Soi Noodles', 'Flat egg noodles, beef fillet slivers, Asian greens, pickled mustard greens, beansprouts, coriander, chilli oil, lime (1a, 4, 10)', '€23.95', true, 10 FROM categories WHERE slug = 'mains'; -- **

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Crab Fried Rice', 'Jasmin rice, tiger prawn, scallion, coriander, egg, soy, white pepper, chilli, lime, Prik Nahm Pla (2, 3, 4, 6)', '€26.00', true, 11 FROM categories WHERE slug = 'mains'; -- *

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'BBQ Striploin', '10 oz chargrilled Irish beef, charred shishito, vine tomatoes, Thai chimichurri', '€38.95', false, 12 FROM categories WHERE slug = 'mains';


-- Dessert
INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Beignets', 'Spiced sugar, pandanus crème Anglaise (1a, 3, 7)', '€9.50', false, 1 FROM categories WHERE slug = 'dessert';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Panna Cotta', 'White chocolate & coconut, passion fruit & lychee jelly, fresh fruit, crumbed meringue (3, 7)', '€9.50', false, 2 FROM categories WHERE slug = 'dessert';

INSERT INTO menu_items (category_id, name, description, price, is_spicy, display_order)
SELECT id, 'Brownie with Chocolate Tamarind Cheesecake', NULL, '€9.50', false, 3 FROM categories WHERE slug = 'dessert';
