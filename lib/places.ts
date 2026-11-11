/** Places that tours stop at, with approximate coordinates for the route map. */
export type Place = { key: string; name: string; lat: number; lng: number; aliases: string[] };

/** Japanese place names for the route map and route list. */
export const PLACE_NAMES_JA: Record<string, string> = {"cmb": "コロンボ空港", "colombo": "コロンボ", "negombo": "ニゴンボ", "pinnawala": "ピンナワラ", "kandy": "キャンディ", "nuwara-eliya": "ヌワラエリヤ", "horton-plains": "ホートン・プレインズ", "ella": "エラ", "yala": "ヤーラ", "bundala": "ブンダラ", "udawalawe": "ウダワラウェ", "galle": "ゴール", "mirissa": "ミリッサ", "bentota": "ベントタ", "hikkaduwa": "ヒッカドゥワ", "ratnapura": "ラトナプラ", "sinharaja": "シンハラジャ", "dambulla": "ダンブッラ", "sigiriya": "シーギリヤ", "habarana": "ハバラナ", "polonnaruwa": "ポロンナルワ", "anuradhapura": "アヌラーダプラ", "minneriya": "ミンネリヤ", "trincomalee": "トリンコマリー", "pasikudah": "パシクダ", "arugam-bay": "アルガム・ベイ", "wilpattu": "ウィルパットゥ", "kalpitiya": "カルピティヤ", "jaffna": "ジャフナ", "kitulgala": "キトゥルガラ"};

export const placeName = (p: Place, locale: "en" | "ja" = "en") => (locale === "ja" ? PLACE_NAMES_JA[p.key] ?? p.name : p.name);

export const PLACES: Place[] = [
  { key: "cmb", name: "Colombo Airport", lat: 7.18, lng: 79.88, aliases: ["airport", "katunayake", "bandaranaike"] },
  { key: "colombo", name: "Colombo", lat: 6.93, lng: 79.85, aliases: ["colombo"] },
  { key: "negombo", name: "Negombo", lat: 7.21, lng: 79.84, aliases: ["negombo"] },
  { key: "pinnawala", name: "Pinnawala", lat: 7.3, lng: 80.39, aliases: ["pinnawala"] },
  { key: "kandy", name: "Kandy", lat: 7.29, lng: 80.63, aliases: ["kandy", "digana", "victoria golf", "peradeniya"] },
  { key: "nuwara-eliya", name: "Nuwara Eliya", lat: 6.97, lng: 80.77, aliases: ["nuwara eliya"] },
  { key: "horton-plains", name: "Horton Plains", lat: 6.8, lng: 80.8, aliases: ["horton plains"] },
  { key: "ella", name: "Ella", lat: 6.87, lng: 81.05, aliases: ["ella"] },
  { key: "yala", name: "Yala", lat: 6.37, lng: 81.4, aliases: ["yala", "tissamaharama"] },
  { key: "bundala", name: "Bundala", lat: 6.19, lng: 81.21, aliases: ["bundala"] },
  { key: "udawalawe", name: "Udawalawe", lat: 6.47, lng: 80.89, aliases: ["udawalawe"] },
  { key: "galle", name: "Galle", lat: 6.03, lng: 80.22, aliases: ["galle"] },
  { key: "mirissa", name: "Mirissa", lat: 5.95, lng: 80.46, aliases: ["mirissa", "weligama"] },
  { key: "bentota", name: "Bentota", lat: 6.42, lng: 80.0, aliases: ["bentota"] },
  { key: "hikkaduwa", name: "Hikkaduwa", lat: 6.14, lng: 80.1, aliases: ["hikkaduwa"] },
  { key: "ratnapura", name: "Ratnapura", lat: 6.68, lng: 80.4, aliases: ["ratnapura", "rathnapura"] },
  { key: "sinharaja", name: "Sinharaja", lat: 6.4, lng: 80.5, aliases: ["sinharaja"] },
  { key: "dambulla", name: "Dambulla", lat: 7.86, lng: 80.65, aliases: ["dambulla"] },
  { key: "sigiriya", name: "Sigiriya", lat: 7.95, lng: 80.76, aliases: ["sigiriya"] },
  { key: "habarana", name: "Habarana", lat: 8.03, lng: 80.75, aliases: ["habarana"] },
  { key: "polonnaruwa", name: "Polonnaruwa", lat: 7.94, lng: 81.0, aliases: ["polonnaruwa"] },
  { key: "anuradhapura", name: "Anuradhapura", lat: 8.31, lng: 80.4, aliases: ["anuradhapura"] },
  { key: "minneriya", name: "Minneriya", lat: 8.04, lng: 80.89, aliases: ["minneriya"] },
  { key: "trincomalee", name: "Trincomalee", lat: 8.59, lng: 81.21, aliases: ["trincomalee"] },
  { key: "pasikudah", name: "Pasikudah", lat: 7.93, lng: 81.56, aliases: ["pasikudah", "passikudah"] },
  { key: "arugam-bay", name: "Arugam Bay", lat: 6.84, lng: 81.83, aliases: ["arugam"] },
  { key: "wilpattu", name: "Wilpattu", lat: 8.46, lng: 80.03, aliases: ["wilpattu"] },
  { key: "kalpitiya", name: "Kalpitiya", lat: 8.23, lng: 79.76, aliases: ["kalpitiya"] },
  { key: "jaffna", name: "Jaffna", lat: 9.66, lng: 80.02, aliases: ["jaffna"] },
  { key: "kitulgala", name: "Kitulgala", lat: 6.99, lng: 80.42, aliases: ["kitulgala"] },
];

/** The place mentioned earliest in `text`, if any. */
export function findPlace(text: string): Place | undefined {
  const t = text.toLowerCase();
  let best: { place: Place; at: number } | undefined;
  for (const place of PLACES) {
    for (const alias of place.aliases) {
      const at = t.search(new RegExp(`\\b${alias}\\b`));
      if (at >= 0 && (!best || at < best.at)) best = { place, at };
    }
  }
  return best?.place;
}

/** The place mentioned last in `text` (e.g. the destination in "Kandy to Nuwara Eliya"). */
export function findLastPlace(text: string): Place | undefined {
  const t = text.toLowerCase();
  let best: { place: Place; at: number } | undefined;
  for (const place of PLACES) {
    for (const alias of place.aliases) {
      const matches = [...t.matchAll(new RegExp(`\\b${alias}\\b`, "g"))];
      const at = matches.length ? matches[matches.length - 1].index! : -1;
      if (at >= 0 && (!best || at > best.at)) best = { place, at };
    }
  }
  return best?.place;
}
