ALTER TABLE public.merch_products
  ADD COLUMN IF NOT EXISTS stock_per_size integer NOT NULL DEFAULT 2;

CREATE OR REPLACE FUNCTION public.get_merch_size_availability()
RETURNS TABLE(product_id uuid, size text, stock integer, ordered integer, remaining integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  WITH sizes AS (
    SELECT p.id AS product_id, s.value::text AS size, p.stock_per_size AS stock
    FROM public.merch_products p
    CROSS JOIN LATERAL jsonb_array_elements(p.sizes) AS s(value)
  ),
  ordered AS (
    SELECT o.product_id, o.size, SUM(o.quantity)::int AS qty
    FROM public.merch_orders o
    WHERE o.status <> 'cancelled'
    GROUP BY o.product_id, o.size
  )
  SELECT sz.product_id,
         sz.size,
         sz.stock,
         COALESCE(od.qty, 0) AS ordered,
         GREATEST(sz.stock - COALESCE(od.qty, 0), 0) AS remaining
  FROM sizes sz
  LEFT JOIN ordered od ON od.product_id = sz.product_id AND od.size = sz.size;
$$;

REVOKE ALL ON FUNCTION public.get_merch_size_availability() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_merch_size_availability() TO anon, authenticated, service_role;