import type { relations, schema } from "db/postgres";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Sql } from "postgres";

export type PgClient = PostgresJsDatabase<typeof schema, typeof relations> & {
  $client: Sql;
};
