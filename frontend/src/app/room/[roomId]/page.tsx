"use client";

import { useParams } from "next/navigation";

export default function Room() {
  const { roomId } = useParams();

  return <div>{roomId}</div>;
}
