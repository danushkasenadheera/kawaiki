// SEO landing pages for the client's priority themes: Wildlife, then Gems, then Golf.
// Facts about tours come from the itineraries; general facts are kept cautious.

export type LandingCard = { title: string; text: string; note?: string; image?: { src: string; alt: string } };

export type LandingPageContent = {
  slug: string;
  category: "Wildlife" | "Gems" | "Golf";
  seoTitle: string;
  seoDescription: string;
  h1: string;
  eyebrow: string;
  lead: string;
  hero: { src: string; alt: string };
  intro: string[];
  cardsTitle: string;
  cards: LandingCard[];
  extraTitle?: string;
  extra?: string[];
  gallery?: { src: string; alt: string }[];
  faqs: { q: string; a: string }[];
  whatsapp: string;
};

export const wildlifeLanding: LandingPageContent = {
  slug: "sri-lanka-wildlife-tours",
  category: "Wildlife",
  seoTitle: "Sri Lanka Wildlife Tours & Leopard Safaris | Kawaiki",
  seoDescription:
    "Sri Lanka wildlife tours with a local team: leopard safaris in Yala and Wilpattu, wild elephants, sloth bears and birding. Tailor-made, from 4 days.",
  h1: "Sri Lanka Wildlife Tours & Safaris",
  eyebrow: "Leopards · Elephants · Sloth bears · Birds",
  lead: "Few places pack so much wildlife into such a small island. We plan safaris around the right parks, the right season and the best light.",
  hero: { src: "/images/wild-yala-leopard-tree.jpg", alt: "Leopard resting along a tree branch in Yala National Park" },
  intro: [
    "Sri Lanka is one of the best places in Asia to see leopards in the wild, and one of the most reliable for wild elephants. Add sloth bears, crocodiles, and a remarkable variety of resident and migratory birds, and a few days of safaris can be the highlight of any trip.",
    "The parks are close together, so a wildlife tour combines easily with Sigiriya, Kandy, tea country and the beaches. Because each park has its own season, we pick your parks around your travel dates, and we know the quieter alternatives when the famous ones get busy.",
  ],
  cardsTitle: "Where to go on safari",
  cards: [
    {
      title: "Yala National Park",
      text: "Sri Lanka's most visited park and its best-known place to see leopards, along with elephants, sloth bears, crocodiles and coastal birdlife.",
      note: "Usually best February–July. Parts of the park can close for a few weeks around September–October.",
      image: { src: "/images/wild-yala-leopard-tree.jpg", alt: "Leopard in a tree in Yala" },
    },
    {
      title: "Wilpattu National Park",
      text: "The island's largest national park, in the north-west, with natural lakes called villus. Leopards and sloth bears, with far fewer jeeps than Yala.",
      note: "Good for most of the year, especially February–October.",
      image: { src: "/images/wild-sloth-bear.jpg", alt: "Sloth bear on a safari track" },
    },
    {
      title: "Kumana National Park",
      text: "Yala's quieter eastern neighbour, known for wetlands, water birds and leopards. Ideal if you want wildlife without the crowds.",
      note: "Best in the east-coast dry season, roughly May–September.",
      image: { src: "/images/wild-kumana-leopard.jpg", alt: "Female leopard in Kumana" },
    },
    {
      title: "Udawalawe & Minneriya",
      text: "Udawalawe is one of the most reliable places to see wild elephants all year. Minneriya is famous for “The Gathering”, when large herds meet at the reservoir.",
      note: "Udawalawe year-round; Minneriya's gathering usually peaks around August–September.",
      image: { src: "/images/wild-tusker.jpg", alt: "Wild tusker elephant" },
    },
    {
      title: "Bundala & birding",
      text: "Bundala, near Yala, is a Ramsar-listed wetland rich in water birds. Rainforest birding adds endemic species found nowhere else.",
      note: "Migratory birds are usually present around October–March.",
      image: { src: "/images/wild-bee-eaters.jpg", alt: "Chestnut-headed bee-eaters" },
    },
  ],
  extraTitle: "Wildlife photography tours",
  extra: [
    "For photographers we plan safaris around light and timing: early-morning and late-afternoon drives, the right parks for the species you want, and enough time in each place to be patient.",
    "We offer wildlife photography tours with professional guidance for every level, from your first long lens to serious portfolios. The photos on this page are real Sri Lankan wildlife, taken in Yala and Kumana.",
  ],
  faqs: [
    {
      q: "When is the best time for a wildlife safari in Sri Lanka?",
      a: "It depends on the park. Yala and the south are usually best from February to July, Minneriya's elephant gathering peaks around August–September, and Wilpattu is good for most of the year. Tell us your dates and we'll choose the right parks.",
    },
    {
      q: "Will I see a leopard?",
      a: "Sightings of wild animals are never guaranteed, but Yala and Wilpattu give excellent chances, especially on early-morning and late-afternoon drives with an experienced guide.",
    },
    {
      q: "How many days do I need for a wildlife tour?",
      a: "Even 4–5 days can include two parks. A 7–10 day trip lets you combine safaris with Kandy, tea country and the beach.",
    },
    {
      q: "Are safaris in private jeeps?",
      a: "Yes. Safaris are arranged in private safari jeeps, so you set the pace and can stay longer at a sighting.",
    },
    {
      q: "Do you arrange photography-focused safaris?",
      a: "Yes. We offer wildlife photography tours with professional guidance, planned around light, timing and the best parks for your target species.",
    },
  ],
  whatsapp: "Hello Kawaiki, I'm interested in a wildlife safari tour in Sri Lanka.",
};

export const gemLanding: LandingPageContent = {
  slug: "sri-lanka-gem-mining-tours",
  category: "Gems",
  seoTitle: "Sri Lanka Gem Mining Tours in Ratnapura | Kawaiki",
  seoDescription:
    "Visit working gem pits in Ratnapura, Sri Lanka's City of Gems. See traditional mining, washing and cutting, and buy gems at the source. Tailor-made.",
  h1: "Sri Lanka Gem Mining Tours",
  eyebrow: "Ratnapura · The City of Gems",
  lead: "Go behind the scenes of one of the world's oldest gem traditions and watch precious stones come out of the earth.",
  hero: { src: "/images/2025-06-gem-1024.jpg", alt: "Gem miner holding gemstones in a woven basket" },
  intro: [
    "Sri Lanka has been famous for its gems for centuries, above all for its sapphires, along with cat's eye, alexandrite, garnet, moonstone and many more. Most of them come from the gem-rich gravels around Ratnapura, whose name means “City of Gems”, about three hours from Colombo.",
    "Mining here is still largely done by hand, using methods passed down through generations. On a Kawaiki gem tour you visit working pits, follow the gravel from the shaft to the washing basket, and see how experts sort, evaluate and cut the stones.",
    "The drive from Colombo winds past tea and rubber plantations into green, river-cut countryside. Days are spread out so you see different stages of the work: surface pits on arrival, a full day at working mines, and later a visit to where the gravel is washed and the stones are graded.",
  ],
  cardsTitle: "From the pit to the polished stone",
  cards: [
    {
      title: "1. The gem pits",
      text: "See traditional pit mining up close: vertical shafts, timber reinforcement and water pumping, as miners bring up the gem-bearing gravel.",
      image: { src: "/images/2026-02-gem.jpg", alt: "Gemstones from a Ratnapura gem pit" },
    },
    {
      title: "2. Washing the gravel",
      text: "Watch miners wash and swirl the gravel in woven baskets, and learn how they spot valuable stones among the pebbles.",
      image: { src: "/images/2025-06-gem-wash.webp", alt: "Guest inspecting gemstones during gem washing" },
    },
    {
      title: "3. Sorting & evaluation",
      text: "See how gems are identified and judged by colour, transparency and structure, and what makes one stone worth far more than another.",
    },
    {
      title: "4. Cutting & polishing",
      text: "Visit a local workshop to see how raw stones are cut, shaped and polished into finished gems.",
      image: { src: "/images/2026-02-gem-cutting.jpg", alt: "Gem cutting in a local workshop" },
    },
  ],
  extraTitle: "Buying gems at the source",
  extra: [
    "A gem tour is a chance to buy authentic, ethically sourced stones directly where they are mined. There's never any obligation to buy.",
    "If you do, buy from licensed dealers and ask for a certificate. Sri Lanka's National Gem and Jewellery Authority offers gem testing, which gives extra peace of mind for more valuable purchases.",
    "Gem tours combine naturally with a Yala safari, Galle's Dutch Fort and beach time in Bentota, as in our 10-day sample itinerary.",
  ],
  faqs: [
    {
      q: "Where is gem mining done in Sri Lanka?",
      a: "Mainly around Ratnapura, Sri Lanka's “City of Gems”, about 100 km and roughly three hours from Colombo.",
    },
    {
      q: "Can I buy gems on the tour?",
      a: "Yes, you can buy authentic gems at the source if you wish, with no obligation. Buy from licensed dealers and ask for a certificate; the National Gem and Jewellery Authority offers gem testing.",
    },
    {
      q: "How long is a gem mining tour?",
      a: "Our sample gem tour is 10 days and includes a Yala safari and beach time. Shorter, gem-focused trips can be tailor-made around your dates.",
    },
    {
      q: "Can a gem tour be combined with wildlife?",
      a: "Yes. Yala National Park is within easy reach of Ratnapura, so a gem tour pairs well with leopard and elephant safaris.",
    },
  ],
  whatsapp: "Hello Kawaiki, I'm interested in a gem mining tour in Ratnapura.",
};

export const golfLanding: LandingPageContent = {
  slug: "sri-lanka-golf-tours",
  category: "Golf",
  seoTitle: "Sri Lanka Golf Tours & Golf Holidays | Kawaiki",
  seoDescription:
    "Sri Lanka golf holidays at Royal Colombo, Victoria Golf & Country Resort and Nuwara Eliya Golf Club, with Kandy and tea country. Tailor-made tours.",
  h1: "Sri Lanka Golf Tours",
  eyebrow: "Historic courses · Hill country · Tea estates",
  lead: "Play some of Asia's oldest and most scenic courses, from colonial Colombo to the cool, misty hill country.",
  hero: { src: "/images/2025-06-Golf.webp", alt: "Golfer teeing off on a hill-country course in Sri Lanka" },
  intro: [
    "Sri Lanka is a quietly special golf destination. Courses with more than a century of history sit alongside some of the island's best scenery, and a golf holiday here is as much about the journey between them as the rounds themselves.",
    "We arrange tee times, transfers and hotels close to each course, so you can play, explore and relax without the logistics. Non-golfing partners have plenty to do on golf days too.",
    "The route climbs from the warm coast to Kandy and on to Nuwara Eliya, nearly 1,900 metres above sea level, where mornings are fresh even when the lowlands are hot. December to April is generally the driest time in the hill country and on the west coast, but golf is possible year-round with a little flexibility for showers.",
  ],
  cardsTitle: "The courses",
  cards: [
    {
      title: "Royal Colombo Golf Club",
      text: "The oldest golf club in Sri Lanka, an easy drive from Colombo and Negombo. A round here pairs well with a short Colombo city tour.",
      image: { src: "/images/2025-06-brian-kungu-aP25OoSdltI-unsplash-1-scaled.jpg", alt: "Golfer on a lush course" },
    },
    {
      title: "Victoria Golf & Country Resort",
      text: "In the hills near Kandy, a scenic and challenging course, close to the Temple of the Tooth and the Royal Botanical Gardens.",
      image: { src: "/images/2025-06-rene-vincent-torralba-HueEXJwZFOM-unsplash-scaled.jpg", alt: "Green fairways surrounded by trees" },
    },
    {
      title: "Nuwara Eliya Golf Club",
      text: "High in the cool hill country, one of Asia's oldest and most picturesque courses, in the colonial town known as “Little England”.",
      image: { src: "/images/2025-06-steven-shircliff-N21z4eG8aKg-unsplash-scaled.jpg", alt: "Golf ball near the hole on a green" },
    },
  ],
  extraTitle: "More than golf",
  extra: [
    "Between rounds, visit Kandy's Temple of the Tooth, the Royal Botanical Gardens in Peradeniya, a working tea factory and Gregory Lake in Nuwara Eliya.",
    "Non-golfers can enjoy spa sessions, nature walks, sightseeing and cultural shows, and a golf trip can easily be extended with a safari or beach stay.",
  ],
  faqs: [
    {
      q: "Which golf courses can I play in Sri Lanka?",
      a: "Our golf tour includes Royal Colombo Golf Club, Victoria Golf & Country Resort near Kandy, and Nuwara Eliya Golf Club in the hill country.",
    },
    {
      q: "Are golf fees included?",
      a: "Yes. Golf fees are included in our golf tour package, along with accommodation, transport and a chauffeur-guide. See the tour page for full details.",
    },
    {
      q: "Can non-golfers come along?",
      a: "Absolutely. On golf days we can arrange alternatives such as Peradeniya Botanical Gardens, spa sessions, nature walks and sightseeing.",
    },
    {
      q: "Can the golf tour be customised?",
      a: "Yes. Add extra rounds, change hotels, shorten or extend the trip, or combine golf with a wildlife safari or beach stay.",
    },
  ],
  whatsapp: "Hello Kawaiki, I'm interested in a golf tour in Sri Lanka.",
};

export const landingPages = [wildlifeLanding, gemLanding, golfLanding];
