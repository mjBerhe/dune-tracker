import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Multiplayer Game</h1>
      <div className="mt-4 space-x-4">
        <Link href="/lobby" className="underline text-blue-500">
          Join Lobby
        </Link>
        <Link href="/game/test-room" className="underline text-blue-500">
          Enter Room
        </Link>
      </div>
    </main>
  );
}
