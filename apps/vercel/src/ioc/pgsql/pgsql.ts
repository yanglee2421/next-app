import { relations, schema } from "db/postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { AppCradle } from "../types";
import type { PgClient } from "./types";

export class PgSQL {
  readonly client: PgClient;

  constructor({ pgsql_url }: AppCradle) {
    const pgsql = postgres(pgsql_url, { prepare: false });
    this.client = drizzle({ client: pgsql, schema, relations });
  }

  dispose() {
    this.client.$client.end();
  }
}
