CREATE TABLE public.requirements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop text NOT NULL,
  quantity_kg integer NOT NULL,
  max_price_per_kg numeric NOT NULL,
  city text NOT NULL DEFAULT '',
  deliver_by date,
  note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.requirements TO authenticated;
GRANT SELECT ON public.requirements TO anon;
GRANT ALL ON public.requirements TO service_role;

ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "requirements_public_read" ON public.requirements FOR SELECT USING (true);
CREATE POLICY "requirements_buyer_insert" ON public.requirements FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "requirements_buyer_update" ON public.requirements FOR UPDATE TO authenticated USING (auth.uid() = buyer_id) WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "requirements_buyer_delete" ON public.requirements FOR DELETE TO authenticated USING (auth.uid() = buyer_id);

CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON public.requirements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();