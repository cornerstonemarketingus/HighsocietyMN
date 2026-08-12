import "dotenv/config";
import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not configured");
const client = new pg.Client({ connectionString });
await client.connect();

const OLD_SENTENCE =
  "Bud Seeker will add private AI-assisted product discovery once our dedicated model service is online.";
const NEW_SENTENCE =
  "Your private budtender is available anytime for AI-assisted product discovery.";

// 1) Known fix: the seeded welcome blog post shipped with the old Bud Seeker copy baked in.
const welcomePost = await client.query(
  `SELECT "id", "content" FROM "blog_posts" WHERE "slug" = 'welcome-to-high-society-mn'`,
);
if (welcomePost.rowCount > 0) {
  const row = welcomePost.rows[0];
  if (row.content.includes(OLD_SENTENCE)) {
    await client.query(`UPDATE "blog_posts" SET "content" = $1, "updatedAt" = NOW() WHERE "id" = $2`, [
      row.content.replace(OLD_SENTENCE, NEW_SENTENCE),
      row.id,
    ]);
    console.log(`✓ Fixed welcome-to-high-society-mn blog post (id ${row.id})`);
  } else {
    console.log("• welcome-to-high-society-mn already clean, skipped");
  }
} else {
  console.log("• welcome-to-high-society-mn post not found, skipped");
}

// 2) Sweep for any other "Bud Seeker" mentions across content tables and just report them —
//    these get flagged for manual review rather than auto-rewritten, since we don't know
//    the surrounding sentence structure and a blind replace could read awkwardly.
const sweeps = [
  { table: "blog_posts", columns: ["title", "excerpt", "content"] },
  { table: "forum_threads", columns: ["title"] },
  { table: "forum_posts", columns: ["content"] },
];

let flagged = 0;
for (const { table, columns } of sweeps) {
  const whereClause = columns.map((col) => `"${col}" ILIKE '%bud seeker%' OR "${col}" ILIKE '%budseeker%'`).join(" OR ");
  const result = await client.query(`SELECT "id", ${columns.map((c) => `"${c}"`).join(", ")} FROM "${table}" WHERE ${whereClause}`);
  for (const row of result.rows) {
    flagged += 1;
    console.log(`⚠ Remaining "Bud Seeker" mention in ${table} (id ${row.id}) — review and edit manually.`);
  }
}

if (flagged === 0) {
  console.log("✓ No other Bud Seeker mentions found in blog/forum content.");
}

await client.end();
