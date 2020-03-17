const db = require("../database/connection");
async function getPerson(dob, email, mobile) {
  const { rows } = await db.query(
    `select *
        from person as p
        WHERE p.dob = $1 AND p.email = $2 and p.mobile = $3
        `,
    [dob, email, mobile]
  );
  return rows;
}
async function getAddress(personID) {
  const { rows } = await db.query(
    `select * from address as a where person_id = $1 order by a.revision_date desc limit 1;
        `,
    [personID]
  );
  return rows[0] ? rows[0] : false;
}
async function getBank(personID) {
  const { rows } = await db.query(
    `select * from bank as a where person_id = $1 order by a.revision_date desc limit 1;
        `,
    [personID]
  );
  return rows[0] ? rows[0] : false;
}
async function getContact(personID) {
  const { rows } = await db.query(
    `select * from contact as a where person_id = $1 order by a.revision_date desc limit 1;
        `,
    [personID]
  );
  return rows[0] ? rows[0] : false;
}

async function setSearchRecord(personID) {
  await db.query(
    `
        insert into search_records (person_id)
        values ($1)
        `,
    [personID]
  );
}
async function setPerson(firstName, lastName, dob, email, mobile) {
  const { rows } = await db.query(
    `
            insert into person (first_name, last_name, dob, email, mobile)
            values ($1,$2,$3,$4,$5)
            returning person_id
          `,
    [firstName, lastName, dob, email, mobile]
  );
  return rows[0].person_id;
}
async function setAddress(
  personID,
  address1,
  address2,
  postcode,
  state,
  purchasePrice
) {
  await db.query(
    `
    insert into address (person_id, address1, address2, postcode, state, purchase_price)
    values ($1,$2,$3,$4,$5,$6);
    `,
    [personID, address1, address2, postcode, state, purchasePrice]
  );
}
async function setBank(personID, bankName, userName) {
  await db.query(
    `
        insert into bank (person_id, bank_name, user_name)
        values ($1,$2,$3);
        `,
    [personID, bankName, userName]
  );
}
async function setContact(personID, landline, url, ip, title) {
  await db.query(
    `
          insert into contact (person_id, landline, url, ip, title)
          values ($1,$2,$3, $4, $5);
          `,
    [personID, landline, url, ip, title]
  );
}
module.exports.getPerson = getPerson;
module.exports.getAddress = getAddress;
module.exports.getContact = getContact;
module.exports.getBank = getBank;
module.exports.setSearchRecord = setSearchRecord;
module.exports.setPerson = setPerson;
module.exports.setAddress = setAddress;
module.exports.setBank = setBank;
module.exports.setContact = setContact;
