CREATE TABLE person (
  "id" bigserial PRIMARY KEY,
  "first_name" text,
  "last_name" text,
  "dob" date,
  "street" text,
  "city" text,
  "state" text,
  "postcode" text,
  "email" text,
  "mobile" text,
  "confirmed" boolean NOT NULL DEFAULT FALSE
);

