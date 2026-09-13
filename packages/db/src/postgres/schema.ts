import { date, integer, pgSchema, pgTable, text } from "drizzle-orm/pg-core";

export const app = pgSchema("app");

export const kvTable = app.table("kv", {
  key: text("key").primaryKey(),
  value: text("value"),
});

export const credentials = pgTable("credentials", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  accessToken: text("accessToken").notNull().unique(),
  displayName: text("displayName"),

  createAt: date("createAt", { mode: "date" }).defaultNow(),
  updateAt: date("updateAt", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const overtimes = pgTable("overtimes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  date: date("date", { mode: "date" }).notNull(),
  note: text(),

  createAt: date("createAt", { mode: "date" }).defaultNow(),
  updateAt: date("updateAt", { mode: "date" })
    .defaultNow()
    .$onUpdateFn(() => new Date()),

  credentialId: integer("credentialId")
    .notNull()
    .references(() => credentials.id),
});
