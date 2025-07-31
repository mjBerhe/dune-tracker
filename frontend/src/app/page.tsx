"use client";

import type { AppType } from "@backend/index";
import { hc } from "hono/client";
import { useRouter } from "next/navigation";
import { getOrCreatePlayer } from "../utils/player";

const client = hc<AppType>("http://localhost:8787/");

export default function Home() {
  const router = useRouter();
  const player = getOrCreatePlayer();

  const handleClick = async () => {
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
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">TESTING</h1>
      <div className="mt-4 space-x-4">
        <button onClick={handleClick}>Create Game</button>
        {/* <Link href="/lobby" className="underline text-blue-500">
          Join Lobby
        </Link>
        <Link href="/game/test-room" className="underline text-blue-500">
          Enter Room
        </Link> */}
      </div>
    </main>
  );
}
