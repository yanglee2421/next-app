import { container } from "@/ioc";
import { schema } from "db/postgres";
import { createFactory } from "hono/factory";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";

interface Env {
  Variables: {};
  Bindings: {};
}

const factory = createFactory<Env>({
  initApp: () => {},
});

const helloHanldes = factory.createHandlers(async (c) => {
  const postgres = container.cradle.pgsql.client;
  const rows = await postgres.select().from(schema.users);

  return c.json({
    message: "Hello Next.js!",
    rows,
  });
});

const createRootApp = () => {
  const app = factory
    .createApp()
    .basePath("/api")
    .onError((error, c) => {
      console.error(error);

      return c.json({ message: error.message }, 500);
    })
    .notFound((c) => {
      return c.json({ message: "Not Found" }, 404);
    })
    .use(logger());

  return app;
};

const createMockApp = () => {
  const app = factory.createApp();

  app.get("/hello", ...helloHanldes);

  return app;
};

const createApp = () => {
  const app = createRootApp();
  const mock = createMockApp();

  app.route("/", mock);

  return app;
};

const app = createApp();

export const GET = handle(app);
export const POST = handle(app);
