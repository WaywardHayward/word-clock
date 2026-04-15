import { useEffect, useMemo, useState } from "react";

// ── Word definitions ──────────────────────────────────────────────────────────
type Cell = readonly [row: number, col: number];
const span = (r: number, c1: number, c2: number): Cell[] =>
  Array.from({ length: c2 - c1 + 1 }, (_, i) => [r, c1 + i] as const);

export const WORDS = {
  IT:       span(0,  0, 1),
  IS:       span(0,  2, 3),
  ABOUT:    span(0,  4, 8),
  NEARLY:   span(1,  0, 5),
  HALF:     span(1,  6, 9),
  QUARTER:  span(2,  1, 7),
  TWENTY:   span(3,  0, 5),
  FIVE_MIN: span(3,  7, 10),
  TEN_MIN:  span(4,  0, 2),
  PAST:     span(4,  4, 7),
  TO:       span(4,  9, 10),
  ONE:      span(5,  0, 2),
  TWO:      span(5,  4, 6),
  THREE:    span(6,  0, 4),
  FOUR:     span(6,  6, 9),
  FIVE_HR:  span(7,  0, 3),
  SIX:      span(7,  5, 7),
  SEVEN:    span(8,  0, 4),
  EIGHT:    span(8,  5, 9),
  NINE:     span(9,  0, 3),
  TEN_HR:   span(9,  5, 7),
  ELEVEN:   span(10, 0, 5),
  TWELVE:   span(11, 0, 5),
  OCLOCK:   span(12, 0, 5),
} satisfies Record<string, Cell[]>;

export type WordKey = keyof typeof WORDS;

const HOUR_WORD: Record<number, WordKey> = {
  1: "ONE",   2: "TWO",    3: "THREE", 4: "FOUR",   5: "FIVE_HR",
  6: "SIX",   7: "SEVEN",  8: "EIGHT", 9: "NINE",   10: "TEN_HR",
  11: "ELEVEN", 12: "TWELVE",
};

// ── Pure functions ────────────────────────────────────────────────────────────
function getActiveWords(date: Date): Set<WordKey> {
  const h = date.getHours() % 12 || 12;
  const m = date.getMinutes();
  const remainder = m % 5;
  const snapped = Math.round(m / 5) * 5;

  const on = new Set<WordKey>(["IT", "IS"]);

  if (remainder >= 1 && remainder <= 3) on.add("ABOUT");
  if (remainder === 4)                  on.add("NEARLY");

  if (snapped === 0) {
    on.add(HOUR_WORD[h]);
    on.add("OCLOCK");
  } else if (snapped === 60) {
    on.add(HOUR_WORD[(h % 12) + 1]);
    on.add("OCLOCK");
  } else if (snapped <= 30) {
    if (snapped === 5  || snapped === 25) on.add("FIVE_MIN");
    if (snapped === 10)                   on.add("TEN_MIN");
    if (snapped === 15)                   on.add("QUARTER");
    if (snapped === 20 || snapped === 25) on.add("TWENTY");
    if (snapped === 30)                   on.add("HALF");
    on.add("PAST");
    on.add(HOUR_WORD[h]);
  } else {
    const next = (h % 12) + 1;
    if (snapped === 35)      { on.add("TWENTY"); on.add("FIVE_MIN"); }
    else if (snapped === 40) on.add("TWENTY");
    else if (snapped === 45) on.add("QUARTER");
    else if (snapped === 50) on.add("TEN_MIN");
    else if (snapped === 55) on.add("FIVE_MIN");
    on.add("TO");
    on.add(HOUR_WORD[next]);
  }

  return on;
}

function getActiveCells(words: Set<WordKey>): Set<string> {
  const cells = new Set<string>();
  for (const word of words) {
    for (const [r, c] of WORDS[word]) cells.add(`${r},${c}`);
  }
  return cells;
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useWordTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const activeCells = useMemo(
    () => (time ? getActiveCells(getActiveWords(time)) : new Set<string>()),
    [time],
  );

  return {
    activeCells,
    seconds: time?.getSeconds() ?? -1,
    label: time?.toLocaleTimeString() ?? "",
  };
}
