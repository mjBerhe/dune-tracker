import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const createGameSchema = z.object({
  host: z.string().min(1), // ensures non-empty stringf
  maxPlayers: z.coerce.number(),
});

type GameRoom = {
  id: string;
  name: string;
  maxPlayers: number;
  players: { id: string; name: string; money: number }[];
  started: boolean;
  // createdAt?
};

const rooms = new Map<string, GameRoom>();

// Generate simple room ID
function generateRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

const app = new Hono()
  .use(
    "*",
    cors({
      origin: ["http://localhost:3000", "https://arrakis-observer.vercel.app"], // Allow your local Next.js frontend
      credentials: true,
    })
  )
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .post("/create-game", zValidator("json", createGameSchema), async (c) => {
    const data = c.req.valid("json");
    const { host, maxPlayers } = data;

    const id = generateRoomId();

    const newGame: GameRoom = {
      id,
      name: host,
      maxPlayers: maxPlayers,
      players: [{ id: "0", name: host, money: 0 }],
      started: false,
    };

    rooms.set(id, newGame);

    return c.json({ success: true, game: newGame }, 200);
  });

export type AppType = typeof app;
export default app;
