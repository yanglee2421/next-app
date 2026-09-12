import { container } from "@/ioc";

export default async function Page() {
  const postgres = container.cradle.pgsql.client;
  const organizations = await postgres.query.users.findMany({
    with: {
      organizations: true,
    },
  });

  return <></>;
}
