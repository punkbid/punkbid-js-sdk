import test, { describe } from "node:test";
import assert from "node:assert";
import { filter } from "../src/index.js";
import { TraitName } from "../src/metadata.js";

describe("filter", () => {
  test("create a valid filter with an array", () => {
    const f = filter(["Zombie", "1 Attribute", "Purple Cap"]);
    assert.deepStrictEqual(f, {
      type: 2,
      attributeCount: 1,
      attributes: [37],
    });
  });

  test("create a valid filter with a single trait", () => {
    const f = filter("3D Glasses");
    assert.deepStrictEqual(f, {
      attributes: [57],
    });
  });

  test("create a filter with mutually exclusive traits", () => {
    assert.throws(() => filter(["Zombie", "Ape"]), {
      message: "mutually exclusive traits are not allowed",
    });
  });

  test("create a filter with mutually exclusive attributes", () => {
    assert.throws(() =>
      filter(["Hoodie", "Purple Cap"] as unknown as TraitName[])
    );
  });
});
