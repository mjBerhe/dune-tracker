import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

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
      origin: ["http://localhost:3000", "https://arrakis-observer.vercel.app"],
      credentials: true,
    })
  )
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .post(
    "/create-game",
    zValidator(
      "json",
      z.object({
        hostName: z.string().min(1), // ensures non-empty string
        hostId: z.string().min(5),
        maxPlayers: z.coerce.number(),
      })
    ),
    async (c) => {
      const data = c.req.valid("json");
      const { hostName, hostId, maxPlayers } = data;

      const gameId = generateRoomId();

      const newGame: GameRoom = {
        id: gameId,
        name: hostName,
        maxPlayers: maxPlayers,
        players: [{ id: hostId, name: hostName, money: 1000 }],
        started: false,
      };

      rooms.set(gameId, newGame);

      return c.json({ success: true, game: newGame }, 200);
    }
  );

export default app;
export type AppType = typeof app;
