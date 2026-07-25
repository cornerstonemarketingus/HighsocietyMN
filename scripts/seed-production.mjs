import "dotenv/config";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not configured");
const client = new pg.Client({ connectionString });
await client.connect();

const categories = [
  ["Flower", "flower", "Premium flower and pre-rolls"],
  ["Edibles", "edibles", "Gummies and infused treats"],
  ["Vapes", "vapes", "Cartridges and disposable vapes"],
  ["Concentrates", "concentrates", "Hash, resin, and extracts"],
  ["Beverages", "beverages", "THC-infused drinks"],
  ["Accessories", "accessories", "Cannabis accessories"],
];
for (let index = 0; index < categories.length; index += 1) {
  const [name, slug, description] = categories[index];
  await client.query(
    `INSERT INTO "categories" ("id","name","slug","description","sortOrder","updatedAt")
     VALUES ($1,$2,$3,$4,$5,NOW())
     ON CONFLICT ("slug") DO UPDATE SET "name"=EXCLUDED."name","description"=EXCLUDED."description","updatedAt"=NOW()`,
    [crypto.randomUUID(), name, slug, description, index + 1],
  );
}
const categoryRows = await client.query(`SELECT "id","slug" FROM "categories"`);
const categoryIds = Object.fromEntries(categoryRows.rows.map((row) => [row.slug, row.id]));

const products = [
  ["Premium Hash Bar — 2 Grams", "premium-hash-bar-2g", "concentrates", 20, null, "High Society MN"],
  ["Pink Runtz", "pink-runtz", "flower", 155, null, "High Society MN"],
  ["Pave", "pave", "flower", 155, null, "High Society MN"],
  ["Strain Specific Smalls", "strain-specific-smalls", "flower", 110, 155, "High Society MN"],
  ["Mitten Extracts Gummies", "mitten-extracts-gummies", "edibles", 10, null, "Mitten Extracts"],
  ["Midwest Extracts Edibles", "midwest-extracts-edibles", "edibles", 10, null, "Midwest Extracts"],
  ["Juice Box Edibles", "juice-box-edibles", "edibles", 10, null, "Juice Box"],
  ["Sweetcarts — Summer Edition", "sweetcarts-summer-edition", "vapes", 20, null, "Sweetcarts"],
  ["MOB", "mob", "flower", 155, null, "High Society MN"],
  ["Infuzed by Society — 5 Pack Infused Joints", "infuzed-by-society-five-pack", "flower", 45, null, "Infuzed by Society"],
  ["A Couple Random Joints", "couple-random-joints", "flower", 15, null, "High Society MN"],
  ["Infuzed by Society — Single Infused Blunt", "infuzed-by-society-single-blunt", "flower", 25, null, "Infuzed by Society"],
  ["THC Drinks — Oliphant Brewing", "thc-drinks-oliphant-brewing", "beverages", 20, null, "Oliphant Brewing"],
  ["Stiiizy — 1 oz Live Resin Sugar", "stiiizy-live-resin-sugar-1oz", "concentrates", 125, null, "Stiiizy"],
  ["Applez N Bananaz", "applez-n-bananaz", "flower", 155, null, "High Society MN"],
  ["Biscotti", "biscotti", "flower", 155, null, "High Society MN"],
];
for (const [name, slug, category, price, comparePrice, brand] of products) {
  await client.query(
    `INSERT INTO "products" ("id","name","slug","description","categoryId","brand","price","comparePrice","images","effects","flavors","terpenes","inStock","stockQuantity","featured","published","updatedAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,ARRAY[]::TEXT[],ARRAY[]::TEXT[],ARRAY[]::TEXT[],ARRAY[]::TEXT[],true,25,true,true,NOW())
     ON CONFLICT ("slug") DO UPDATE SET "name"=EXCLUDED."name","categoryId"=EXCLUDED."categoryId","brand"=EXCLUDED."brand","price"=EXCLUDED."price","comparePrice"=EXCLUDED."comparePrice","inStock"=true,"published"=true,"updatedAt"=NOW()`,
    [crypto.randomUUID(), name, slug, `Current product imported from highsocietymn.com.`, categoryIds[category], brand, price, comparePrice],
  );
}

const adminEmail = "admin@highsocietymn.com";
const adminId = crypto.randomUUID();
const randomPassword = await bcrypt.hash(crypto.randomUUID(), 12);
await client.query(
  `INSERT INTO "users" ("id","name","email","password","role","updatedAt")
   VALUES ($1,'High Society Editorial',$2,$3,'ADMIN',NOW())
   ON CONFLICT ("email") DO NOTHING`,
  [adminId, adminEmail, randomPassword],
);
const admin = await client.query(`SELECT "id" FROM "users" WHERE "email"=$1`, [adminEmail]);
const authorId = admin.rows[0].id;

const forumCategories = [
  ["General Lounge", "general", "Relax, connect, and talk with the community."],
  ["Strain Reviews", "strain-reviews", "Member reviews and product experiences."],
  ["Tips & Education", "tips-tricks", "Responsible-use guidance and cannabis education."],
  ["Drops & Events", "events", "New vault drops, events, and announcements."],
  ["New Members", "new-members", "Introduce yourself to the lounge."],
];
for (let index = 0; index < forumCategories.length; index += 1) {
  const [name, slug, description] = forumCategories[index];
  await client.query(
    `INSERT INTO "forum_categories" ("id","name","slug","description","sortOrder","updatedAt")
     VALUES ($1,$2,$3,$4,$5,NOW())
     ON CONFLICT ("slug") DO UPDATE SET "name"=EXCLUDED."name","description"=EXCLUDED."description","updatedAt"=NOW()`,
    [crypto.randomUUID(), name, slug, description, index + 1],
  );
}

const generalCategory = await client.query(`SELECT "id" FROM "forum_categories" WHERE "slug"='general'`);
const welcomeThreadId = crypto.randomUUID();
await client.query(
  `INSERT INTO "forum_threads" ("id","title","slug","categoryId","authorId","pinned","updatedAt")
   VALUES ($1,'Welcome to the Member Lounge','welcome-to-the-member-lounge',$2,$3,true,NOW())
   ON CONFLICT ("slug") DO NOTHING`,
  [welcomeThreadId, generalCategory.rows[0].id, authorId],
);
const welcomeThread = await client.query(`SELECT "id" FROM "forum_threads" WHERE "slug"='welcome-to-the-member-lounge'`);
const existingWelcomePost = await client.query(`SELECT "id" FROM "forum_posts" WHERE "threadId"=$1 LIMIT 1`, [welcomeThread.rows[0].id]);
if (existingWelcomePost.rowCount === 0) {
  await client.query(
    `INSERT INTO "forum_posts" ("id","threadId","authorId","content","updatedAt")
     VALUES ($1,$2,$3,$4,NOW())`,
    [crypto.randomUUID(), welcomeThread.rows[0].id, authorId, "Welcome to the High Society Member Lounge. Introduce yourself, share responsible-use tips, review recent drops, and help us build a thoughtful Minnesota cannabis community for adults 21+."],
  );
}

await client.query(
  `INSERT INTO "blog_posts" ("id","title","slug","excerpt","content","authorId","published","publishedAt","updatedAt")
   VALUES ($1,$2,$3,$4,$5,$6,true,NOW(),NOW())
   ON CONFLICT ("slug") DO NOTHING`,
  [
    crypto.randomUUID(),
    "Welcome to the New High Society MN",
    "welcome-to-high-society-mn",
    "Meet Minnesota’s redesigned private cannabis marketplace, member lounge, rewards, and scheduled fulfillment experience.",
    `High Society MN has been rebuilt around a simple idea: shopping should feel private, informed, and effortless.

Our live menu brings the current High Society selection into one clean marketplace. Members can save products, schedule pickup or delivery, follow order progress, and earn rewards through referrals and games.

The Member Lounge is a place for adults 21+ to exchange responsible-use tips, review products, and learn from one another. Bud Seeker will add private AI-assisted product discovery once our dedicated model service is online.

Fresh vault drops arrive Tuesday, Thursday, and Saturday at 10am. Join the private email list to unlock the welcome wheel and receive drop alerts.

Cannabis is for adults 21+ only. Start low, go slow, and consume responsibly.`,
    authorId,
  ],
);

await client.end();
console.log(`Seeded ${products.length} live products, ${forumCategories.length} lounge categories, and the first journal post.`);
