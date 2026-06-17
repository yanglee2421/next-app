import bcrypt from "bcrypt";
import { schema } from "db/postgres";
import { eq } from "drizzle-orm";
import type { PgClient } from "../pgsql/types";
import type { Session } from "../session";
import type { AppCradle } from "../types";
import type { SignInInput, SignUpInput } from "./types";

class Hash {
  #rounds: number;

  constructor(rounds: number) {
    this.#rounds = rounds;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.#rounds);
    const result = await bcrypt.hash(password, salt);
    return result;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    return result;
  }
}

export class Auth {
  private pgsql: PgClient;
  private hash: Hash;
  private session: Session;

  constructor({ pgsql, session }: AppCradle) {
    this.pgsql = pgsql.client;
    this.hash = new Hash(10);
    this.session = session;
  }

  dispose() {}

  async signUp(params: SignUpInput) {
    const result = this.pgsql.transaction(async (tx) => {
      const hashedPassword = await this.hash.hashPassword(params.password);

      const [userRoleGroup] = await tx
        .insert(schema.roleGroups)
        .values({ name: "user" })
        .returning();

      if (!userRoleGroup) {
        throw new Error("Failed to create user role group");
      }

      const [user] = await tx
        .insert(schema.users)
        .values({
          email: params.email,
          password: hashedPassword,
          roleGroupId: userRoleGroup.id,
        })
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          name: schema.users.name,
        });

      if (!user) {
        throw new Error("Failed to create user");
      }

      const session = await this.session.open(user.id);

      return { user, session };
    });

    return result;
  }
  async signIn(params: SignInInput) {
    const [user] = await this.pgsql
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, params.email))
      .limit(1);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.password) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = this.hash.comparePassword(
      params.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return user;
  }
  signOut() {}
}
