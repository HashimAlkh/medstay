"use client";

import { useEffect, useState } from "react";

export default function ResendButton() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  return (
    <button
      type="submit"
      disabled={seconds > 0}
      onClick={() => setSeconds(60)}
      className="w-full rounded-xl bg-teal-600 text-white py-2.5 text-sm font-medium hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {seconds > 0
        ? `Erneut senden in ${seconds}s`
        : "Bestätigungs-Mail erneut senden"}
    </button>
  );
}