ALTER TABLE public.users ADD deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.users ADD deleted_email varchar(256) NULL;
