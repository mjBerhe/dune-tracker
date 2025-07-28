import { Hono } from "hono";
import { cors } from "hono/cors";
import { success, z } from "zod";

const createGameSchema = z.object({
  host: z.string().min(1), // ensures non-empty stringf
  maxPlayers: z.number(),
});

type CreateGameInput = z.infer<typeof createGameSchema>;

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

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://arrakis-observer.vercel.app"], // Allow your local Next.js frontend
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/create-game", async (c) => {
  const body = await c.req.json();

  const parsed = createGameSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: parsed.error }, 400);
  }

  const { host, maxPlayers } = parsed.data;
  const id = generateRoomId();

  const newGame: GameRoom = {
    id,
    name: host,
    maxPlayers,
    players: [{ id: "0", name: host, money: 0 }],
    started: false,
  };

  rooms.set(id, newGame);

  return c.json({ success: true, game: newGame });
});

export default app;
