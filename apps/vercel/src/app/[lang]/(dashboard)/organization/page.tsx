import { Card } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { container } from "@/ioc";
import { schema } from "db/postgres";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Add } from "./add";
import { Credentials } from "./credentials";

const postgres = container.cradle.pgsql.client;
const setAccessCookie = async (accessToken: string) => {
  const cookie = await cookies();

  cookie.set("accessToken", accessToken);
  revalidatePath("/");
};

const saveAction = async (accessToken: string) => {
  "use server";

  await postgres
    .insert(schema.credentials)
    .values({ accessToken })
    .onConflictDoNothing({ target: schema.credentials.accessToken });
  await setAccessCookie(accessToken);
};

interface AddActionInput {
  date: string;
  duration: number;
  note: string;
}

const addAction = async (value: AddActionInput) => {
  "use server";

  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value || "";

  if (!accessToken) {
    throw new Error("Access Token is required!");
  }

  const [credential] = await postgres
    .select()
    .from(schema.credentials)
    .where(eq(schema.credentials.accessToken, accessToken));

  if (!credential) {
    throw new Error("Invalid access token");
  }

  await postgres.insert(schema.overtimes).values({
    date: new Date(value.date),
    duration: value.duration,
    note: value.note,
    credentialId: credential.id,
  });

  revalidatePath("/");
};

export default async function Page() {
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value || "";
  const result = await postgres.query.credentials.findFirst({
    where: { accessToken },
    with: { overtimes: true },
  });

  return (
    <div className="space-y-6 p-6">
      <Credentials saveAction={saveAction} />
      <Add action={addAction} />
      <Card>
        <Table>
          <TableHeader></TableHeader>
          <TableBody>
            {result?.overtimes.map((row) => {
              return <TableRow key={row.id}></TableRow>;
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
