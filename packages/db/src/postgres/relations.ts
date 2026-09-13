import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => {
  return {
    credentials: {
      overtimes: r.many.overtimes({
        from: r.credentials.id,
        to: r.overtimes.credentialId,
      }),
    },

    overtimes: {
      credential: r.one.credentials({
        from: r.overtimes.credentialId,
        to: r.credentials.id,
      }),
    },
  };
});
