import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { container } from "@/ioc";
import { schema } from "db/postgres";
import { ArchiveRestore, CalendarIcon, Save } from "lucide-react";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const setAccessCookie = async (accessToken: string) => {
  const cookie = await cookies();

  cookie.set("accessToken", accessToken);
  revalidatePath("/");
};

const saveAction = async (formData: FormData) => {
  "use server";

  const accessToken = formData.get("accessToken");

  if (typeof accessToken !== "string") {
    return;
  }

  await postgres.insert(schema.credentials).values({ accessToken });
  setAccessCookie(accessToken);
};

const postgres = container.cradle.pgsql.client;

export default async function Page() {
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value || "";
  const result = await postgres.query.credentials.findFirst({
    where: { accessToken },
    with: { overtimes: true },
  });

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardContent>
          <form action={saveAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
                <ButtonGroup>
                  <Input
                    name="accessToken"
                    type="text"
                    placeholder="Type to search..."
                  />
                  <Button type="submit" variant="outline">
                    Save
                  </Button>
                </ButtonGroup>
              </Field>
              <Field>
                <Button type="button" variant={"link"}>
                  Auto generate
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Overtime Add</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel>Date</FieldLabel>
                <InputGroup>
                  <InputGroupInput />
                  <InputGroupAddon align="inline-end">
                    <Popover>
                      <PopoverTrigger asChild>
                        <InputGroupButton
                          id="date-picker"
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Select date"
                        >
                          <CalendarIcon />
                          <span className="sr-only">Select date</span>
                        </InputGroupButton>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar mode="single" />
                      </PopoverContent>
                    </Popover>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel>Duration</FieldLabel>
                <Input />
              </Field>
              <Field>
                <FieldLabel>Note</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    placeholder="I'm having an issue with the login button on mobile."
                    rows={6}
                    className="min-h-24 resize-none"
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      99/100 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-3">
            <Button className="uppercase">
              <Save />
              save
            </Button>
            <Button variant={"outline"} className="uppercase">
              <ArchiveRestore />
              reset
            </Button>
          </div>
        </CardFooter>
      </Card>
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
