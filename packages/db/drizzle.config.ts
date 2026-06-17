import { defineConfig } from "drizzle-kit";

const POSTGRES_URL = process.env.POSTGRES_URL!;

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
