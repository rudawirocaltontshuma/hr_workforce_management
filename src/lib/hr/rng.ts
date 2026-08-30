/**
 * Deterministic seeded random utilities used to generate the mock HR dataset.
 * Using a seeded PRNG (instead of Math.random) keeps every server render and
 * client hydration byte-for-byte identical across the whole demo dataset.
 */
function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fixed "today" for the demo so every derived date, trend and "time ago" label stays deterministic. */
export const NOW = new Date("2026-08-30T09:00:00.000Z");

export class Rng {
  private next: () => number;

  constructor(seed: number) {
    this.next = mulberry32(seed);
  }

  float(min = 0, max = 1): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1));
  }

  bool(probability = 0.5): boolean {
    return this.next() < probability;
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)];
  }

  pickMany<T>(items: readonly T[], count: number): T[] {
    return this.shuffle(items).slice(0, count);
  }

  pickWeighted<T>(items: readonly (readonly [T, number])[]): T {
    const total = items.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = this.float(0, total);
    for (const [item, weight] of items) {
      if (roll < weight) return item;
      roll -= weight;
    }
    return items[items.length - 1][0];
  }

  shuffle<T>(items: readonly T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  date(start: Date, end: Date): Date {
    return new Date(this.int(start.getTime(), end.getTime()));
  }
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short" });
}
