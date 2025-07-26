import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://arrakis-observer.vercel.app/"], // Allow your local Next.js frontend
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
