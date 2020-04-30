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
  "mobile" varchar
);

CREATE TABLE users (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE api_keys (
  "api_key" text NOT NULL PRIMARY KEY,
  "user_id" int REFERENCES users ON DELETE CASCADE
);

CREATE TABLE user_routes (
  "id" serial PRIMARY KEY,
  "user_id" int NOT NULL REFERENCES users,
  "route" text NOT NULL
);

CREATE TABLE confirmed_people (
  "person_id" bigserial PRIMARY KEY REFERENCES person ON DELETE CASCADE,
  "user_id" int REFERENCES users ON DELETE CASCADE,
  "confirmed_date" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE datazoo_searches (
  "id" serial PRIMARY KEY,
  "search_date" timestamp DEFAULT CURRENT_TIMESTAMP,
  "hash" text NOT NULL,
  "body" json NOT NULL,
  "response" json NOT NULL
);

CREATE TABLE verified_documents (
  "id" serial PRIMARY KEY,
  "verification_date" timestamp DEFAULT CURRENT_TIMESTAMP,
  "person_id" int REFERENCES person ON DELETE CASCADE,
  "document_type" text NOT NULL
);

