import { Hono } from "hono";
import { upgradeWebSocket } from "hono/cloudflare-workers";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const socketsByRoom = new Map<string, Set<WebSocket>>();

export const wsRoute = new Hono().get(
  "/:roomId",
  zValidator("param", z.object({ roomId: z.string() })),
  upgradeWebSocket((c) => {
    const { roomId } = c.req.param();
    console.log("are we getting here");
    // const socket = c.env?.upgradeWebSocket(c);

    // if (!socket) {
    //   throw new Error("WebSocket upgrade failed");
    // }

    let roomSockets = socketsByRoom.get(roomId);
    if (!roomSockets) {
      roomSockets = new Set();
      socketsByRoom.set(roomId, roomSockets);
    }
    // roomSockets.add(socket);

    return {
      onMessage(evt, ws) {
        const data = JSON.parse(evt.data);
        console.log(data);

        if (data.type === "add-solari") {
          // add solari to user
        }
      },

      onClose() {
        console.log(`Connection closed for room ${roomId}`);
      },
    };
  })
);
