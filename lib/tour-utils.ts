// Pure helpers shared by server and client components (no server-only imports here).
import { findLastPlace, findPlace, type Place } from "./places";

type DayLike = { title: string; distance: string | null; items: string[] };
type TourLike = { price: string; itineraryTitle: string; days: DayLike[] };

export const CATEGORIES = ["Wildlife", "Culture", "Beach", "Nature", "Golf", "Gems", "Romantic"] as const;
export type Category = (typeof CATEGORIES)[number];

/** Splits "Day 2 - Royal Colombo Golf Club" into its label and heading. */
export function splitDayTitle(title: string) {
  const m = title.match(/^(Day [\d\s&]+?)\s*[-–]\s*(.*)$/);
  return m ? { label: m[1].trim(), heading: m[2].trim() } : { label: "", heading: title };
}

/** "USD 2500 Per Person ..." -> 2500 (or null if no price). */
export function priceAmount(tour: Pick<TourLike, "price">): number | null {
  const m = tour.price.match(/USD\s*([\d,]+)/i);
  return m ? Number(m[1].replace(/,/g, "")) : null;
}

/** Number of days, taken from the itinerary title ("8 NIGHTS 9 DAYS" -> 9). */
export function dayCount(tour: Pick<TourLike, "itineraryTitle" | "days">): number {
  const m = tour.itineraryTitle.match(/(\d+)\s*DAYS/i);
  return m ? Number(m[1]) : tour.days.length;
}

/** Sum of the "120 km / 3 hours" figures. */
export function totalKm(tour: Pick<TourLike, "days">): number {
  return tour.days.reduce((sum, d) => {
    const m = d.distance?.match(/([\d.]+)\s*km/i);
    return sum + (m ? Number(m[1]) : 0);
  }, 0);
}

// "Overnight: Negombo", "Dinner & Overnight in Colombo.", "Dinner & Overnight Stay: Yala", "Overnight at Yala"
const OVERNIGHT = /overnight(?:\s+stay)?\s*(?::|\bin\b|\bat\b)\s*(.+)/i;

/**
 * Overnight stops in order, worked out from each day's "Overnight …" line
 * (or the destination in the day title when there isn't one).
 */
export function routeStops(tour: Pick<TourLike, "days">): Place[] {
  const stops: Place[] = [];
  const push = (p?: Place) => {
    if (p && stops[stops.length - 1]?.key !== p.key) stops.push(p);
  };

  tour.days.forEach((d, i) => {
    // "Colombo Airport to Kandy via Pinnawala" -> stops at Kandy, not Pinnawala.
    const titlePart = d.title.replace(/^Day [\d\s&]+[-–]\s*/, "").replace(/\s+via\s+.*$/i, "");
    if (i === 0 && /airport/i.test(titlePart)) push(findPlace("airport"));

    const overnight = d.items.map((it) => it.match(OVERNIGHT)?.[1]).find(Boolean);
    const isLast = i === tour.days.length - 1;
    if (isLast && /airport/i.test(`${d.title} ${d.items.join(" ")}`)) push(findPlace("airport"));
    else push(overnight ? findPlace(overnight) : findLastPlace(titlePart));
  });
  return stops;
}

export function startsAndEndsAtAirport(tour: Pick<TourLike, "days">) {
  const text = (d?: DayLike) => (d ? `${d.title} ${d.items.join(" ")}` : "");
  return /airport/i.test(text(tour.days[0])) && /airport/i.test(text(tour.days[tour.days.length - 1]));
}

/** Trims text to Google's ~155-character snippet length at a word boundary. */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:–-]+$/, "")}…`;
}
