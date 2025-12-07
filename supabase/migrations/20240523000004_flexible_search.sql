-- Drop the old strict function
drop function if exists get_booking_status(text, text);

-- Create a more flexible (single query) function
create or replace function get_booking_status(p_query text)
returns table (
  id uuid,
  booking_date date,
  booking_time time,
  guests int,
  status text,
  created_at timestamptz
) 
language plpgsql
security definer
as $$
declare
  normalized_query text;
begin
  -- Simple normalization: trim whitespace and lower case
  normalized_query := lower(trim(p_query));

  return query
  select 
    b.id,
    b.booking_date,
    b.booking_time,
    b.guests,
    b.status,
    b.created_at
  from bookings b
  where 
    -- Check Email match
    lower(b.email) = normalized_query
    OR
    -- Check Phone match (remove common formatting chars for robust check)
    replace(replace(replace(b.phone, ' ', ''), '-', ''), '+', '') = replace(replace(replace(normalized_query, ' ', ''), '-', ''), '+', '')
  order by b.booking_date desc;
end;
$$;
