
-- Drop table

-- DROP TABLE public.person;

CREATE TABLE public.person (
	person_id bigserial NOT NULL,
	dob date NOT NULL,
	first_name varchar NOT NULL,
	last_name varchar NOT NULL,
	email varchar NULL,
	mobile varchar NULL,
	CONSTRAINT person_pkey PRIMARY KEY (person_id)
);
CREATE UNIQUE INDEX "PK_person" ON public.person USING btree (person_id);



-- Drop table

-- DROP TABLE public.search_records;

CREATE TABLE public.search_records (
	search_id bigserial NOT NULL,
	person_id bigserial NOT NULL,
	search_date timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT search_records_pkey PRIMARY KEY (search_id)
);
CREATE UNIQUE INDEX "PK_table_227" ON public.search_records USING btree (search_id);
CREATE INDEX "fkIdx_231" ON public.search_records USING btree (person_id);

ALTER TABLE public.search_records ADD CONSTRAINT "FK_231" FOREIGN KEY (person_id) REFERENCES person(person_id);


-- Drop table

-- DROP TABLE public.contact;

CREATE TABLE public.contact (
	contact_id serial NOT NULL,
	person_id bigserial NOT NULL,
	landline varchar NULL,
	url varchar NULL,
	title varchar NULL,
	revision_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ip inet NULL,
	CONSTRAINT contact_pkey PRIMARY KEY (contact_id)
);
CREATE UNIQUE INDEX "PK_contact" ON public.contact USING btree (contact_id);
CREATE INDEX "fkIdx_180" ON public.contact USING btree (person_id);

ALTER TABLE public.contact ADD CONSTRAINT "FK_180" FOREIGN KEY (person_id) REFERENCES person(person_id);



-- Drop table

-- DROP TABLE public.bank;

CREATE TABLE public.bank (
	bank_id bigserial NOT NULL,
	person_id bigserial NOT NULL,
	bank_name varchar NULL,
	user_name varchar NULL,
	revision_date timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT bank_pkey PRIMARY KEY (bank_id)
);
CREATE UNIQUE INDEX "PK_bank" ON public.bank USING btree (bank_id);
CREATE INDEX "fkIdx_198" ON public.bank USING btree (person_id);

ALTER TABLE public.bank ADD CONSTRAINT "FK_198" FOREIGN KEY (person_id) REFERENCES person(person_id);


-- Drop table

-- DROP TABLE public.address;

CREATE TABLE public.address (
	address_id bigserial NOT NULL,
	person_id bigserial NOT NULL,
	address1 varchar NULL,
	address2 varchar NULL,
	postcode varchar NULL,
	state varchar NULL,
	purchase_price numeric(18) NOT NULL,
	revision_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT address_pkey PRIMARY KEY (address_id)
);
CREATE UNIQUE INDEX "PK_address" ON public.address USING btree (address_id);
CREATE INDEX "fkIdx_176" ON public.address USING btree (person_id);

ALTER TABLE public.address ADD CONSTRAINT "FK_176" FOREIGN KEY (person_id) REFERENCES person(person_id);


