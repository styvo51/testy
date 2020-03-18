CREATE TABLE person (
  "id" bigserial PRIMARY KEY,
  "first_name" varchar,
  "last_name" varchar,
  "dob" date,
  "street" varchar,
  "city" varchar,
  "state" char(3),
  "postcode" char(4),
  "email" varchar,
  "mobile" varchar,
  "confirmed" boolean NOT NULL DEFAULT false
);

CREATE TABLE search_record (
  "id" bigint PRIMARY KEY,
  "search_date" timestamp DEFAULT CURRENT_TIMESTAMP,
  "api_key" varchar NOT NULL,
  "person" bigint NOT NULL
);

ALTER TABLE search_record ADD FOREIGN KEY ("person") REFERENCES "person" ("id");