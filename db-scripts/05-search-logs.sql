CREATE TABLE "searches" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL REFERENCES users ON DELETE CASCADE,
  "search_type" varchar NOT NULL,
  "created" timestamp NOT NULL DEFAULT (now()),
  "body" text NOT NULL,
  "response" text
);