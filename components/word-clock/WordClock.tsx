"use client";

import { GRID } from "./grid";
import { useWordTime } from "@/hooks/useWordTime";
import styles from "./WordClock.module.css";

const DOTS = Array.from({ length: 60 }, (_, i) => i);

// Distribute dots evenly around a rectangle, starting top-centre clockwise.
function getDotPosition(i: number) {
  const w = GRID[0].length; // 11 cols
  const h = GRID.length;    // 13 rows
  const perimeter = 2 * w + 2 * h;
  const dist = (i / 60) * perimeter;
  // Shift so dot 0 sits at top-centre (12 o'clock)
  const d = (dist + w / 2) % perimeter;

  let top: number, left: number; // 0–100 %

  if (d < w) {
    top = 0; left = (d / w) * 100;                           // top edge →
  } else if (d < w + h) {
    top = ((d - w) / h) * 100; left = 100;                   // right edge ↓
  } else if (d < 2 * w + h) {
    top = 100; left = 100 - ((d - w - h) / w) * 100;         // bottom edge ←
  } else {
    top = 100 - ((d - 2 * w - h) / h) * 100; left = 0;      // left edge ↑
  }

  return { top: `${top}%`, left: `${left}%` };
}

export default function WordClock() {
  const { activeCells, seconds, label } = useWordTime();

  return (
    <div className={styles.wrapper}>
      <div className={styles.dotRing}>
        {DOTS.map((i) => {
          const pos = getDotPosition(i);
          return (
            <span
              key={i}
              className={`${styles.dot} ${i <= seconds ? styles.dotOn : ""} ${i % 15 === 0 ? styles.dotCardinal : ""}`}
              style={{ top: pos.top, left: pos.left }}
            />
          );
        })}
      </div>

      <div className={styles.grid} aria-label={label}>
        {GRID.map((letters, r) => (
          <div key={r} className={styles.row}>
            {letters.map((letter, c) => (
              <span
                key={c}
                className={`${styles.letter} ${activeCells.has(`${r},${c}`) ? styles.on : ""}`}
              >
                {letter}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
