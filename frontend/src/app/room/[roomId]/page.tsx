"use client";

import { useState, useEffect } from "react";
import { hc, InferResponseType } from "hono/client";
import { AppType } from "@backend/index";
import { useParams } from "next/navigation";
import type { GameRoom } from "@backend/index";

const client = hc<AppType>("http://localhost:8787/");

type ResponseType200 = InferResponseType<(typeof client)["get-room"][":id"]["$get"], 200>;

export default function Room() {
  const { roomId } = useParams();
  const [room, setRoom] = useState<GameRoom | null>(null);

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
    </div>
  );
}
