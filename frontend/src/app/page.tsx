"use client";

import { AppType } from "../../../hono-backend/src/";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:8787/");

export default function Home() {
  const handleClick = async () => {
    const res = await client["create-game"].$post({
      json: {
        host: "Matt",
        maxPlayers: 4,
      },
    });

    const data = await res.json();
    console.log(data);
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
