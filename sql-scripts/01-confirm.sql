
-- Drop table

DROP TABLE public.confirm_records;

CREATE TABLE public.confirm_records (
	search_id bigserial PRIMARY KEY,
	api_key varchar NOT NULL,
	last_name varchar NOT NULL,
	address1 varchar NOT NULL,
	address2 varchar NOT NULL,
	postcode int4 NOT NULL,
	state varchar NOT NULL,
	search_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	match bool NOT NULL DEFAULT false,
	corporate bool not null default false
);
GRANT CONNECT ON DATABASE postgres TO imxadmin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO imxadmin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO imxadmin;
