INSERT INTO public.classes (slug, course_key, name, class_date, start_time, end_time, price_cents, capacity, location, status)
VALUES ('defensive-pistol-tacmed-2026-09-12', 'defensive-pistol-tacmed', 'Defensive Pistol / TacMed Course', '2026-09-12', '0730', '1430', 26500, 10, 'Nuevo, CA', 'open')
ON CONFLICT (slug) DO NOTHING;