const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const domainApi = require("../domainCall");

describe("POST /match", () => {
  // perfect match
  it("Returns true, with confidence of 1 for exact match", async done => {
    const result = await request
      .post("/match?key=3f85a233-dff8-47ce-a971-5716aa93af9c")
      .send(domainApi)
      .set("Accept", "application/json");
    expect(result.status).toBe(200);
    expect(result.type).toBe("application/json");
    expect(result.body.match).toBeTruthy();
    expect(result.body.confidence).toBe("1.00");
    done();
  });
  // partial match
  it("Returns true for a partial match", async done => {
    const result = await request
      .post("/match?key=3f85a233-dff8-47ce-a971-5716aa93af9c")
      .send({
        dob: "2019-07-30",
        first_name: "mxim",
        last_name: "trevithck",
        email: "mtrevithick0@uol.com.br",
        mobile: "367-951-2003",
        address1: "26453 Spaight Court",
        address2: "asdas",
        postcode: 2222
      })
      .set("Accept", "application/json");
    expect(result.status).toBe(200);
    expect(result.type).toBe("application/json");
    expect(result.body.match).toBeTruthy();
    expect(Number(result.body.confidence)).toBeLessThan(1);
    expect(Number(result.body.confidence)).toBeGreaterThanOrEqual(0.75);
    done();
  });
  // no match
  it("Returns false if non immutables are incorrect", async done => {
    const result = await request
      .post("/match?key=3f85a233-dff8-47ce-a971-5716aa93af9c")
      .send({
        dob: "2019-07-30",
        first_name: "mxim",
        last_name: "trevithck",
        email: "mtrevithick0@uol.com.br",
        mobile: "367-951-2003",
        address1: "9 Ralph Stree",
        address2: "Elephant and Castle",
        postcode: 5549
      })
      .set("Accept", "application/json");
    expect(result.status).toBe(200);
    expect(result.type).toBe("application/json");
    expect(result.body.match).not.toBeTruthy();
    expect(Number(result.body.confidence)).toBeLessThan(1);
    expect(Number(result.body.confidence)).toBeGreaterThanOrEqual(0.75);
    console.log(result.body);
    done();
  });
});
