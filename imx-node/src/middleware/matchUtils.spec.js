const {
  compareRecords,
  generateNewRecord
} = require("../middleware/matchUtils");
const model = ["a", "b", "c"];
const primary = { a: 1, b: "stuff", c: [1, 2, 3] };
describe("Compare two datasets", () => {
  // No differences
  it("comparing identical objects", () => {
    const result = compareRecords(model, primary, primary);
    expect(result.length).toBe(0);
  });
  // Differences
  it("comparing different objects", () => {
    const result = compareRecords(model, primary, {
      a: 5,
      b: ["a"],
      c: { z: 44 }
    });
    expect(result.length).toBe(3);
    expect(result).toEqual(model);
  });
  it("only checks for presence of keys in both objects", () => {
    const result = compareRecords(model, primary, {
      d: 5,
      e: ["a"],
      f: { z: 44 }
    });
    expect(result.length).toBe(0);
  });
  // Empty primary
  it("returns complete array for empty primary object", () => {
    const result = compareRecords(
      model,
      {},
      {
        a: 5,
        b: ["a"],
        c: { z: 44 }
      }
    );
    expect(result.length).toBe(3);
    expect(result).toEqual(model);
  });
  // empty secondary
  it("returns empty array for empty secondary object", () => {
    const result = compareRecords(
      model,
      {
        a: 5,
        b: ["a"],
        c: { z: 44 }
      },
      {}
    );
    expect(result.length).toBe(0);
  });
});
describe("Generate a new record", () => {
  // returns correctly merged record
  it("returns a correctly merged record", () => {
    const result = generateNewRecord(model, primary, {
      a: 5,
      b: ["a"]
    });
    expect(Object.keys(result).length).toBe(3);
    expect(result.a).toEqual(5);
    expect(result.b).toEqual(["a"]);
    expect(result.c).toEqual([1, 2, 3]);
  });
  // returns false if no differences
  it("returns false if there are no difference in the objects", () => {
    const result = generateNewRecord(model, primary, primary);
    expect(result).not.toBeTruthy();
  });
});
