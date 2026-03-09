ALTER TABLE public.contact_submissions
  ADD CONSTRAINT chk_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT chk_phone_length CHECK (char_length(phone) BETWEEN 1 AND 20),
  ADD CONSTRAINT chk_email_length CHECK (char_length(email) BETWEEN 1 AND 255),
  ADD CONSTRAINT chk_description_length CHECK (char_length(description) BETWEEN 1 AND 1000);