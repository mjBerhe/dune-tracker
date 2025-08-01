"use client";

import type { AppType } from "@backend/index";
import { hc, InferResponseType } from "hono/client";
import { useRouter } from "next/navigation";
import { getOrCreatePlayer } from "../utils/player";
import { useAvailableRooms } from "../hooks/useAvailableRooms";

const client = hc<AppType>("http://localhost:8787/");

type JoinRoomResponseType200 = InferResponseType<
  (typeof client)["join-game"]["$post"],
  200
>;

export default function Home() {
  const router = useRouter();
  const player = getOrCreatePlayer();

  const { rooms, loading } = useAvailableRooms();

  const handleCreateGame = async () => {
    try {
      const res = await client["create-game"].$post({
        json: {
          hostName: player?.name ?? "Default Name",
          hostId: player?.id ?? "12345",
          maxPlayers: 4,
        },
      });
      const data = await res.json();

      if (data.success && data.game.id) {
        router.push(`/room/${data.game.id}`);
      }
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  const handleJoinGame = async (roomId: string) => {
    try {
      const res = await client["join-game"].$post({
        json: {
          playerId: player?.id ?? "",
          playerName: player?.name ?? "",
          roomId: roomId,
        },
      });

      if (res.ok) {
        const data: JoinRoomResponseType200 = await res.json();

        if (data.success && data.game.id) {
          router.push(`/room/${data.game.id}`);
        }
      }
    } catch (err) {
      console.error("Failed to join room", err);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">TESTING</h1>
      <div className="mt-4 space-x-4">
        <button onClick={handleCreateGame}>Create Game</button>
      </div>

      <div className="mt-4">
        {rooms.length === 0 && <p>No Available Rooms</p>}
        {rooms.length > 0 &&
          rooms.map((room) => (
            <div key={room.id}>
              <div className="flex gap-x-2">
                <p>Room: {room.id}</p>
                <p>
                  ({room.players.length}/{room.maxPlayers})
                </p>
              </div>

              <button onClick={() => handleJoinGame(room.id)}>Join Game</button>
            </div>
          ))}
      </div>
    </main>
  );
}
