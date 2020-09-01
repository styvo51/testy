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
const sampleRequest = {
  firstName: "Nur",
  lastName: "Misuari",
  gender: "Male",
  dateOfBirth: "1939-03-03",
};

const sampleResponse = {
  reportingReference: "DZ-KWC-000000001038672",
  safeHarbour: false,
  watchlistAML: [
    {
      countryCode: "Global",
      clientReference: "Test_0001",
      reportingReference: "DZ-083a258d-88d2-4b4d-a893-559aa737ade7",
      matchStatus: "Match",
      searchErrorMessage: "",
      safeHarbour: false,
      searchStatus: "Successful",
      serviceResponses: {
        "Watchlist AML": {
          status: 0,
          sourceStatus: "Successful",
          errorMessage: "",
          identityVerified: true,
          safeHarbourScore: "none",
          nameMatchScore: "1.000",
          addressMatchScore: "N/A",
          verifications: {
            dateOfBirth: true,
            firstName: true,
            gender: true,
            lastName: true,
          },
          returnedData: {
            watchlistResults: [
              {
                additionalInfoURL:
                  "https://idu.datazoo.com/api/v2/watchlist/PDF/519303",
                category: "Politically Exposed Person",
                deathIndex: "NO",
                gender: "Male",
                otherNames: ["Nour Misuari"],
                scanId: "I519303",
              },
            ],
          },
        },
      },
    },
  ],
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
  nock("https://idu-test.datazoo.com/api/v2")
    .post("/auth/sign_in", {
      UserName: process.env.DATA_ZOO_USERNAME,
      Password: process.env.DATA_ZOO_PASSWORD,
    })
    .reply(200, { sessionToken: "token" })
    .post("/api/Authenticate.json")
    .reply(403)
    .persist();

  // Use to count number of times request is made
  nock("https://idu-test.datazoo.com/api/v2")
    .post("/verify")
    .reply(function (uri, body) {
      const headers = this.req.headers;
      const time = new Date().getTime();
      return headers.sessiontoken === "token" &&
        headers.username === process.env.DATA_ZOO_USERNAME
        ? [200, { ...sampleResponse, time }]
        : [403];
    })
    .persist();
});

afterAll(async () => {
  await client.release();
});

/********************************************
 *                 TESTS
 ********************************************/

describe("POST /aml/watchlist", () => {
  it("Verifies person with datazoo PEPS api", async () => {
    const res = await request
      .post(`/aml/watchlist?key=${apikey}`)
      .send(sampleRequest)
      .expect(200);
    expect(res.body).toMatchObject(sampleResponse);
  });

  it("Uses cached response", async () => {
    process.env.DATA_ZOO_PEPS_REQUEST_EXPIRY = "1 year";
    const res1 = await request
      .post(`/aml/watchlist?key=${apikey}`)
      .send(sampleRequest)
      .expect(200);
    sleep(5);
    const res2 = await request
      .post(`/aml/watchlist?key=${apikey}`)
      .send(sampleRequest)
      .expect(200);

    expect(res2.body).toMatchObject(sampleResponse);
    expect(res2.body.time).toBe(res1.body.time); // 3rd party request should only be done once, and cache used

    const {
      rows: [data],
      rowCount,
    } = await client.query("select * from datazoo_searches");

    expect(data.response).toMatchObject(sampleResponse);
    expect(rowCount).toBe(1);
  });

  it("Doesn't use cached request", async () => {
    process.env.DATA_ZOO_PEPS_REQUEST_EXPIRY = "1 millisecond";
    const res1 = await request
      .post(`/aml/watchlist?key=${apikey}`)
      .send(sampleRequest)
      .expect(200);
    sleep(5);
    const res2 = await request
      .post(`/aml/watchlist?key=${apikey}`)
      .send(sampleRequest)
      .expect(200);
    expect(res2.body).toMatchObject(sampleResponse);
    expect(res2.body.time).not.toBe(res1.body.time); // 3rd party request should only be done once, and cache used
    const { rowCount } = await client.query("select * from datazoo_searches");
    expect(rowCount).toBe(2);
  });

  it("Doesn't allow request of unauthorized user", async () => {
    const res = await request
      .post(`/aml/watchlist`)
      .send(sampleRequest)
      .expect(403);

    expect(res.body.error).not.toBeUndefined();
  });
});
