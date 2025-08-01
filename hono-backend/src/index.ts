import { Hono } from "hono";
import { cors } from "hono/cors";
import { success, z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { wsRoute } from "./routes/ws";

const STARTING_SOLARI = 0;
const STARTING_WATER = 1;
const STARTING_SPICE = 0;

export type GameRoom = {
  id: string;
  name: string;
  maxPlayers: number;
  players: { id: string; name: string; solari: number; water: number; spice: number }[];
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
        players: [
          {
            id: hostId,
            name: hostName,
            solari: STARTING_SOLARI,
            water: STARTING_WATER,
            spice: STARTING_SPICE,
          },
        ],
        started: false,
      };

      rooms.set(gameId, newGame);

      return c.json({ success: true, game: newGame }, 200);
    }
  )
  .post(
    "/join-game",
    zValidator(
      "json",
      z.object({
        playerId: z.string().min(5),
        playerName: z.string().min(1),
        roomId: z.string().min(1),
      })
    ),
    async (c) => {
      const data = c.req.valid("json");
      const { playerId, playerName, roomId } = data;

      const room = rooms.get(roomId);
      if (!room) {
        return c.json({ error: "Room does not exist" }, 404);
      }

      const exisitingPlayer = room.players.find((p) => p.id === playerId);
      if (!exisitingPlayer) {
        if (room.players.length >= room.maxPlayers) {
          return c.json({ error: "Room is full" }, 400);
        }

        // else there is space for the player to join
        room.players.push({
          id: playerId,
          name: playerName,
          solari: STARTING_SOLARI,
          water: STARTING_WATER,
          spice: STARTING_SPICE,
        });
      } else {
        // player is already in the room
        return c.json({ error: "Already inside room" }, 400);
      }

      return c.json({ success: true, game: room }, 200);
    }
  )
  .get("/rooms", (c) => {
    const availableRooms = Array.from(rooms.values()).filter(
      (room) => room.players.length < room.maxPlayers
    );
    return c.json({ success: true, rooms: availableRooms });
  })
  .get("/get-room/:id", zValidator("param", z.object({ id: z.string() })), (c) => {
    const { id } = c.req.param();
    const room = rooms.get(id);

    if (!room) {
      return c.json({ error: "Room not found" }, 404);
    }

    return c.json({ success: true, room: room }, 200);
  })
  .route("/ws", wsRoute);

// const wsApp = wsRoute;

export default app;
export type AppType = typeof app;
// export type WsAppType = typeof wsApp;
