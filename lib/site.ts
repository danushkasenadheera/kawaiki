export const site = {
  name: "Kawaiki Tours & Travels",
  legalName: "Kawaiki Tours and Travels (Pvt) Ltd.",
  url: "https://kawaiki.com",
  phone: "+94706667067",
  phoneDisplay: "+94 70 666 7067",
  whatsapp: "https://wa.me/94706667067",
  email: "info@kawaiki.com",
  address:
    "58/21, 3rd Lane, Soma Thalagala Mw, Gangodawila, Nugegoda, Sri Lanka 10250",
  instagram: "https://www.instagram.com/kawaiki.tt/",
  facebook: "https://web.facebook.com/profile.php?id=61581410950538",
  hours: "Mon-Fri: 8.00 AM-10.30PM Sat: 8.00AM-6.00PM",
  description:
    "Kawaiki Tours & Travels is a Sri Lanka Tourist Board approved travel agency offering tailor-made tours, flight bookings, hotel reservations, airport handling and guided excursions across Sri Lanka.",
  footerBlurb:
    "Kawaiki Tours & Travels is a leading Sri Lankan travel agency offering flight bookings, hotel reservations, airport handling, and guided tours. Serving both local and international travelers, our expert team is available 24/7 to provide reliable, personalized service for unforgettable journeys in Sri Lanka and around the world.",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services" },
  { href: "/packages/", label: "Packages" },
  { href: "/about-us/", label: "About Us" },
  { href: "/contact/", label: "Contact Us" },
];

export type ServiceIcon =
  | "hotel"
  | "globe"
  | "route"
  | "car"
  | "binoculars"
  | "ticket"
  | "camera";

export type Service = { icon: ServiceIcon; title: string; text: string };

/** Services as shown on the home page. */
export const homeServices: Service[] = [
  {
    icon: "hotel",
    title: "Hotel Reservations",
    text: "Booking the best hotels to suit your budget and preferences, ensuring a comfortable stay.",
  },
  {
    icon: "globe",
    title: "Inbound & Outbound Tours",
    text: "Tailored tour packages for travelers visiting Sri Lanka and those exploring destinations abroad.",
  },
  {
    icon: "route",
    title: "Airport Transfers",
    text: "Reliable airport pickup and drop-off services for a smooth start and end to your journey.",
  },
  {
    icon: "car",
    title: "Car Rentals",
    text: "Flexible car rental options with experience drivers or without a driver for your convenience.",
  },
  {
    icon: "binoculars",
    title: "Local Tours & Safari Arrangements",
    text: "Experience the wild side of Sri Lanka with our expertly curated local tours and unforgettable safari adventures.",
  },
  {
    icon: "ticket",
    title: "Ticketing",
    text: "Hassle-free domestic and international flight ticket bookings at competitive rates.",
  },
  {
    icon: "camera",
    title: "Wildlife Photography",
    text: "Capture Sri Lanka’s stunning wildlife with our expertly guided photography tours, tailored for enthusiasts and professionals.",
  },
];

/** Services as shown on the Services page. */
export const services: Service[] = [
  {
    icon: "hotel",
    title: "Hotel Reservations",
    text: "Booking the best hotels to suit your budget and preferences, ensuring a comfortable stay.",
  },
  {
    icon: "globe",
    title: "Organizing Inbound & Outbound Tours",
    text: "Tailored tour packages for travelers visiting Sri Lanka and those exploring destinations abroad.",
  },
  {
    icon: "route",
    title: "Airport Transfers",
    text: "Reliable airport pickup and drop-off services for a smooth start and end to your journey.",
  },
  {
    icon: "car",
    title: "Car Rentals",
    text: "Flexible car rental options with or without a driver for your convenience.",
  },
  {
    icon: "binoculars",
    title: "Local Tours & Safari Arrangements",
    text: "Explore Sri Lanka’s cultural sites and wildlife with guided local tours and safari experiences.",
  },
  {
    icon: "ticket",
    title: "Ticketing",
    text: "Hassle-free domestic and international flight ticket bookings at competitive rates.",
  },
];

export type Img = { src: string; alt: string };

const img = (file: string, alt: string): Img => ({
  src: `/images/${file}`,
  alt,
});

export const images = {
  logo: img(
    "2025-06-kawaiki-logo-500.png",
    "Kawaiki Tours & Travels logo",
  ),
  homeHero: img("sigiriya-sunrise-hero.jpg", "Misty sunrise over Sigiriya and Pidurangala rocks, Sri Lanka"),
  pageBanner: img("sigiriya-sunrise-hero.jpg", "Misty sunrise over Sigiriya and Pidurangala rocks, Sri Lanka"),
  contactBg: img("2023-06-home-bg2.jpg", "Vintage telephone"),
  safariBanner: img("2025-06-DSC0708-scaled.jpg", "Wildlife safari in Sri Lanka"),
  golfBanner: img("2025-06-Golf.webp", "Golf course in Sri Lanka"),
  gemBanner: img(
    "2025-06-gem-1024.jpg",
    "Sri Lankan gem miner washing and inspecting gemstones at a traditional mine",
  ),
  aboutTea: img(
    "2025-06-sidath-vimukthi-UFWx3Av0mH8-unsplash.webp",
    "Woman walking through lush green tea plantations in Sri Lanka",
  ),
  aboutHero: img(
    "2025-06-lucija-ros-VC7P8p6dFIc-unsplash-scaled.jpg",
    "Girl standing in a tea plantation looking up at the Nine Arch Bridge in Sri Lanka",
  ),
};

export const experienceSlides: Img[] = [
  img(
    "2025-06-thiwanka-by-hendrik-cornelissen.webp",
    "Sunrise behind Thiwanka Pilimage at Polonnaruwa Ancient City, Sri Lanka",
  ),
  img(
    "2025-06-lotus-tower-by-tharoushan-kandarajah.webp",
    "Lotus Tower rising above Colombo city buildings",
  ),
  img(
    "2025-06-ella-rock-by-kapila-jayawardana.webp",
    "Dawn breaking over Ella Rock with scenic mountains in the background, Sri Lanka",
  ),
  img(
    "2025-06-tharindu-madhusanka-ctiCt1_M8dY-unsplash-scaled.jpg",
    "Woman enjoying a scenic waterfall surrounded by lush greenery in Sri Lanka",
  ),
];

export const homeGallery: (Img & { label: string })[] = [
  {
    ...img(
      "2025-06-thushal-madhushankha-sigiriya-unsplash.webp",
      "Woman admiring Sigiriya Rock from Pidurangala Rock viewpoint in Sri Lanka",
    ),
    label: "Cultural Heritages",
  },
  {
    ...img(
      "2025-06-romantic-1024.jpg",
      "Romantic couple walking on a Sri Lankan beach drinking fresh king coconuts",
    ),
    label: "Romantic Getaway",
  },
  {
    ...img(
      "2025-06-Golf.webp",
      "Guest playing golf on a lush course during a Kawaiki golf tour in Sri Lanka",
    ),
    label: "Play",
  },
  {
    ...img(
      "2025-06-iStock-862152836-scaled.jpg",
      "Tea plantation workers plucking leaves with lush green mountains in the background",
    ),
    label: "Lifestyle",
  },
  {
    ...img(
      "2025-06-amal-prasad-sri-lanka-beach-unsplash.webp",
      "Aerial view of beautiful sea, sandy beach, and palm trees in Sri Lanka",
    ),
    label: "Pristine Beaches",
  },
  {
    ...img(
      "2025-06-leopard-kumana-thamara.webp",
      "Leopard resting on a tree branch during a wildlife expedition in Sri Lanka",
    ),
    label: "Elusive Wildlife",
  },
];

export const memories: Img[] = [
  img("2025-06-tea.webp", "Girl smelling freshly plucked tea leaves at a Sri Lankan tea estate"),
  img("2025-06-thambili.webp", "Two Kawaiki guests enjoying fresh king coconuts in Sri Lanka"),
  img("2025-06-filipp-nekhaev-unsplash.jpg", "Girl carrying a surfboard on a sunny beach in Sri Lanka"),
  img("2025-06-still-fishing.webp", "Traditional stilt fishing in Southern Sri Lanka"),
  img("2025-06-gem-wash.webp", "Kawaiki guest washing and inspecting gemstones during a gem tour"),
];

export const aboutSlides: Img[] = [
  experienceSlides[2],
  experienceSlides[1],
  experienceSlides[0],
];

export const aboutGallery: Img[] = [
  img("2025-06-amal-prasad-sri-lanka-beach-unsplash.webp", "Aerial view of beach and palm trees in Sri Lanka"),
  img("2025-06-leopard-kumana-thamara.webp", "Leopard resting on a tree branch in Sri Lanka"),
  img("2025-06-thushal-madhushankha-sigiriya-unsplash.webp", "Sigiriya Rock from Pidurangala viewpoint"),
  img("2025-06-Minneriya-elephant.jpg", "Elephants in Minneriya National Park, Sri Lanka"),
  img("2025-06-gem-1024.jpg", "Gem miner inspecting gemstones at a traditional mine"),
  img("2025-06-romantic-1024.jpg", "Couple walking on a Sri Lankan beach with king coconuts"),
  img("2025-06-dambulla-1024.jpg", "Buddha statues inside Dambulla Cave Temple"),
  img("2025-06-stil-fishing-1024.jpg", "Stilt fishing, Sri Lanka"),
];

export const gemTourHighlights = [
  { title: "Gem Mining", text: "Witness the traditional gem mining process" },
  { title: "Gem Selection", text: "Gain unique insight into the gem washing and selection" },
  { title: "Gem Cutting", text: "Visit a local workshop to observe how raw stones are cut, shaped, and polished" },
  { title: "Gem Purchase", text: "Opportunity to purchase authentic, ethically sourced gems directly at their origin" },
];
