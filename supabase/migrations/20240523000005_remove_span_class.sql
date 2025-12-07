-- Remove span_class column from gallery_images table
alter table gallery_images drop column if exists span_class;
