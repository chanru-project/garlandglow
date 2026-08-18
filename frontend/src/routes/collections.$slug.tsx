import { createFileRoute, Link } from "@tanstack/react-router";
import { CatalogPage } from "@/components/site/CatalogPage";
import { GARLAND_COLLECTIONS, FLOWER_COLLECTIONS, type Product } from "@/data/products";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.avif";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";
import { fetchAllFlowers, fetchFlowersByCategory } from "@/lib/flower-api";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, MessageSquare, PhoneCall } from "lucide-react";

type EventDetail = {
  slugKey: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  mainImage: string;
  gallery: { name: string; image: string; tag: string }[];
  features: string[];
};

const ALL_EVENTS_LIST = [
  { name: "Puberty Function", slug: "puberty-function", image: g1 },
  { name: "Engagement", slug: "engagement", image: g2 },
  { name: "Birthday", slug: "birthday", image: g3 },
  { name: "Marriage", slug: "marriage", image: g4 },
  { name: "Kathukuthu", slug: "kathukuthu", image: g5 },
  { name: "Reception", slug: "marriage", image: g6 },
];

const EVENT_DETAILS_MAP: Record<string, EventDetail> = {
  "puberty-function": {
    slugKey: "puberty-function",
    name: "Puberty Function",
    title: "Puberty Function (Ritu Kala Samskara) Decor",
    subtitle: "Traditional floral stages, mandapams, pathway decor & garlands",
    description:
      "Make your daughter's milestone grand and unforgettable with traditional fresh flower stage backdrops, grand floral entrance arches, pathimalai, flower swings, and custom garlands.",
    mainImage: g1,
    gallery: [
      { name: "Traditional Floral Stage", image: g1, tag: "Stage Decor" },
      { name: "Grand Entrance Arch", image: g2, tag: "Entrance" },
      { name: "Floral Flower Swing", image: g3, tag: "Special Setup" },
      { name: "Pathway & Mandapam Decor", image: g4, tag: "Pathway" },
    ],
    features: [
      "Custom Flower Stage Backdrop",
      "Fresh Jasmine & Rose Pathimalai",
      "Entrance Floral Arch",
      "Traditional Flower Swing",
      "On-site Florist Setup",
    ],
  },
  engagement: {
    slugKey: "engagement",
    name: "Engagement",
    title: "Engagement Ceremony Floral Decor",
    subtitle: "Elegant ring-exchange stages & romantic floral arrangements",
    description:
      "Celebrate your promise of togetherness with bespoke floral backdrops, ring tray floral styling, grand entrance floral gateways, and premium couple varmalas.",
    mainImage: g2,
    gallery: [
      { name: "Ring Exchange Stage", image: g2, tag: "Stage Decor" },
      { name: "Couple Varmala Display", image: g1, tag: "Garlands" },
      { name: "Floral Entrance Gate", image: g6, tag: "Entrance" },
      { name: "Photo Backdrop Zone", image: g3, tag: "Photo Zone" },
    ],
    features: [
      "Modern & Traditional Stage Backdrops",
      "Premium Couple Varmalas",
      "Ring Tray Floral Decor",
      "Custom Lighting Integration",
    ],
  },
  birthday: {
    slugKey: "birthday",
    name: "Birthday",
    title: "Birthday Celebrations Floral & Event Setup",
    subtitle: "Vibrant floral & balloon fusions, photo walls & party decor",
    description:
      "Transform birthday celebrations into magical moments with colorful fresh flower backdrops, balloon and bloom arches, custom name boards, and elegant table arrangements.",
    mainImage: g3,
    gallery: [
      { name: "Vibrant Party Stage", image: g3, tag: "Stage Decor" },
      { name: "Floral Photo Wall", image: g1, tag: "Photo Zone" },
      { name: "Welcome Floral Board", image: g5, tag: "Welcome Zone" },
      { name: "Table Centerpieces", image: g2, tag: "Table Decor" },
    ],
    features: [
      "Custom Theme Backdrops",
      "Fresh Floral & Balloon Fusion",
      "Welcome Signboard Flowers",
      "Cake Table Floral Styling",
    ],
  },
  marriage: {
    slugKey: "marriage",
    name: "Marriage",
    title: "Marriage & Wedding Mandapam Decor",
    subtitle: "Grand wedding mandapams, muhurtham flowers & reception decor",
    description:
      "Complete wedding floral design service including traditional wedding mandapam decor, grand reception stage backdrops, rose petal carpets, and exquisite bride and groom varmalas.",
    mainImage: g4,
    gallery: [
      { name: "Muhurtham Mandapam", image: g4, tag: "Mandapam" },
      { name: "Reception Floral Stage", image: g6, tag: "Reception" },
      { name: "Floral Pathway Carpet", image: g1, tag: "Pathway" },
      { name: "Bridal Varmala Set", image: g2, tag: "Varmala" },
    ],
    features: [
      "Full Mandapam Fresh Flower Decor",
      "Designer Bridal & Groom Varmalas",
      "Rose Petal Carpet Pathway",
      "Reception Stage Backdrops",
      "Car Decoration",
    ],
  },
  kathukuthu: {
    slugKey: "kathukuthu",
    name: "Kathukuthu",
    title: "Kathukuthu (Ear Piercing) Traditional Decor",
    subtitle: "Auspicious traditional setups, yellow bloom themes & festive garlands",
    description:
      "Celebrate the auspicious ear piercing ceremony with authentic South Indian traditional flower decor, fresh marigold and jasmine arches, traditional seating stages, and blessed garlands.",
    mainImage: g5,
    gallery: [
      { name: "Traditional Seating Stage", image: g5, tag: "Stage Decor" },
      { name: "Yellow Bloom Gateway", image: g3, tag: "Entrance" },
      { name: "Jasmine & Marigold Malas", image: g1, tag: "Garlands" },
      { name: "Auspicious Puja Setup", image: g4, tag: "Puja Decor" },
    ],
    features: [
      "Authentic Traditional Decor",
      "Fresh Marigold & Jasmine Malas",
      "Traditional Flower Swing / Seating",
      "Puja & Ceremony Floral Styling",
    ],
  },
};

type ServiceDetail = {
  title: string;
  description: string;
  image: string;
  categoryType: string;
  features: string[];
};

const SERVICE_DETAILS_MAP: Record<string, ServiceDetail> = {
  // DJ Categories
  "dj-sound-system": {
    title: "DJ Sound System",
    description: "High-clarity concert-grade line array sound systems, bass subwoofers, wireless mics, and professional event DJs.",
    image: g4,
    categoryType: "DJ Service",
    features: ["Concert-Grade Line Array Speakers", "High-Power Subwoofers", "Professional Event DJ", "Wireless Microphones & Mixers"],
  },
  "led-wall": {
    title: "LED Video Wall",
    description: "High-resolution P2.5 indoor and outdoor LED display walls for live video feeds, visuals, and slideshows.",
    image: g6,
    categoryType: "DJ Service",
    features: ["P2.5 High-Resolution Display", "Live Camera Feed Integration", "Custom Video Backgrounds", "Customizable Screen Sizes"],
  },
  "stage-lighting": {
    title: "Stage & Ambient Lighting",
    description: "Intelligent moving head lights, ambient LED uplighting, cob lights, and stage beam effects for events.",
    image: g3,
    categoryType: "DJ Service",
    features: ["Sharpy Moving Head Lights", "LED Par Ambient Uplighting", "DMX Lighting Controller", "Custom Color Themes"],
  },
  "smoke-machine": {
    title: "Smoke & Low Fog Effects",
    description: "Dry ice low fog ground effects for bridal entries and stage smoke machines for dance floors.",
    image: g1,
    categoryType: "DJ Service",
    features: ["Dry Ice Heavy Low Fog", "Stage Smoke Cannon", "Co2 Cold Pyro Effects", "Safe & Odorless Operation"],
  },
  "laser-lights": {
    title: "Laser Lights & Visuals",
    description: "Multi-color 3D laser light shows synchronized to music beats for high-energy party environments.",
    image: g2,
    categoryType: "DJ Service",
    features: ["RGB 3D Beam Lasers", "Music Beat Sync", "Custom Logo Projection", "High-Power Venue Coverage"],
  },
  "live-music": {
    title: "Live Band & Music Performance",
    description: "Live instrumentalists, acoustic bands, traditional chenda melam, and fusion music groups for weddings.",
    image: g5,
    categoryType: "DJ Service",
    features: ["Violin & Flute Instrumentals", "Fusion Live Band", "Chenda Melam & Nadaswaram", "Custom Song Playlist"],
  },
  "dance-floor": {
    title: "Illuminated Dance Floor",
    description: "Glass LED mirror dance floors and custom branded dance platforms for wedding receptions and parties.",
    image: g6,
    categoryType: "DJ Service",
    features: ["LED Infinity Mirror Floor", "Non-Slip Acrylic Surface", "Custom Dimensions", "Interactive Light Patterns"],
  },
  "anchor-service": {
    title: "Professional Emcee & Anchor",
    description: "Engaging Tamil & English event hosts, emcees, and anchors to keep your guests entertained throughout the event.",
    image: g2,
    categoryType: "DJ Service",
    features: ["Experienced Tamil/English Anchors", "Crowd Engagement & Games", "Event Timeline Management", "Interactive Stage Hosting"],
  },

  // Catering Categories
  "south-indian-veg": {
    title: "South Indian Traditional Veg Catering",
    description: "Authentic banana leaf feast with traditional varieties, sambar, rasam, payasam, and fresh hot savories.",
    image: g5,
    categoryType: "Catering Service",
    features: ["Authentic Banana Leaf Service", "30+ Traditional Menu Items", "Special Elai Payasam & Sweets", "Hygienic Uniformed Servers"],
  },
  "south-indian-non-veg": {
    title: "South Indian Non-Veg Feast",
    description: "Signature Chettinad biryani, mutton Chukka, chicken 65, fish fry, and rich non-veg gravy items.",
    image: g4,
    categoryType: "Catering Service",
    features: ["Seeraga Samba Mutton Biryani", "Chettinad Spicy Gravies", "Live Tawa Fish Fry", "Traditional Recipe Masters"],
  },
  "north-indian": {
    title: "North Indian Delicacies",
    description: "Rich paneer butter masala, butter naans, dal makhani, jeera rice, and authentic North Indian specialties.",
    image: g3,
    categoryType: "Catering Service",
    features: ["Live Tandoor Naan & Roti", "Rich Shahi Gravies", "Jeera & Pulao Varieties", "North Indian Master Chefs"],
  },
  chinese: {
    title: "Indo-Chinese Fusion",
    description: "Live wok fried rice, Hakka noodles, Gobi Manchurian, Schezwan chili chicken, and starter counters.",
    image: g2,
    categoryType: "Catering Service",
    features: ["Live Wok Tossed Noodles", "Crispy Manchurian & Starters", "Custom Spice Level", "Interactive Live Counter"],
  },
  "live-counters": {
    title: "Live Food Counters",
    description: "Live Dosa counter, Chaat counter, Appam & Stew, Pasta station, and sizzler counters.",
    image: g1,
    categoryType: "Catering Service",
    features: ["Live Hot Dosa Variations", "Delhi Style Chaat Stall", "Live Pasta & Sauce Bar", "Appam & Stew Station"],
  },
  "wedding-catering": {
    title: "Grand Wedding Catering Package",
    description: "Complete breakfast, lunch, and dinner catering for multi-day wedding celebrations with buffet and elai service.",
    image: g6,
    categoryType: "Catering Service",
    features: ["Multi-Day Meal Management", "Traditional Elai & Buffet Style", "Welcome Drinks & Snack Stalls", "Dessert & Ice Cream Bar"],
  },
  "birthday-catering": {
    title: "Birthday Party Catering",
    description: "Kid-friendly menus, mini burgers, nuggets, pasta, colorful mocktails, and sweet treats.",
    image: g3,
    categoryType: "Catering Service",
    features: ["Kid-Friendly Tasty Menu", "Finger Foods & Starters", "Live Ice Cream & Popcorn", "Customized Menu Combos"],
  },
  "corporate-catering": {
    title: "Corporate Event Catering",
    description: "Executive box lunches, high-tea snacks, lavish buffet spreads, and corporate dining solutions.",
    image: g2,
    categoryType: "Catering Service",
    features: ["Professional Buffet Setup", "Punctual Delivery & Service", "Packed Executive Boxes", "Corporate High-Tea Menu"],
  },
  "juice-counter": {
    title: "Fresh Juice & Mocktail Counter",
    description: "Freshly squeezed seasonal fruit juices, tender coconut blends, and chilled party mocktails.",
    image: g1,
    categoryType: "Catering Service",
    features: ["100% Fresh Squeezed Juices", "Custom Party Mocktails", "Chilled Fruit Shakes", "Hygienic Glassware"],
  },
  "sweet-stall": {
    title: "Live Sweet & Dessert Stall",
    description: "Hot gulab jamun, live jalebi, traditional halwa varieties, ice cream rolls, and kulfi counters.",
    image: g5,
    categoryType: "Catering Service",
    features: ["Live Hot Jalebi & Rabri", "Traditional Tirunelveli Halwa", "Assorted Ice Cream Flavors", "Kulfi & Falooda Counter"],
  },

  // Gift Categories
  "flower-bouquets": {
    title: "Fresh Flower Bouquets",
    description: "Hand-tied premium red rose, lily, orchid, and mixed bloom bouquets wrapped in designer paper.",
    image: g1,
    categoryType: "Gifting Service",
    features: ["Fresh Farm Roses & Lilies", "Designer Wrapping Paper", "Personalized Message Card", "Same-Day Delivery"],
  },
  "chocolate-bouquet": {
    title: "Chocolate Bouquets",
    description: "Artisanal Ferrero Rocher, Dairy Milk, and imported chocolate bouquets blended with fresh roses.",
    image: g2,
    categoryType: "Gifting Service",
    features: ["Premium Imported Chocolates", "Rose & Chocolate Fusion", "Decorative Ribbon Bows", "Custom Chocolate Count"],
  },
  "teddy-gifts": {
    title: "Teddy Bear Combo Gifts",
    description: "Adorable plush teddy bears paired with fresh roses, chocolate boxes, and love hampers.",
    image: g3,
    categoryType: "Gifting Service",
    features: ["Soft Plush Premium Teddies", "Red Rose Bouquet Pair", "Custom Gift Box Packaging", "Sweet Greeting Note"],
  },
  "gift-hampers": {
    title: "Luxury Celebration Gift Hampers",
    description: "Curated gift baskets with dry fruits, gourmet chocolates, scented candles, and fresh flowers.",
    image: g6,
    categoryType: "Gifting Service",
    features: ["Gourmet Chocolates & Dry Fruits", "Scented Candle & Fragrance", "Wooden Basket Packaging", "Custom Ribbon Styling"],
  },
  "customized-gifts": {
    title: "Customized Keepsake Gifts",
    description: "Personalized engraved items, custom printed mugs, cushions, and customized photo gifts.",
    image: g4,
    categoryType: "Gifting Service",
    features: ["Name & Photo Customization", "High-Quality Keepsake Materials", "Gift Wrap Included", "Preview Before Dispatch"],
  },
  "photo-frames": {
    title: "Custom Photo Frames",
    description: "Elegant wooden, collage, and acrylic photo frames tailored for anniversary and birthday gifts.",
    image: g5,
    categoryType: "Gifting Service",
    features: ["Premium Synthetic Wooden Frame", "High-Definition Photo Printing", "Collage & Canvas Layouts", "Wall & Desk Mountable"],
  },
  "greeting-cards": {
    title: "Personalized Greeting Cards",
    description: "Handcrafted pop-up cards, wedding wishes, birthday notes, and gold-foil message cards.",
    image: g1,
    categoryType: "Gifting Service",
    features: ["Handcrafted Pop-Up Designs", "Gold Foil Lettering", "Custom Written Message", "Matching Envelope"],
  },
  "indoor-plants": {
    title: "Green Indoor & Desk Plants",
    description: "Lucky bamboo, money plants, peace lilies, and succulents in ceramic pots for eco-friendly gifting.",
    image: g2,
    categoryType: "Gifting Service",
    features: ["Air-Purifying Live Plants", "Decorative Ceramic Pots", "Low Maintenance", "Eco-Friendly Gift Packaging"],
  },
  "wedding-return-gifts": {
    title: "Wedding & Festival Return Gifts",
    description: "Bulk return gift hampers, jute bags, brass diyas, and traditional floral gift boxes for guests.",
    image: g4,
    categoryType: "Gifting Service",
    features: ["Bulk Quantity Discounts", "Traditional Brass & Jute Items", "Custom Name Tag Branding", "Hygienic Individual Packing"],
  },
};

export const Route = createFileRoute("/collections/$slug")({
  head: ({ params }) => {
    const name = decodeName(params.slug);
    return {
      meta: [
        { title: `${name} — DUVIX Collections` },
        { name: "description", content: `Explore ${name} collections and services.` },
      ],
    };
  },
  component: CollectionDetail,
});

function decodeName(slug?: string) {
  const safeSlug = String(slug || "").toLowerCase();
  if (safeSlug === "rose") return "Rose";
  const all = [...FLOWER_COLLECTIONS, ...GARLAND_COLLECTIONS];
  const match = all.find((c) => String(c || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") === safeSlug);
  if (match) return match;

  if (safeSlug === "events" || safeSlug === "wedding" || safeSlug === "event") {
    return "Events";
  }

  const eventMatch = EVENT_DETAILS_MAP[safeSlug];
  if (eventMatch) return eventMatch.name;

  const serviceMatch = SERVICE_DETAILS_MAP[safeSlug];
  if (serviceMatch) return serviceMatch.title;

  return safeSlug.split("-").map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : "")).join(" ");
}

function toCategoryParam(value?: string) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normalizeCollectionValue(value?: string) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function openWhatsappInquiry(serviceName: string) {
  const ownerNumber = "919342886507";
  const msg = `Hello, I would like to inquire/book the following service:\nService: ${serviceName}\nPlease share packages and availability details.`;
  const url = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function CollectionDetail() {
  const { slug } = Route.useParams();
  const safeSlug = String(slug || "").toLowerCase();
  const name = decodeName(slug);

  const isMainEventsPage = safeSlug === "events" || safeSlug === "wedding" || safeSlug === "event";
  const eventDetail = EVENT_DETAILS_MAP[safeSlug];
  const serviceDetail = SERVICE_DETAILS_MAP[safeSlug];

  const isEventsCollection = isMainEventsPage || Boolean(eventDetail);
  const isServiceCollection = Boolean(serviceDetail);
  const isFlowerCollection =
    !isEventsCollection &&
    !isServiceCollection &&
    FLOWER_COLLECTIONS.some(
      (collection) => normalizeCollectionValue(collection) === normalizeCollectionValue(name),
    );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!isEventsCollection && !isServiceCollection);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEventsCollection || isServiceCollection) return;

    let isMounted = true;

    const loadCollection = async () => {
      setLoading(true);
      setError(null);

      try {
        const requestedCategory = toCategoryParam(slug);
        const byCategory = await fetchFlowersByCategory(requestedCategory);
        if (!isMounted) return;

        if (byCategory.length > 0) {
          setProducts(byCategory);
          return;
        }

        const allProducts = await fetchAllFlowers();
        if (!isMounted) return;

        const matchingProducts = allProducts.filter((item) => {
          const itemCollection = normalizeCollectionValue(item.collection);
          const itemCategory = normalizeCollectionValue(item.sourceCategory);
          const itemSlug = normalizeCollectionValue(item.slug);
          return (
            itemCollection === normalizeCollectionValue(name) ||
            itemCollection === requestedCategory ||
            itemCategory === requestedCategory ||
            itemSlug.includes(requestedCategory)
          );
        });

        setProducts(matchingProducts);
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load collection.");
        setProducts([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCollection();

    return () => {
      isMounted = false;
    };
  }, [isEventsCollection, isServiceCollection, name, slug]);

  if (isMainEventsPage) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/collections"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-accent hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Collections
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Curated Events
          </span>
        </div>

        <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl">Events & Occasions</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Explore puberty function, engagement, birthday, marriage, kathukuthu, and reception looks.
        </p>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_EVENTS_LIST.map((item) => (
            <Link
              key={item.name}
              to="/collections/$slug"
              params={{ slug: item.slug }}
              className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="font-display text-xl">{item.name}</div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
              </div>
            </Link>
          ))}
        </section>
      </div>
    );
  }

  if (eventDetail) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/collections"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-accent hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Collections
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Event Services
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {eventDetail.title}
            </h1>
            <p className="mt-3 text-lg font-medium text-accent">{eventDetail.subtitle}</p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {eventDetail.description}
            </p>

            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground">
                What We Provide
              </h3>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {eventDetail.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-foreground/90">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => openWhatsappInquiry(eventDetail.title)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.02]"
              >
                <MessageSquare className="h-4 w-4" /> Book Event on WhatsApp
              </button>
              <a
                href="tel:9342886507"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
              >
                <PhoneCall className="h-4 w-4" /> Call Florist Direct
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
              <img
                src={eventDetail.mainImage}
                alt={eventDetail.title}
                className="h-[340px] w-full object-cover sm:h-[420px]"
              />
            </div>
          </div>
        </div>

        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-accent">Decor Showcase</div>
              <h2 className="mt-1 font-display text-3xl md:text-4xl">
                {eventDetail.name} Setup Gallery
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {eventDetail.gallery.map((item, idx) => (
              <article
                key={idx}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
                    {item.tag}
                  </span>
                  <div className="mt-2 font-display text-lg">{item.name}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-border pt-12">
          <div className="text-xs uppercase tracking-[0.3em] text-accent">Explore More</div>
          <h3 className="mt-1 font-display text-2xl md:text-3xl">Other Event Categories</h3>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_EVENTS_LIST.filter((item) => item.slug !== safeSlug).map((item) => (
              <Link
                key={item.name}
                to="/collections/$slug"
                params={{ slug: item.slug }}
                className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="font-display text-xl">{item.name}</div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (serviceDetail) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/collections"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-accent hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Collections
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" /> {serviceDetail.categoryType}
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {serviceDetail.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {serviceDetail.description}
            </p>

            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground">
                Highlights & Features
              </h3>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {serviceDetail.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-foreground/90">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => openWhatsappInquiry(serviceDetail.title)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.02]"
              >
                <MessageSquare className="h-4 w-4" /> Inquire on WhatsApp
              </button>
              <a
                href="tel:9342886507"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
              >
                <PhoneCall className="h-4 w-4" /> Call Direct
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-secondary/50 p-6 shadow-elegant">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{serviceDetail.categoryType}</div>
                  <div className="font-display text-xl font-semibold text-foreground">{serviceDetail.title}</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Customized packages, transparent pricing, and professional execution tailored to your venue and event needs.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => openWhatsappInquiry(serviceDetail.title)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
                >
                  <MessageSquare className="h-4 w-4" /> Inquire via WhatsApp
                </button>
                <a
                  href="tel:8637686493"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
                >
                  <PhoneCall className="h-4 w-4" /> Call +91 8637686493
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CatalogPage
      title={name}
      eyebrow="Curated  & Occasions"
      products={products}
      collections={isFlowerCollection ? FLOWER_COLLECTIONS : GARLAND_COLLECTIONS}
      activeCollection={products.some((item) => item.collection === name) ? name : undefined}
      loading={loading}
      error={error}
    />
  );
}
