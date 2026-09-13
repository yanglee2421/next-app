import { defineConfig } from "drizzle-kit";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, "../../apps/vercel/.env");
const fileContent = fs.readFileSync(filePath, "utf-8");
const lines = fileContent.split("\n");
const reg = /^POSTGRES_URL=(?<value>.+)/;
const POSTGRES_URLLine = lines.find((line) => reg.test(line)) || "";
const POSTGRES_URL = reg.exec(POSTGRES_URLLine)?.groups?.value || "";
console.log(POSTGRES_URL);

export default defineConfig({
  schema: "./src/postgres/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: POSTGRES_URL,
  },
  tablesFilter: [],
  schemaFilter: ["public", "app"],
});
