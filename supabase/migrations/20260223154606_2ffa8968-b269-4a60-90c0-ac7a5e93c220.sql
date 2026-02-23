CREATE POLICY "Deny public reads" ON public.contact_submissions
  FOR SELECT
  USING (false);