"use server";

export type FormState = { ok: boolean; message: string } | null;

type Lang = "en" | "ja";
const langOf = (fd: FormData): Lang => (fd.get("locale") === "ja" ? "ja" : "en");

// Messages shown to the visitor, in their language.
const MSG = {
  en: {
    thanks: "Thank you! We'll be in touch shortly.",
    sent: "Thank you! Your message has been sent. We'll get back to you shortly.",
    sentEnquiry: "Thank you! Your enquiry has been sent. We'll get back to you shortly.",
    failed: "Sorry, we couldn't send your message right now. Please email info@kawaiki.com or call +94706667067.",
    fill: "Please fill in: {fields}.",
    email: "Please enter a valid email address.",
    choose: "Please choose what you need.",
  },
  ja: {
    thanks: "ありがとうございます。担当者よりご連絡いたします。",
    sent: "メッセージを送信しました。担当者より折り返しご連絡いたします。",
    sentEnquiry: "お問い合わせを送信しました。担当者より折り返しご連絡いたします。",
    failed: "申し訳ありません。送信できませんでした。info@kawaiki.com へのメール、または +94706667067 へお電話ください。",
    fill: "必須項目をご入力ください。",
    email: "正しいメールアドレスをご入力ください。",
    choose: "ご希望の内容をお選びください。",
  },
} as const;

const DIRECTIONS: Record<string, string> = {
  arrival: "Arrival (airport → hotel)",
  departure: "Departure (hotel → airport)",
  both: "Both ways",
};

const LABELS: Record<string, string> = {
  language: "Language",
  name: "Name",
  email: "Email",
  phone: "Phone",
  person: "No. of persons",
  children: "No. of children",
  duration: "Duration",
  arrival: "Arrival date",
  package: "Package",
  message: "Message",
  service: "Service",
  direction: "Transfer",
  departure_date: "Departure date",
  departure_flight: "Departure flight",
  booking_ref: "Booking reference / tour",
  travel_dates: "Travel dates",
  company: "Company",
  country: "Country",
  flight_number: "Flight number",
  pickup: "Pick-up",
  dropoff: "Drop-off",
  passengers: "Passengers",
  start_date: "Start date",
  days: "Number of days",
  driver: "Driver",
  location: "Location",
  check_in: "Check-in",
  check_out: "Check-out",
  rooms: "Rooms",
  guests: "Guests",
  from: "From",
  to: "To",
  depart_date: "Departure date",
  return_date: "Return date",
};

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function sendEmail(subject: string, fields: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "info@kawaiki.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Kawaiki Website <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY is not set; enquiry not emailed:", subject, fields);
    return false;
  }

  const rows = Object.entries(fields)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${escape(LABELS[k] ?? k)}</b></td><td style="padding:4px 0">${escape(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: fields.email,
      subject,
      html: `<h2>${escape(subject)}</h2><table>${rows}</table>`,
      text: Object.entries(fields).map(([k, v]) => `${LABELS[k] ?? k}: ${v}`).join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text());
    return false;
  }
  return true;
}

function collect(formData: FormData, keys: string[]) {
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = formData.get(k);
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 5000);
  }
  return out;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function submit(kind: "contact" | "booking", formData: FormData): Promise<FormState> {
  const lang = langOf(formData);
  const m = MSG[lang];
  // Honeypot: real visitors never fill this hidden field.
  if (formData.get("website")) return { ok: true, message: m.thanks };

  const keys =
    kind === "contact"
      ? ["name", "phone", "email", "message"]
      : ["person", "children", "duration", "arrival", "package", "email", "phone", "message"];
  const fields = collect(formData, keys);

  const required = kind === "contact" ? keys : keys.filter((k) => k !== "package");
  const missing = required.filter((k) => !fields[k]);
  if (missing.length) {
    return { ok: false, message: m.fill.replace("{fields}", missing.map((k) => LABELS[k]).join(", ")) };
  }
  if (!EMAIL_RE.test(fields.email)) return { ok: false, message: m.email };
  if (lang === "ja") fields.language = "Japanese (reply in Japanese)";

  const subject =
    kind === "contact"
      ? `Website enquiry from ${fields.name}`
      : `Tour booking request${fields.package ? `: ${fields.package}` : ""}`;

  const sent = await sendEmail(lang === "ja" ? `[日本語] ${subject}` : subject, fields);
  if (!sent) return { ok: false, message: m.failed };
  return { ok: true, message: m.sent };
}

export async function sendContact(_prev: FormState, formData: FormData) {
  return submit("contact", formData);
}

export async function sendBooking(_prev: FormState, formData: FormData) {
  return submit("booking", formData);
}

// ── Services page: one form, fields depend on the service chosen ──────────────
const SERVICE_FIELDS: Record<string, { label: string; keys: string[]; required: string[] }> = {
  tour: { label: "Tour package", keys: ["package", "arrival", "person", "duration"], required: ["arrival", "person"] },
  transfer: {
    label: "Airport transfer",
    keys: ["direction", "arrival", "flight_number", "departure_date", "departure_flight", "pickup", "dropoff", "passengers"],
    required: ["direction", "passengers"],
  },
  car: { label: "Car hire", keys: ["start_date", "days", "driver", "passengers"], required: ["start_date", "days", "driver"] },
  hotel: { label: "Hotel booking", keys: ["location", "check_in", "check_out", "rooms", "guests"], required: ["location", "check_in", "check_out"] },
  flight: { label: "Flight tickets", keys: ["from", "to", "depart_date", "return_date", "passengers"], required: ["from", "to", "depart_date"] },
  booking: { label: "Booking help", keys: ["booking_ref", "travel_dates"], required: [] },
  partner: { label: "Tour operator / partnership", keys: ["company", "country"], required: ["company"] },
  other: { label: "Other enquiry", keys: [], required: [] },
};

export async function sendServiceEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const lang = langOf(formData);
  const m = MSG[lang];
  if (formData.get("website")) return { ok: true, message: m.thanks };

  const type = String(formData.get("service") ?? "");
  const spec = SERVICE_FIELDS[type];
  if (!spec) return { ok: false, message: m.choose };

  const common = ["name", "email", "phone", "message"];
  const fields = collect(formData, [...common, ...spec.keys]);
  const required = ["name", "email", "phone", ...spec.required, ...(["other", "booking", "partner"].includes(type) ? ["message"] : [])];

  // Transfers: which dates/places are needed depends on the direction (sent as a code).
  if (type === "transfer") {
    const dir = fields.direction ?? "";
    if (!DIRECTIONS[dir]) return { ok: false, message: m.choose };
    if (dir === "arrival" || dir === "both") required.push("arrival");
    if (dir === "departure" || dir === "both") required.push("departure_date");
    if (dir === "arrival") required.push("dropoff");
    if (dir === "departure") required.push("pickup");
    fields.direction = DIRECTIONS[dir];
  }
  const missing = required.filter((k) => !fields[k]);
  if (missing.length) return { ok: false, message: m.fill.replace("{fields}", missing.map((k) => LABELS[k] ?? k).join(", ")) };
  if (!EMAIL_RE.test(fields.email)) return { ok: false, message: m.email };

  const ordered: Record<string, string> = { service: spec.label };
  if (lang === "ja") ordered.language = "Japanese (reply in Japanese)";
  for (const k of [...spec.keys, "name", "email", "phone", "message"]) if (fields[k]) ordered[k] = fields[k];

  const subject = `${spec.label} enquiry from ${fields.name}`;
  const sent = await sendEmail(lang === "ja" ? `[日本語] ${subject}` : subject, ordered);
  if (!sent) return { ok: false, message: m.failed };
  return { ok: true, message: m.sentEnquiry };
}
