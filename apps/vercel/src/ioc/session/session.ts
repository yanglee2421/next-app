import { schema } from "db/postgres";
import * as sql from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { PgClient } from "../pgsql/types";
import type { AppCradle } from "../types";

const atFirstOrThrow = <T>(
  array: T[],
  errorFactory: () => Error = () => new Error("Not found"),
): T => {
  if (array.length === 0) {
    throw errorFactory();
  }
  return array[0];
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const isClamped = (value: number, min: number, max: number) => {
  return Object.is(value, clamp(value, min, max));
};

const isExpired = (session: schema.Session) => {
  return new Date(session.expiresAt).getTime() < Date.now();
};

const isStale = (session: schema.Session, stableTime: number) => {
  const expireTime = new Date(session.expiresAt).getTime();
  const timeNow = Date.now();
  const restTime = expireTime - timeNow;

  return isClamped(restTime, 0, stableTime);
};

class NavigateService {
  static navigateToLogin(): never {
    throw redirect("/login");
  }
  static navigateToHome(): never {
    throw redirect("/");
  }
  static notFound(): never {
    throw notFound();
  }
}

export class Session {
  private db: PgClient;
  private cookieKey: string;
  // 7 days
  private expiresIn = 1000 * 60 * 60 * 24 * 7;
  // 1 day
  private stableIn = 1000 * 60 * 60 * 24;

  constructor({ pgsql, AUTH_COOKIE_NAME }: AppCradle) {
    this.db = pgsql.client;
    this.cookieKey = AUTH_COOKIE_NAME;
  }

  dbCreate(userId: number, expiresAt: Date) {
    return this.db
      .insert(schema.sessions)
      .values({ userId: userId, expiresAt })
      .returning();
  }
  dbDelete(sessionId: string) {
    return this.db
      .delete(schema.sessions)
      .where(sql.eq(schema.sessions.id, sessionId))
      .returning();
  }
  dbUpdate(sessionId: string, expiresAt: string) {
    return this.db
      .update(schema.sessions)
      .set({ expiresAt: new Date(expiresAt) })
      .where(sql.eq(schema.sessions.id, sessionId))
      .returning();
  }
  dbRead(sessionId: string) {
    return this.db
      .select()
      .from(schema.sessions)
      .where(sql.eq(schema.sessions.id, sessionId))
      .limit(1);
  }
  dbClearExpired() {
    return this.db
      .delete(schema.sessions)
      .where(sql.lt(schema.sessions.expiresAt, new Date()))
      .returning();
  }

  async cookieUpsert(sessionId: string, expires: Date) {
    const cookieStore = await cookies();

    cookieStore.set(this.cookieKey, sessionId, {
      sameSite: "strict",
      expires,
    });
  }
  async cookieDelete() {
    const cookieStore = await cookies();
    cookieStore.delete(this.cookieKey);
  }
  async cookieRead() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(this.cookieKey)?.value;

    if (!sessionId) {
      throw NavigateService.navigateToLogin();
    }

    return sessionId;
  }

  async open(userId: number) {
    const expiresAt = new Date(Date.now() + this.expiresIn);
    const sessions = await this.dbCreate(userId, expiresAt);
    const session = atFirstOrThrow(sessions);

    await this.cookieUpsert(session.id, expiresAt);
  }
  async close(isInRSC = false) {
    const sessionId = await this.cookieRead();

    await this.dbDelete(sessionId);

    // In RSC, we can not delete cookie
    if (isInRSC) return;

    await this.cookieDelete();
  }
  async update() {
    const expiresAt = new Date(Date.now() + this.expiresIn);
    const sessionId = await this.cookieRead();
    const result = await this.dbUpdate(sessionId, expiresAt.toISOString());

    await this.cookieUpsert(sessionId, expiresAt);

    return result;
  }
  async verify(isInRSC = false) {
    /*
     * Randomly clear expired sessions with a low probability
     * to avoid performance issues
     */
    if (Math.random() < 0.01) {
      await this.dbClearExpired();
    }

    const sessionId = await this.cookieRead();
    const sessions = await this.dbRead(sessionId);
    const session = atFirstOrThrow(sessions, NavigateService.navigateToLogin);

    const expired = isExpired(session);
    const stale = isStale(session, this.stableIn);

    if (expired) {
      await this.close(isInRSC);
      throw NavigateService.navigateToLogin();
    }

    if (!stale) {
      return session;
    }

    // In RSC, we can not update session, so just return the session info
    if (isInRSC) return session;

    const newSessions = await this.update();
    const newSession = atFirstOrThrow(
      newSessions,
      NavigateService.navigateToLogin,
    );

    return newSession;
  }
}
