import assert from "node:assert/strict";
import test from "node:test";
import { categoryImage } from "../src/lib/product-images";

test("uses cannabis category artwork for missing product images", () => {
  assert.equal(categoryImage("Flower"), "/images/categories/flower.svg");
  assert.equal(categoryImage("Edibles"), "/images/categories/edibles.svg");
  assert.equal(categoryImage("Vapes"), "/images/categories/vapes.svg");
  assert.equal(categoryImage("Unknown"), "/images/categories/flower.svg");
});
