ALTER TABLE public.confirm_records DROP COLUMN nicknames;
ALTER TABLE public.confirm_records DROP COLUMN first_name;
ALTER TABLE public.confirm_records DROP COLUMN ip;
ALTER TABLE public.confirm_records ADD corporate bool NOT NULL default false;


