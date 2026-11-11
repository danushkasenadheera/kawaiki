"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { useDict } from "./i18n-provider";

// Full street address so the pin lands on the office, not just the neighbourhood.
const query = encodeURIComponent("58/21 3rd Lane, Soma Thalagala Mawatha, Gangodawila, Nugegoda 10250, Sri Lanka");

/**
 * Google Maps only loads after the visitor clicks, so no Google cookies are set
 * and the page stays fast until the map is actually wanted.
 */
export function MapEmbed() {
  const t = useDict().map;
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <iframe
        title={t.title}
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        className="h-[380px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="flex h-[380px] flex-col items-center justify-center gap-4 bg-sand px-4 text-center">
      <MapPin className="size-10 text-teal" />
      <p className="max-w-md text-sm">{site.legalName}, {site.address}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => setShow(true)} className="btn btn-teal">
          {t.show}
        </button>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn border border-ink"
        >
          {t.open}
        </a>
      </div>
      <p className="text-xs text-ink/60">{t.privacy}</p>
    </div>
  );
}
