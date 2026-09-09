ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS picked_up_at timestamptz;

CREATE POLICY orders_buyer_update ON public.orders
  FOR UPDATE TO authenticated
  USING (auth.uid() = buyer_id)
  WITH CHECK (auth.uid() = buyer_id);

CREATE TABLE public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  farmer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'held',
  released_at timestamptz,
  settled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.payouts TO authenticated;
GRANT ALL ON public.payouts TO service_role;

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY payouts_farmer_read ON public.payouts
  FOR SELECT TO authenticated
  USING (auth.uid() = farmer_id);

CREATE POLICY payouts_buyer_read ON public.payouts
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = payouts.order_id AND o.buyer_id = auth.uid()));

CREATE POLICY payouts_farmer_update ON public.payouts
  FOR UPDATE TO authenticated
  USING (auth.uid() = farmer_id)
  WITH CHECK (auth.uid() = farmer_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_payouts_updated_at
BEFORE UPDATE ON public.payouts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.sync_order_payout()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_farmer uuid;
BEGIN
  SELECT l.farmer_id INTO v_farmer FROM public.listings l WHERE l.id = NEW.listing_id;

  IF NEW.payment_status = 'held' AND COALESCE(OLD.payment_status, 'unpaid') <> 'held' THEN
    IF NEW.paid_at IS NULL THEN
      NEW.paid_at := now();
    END IF;
    INSERT INTO public.payouts (order_id, farmer_id, amount, status)
    VALUES (NEW.id, v_farmer, NEW.quantity_kg * NEW.price_per_kg, 'held')
    ON CONFLICT (order_id) DO NOTHING;
  END IF;

  IF NEW.status = 'picked_up' AND COALESCE(OLD.status, '') <> 'picked_up' THEN
    IF NEW.picked_up_at IS NULL THEN
      NEW.picked_up_at := now();
    END IF;
    IF NEW.payment_status = 'held' THEN
      NEW.payment_status := 'released';
      UPDATE public.payouts
        SET status = 'released', released_at = now()
        WHERE order_id = NEW.id AND status = 'held';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sync_order_payout() FROM anon, authenticated, PUBLIC;

CREATE TRIGGER orders_sync_payout
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.sync_order_payout();