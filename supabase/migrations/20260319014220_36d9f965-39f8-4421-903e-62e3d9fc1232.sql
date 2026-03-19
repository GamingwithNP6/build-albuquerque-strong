
-- Fix: Enforce author_role in RLS so users can't spoof 'admin' role on notes
-- Drop existing INSERT policy
DROP POLICY "Users can create notes on own submissions" ON public.request_notes;

-- Recreate with author_role enforcement
CREATE POLICY "Users can create notes on own submissions"
ON public.request_notes
FOR INSERT
TO authenticated
WITH CHECK (
  (author_user_id = auth.uid())
  AND (author_role = 'user' OR has_role(auth.uid(), 'admin'::app_role))
  AND (has_role(auth.uid(), 'admin'::app_role) OR EXISTS (
    SELECT 1 FROM contact_submissions
    WHERE contact_submissions.id = request_notes.submission_id
    AND contact_submissions.user_id = auth.uid()
  ))
);
