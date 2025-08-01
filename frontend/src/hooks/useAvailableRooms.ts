import { useEffect, useState } from "react";
import type { AppType, GameRoom } from "@backend/index";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:8787/");

export function useAvailableRooms() {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await client.rooms.$get();
      const data = await res.json();

      if (data.success && data.rooms?.length > 0) {
        setRooms(data.rooms);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    // Optional: auto-refresh every 5 seconds
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  return { rooms, loading };
}
