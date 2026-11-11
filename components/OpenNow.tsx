"use client";
import { useEffect, useState } from "react";

// Haifa hours: Sunday to Wednesday 08:00 to midnight, Thursday to Saturday 08:00 to 01:00.
function isOpen(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jerusalem", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const mins = Number(get("hour")) * 60 + Number(get("minute"));
  if (mins >= 8 * 60) return true;
  // Between 00:00 and 01:00 we are still open if the previous day was Thursday, Friday or Saturday.
  const prev = (day + 6) % 7;
  return mins < 60 && prev >= 4;
}

export default function OpenNow({ open, closed }: { open: string; closed: string }) {
  const [state, setState] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setState(isOpen(new Date()));
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);
  if (state === null) return null;
  return <span className={`open-now ${state ? "yes" : "no"}`}>{state ? open : closed}</span>;
}
