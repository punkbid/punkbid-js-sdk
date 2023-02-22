import test, { describe } from "node:test";
import assert from "node:assert";
import { filter, Cart } from "../src/index.js";

function testSerialization(cart: Cart, expectedContent: number[]) {
  assert.deepStrictEqual(Array.from(cart.computeContent()), expectedContent);
  const buffer = cart.serialize();
  cart = Cart.deserialize(buffer);
  assert.deepStrictEqual(Array.from(cart.computeContent()), expectedContent);
}

describe("Cart", () => {
  test("add a filter", () => {
    const c = new Cart();
    c.add(filter(["Alien"]));

    assert.deepStrictEqual(
      Array.from(c.computeContent()),
      [635, 2890, 3100, 3443, 5822, 5905, 6089, 7523, 7804]
    );
  });

  test("remove an id", () => {
    const c = new Cart();
    c.add(filter(["Alien"]));
    c.remove(3100);

    assert.deepStrictEqual(
      Array.from(c.computeContent()),
      [635, 2890, 3443, 5822, 5905, 6089, 7523, 7804]
    );
  });

  test("remove ids", () => {
    const c = new Cart();
    c.add(filter(["Alien"]));
    c.remove([3100, 5822]);

    assert.deepStrictEqual(
      Array.from(c.computeContent()),
      [635, 2890, 3443, 5905, 6089, 7523, 7804]
    );
  });

  test("remove a filter", () => {
    const c = new Cart();
    c.add(filter(["Alien"]));
    c.remove(filter(["Bandana"]));

    assert.deepStrictEqual(
      Array.from(c.computeContent()),
      [2890, 3100, 3443, 5905, 6089, 7523, 7804]
    );
  });

  test("add an out-of-bound id", () => {
    assert.throws(() => {
      const c = new Cart();
      c.add(10_000);
    });
  });

  test("serialize & deserialize id steps", () => {
    const c = new Cart();
    c.add(9999);
    c.add(130);
    c.add(888);
    c.remove(130);

    testSerialization(c, [9999, 888]);
  });

  test("serialize & deserialize filters & id steps", () => {
    const c = new Cart();
    c.add(filter(["Alien"]));
    c.remove(3100);
    c.remove(filter(["Bandana"]));
    c.add(4513);
    testSerialization(c, [2890, 3443, 5905, 6089, 7523, 7804, 4513]);
  });

  test("serialize a hair attribute", () => {
    const c = new Cart();
    c.add(filter(["Hoodie", "Ape"]));
    testSerialization(c, [2924]);
  });

  test("serialize a facial hair attribute", () => {
    const c = new Cart();
    c.add(filter(["Beanie", "Big Beard"]));
    testSerialization(c, [3107]);
  });

  test("serialize an eye attribute", () => {
    const c = new Cart();
    c.add(filter(["Beanie", "3D Glasses"]));
    testSerialization(c, [5690, 7846]);
  });

  test("serialize a neck attribute", () => {
    const c = new Cart();
    c.add(filter(["1 Attribute", "Choker"]));
    testSerialization(c, [89]);
  });

  test("serialize a mouth attribute", () => {
    const c = new Cart();
    c.add(filter(["7 Attributes", "Buck Teeth"]));
    testSerialization(c, [8348]);
  });

  test("serialize a mouth accessory attribute", () => {
    const c = new Cart();
    c.add(filter(["4 Attributes", "Albino Skin", "Medical Mask"]));
    testSerialization(c, [7679]);
  });

  test("serialize a cheek attribute", () => {
    const c = new Cart();
    c.add(filter(["Spots", "1 Attribute"]));
    testSerialization(c, [798, 5525]);
  });

  test("serialize a clown nose attribute", () => {
    const c = new Cart();
    c.add(filter(["Albino Skin", "Female", "Pilot Helmet", "Clown Nose"]));
    testSerialization(c, [7057]);
  });

  test("serialize a clown nose attribute", () => {
    const c = new Cart();
    c.add(filter(["Albino Skin", "Female", "Pilot Helmet", "Clown Nose"]));
    testSerialization(c, [7057]);
  });

  test("serialize a earring attribute", () => {
    const c = new Cart();
    c.add(filter(["Dark Skin", "Male", "Earring", "1 Attribute"]));
    testSerialization(c, [4422]);
  });

  test("clearing a cart", () => {
    const c = new Cart();
    c.add(filter(["Alien"]));

    assert.deepStrictEqual(
      Array.from(c.computeContent()),
      [635, 2890, 3100, 3443, 5822, 5905, 6089, 7523, 7804]
    );
    c.clear();
    assert.deepStrictEqual(Array.from(c.computeContent()), []);
  });
});
