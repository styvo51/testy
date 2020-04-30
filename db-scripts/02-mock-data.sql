INSERT INTO person (first_name, last_name, dob, street, city, state, postcode, email, mobile)
  VALUES ('John', 'Smith', '1975-11-23', '1 Adelaide Street', 'Brisbane', 'QLD', '4000', 'john@email.com', '0412345678'), ('Jane', 'Smith', '1975-11-23', '13 Dawn Street', 'Brisbane', 'QLD', '4001', 'jane@email.com', '0413579113'), ('Tim', 'Jones', '1975-11-23', '33 Ableton Road', 'Sydney', 'NSW', '2000', 'tim@email.com', '0411222333');

INSERT INTO users (name)
  VALUES ('Admin'), ('Oracle');

INSERT INTO api_keys (user_id, api_key)
  VALUES (1, 'apikey'), (2, 'oracleapikey');

INSERT INTO user_routes (user_id, route)
  VALUES (1, '*'), (2, '/oracle*');

INSERT INTO confirmed_people (person_id, user_id)
  VALUES (1, 1);

