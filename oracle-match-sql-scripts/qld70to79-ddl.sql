CREATE TABLE public.qld70to79 (
	id bigserial NOT NULL,
	title varchar NULL,
	first_name varchar NOT NULL,
	last_name varchar NOT NULL,
	email varchar NOT NULL,
	address varchar NOT NULL,
	address2 varchar NOT NULL,
	postcode varchar NOT NULL,
	dob varchar NOT NULL,
	telephone varchar NOT NULL,
	url varchar NOT NULL,
	ip varchar NOT NULL,
	CONSTRAINT qld70to79_pkey PRIMARY KEY (id)
);
