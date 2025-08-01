"use client";

import { useState, useEffect, useRef } from "react";
import { hc, InferResponseType } from "hono/client";
import { AppType } from "@backend/index";
import { useParams } from "next/navigation";
import type { GameRoom } from "@backend/index";

const client = hc<AppType>("http://localhost:8787/");

// const wsClient = hc<WsAppType>("http://localhost:8787/");

type ResponseType200 = InferResponseType<(typeof client)["get-room"][":id"]["$get"], 200>;

export default function Room() {
  const { roomId } = useParams();
  const [room, setRoom] = useState<GameRoom | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await client["get-room"][":id"].$get({
          param: {
            id: roomId as string,
          },
        });

        if (res.ok) {
          const data: ResponseType200 = await res.json();
          setRoom(data.room);
        }
      } catch (err) {}
    };

    fetchRoom();
  }, []);

  // intializing web socket
  useEffect(() => {
    const ws = client.ws[":roomId"].$ws({ param: { roomId: roomId as string } });
    wsRef.current = ws;

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Received:", data);
    };

    ws.onopen = () => {
      console.log("WebSocket connected!");
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  const handleAddSolari = () => {
    wsRef.current?.send(JSON.stringify({ type: "add-solari", amount: 1 }));
  };

  if (!room) {
    return <div>Loading room...</div>;
  }
  return (
    <div>
      <p>Room Name: {roomId}</p>

      <div className="flex gap-x-2">
        <p>Players:</p>
        <div className="flex flex-col">
          {room.players.map((x) => (
            <p key={x.id}>{x.name}</p>
          ))}
        </div>
      </div>

      <button onClick={handleAddSolari}>Add Solari</button>
    </div>
  );
}
