"use client";

// Clock.tsx — client component (needs browser APIs for time)
// CSS Modules give each class a unique hashed name at build time,
// so .time here will never clash with any other .time in the project.
import { useEffect, useState } from "react";
import styles from "./Clock.module.css";

export default function Clock() {
  // Start as null so server HTML matches client HTML (avoids hydration mismatch)
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date()); // set immediately — don't wait 1s for the first tick
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={styles.wrapper}>
      <time className={styles.time} dateTime={time?.toISOString()}>
        {time != null ? `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}` : "--:--:--"}
      </time>

      <p className={styles.date}>
        {time?.toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
