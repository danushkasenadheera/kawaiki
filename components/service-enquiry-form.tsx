"use client";

import { useActionState, useEffect, useState } from "react";
import { sendServiceEnquiry } from "@/app/actions";
import { fmt } from "@/lib/i18n/dict/en";
import { ENQUIRY_TYPES, SERVICE_ENQUIRY_TYPES, type EnquiryType } from "@/lib/services";
import { FormExtras, Status } from "./forms";
import { useDict } from "./i18n-provider";

// Option *values* stay in English (they go into the email to the Kawaiki team);
// only the visible labels are translated.
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`grid gap-1 text-sm ${wide ? "sm:col-span-2" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

const req = (s: string) => `${s} *`;

function Count({ name, label, max = 10, required = false }: { name: string; label: string; max?: number; required?: boolean }) {
  const t = useDict().form;
  return (
    <Field label={required ? req(label) : label}>
      <select className="field" name={name} required={required} defaultValue="">
        <option value="" disabled>{t.select}</option>
        {range(1, max - 1).map((n) => <option key={n}>{n}</option>)}
        <option value={`${max}+`}>{fmt(t.orMore, { n: max })}</option>
      </select>
    </Field>
  );
}

type Direction = "arrival" | "departure" | "both";

/** Airport transfer fields: which dates and places are asked for depends on the direction. */
function TransferFields() {
  const t = useDict().enquiry;
  const [dir, setDir] = useState<Direction>("arrival");
  const airport = t.airport;
  const options: { value: Direction; label: string }[] = [
    { value: "arrival", label: t.dirArrival },
    { value: "departure", label: t.dirDeparture },
    { value: "both", label: t.dirBoth },
  ];
  return (
    <>
      <fieldset className="sm:col-span-2">
        <legend className="mb-2 text-sm">{req(t.whichWay)}</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <label
              key={o.value}
              className={`cursor-pointer border px-3 py-1.5 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal ${
                dir === o.value ? "border-teal bg-teal/20" : "border-ink/20 bg-white"
              }`}
            >
              <input type="radio" name="direction" value={o.value} checked={dir === o.value} onChange={() => setDir(o.value)} className="sr-only" />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
      {/* Re-keyed so pick-up/drop-off defaults follow the direction. */}
      <div key={dir} className="contents">
        {dir !== "departure" && (
          <>
            <Field label={req(t.arrivalDate)}><input className="field" type="date" name="arrival" required /></Field>
            <Field label={t.arrivalFlight}><input className="field" name="flight_number" placeholder="UL 504" /></Field>
          </>
        )}
        {dir !== "arrival" && (
          <>
            <Field label={req(t.departureDate)}><input className="field" type="date" name="departure_date" required /></Field>
            <Field label={t.departureFlight}><input className="field" name="departure_flight" placeholder="UL 503" /></Field>
          </>
        )}
        {dir === "arrival" && (
          <>
            <Field label={t.pickup}><input className="field" name="pickup" defaultValue={airport} /></Field>
            <Field label={req(t.dropoffHotel)}><input className="field" name="dropoff" required /></Field>
          </>
        )}
        {dir === "departure" && (
          <>
            <Field label={req(t.pickupHotel)}><input className="field" name="pickup" required /></Field>
            <Field label={t.dropoff}><input className="field" name="dropoff" defaultValue={airport} /></Field>
          </>
        )}
        {dir === "both" && (
          <Field label={t.hotelCity} wide>
            <input className="field" name="dropoff" placeholder={t.hotelCityPh} />
          </Field>
        )}
        <Count name="passengers" label={t.passengers} required />
      </div>
    </>
  );
}

/** One enquiry form for every service; only the fields for the chosen service are shown. */
export function ServiceEnquiryForm({
  packages,
  include = SERVICE_ENQUIRY_TYPES,
}: {
  packages: string[];
  /** Which "What do you need?" choices to offer. */
  include?: EnquiryType[];
}) {
  const d = useDict();
  const t = d.enquiry;
  const choices = ENQUIRY_TYPES.filter((x) => include.includes(x.value));
  const [type, setType] = useState<EnquiryType>(choices[0]?.value ?? "other");
  const [state, action, pending] = useActionState(sendServiceEnquiry, null);
  const messageRequired = ["other", "booking", "partner"].includes(type);

  // Buttons elsewhere on the page link to #enquire-transfer, #enquire-car, etc.
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#enquire-(\w+)/);
      const found = m && ENQUIRY_TYPES.find((x) => x.value === m[1] && include.includes(x.value));
      if (found) {
        setType(found.value);
        document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [include]);

  return (
    <form action={action} className="relative grid gap-6">
      <FormExtras />

      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t.whatNeed}</legend>
        <div className="flex flex-wrap gap-2">
          {choices.map((c) => (
            <label
              key={c.value}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal ${
                type === c.value ? "border-ink bg-ink text-white" : "border-ink/20 bg-white hover:border-teal"
              }`}
            >
              <input type="radio" name="service" value={c.value} checked={type === c.value} onChange={() => setType(c.value)} className="sr-only" />
              {t.types[c.value] ?? c.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Service-specific fields. Re-keyed so switching service clears them. */}
      <div key={type} className="grid gap-4 sm:grid-cols-2">
        {type === "tour" && (
          <>
            <Field label={t.package} wide>
              <select className="field" name="package" defaultValue="">
                <option value="">{t.notSure}</option>
                {packages.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label={req(t.arrivalDate)}><input className="field" type="date" name="arrival" required /></Field>
            <Count name="person" label={t.travellers} required />
            <Field label={t.tripLength}>
              <select className="field" name="duration" defaultValue="">
                <option value="">{d.form.select}</option>
                {range(2, 14).map((n) => <option key={n} value={`${n} days`}>{fmt(d.form.nDays, { n })}</option>)}
                <option value="15+ days">{d.form.daysOrMore}</option>
              </select>
            </Field>
          </>
        )}
        {type === "transfer" && <TransferFields />}
        {type === "booking" && (
          <>
            <Field label={t.bookingRef}><input className="field" name="booking_ref" /></Field>
            <Field label={t.travelDates}><input className="field" name="travel_dates" placeholder={t.travelDatesPh} /></Field>
          </>
        )}
        {type === "partner" && (
          <>
            <Field label={req(t.company)}><input className="field" name="company" required autoComplete="organization" /></Field>
            <Field label={t.country}><input className="field" name="country" autoComplete="country-name" /></Field>
          </>
        )}
        {type === "car" && (
          <>
            <Field label={req(t.startDate)}><input className="field" type="date" name="start_date" required /></Field>
            <Field label={req(t.numDays)}><input className="field" type="number" name="days" min={1} max={60} required /></Field>
            <Field label={req(t.driver)}>
              <select className="field" name="driver" required defaultValue="">
                <option value="" disabled>{d.form.select}</option>
                <option value="With driver">{t.withDriver}</option>
                <option value="Without driver (self-drive)">{t.selfDrive}</option>
              </select>
            </Field>
            <Count name="passengers" label={t.passengers} />
          </>
        )}
        {type === "hotel" && (
          <>
            <Field label={req(t.where)} wide><input className="field" name="location" required placeholder={t.wherePh} /></Field>
            <Field label={req(t.checkIn)}><input className="field" type="date" name="check_in" required /></Field>
            <Field label={req(t.checkOut)}><input className="field" type="date" name="check_out" required /></Field>
            <Count name="rooms" label={t.rooms} max={5} />
            <Count name="guests" label={t.guests} />
          </>
        )}
        {type === "flight" && (
          <>
            <Field label={req(t.from)}><input className="field" name="from" required placeholder={t.fromPh} /></Field>
            <Field label={req(t.to)}><input className="field" name="to" required placeholder={t.toPh} /></Field>
            <Field label={req(t.departureDate)}><input className="field" type="date" name="depart_date" required /></Field>
            <Field label={t.returnDate}><input className="field" type="date" name="return_date" /></Field>
            <Count name="passengers" label={t.passengers} />
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={req(d.form.name)}><input className="field" name="name" required autoComplete="name" /></Field>
        <Field label={req(d.form.email)}><input className="field" type="email" name="email" required autoComplete="email" /></Field>
        <Field label={req(d.form.phoneWa)}><input className="field" type="tel" name="phone" required autoComplete="tel" /></Field>
      </div>
      <Field label={messageRequired ? req(t.howHelp) : t.anythingElse}>
        <textarea className="field min-h-28" name="message" required={messageRequired} />
      </Field>

      <Status state={state} />
      <div className="text-center">
        <button type="submit" className="btn btn-teal" disabled={pending}>{pending ? d.form.sending : t.send}</button>
      </div>
    </form>
  );
}
