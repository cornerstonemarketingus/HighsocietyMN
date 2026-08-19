import assert from "node:assert/strict";
import test from "node:test";
import { blogCoverFor, parseBlogDraft, slugifyBlogTitle } from "../src/lib/blog-automation";

test("assigns stable editorial covers while preserving explicit images", () => {
  assert.equal(blogCoverFor("A guide to modern edibles"), "/images/categories/edibles.svg");
  assert.equal(blogCoverFor("Understanding live resin"), "/images/categories/vapes.svg");
  assert.equal(blogCoverFor("Flower freshness"), "/images/categories/flower.svg");
  assert.equal(blogCoverFor("Anything", "/custom/cover.jpg"), "/custom/cover.jpg");
});

test("parses complete JSON drafts and rejects unsafe or incomplete content", () => {
  const content = `## Introduction\n\n${"Responsible adult cannabis education. ".repeat(70)}`;
  const parsed = parseBlogDraft(`\`\`\`json\n${JSON.stringify({ title: "A thoughtful guide to cannabis labels", excerpt: "Learn how to read product labels carefully and make more deliberate choices as an adult consumer.", content })}\n\`\`\``);
  assert.equal(parsed.title, "A thoughtful guide to cannabis labels");
  assert.throws(() => parseBlogDraft(JSON.stringify({ title: "Too short", excerpt: "Brief", content: "Tiny" })), /incomplete/);
  assert.throws(() => parseBlogDraft(JSON.stringify({ title: "A sufficiently descriptive title", excerpt: "A sufficiently detailed excerpt that passes the minimum length requirement.", content: `${"Safe text. ".repeat(190)}<script>alert(1)</script>` })), /unsafe/);
});

test("creates clean bounded blog slugs", () => {
  assert.equal(slugifyBlogTitle("Terpenes & Aroma: A Practical Guide"), "terpenes-and-aroma-a-practical-guide");
});
