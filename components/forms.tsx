"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { sendBooking, sendContact, type FormState } from "@/app/actions";
import { fmt } from "@/lib/i18n/dict/en";
import { useDict, useLocale } from "./i18n-provider";

export function Status({ state }: { state: FormState }) {
  if (!state) return null;
  const Icon = state.ok ? CheckCircle2 : AlertCircle;
  return (
    <p role="status" className={`flex items-start gap-2 rounded-lg p-3 text-sm ${state.ok ? "bg-teal/15 text-teal-dark" : "bg-pink/10 text-pink"}`}>
      <Icon className="mt-0.5 size-4 shrink-0" /> {state.message}
    </p>
  );
}

/** Spam trap plus the visitor's language, so replies and messages match it. */
export function FormExtras() {
  const locale = useLocale();
  return (
    <>
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
    </>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => <span className="sr-only">{children}</span>;

export function ContactForm() {
  const t = useDict().form;
  const [state, action, pending] = useActionState(sendContact, null);
  return (
    <form action={action} className="relative grid gap-4">
      <FormExtras />
      <div className="grid gap-4 sm:grid-cols-2">
        <label><Label>{t.name}</Label><input className="field" name="name" type="text" placeholder={t.enterName} required autoComplete="name" /></label>
        <label><Label>{t.phone}</Label><input className="field" name="phone" type="tel" placeholder={t.enterPhone} required autoComplete="tel" /></label>
      </div>
      <label><Label>{t.email}</Label><input className="field" name="email" type="email" placeholder={t.enterEmail} required autoComplete="email" /></label>
      <label><Label>{t.message}</Label><textarea className="field min-h-36" name="message" placeholder={t.enterMessage} required /></label>
      <Status state={state} />
      <div className="text-center">
        <button type="submit" className="btn btn-teal" disabled={pending}>
          {pending ? t.sending : t.sendMessage}
        </button>
      </div>
    </form>
  );
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export function BookingForm({
  packages = [],
  showPackage = true,
  defaultPackage,
  submit = "bookNow",
}: {
  packages?: string[];
  showPackage?: boolean;
  defaultPackage?: string;
  submit?: "bookNow" | "send" | "sendRequest";
}) {
  const t = useDict().form;
  const [state, action, pending] = useActionState(sendBooking, null);
  return (
    <form action={action} className="relative grid gap-4">
      <FormExtras />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label>
          <Label>{t.persons}</Label>
          <select className="field" name="person" required defaultValue="">
            <option value="" disabled>{t.persons}</option>
            {range(1, 9).map((n) => <option key={n}>{n}</option>)}
            <option value="10+">{fmt(t.orMore, { n: 10 })}</option>
          </select>
        </label>
        <label>
          <Label>{t.children}</Label>
          <select className="field" name="children" required defaultValue="">
            <option value="" disabled>{t.children}</option>
            {range(0, 4).map((n) => <option key={n}>{n}</option>)}
            <option value="5+">{fmt(t.orMore, { n: 5 })}</option>
          </select>
        </label>
        <label>
          <Label>{t.duration}</Label>
          <select className="field" name="duration" required defaultValue="">
            <option value="" disabled>{t.duration}</option>
            {range(2, 14).map((n) => <option key={n} value={`${n} days`}>{fmt(t.nDays, { n })}</option>)}
            <option value="15+ days">{t.daysOrMore}</option>
          </select>
        </label>
        <label>
          <Label>{t.arrival}</Label>
          <input className="field" name="arrival" type="date" required aria-label={t.arrival} />
        </label>
      </div>
      <div className={`grid gap-4 ${showPackage ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {showPackage && (
          <label>
            <Label>{t.package}</Label>
            <select className="field" name="package" required defaultValue={defaultPackage ?? ""}>
              <option value="" disabled>{t.package}</option>
              {packages.map((p) => <option key={p}>{p}</option>)}
              <option>{t.customPackage}</option>
            </select>
          </label>
        )}
        <label><Label>{t.email}</Label><input className="field" name="email" type="email" placeholder={t.enterEmail} required autoComplete="email" /></label>
        <label><Label>{t.phone}</Label><input className="field" name="phone" type="tel" placeholder={t.enterPhone} required autoComplete="tel" /></label>
      </div>
      <label><Label>{t.message}</Label><textarea className="field min-h-40" name="message" placeholder={t.messagePh} required /></label>
      <Status state={state} />
      <div className="text-center">
        <button type="submit" className="btn btn-teal" disabled={pending}>
          {pending ? t.sending : t[submit]}
        </button>
      </div>
    </form>
  );
}
