import { asClass, asValue, createContainer } from "awilix";
import { Auth } from "./auth";
import { PgSQL } from "./pgsql";
import { Session } from "./session";
import type { AppCradle } from "./types";

export const container = createContainer<AppCradle>({
  injectionMode: "PROXY",
  strict: true,
});

container.register({
  pgsql_url: asValue(process.env.POSTGRES_URL || ""),
  AUTH_COOKIE_NAME: asValue("auth_token"),

  auth: asClass(Auth)
    .singleton()
    .disposer((auth) => auth.dispose()),
  pgsql: asClass(PgSQL)
    .singleton()
    .disposer((pgsql) => pgsql.dispose()),
  session: asClass(Session).singleton(),
});
