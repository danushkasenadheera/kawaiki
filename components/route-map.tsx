import { placeName, type Place } from "@/lib/places";

// Simple equirectangular projection; Sri Lanka is small enough that it looks right.
const K = 120;
const px = (lng: number) => (lng - 79.6) * K;
const py = (lat: number) => (9.9 - lat) * K;

// Simplified coastline (lat, lng), clockwise from Point Pedro. Stylised, not survey-accurate.
const COAST: [number, number][] = [
  [9.83, 80.23], [9.55, 80.6], [9.27, 80.82], [8.95, 81.0], [8.58, 81.24], [8.35, 81.38], [7.95, 81.56],
  [7.72, 81.7], [7.41, 81.83], [6.87, 81.84], [6.52, 81.7], [6.3, 81.5], [6.21, 81.33], [6.12, 81.12],
  [6.02, 80.79], [5.92, 80.59], [5.95, 80.46], [6.03, 80.21], [6.14, 80.1], [6.42, 80.0], [6.58, 79.96],
  [6.93, 79.85], [7.21, 79.83], [7.58, 79.79], [7.95, 79.8], [8.23, 79.75], [8.55, 79.88], [8.98, 79.9],
  [9.1, 80.05], [9.5, 80.2], [9.66, 80.01], [9.81, 80.04],
];
const coastPath = `M${COAST.map(([lat, lng]) => `${px(lng).toFixed(1)},${py(lat).toFixed(1)}`).join("L")}Z`;

type Label = { key: string; text: string; x: number; y: number; side: "left" | "right" };

/** Nudges labels on the same side apart so close stops (e.g. Colombo/Negombo) stay readable. */
function placeLabels(labels: Label[]) {
  for (const side of ["left", "right"] as const) {
    const group = labels.filter((l) => l.side === side).sort((a, b) => a.y - b.y);
    for (let i = 1; i < group.length; i++) {
      if (group[i].y - group[i - 1].y < 18) group[i].y = group[i - 1].y + 18;
    }
  }
  return labels;
}

export function RouteMap({ stops, title, locale = "en", airportLabel = "✈ Airport" }: { stops: Place[]; title: string; locale?: "en" | "ja"; airportLabel?: string }) {
  if (stops.length < 2) return null;

  const unique = stops.filter((p, i) => stops.findIndex((q) => q.key === p.key) === i);
  const numbered = unique.filter((p) => p.key !== "cmb");
  const line = stops.map((p) => `${px(p.lng).toFixed(1)},${py(p.lat).toFixed(1)}`).join(" ");

  const labels = placeLabels(
    unique.map((p) => ({
      key: p.key,
      text: p.key === "cmb" ? airportLabel : `${numbered.indexOf(p) + 1}. ${placeName(p, locale)}`,
      x: px(p.lng),
      y: py(p.lat),
      side: p.lng < 80.35 ? "left" : "right",
    })),
  );

  return (
    <figure className="mx-auto w-full max-w-md">
      <svg viewBox="-95 -5 430 495" role="img" aria-labelledby="route-map-title" className="h-auto w-full">
        <title id="route-map-title">{`${title}: ${numbered.map((p) => placeName(p, locale)).join(", ")}`}</title>
        <path d={coastPath} fill="#e8f8f8" stroke="#22d4d6" strokeWidth={2} strokeLinejoin="round" />
        <polyline points={line} fill="none" stroke="#1d6aa8" strokeWidth={2.5} strokeDasharray="6 5" strokeLinecap="round" strokeLinejoin="round" />
        {unique.map((p) =>
          p.key === "cmb" ? (
            <rect key={p.key} x={px(p.lng) - 6} y={py(p.lat) - 6} width={12} height={12} fill="#0a0a0b" />
          ) : (
            <g key={p.key}>
              <circle cx={px(p.lng)} cy={py(p.lat)} r={11} fill="#e44993" stroke="#fff" strokeWidth={2} />
              <text x={px(p.lng)} y={py(p.lat) + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">
                {numbered.indexOf(p) + 1}
              </text>
            </g>
          ),
        )}
        {labels.map((l) => (
          <text
            key={l.key}
            x={l.side === "left" ? l.x - 16 : l.x + 16}
            y={l.y + 5}
            textAnchor={l.side === "left" ? "end" : "start"}
            fontSize={16}
            fill="#0a0a0b"
            paintOrder="stroke"
            stroke="#fff"
            strokeWidth={3}
          >
            {l.text}
          </text>
        ))}
      </svg>
    </figure>
  );
}
