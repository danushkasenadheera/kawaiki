"use client";

import { useEffect, useState } from "react";
import { fmt } from "@/lib/i18n/dict/en";
import { useDict } from "./i18n-provider";

/** "It's 14:32 in Sri Lanka", ticking every 30s. Rendered only in the browser, so it's always the visitor's real "now". */
export function LocalTime({ className = "" }: { className?: string }) {
  const t = useDict();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return <span className={className} aria-hidden="true" />;
  return (
    <span className={className}>
      <span className="mr-2 inline-block size-2 animate-pulse rounded-full bg-[#25d366] align-middle" aria-hidden="true" />
      {fmt(t.localTime, { time })}
    </span>
  );
}
