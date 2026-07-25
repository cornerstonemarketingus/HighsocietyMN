import "dotenv/config";
import fs from "node:fs";
import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not configured");

const sql = fs.readFileSync(process.argv[2], "utf8");
const client = new pg.Client({ connectionString });
await client.connect();
await client.query(sql);
await client.end();
console.log("Database schema applied.");
