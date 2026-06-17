import {
  integer,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const app = pgSchema("app");

export const kvTable = app.table("kv", {
  key: text("key").primaryKey(),
  value: text("value"),
});

export type KV = typeof kvTable.$inferSelect;

export const roleGroups = app.table("role_groups", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
});

export type RoleGroup = typeof roleGroups.$inferSelect;

export const permissions = app.table("permissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  label: text("label"),
});

export type Permission = typeof permissions.$inferSelect;

export const users = app.table("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").unique(),
  password: text("password"),
  name: text("name"),

  roleGroupId: integer("role_group_id")
    .notNull()
    .references(() => roleGroups.id),
});

export type User = typeof users.$inferSelect;

export const sessions = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
  token: text("token"),

  userId: integer("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type Session = typeof sessions.$inferSelect;

export const organizations = app.table("organizations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),

  roleGroupId: integer("role_group_id")
    .notNull()
    .references(() => roleGroups.id),
});

export type Organization = typeof organizations.$inferSelect;

export const roles = app.table("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),

  groupId: integer("group_id")
    .notNull()
    .references(() => roleGroups.id),
});

export type Role = typeof roles.$inferSelect;

export const overtimes = pgTable("xx", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  hours: integer("hours").notNull().default(8),
  reason: text("reason"),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export type Overtime = typeof overtimes.$inferSelect;

// Many to many map tables

export const userOrganizations = app.table(
  "user_organizations",
  {
    userId: integer("user_id").references(() => users.id),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id),
    role: text("role").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.organizationId],
      name: "user_organizations_pkey",
    }),
  ],
);

export const rolePermissions = app.table(
  "role_permissions",
  {
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id),
    permissionId: integer("permission_id")
      .notNull()
      .references(() => permissions.id),
  },
  (table) => [
    primaryKey({
      columns: [table.roleId, table.permissionId],
      name: "role_permissions_pkey",
    }),
  ],
);
