-- Create a secure function to check booking status
-- Security Definer allows it to read the bookings table even if the user is anon (public)
-- BUT it strictly filters by BOTH email and phone, preventing enumeration.

create or replace function get_booking_status(p_email text, p_phone text)
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
begin
  return query
  select 
    b.id,
    b.booking_date,
    b.booking_time,
    b.guests,
    b.status,
    b.created_at
  from bookings b
  where lower(b.email) = lower(p_email)
  and replace(replace(replace(b.phone, ' ', ''), '-', ''), '+', '') = replace(replace(replace(p_phone, ' ', ''), '-', ''), '+', '') -- Normalize phone comparison slightly
  order by b.created_at desc;
end;
$$;
