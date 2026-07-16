import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("package.json defines baseline quality scripts", () => {
  const pkgPath = path.join(process.cwd(), "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  assert.equal(typeof pkg.scripts?.lint, "string");
  assert.equal(typeof pkg.scripts?.typecheck, "string");
  assert.equal(typeof pkg.scripts?.test, "string");
  assert.equal(typeof pkg.scripts?.verify, "string");
});

test("source and prisma directories exist", () => {
  assert.equal(fs.existsSync(path.join(process.cwd(), "src")), true);
  assert.equal(fs.existsSync(path.join(process.cwd(), "prisma")), true);
});
