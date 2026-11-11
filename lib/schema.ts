import { images, site } from "./site";
import { dayCount, priceAmount, type Tour } from "./tours";

const abs = (path: string) => new URL(path, site.url).toString();
const ORG_ID = `${site.url}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: `${site.url}/`,
    logo: abs(images.logo.src),
    image: abs(images.homeHero.src),
    description: site.description,
    telephone: site.phone,
    email: site.email,
    foundingDate: "2010",
    address: {
      "@type": "PostalAddress",
      streetAddress: "58/21, 3rd Lane, Soma Thalagala Mw, Gangodawila",
      addressLocality: "Nugegoda",
      addressRegion: "Western Province",
      postalCode: "10250",
      addressCountry: "LK",
    },
    areaServed: { "@type": "Country", name: "Sri Lanka" },
    sameAs: [site.facebook, site.instagram],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function tourSchema(tour: Tour) {
  const price = priceAmount(tour);
  const url = abs(`/${tour.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.summary,
    url,
    image: [abs(tour.image), abs(tour.hero.src)],
    provider: { "@id": ORG_ID },
    touristType: "Leisure",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.days.length,
      itemListElement: tour.days.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: d.title,
        description: d.items.join(" "),
      })),
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: "USD",
        url,
        availability: "https://schema.org/InStock",
        description: `Per person, ${dayCount(tour)} days. ${tour.price}`,
      },
    }),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
