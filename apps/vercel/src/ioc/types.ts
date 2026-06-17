import type { Auth } from "./auth";
import type { PgSQL } from "./pgsql";
import type { Session } from "./session";

export interface AppCradle {
  pgsql_url: string;
  AUTH_COOKIE_NAME: string;

  auth: Auth;
  pgsql: PgSQL;
  session: Session;
}
