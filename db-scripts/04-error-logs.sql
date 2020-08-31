CREATE TABLE "error_logs" (
  "id" SERIAL PRIMARY KEY,
  "created" timestamptz NOT NULL DEFAULT (now()),
  "user_id" int NOT NULL,
  "internal_error" json NOT NULL, 
  "client_error" json NOT NULL
);

ALTER TABLE "error_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");