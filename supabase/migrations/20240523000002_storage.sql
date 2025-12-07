-- Create a new storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Policy to allow public access to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- Policy to allow authenticated users (Admins) to upload images
create policy "Admin Upload"
on storage.objects for insert
with check ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- Policy to allow authenticated users (Admins) to update images
create policy "Admin Update"
on storage.objects for update
using ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- Policy to allow authenticated users (Admins) to delete images
create policy "Admin Delete"
on storage.objects for delete
using ( bucket_id = 'images' AND auth.role() = 'authenticated' );
