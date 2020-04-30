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
      status: 0,
      verified: true,
      safeHarbourScore: "None",
      firstName: "Nur",
      middleName: "",
      lastName: "MISUARI",
      dateOfBirth: "1939-03-03",
      address1: "PHILIPPINES",
      watchlistAMLAdditionalInfo: {
        category: "TER/SIP",
        scanId: "519303",
        urlMore:
          "https://resttest.datazoo.com/watchlist/519303_20190722150111.pdf",
        urlRemote:
          "URL for search history will appear here (authenticated users only)",
        residentOf: "",
        gender: "Male",
        deathIndex: "NO",
        placeOfBirth: "Philippines",
        lastReviewed: "2018-12-04",
        originalScriptName: [],
        otherNames: ["Nour MISUARI"],
        sanctionsReferences: [
          "PEP Tier 1",
          "Rep. Risk: Bribery and Corruption - Corrupt Practices",
          "Rep. Risk: Terrorism - Violent Crimes with Terrorist Connection",
          "Rep. Risk: Terrorism - Terrorist Financing and Support",
        ],
        importantDates: ["Date of Birth: 03 Mar 1939"],
        officialLists: ["PHILIPPINES OFFICE OF THE OMBUDSMAN"],
        associates: [
          "Hassan Ali Basari",
          "Abdul Ghani Omar",
          "Salim Y Salamuddin Julkipli",
        ],
        images: ["https://secure.datazoo.com/images/0013775000/0013774074.jpg"],
        idNumbers: [""],
        notes:
          "[BIOGRAPHY] Political Positions - Former Governor of the Autonomous Region in Muslim Mindanao",
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
  nock("https://resttest.datazoo.com")
    .post("/api/Authenticate.json", {
      UserName: process.env.DATA_ZOO_USERNAME,
      Password: process.env.DATA_ZOO_PASSWORD,
    })
    .reply(200, { sessionToken: "token" })
    .post("/api/Authenticate.json")
    .reply(403)
    .persist();

  // Use to count number of times request is made
  nock("https://resttest.datazoo.com")
    .post("/api/Australia/Verify.json")
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

describe("POST /politically-exposed-persons", () => {
  it("Verifies person with datazoo PEPS api", async () => {
    const res = await request
      .post(`/politically-exposed-persons?key=${apikey}`)
      .send(sampleRequest)
      .expect(200);
    expect(res.body).toMatchObject(sampleResponse);
  });

  it("Uses cached response", async () => {
    process.env.DATA_ZOO_PEPS_REQUEST_EXPIRY = "1 year";
    const res1 = await request
      .post(`/politically-exposed-persons?key=${apikey}`)
      .send(sampleRequest)
      .expect(200);
    sleep(5);
    const res2 = await request
      .post(`/politically-exposed-persons?key=${apikey}`)
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
      .post(`/politically-exposed-persons?key=${apikey}`)
      .send(sampleRequest)
      .expect(200);
    sleep(5);
    const res2 = await request
      .post(`/politically-exposed-persons?key=${apikey}`)
      .send(sampleRequest)
      .expect(200);
    expect(res2.body).toMatchObject(sampleResponse);
    expect(res2.body.time).not.toBe(res1.body.time); // 3rd party request should only be done once, and cache used
    const { rowCount } = await client.query("select * from datazoo_searches");
    expect(rowCount).toBe(2);
  });

  it("Doesn't allow request of unauthorized user", async () => {
    const res = await request
      .post(`/politically-exposed-persons`)
      .send(sampleRequest)
      .expect(403);

    expect(res.body.error).not.toBeUndefined();
  });
});
