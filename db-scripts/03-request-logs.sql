CREATE TABLE "request_logs" (
  "id" SERIAL PRIMARY KEY,
  "created" timestamptz NOT NULL DEFAULT (now()),
  "user_id" int NOT NULL,
  "raw_request" json NOT NULL
);

ALTER TABLE "request_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");