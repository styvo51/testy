INSERT INTO person (first_name, last_name, dob, street, city, state, postcode, email, mobile)
SELECT
  q.first_name,
  q.last_name,
  CASE WHEN q.dob::text ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' = FALSE THEN
    NULL
  ELSE
    q.dob::date
  END,
  q.address,
  q.address2,
  CASE WHEN q.postcode ~ '^[0-9]+$' = FALSE THEN
    NULL
  WHEN (q.postcode::int > 999
    AND q.postcode::int < 2600)
    OR (q.postcode::int > 2618
      AND q.postcode::int < 2900)
    OR (q.postcode::int > 2920
      AND q.postcode::int < 3000) THEN
    'NSW'
  WHEN (q.postcode::int > 199
    AND q.postcode::int < 300)
    OR (q.postcode::int > 2599
      AND q.postcode::int < 2619)
    OR (q.postcode::int > 2899
      AND q.postcode::int < 2921) THEN
    'ACT'
  WHEN (q.postcode::int > 2999
    AND q.postcode::int < 4000)
    OR (q.postcode::int > 7999
      AND q.postcode::int < 9000) THEN
    'VIC'
  WHEN (q.postcode::int > 3999
    AND q.postcode::int < 5000)
    OR (q.postcode::int > 8999
      AND q.postcode::int < 10000) THEN
    'QLD'
  WHEN (q.postcode::int > 4999
    AND q.postcode::int < 6000) THEN
    'SA'
  WHEN (q.postcode::int > 5999
    AND q.postcode::int < 6798)
    OR (q.postcode::int > 6799
      AND q.postcode::int < 7000) THEN
    'WA'
  WHEN (q.postcode::int > 6999
    AND q.postcode::int < 7800)
    OR (q.postcode::int > 7799
      AND q.postcode::int < 8000) THEN
    'TAS'
  WHEN (q.postcode::int > 799
    AND q.postcode::int < 900)
    OR (q.postcode::int > 899
      AND q.postcode::int < 1000) THEN
    'NT'
  ELSE
    NULL
  END,
  q.postcode,
  q.email,
  q.telephone
FROM
  qld70to79 q
