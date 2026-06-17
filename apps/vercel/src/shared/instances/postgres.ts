import { relations, schema } from "db/postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import postgresJS from "postgres";

const client = postgresJS(process.env.POSTGRES_URL!, { prepare: false });
export const postgres = drizzle({ client, schema, relations });
