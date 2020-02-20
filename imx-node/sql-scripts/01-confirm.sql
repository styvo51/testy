
-- Drop table

DROP TABLE public.confirm_records;

CREATE TABLE public.confirm_records (
	search_id bigserial PRIMARY KEY,
	api_key varchar NOT NULL,
	first_name varchar NOT NULL,
	last_name varchar NOT NULL,
	address1 varchar NOT NULL,
	address2 varchar NOT NULL,
	postcode int4 NOT NULL,
	state varchar NOT NULL,
	search_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	match bool NOT NULL DEFAULT false,
	ip inet NOT NULL,
	nicknames varchar NOT NULL
);

