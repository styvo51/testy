const nock = require("nock");
const app = require("../app");
const request = require("supertest")(app);
const db = require("../../tests/db");
const [{ apikey }] = require("../../tests/mockdata/apiKeys");
const sleep = require("../utils/sleep");
let client;

/********************************************
 *            SAMPLE API REQ/RES
 *        (from datazoo documentation)
 ********************************************/
const driversLicenceRequest = {
  firstName: "John", // mandatory input
  middleName: null, // required if present on Licence
  lastName: "Smith", // mandatory input
  dateOfBirth: "1965-01-01", // mandatory input
  driversLicenceNo: "94977000", // mandatory input
  driversLicenceState: "ACT", // mandatory input
  thirdPartyDatasetsConsentObtained: true,
};

const driversLicenceResponse = {
  reportingReference: "DZ-KWD-000000001042128",
  safeHarbour: false,
  thirdPartyDatasets: {
    status: 0,
    verified: true,
    safeHarbourScore: "M2",
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: "1965-01-01",
    driversLicenceNo: "94977000",
    driversLicenceState: "ACT",
  },
};

const passportRequest = {
  firstName: "John", // mandatory input
  middleName: null, //required if present on Passport
  lastName: "Smith", // mandatory input
  dateOfBirth: "1965-01-01", // mandatory input
  passportNo: "C5100511", // mandatory input
  gender: "Male", // mandatory input
  thirdPartyDatasetsConsentObtained: true,
};
const passportResponse = {
  reportingReference: "DZ-KWE-000000001042132",
  safeHarbour: false,
  thirdPartyDatasets: {
    status: 0,
    verified: true,
    safeHarbourScore: "M2",
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: "1965-01-01",
    passportNo: "C5100511",
  },
};

const medicarecardRequest = {
  firstName: "John", // mandatory input
  middleName: "Allen", //required if initials are present on Medicare card
  lastName: "Smith", // mandatory input
  dateOfBirth: "1965-01-01", // mandatory input
  medicareCardNo: "3512743581", // mandatory input
  medicareCardType: "G", // mandatory input
  medicareIndividualRefNo: "1", // mandatory input
  medicareExpiryDate: "3999-12", // mandatory input
  thirdPartyDatasetsConsentObtained: true,
};

const medicarecardResponse = {
  reportingReference: "DZ-KWR-000000001042137",
  safeHarbour: false,
  thirdPartyDatasets: {
    status: 0,
    verified: true,
    safeHarbourScore: "M2",
    firstName: "John",
    middleName: "Allen",
    lastName: "Smith",
    dateOfBirth: "1965-01-01",
    medicareCardNo: "3512743581",
    medicareCardType: "G",
    medicareIndividualRefNo: 1,
    medicareExpiryDate: "3999-12-01",
  },
};

/********************************************
 *               LIFECYCLE
 ********************************************/
beforeAll(async () => {
  client = await db.connect();
});

beforeEach(async () => {
  await db.initTables(client);
  await db.seedData(client);
  nock("https://resttest.datazoo.com")
    .post("/api/Authenticate.json", {
      UserName: process.env.DATA_ZOO_USERNAME,
      Password: process.env.DATA_ZOO_PASSWORD,
    })
    .reply(200, { sessionToken: "token" })
    .post("/api/Authenticate.json")
    .reply(403)
    .persist();

  nock("https://resttest.datazoo.com")
    .post("/api/Australia/Verify.json")
    .reply(function (uri, body) {
      const headers = this.req.headers;
      if (headers.username !== process.env.DATA_ZOO_USERNAME) return [403];
      switch (headers.sessiontoken) {
        case "token":
          const time = new Date().getTime();
          if (body.driversLicenceNo)
            return [200, { ...driversLicenceResponse, time }];
          if (body.passportNo) return [200, { ...passportResponse, time }];
          if (body.medicareCardNo)
            return [200, { ...medicarecardResponse, time }];
          return [400];
        default:
          return [403];
      }
    })
    .persist();
});

afterAll(async () => {
  await client.release();
});

/********************************************
 *                 TESTS
 ********************************************/
describe("POST /verify-document/:document", () => {
  it("Verifies a Drivers Licence", async () => {
    const res = await request
      .post(`/verify-document/driverslicence?key=${apikey}`)
      .send(driversLicenceRequest)
      .expect(200);
    expect(res.body).toMatchObject(driversLicenceResponse);
  });
  it("Verifies a Passport", async () => {
    const res = await request
      .post(`/verify-document/passport?key=${apikey}`)
      .send(passportRequest)
      .expect(200);
    expect(res.body).toMatchObject(passportResponse);
  });
  it("Verifies a Medicarecard", async () => {
    const res = await request
      .post(`/verify-document/medicarecard?key=${apikey}`)
      .send(medicarecardRequest)
      .expect(200);
    expect(res.body).toMatchObject(medicarecardResponse);
  });

  it("Uses cached request", async () => {
    process.env.DATA_ZOO_DVS_REQUEST_EXPIRY = "1 year";
    const res1 = await request
      .post(`/verify-document/driverslicence?key=${apikey}`)
      .send(driversLicenceRequest)
      .expect(200);
    expect(res1.body).toMatchObject(driversLicenceResponse);
    sleep(10);
    const res2 = await request
      .post(`/verify-document/driverslicence?key=${apikey}`)
      .send(driversLicenceRequest)
      .expect(200);

    expect(res2.body).toMatchObject(driversLicenceResponse);
    expect(res2.body.time).toBe(res1.body.time); // 3rd party request should only be done once, and cache used

    const {
      rows: [data],
      rowCount,
    } = await client.query("select * from datazoo_searches");

    expect(data.response).toMatchObject(driversLicenceResponse);
    expect(rowCount).toBe(1);
  });

  it("Doesn't use cached request", async () => {
    process.env.DATA_ZOO_DVS_REQUEST_EXPIRY = "1 millisecond";
    const res1 = await request
      .post(`/verify-document/driverslicence?key=${apikey}`)
      .send(driversLicenceRequest)
      .expect(200);
    expect(res1.body).toMatchObject(driversLicenceResponse);
    sleep(10);
    const res2 = await request
      .post(`/verify-document/driverslicence?key=${apikey}`)
      .send(driversLicenceRequest)
      .expect(200);

    expect(res2.body).toMatchObject(driversLicenceResponse);
    expect(res2.body.time).not.toBe(res1.body.time); // 3rd party request should only be done once, and cache used

    const { rowCount } = await client.query("select * from datazoo_searches");
    expect(rowCount).toBe(2);
  });

  it("Doesn't verify document for unauthorized user", async () => {
    const res = await request
      .post(`/verify-document/driverslicence`)
      .send(driversLicenceRequest)
      .expect(403);

    expect(res.body.error).not.toBeUndefined();
  });
});
