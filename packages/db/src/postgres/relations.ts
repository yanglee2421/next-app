import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => {
  return {
    users: {
      sessions: r.many.sessions({
        from: r.users.id,
        to: r.sessions.userId,
      }),
      organizations: r.many.organizations({
        from: r.users.id.through(r.userOrganizations.userId),
        to: r.organizations.id.through(r.userOrganizations.organizationId),
      }),
      roleGroup: r.one.roleGroups({
        from: r.users.roleGroupId,
        to: r.roleGroups.id,
      }),
      overtimes: r.many.overtimes({
        from: r.users.id,
        to: r.overtimes.userId,
      }),
    },
    sessions: {
      user: r.one.users({
        from: r.sessions.userId,
        to: r.users.id,
      }),
    },

    //
    organizations: {
      users: r.many.users({
        from: r.organizations.id.through(r.userOrganizations.organizationId),
        to: r.users.id.through(r.userOrganizations.userId),
      }),
      roleGroup: r.one.roleGroups({
        from: r.organizations.roleGroupId,
        to: r.roleGroups.id,
      }),
    },

    //
    roleGroups: {
      roles: r.many.roles({
        from: r.roleGroups.id,
        to: r.roles.groupId,
      }),
    },
    roles: {
      permissions: r.many.permissions({
        from: r.roles.id.through(r.rolePermissions.roleId),
        to: r.permissions.id.through(r.rolePermissions.permissionId),
      }),
      group: r.one.roleGroups({
        from: r.roles.groupId,
        to: r.roleGroups.id,
      }),
    },
    permissions: {
      roles: r.many.roles({
        from: r.permissions.id.through(r.rolePermissions.permissionId),
        to: r.roles.id.through(r.rolePermissions.roleId),
      }),
    },

    overtimes: {
      user: r.one.users({
        from: r.overtimes.userId,
        to: r.users.id,
      }),
    },
  };
});
