const app = require("../app");
const request = require("supertest")(app);
const db = require("../../tests/db");
const [, { apikey }] = require("../../tests/mockdata/apiKeys");
const testCases = require("../../tests/mockdata/contacts");

let client;
// Run a check that test suite is connecting to test database and seed test data
beforeAll(async () => {
  client = await db.connect();
});

beforeEach(async () => {
  await db.initTables(client);
  await db.seedData(client);
});

afterAll(async () => {
  await client.release();
});

/********************************************
 *                 TESTS
 ********************************************/
describe("POST /contacts", () => {
  it("should not find contacts when not authenticated", async () => {
    const response = await request
      .post(`/contacts`)
      .send(testCases.noRecord)
      .expect(403);
    expect(response.body.error).not.toBeUndefined();
    expect(response.body.error).toBe("Unable to authenticate your api key");
  });
  it("should find a match if the property is owner occupied", async () => {
    const response = await request
      .post(`/contacts?key=${apikey}`)
      .send(testCases.ownerOccupied)
      .expect(200);
    expect(response.body.owner_occupied).toBeTruthy();
    expect(response.body.owner_contacts).not.toBeUndefined();
    expect(response.body.owner_contacts.owner_name).not.toBeUndefined();
    expect(response.body.owner_contacts.raw_addresses).not.toBeUndefined();
  });
  it("should process raw QLD addresses correctly", async () => {
    const response = await request
      .post(`/contacts?key=${apikey}`)
      .send(testCases.qld)
      .expect(200);
    expect(response.body.owner_occupied).not.toBeTruthy();
    expect(response.body.owner_contacts).not.toBeUndefined();
  });
  it("should process raw NSW addresses correctly", async () => {
    const response = await request
      .post(`/contacts?key=${apikey}`)
      .send(testCases.nsw)
      .expect(200);
    expect(response.body.owner_occupied).not.toBeTruthy();
    expect(response.body.owner_contacts).not.toBeUndefined();
  });
  it("should return a correct response if no records are found", async () => {
    const response = await request
      .post(`/contacts?key=${apikey}`)
      .send(testCases.noRecord)
      .expect(200);
    expect(response.body.owner_occupied).not.toBeTruthy();
  });
  it("should tell the user if they have missed a field", async () => {
    const response = await request
      .post(`/contacts?key=${apikey}`)
      .send(testCases.badRequest)
      .expect(400);
    expect(response.body.error).not.toBeUndefined();
    expect(response.body.error).toBe("Validation failed");
    expect(response.body.errorFields).not.toBeUndefined();
    expect(response.body.errorFields.state).not.toBeUndefined();
    expect(response.body.errorFields.state).toBe('"State" is required');
  });
});
