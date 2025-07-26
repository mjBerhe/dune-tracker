"use client";

import { useEffect, useState } from "react";

export default function Lobby() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/");
        const msg = await response.text();
        // console.log(response);
        setMessage(msg);
      } catch (err) {
        console.error(err);
      }
    };

    testAPI();
  }, []);

  return <main>{message}</main>;
}
