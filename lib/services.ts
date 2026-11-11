// Services page content. Written only from the client's own material
// (about-us document, existing site copy, terms). No prices or vehicle claims.

export type EnquiryType = "tour" | "transfer" | "car" | "hotel" | "flight" | "booking" | "partner" | "other";

export const ENQUIRY_TYPES: { value: EnquiryType; label: string }[] = [
  { value: "tour", label: "Tour package" },
  { value: "transfer", label: "Airport transfer" },
  { value: "car", label: "Car hire" },
  { value: "hotel", label: "Hotel booking" },
  { value: "flight", label: "Flight tickets" },
  { value: "booking", label: "Help with my booking" },
  { value: "partner", label: "Tour operator / partnership" },
  { value: "other", label: "Something else" },
];

/** The Services page leaves out the contact-only choices. */
export const SERVICE_ENQUIRY_TYPES: EnquiryType[] = ["tour", "transfer", "car", "hotel", "flight", "other"];

export type ServiceBlock = {
  id: string;
  title: string;
  image: { src: string; alt: string };
  intro: string;
  points: string[];
  cta: { label: string; href: string };
};

export const serviceBlocks: ServiceBlock[] = [
  {
    id: "tours",
    title: "Tailor-made tours",
    image: {
      src: "/images/2025-06-thushal-madhushankha-sigiriya-unsplash.webp",
      alt: "Traveller admiring Sigiriya Rock from Pidurangala",
    },
    intro:
      "Culture, wildlife, beaches, tea country or a mix of everything. We plan each tour around your dates, interests and budget, for independent travellers, families and groups.",
    points: [
      "Private, air-conditioned transport with a chauffeur-guide",
      "Hotels, entrance fees and safaris arranged for you",
      "Sample itineraries you can change, or a plan from scratch",
      "Full payment on arrival, with up to 2 free changes",
    ],
    cta: { label: "See tour packages", href: "/packages/" },
  },
  {
    id: "transfers",
    title: "Airport transfers",
    image: { src: "/images/2025-06-thambili.webp", alt: "Kawaiki guests enjoying fresh king coconuts on arrival" },
    intro:
      "Start and end your trip without the stress. We meet you when you land at Bandaranaike International Airport, and bring you back in good time for your flight home.",
    points: [
      "Arrival pickups with a personal meet & greet at Colombo airport (CMB)",
      "Departure drop-offs, timed around your flight",
      "Private, air-conditioned vehicles, at any hour: our team works around the clock",
      "To and from hotels and cities anywhere in Sri Lanka",
    ],
    cta: { label: "Book a transfer", href: "#enquire-transfer" },
  },
  {
    id: "car-hire",
    title: "Car hire",
    image: { src: "/images/2025-06-MG_6071-copy.jpg", alt: "Lush tea plantations in Sri Lanka's hill country" },
    intro:
      "Explore at your own pace. Hire a vehicle with an experienced local driver who knows the roads, or without a driver if you prefer.",
    points: [
      "With an experienced driver, or self-drive",
      "Air-conditioned and luxury vehicles",
      "Day trips or multi-day journeys",
      "Flexible pick-up from your hotel or the airport",
    ],
    cta: { label: "Ask about car hire", href: "#enquire-car" },
  },
  {
    id: "hotels",
    title: "Hotel reservations",
    image: { src: "/images/2025-06-amal-prasad-sri-lanka-beach-unsplash.webp", alt: "Aerial view of a palm-lined Sri Lankan beach" },
    intro:
      "From beachfront resorts to colonial hill-country hotels and private villas, we book the right place for your budget and style, in Sri Lanka and worldwide.",
    points: [
      "Luxury hotels, boutique stays and villas",
      "Options to suit every budget",
      "Hotels in Sri Lanka and worldwide",
      "Local advice on the best area for each stop",
    ],
    cta: { label: "Request hotels", href: "#enquire-hotel" },
  },
  {
    id: "flights",
    title: "Flight tickets & outbound travel",
    image: { src: "/images/2025-06-lotus-tower-by-tharoushan-kandarajah.webp", alt: "Lotus Tower above the Colombo skyline" },
    intro:
      "Domestic and international flight bookings at competitive rates, plus complete holidays abroad for travellers leaving Sri Lanka.",
    points: [
      "Bookings on all major international and regional airlines",
      "Competitive fares for individuals and corporate clients",
      "Outbound tours and holidays for Sri Lankans",
      "One team for flights, hotels and transfers",
    ],
    cta: { label: "Get a flight quote", href: "#enquire-flight" },
  },
];

export const serviceFaqs = [
  {
    q: "Can I book just a transfer, car or hotel without a full tour?",
    a: "Yes. You can book any single service, such as an airport pickup, a car with driver, a hotel or a flight ticket, as well as complete tours.",
  },
  {
    q: "Can I hire a car without a driver?",
    a: "Yes. We offer car hire with an experienced driver or without a driver. Tell us your dates and we'll suggest the right vehicle.",
  },
  {
    q: "Can you handle late-night or early-morning flights?",
    a: "Yes. Our team works around the clock, so we can meet you whatever time your flight lands, and get you to the airport for early departures too.",
  },
  {
    q: "Do you work with overseas tour operators?",
    a: "Yes. As an inbound tour operator we provide full ground handling for overseas agents: airport welcome, transfers, hotels, excursions and safaris for FITs and groups.",
  },
  {
    q: "How do I pay?",
    a: "For tours, full payment is made on arrival. For other services we confirm the payment details when we send your quotation.",
  },
];
