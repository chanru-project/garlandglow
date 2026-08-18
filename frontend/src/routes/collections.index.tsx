import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Flower2,
  Gift,
  Music2,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { IMAGES } from "@/data/products";
import { resolveApiUrl } from "@/lib/flower-api";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.avif";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — Services & Categories | DUVIX" },
      {
        name: "description",
        content:
          "Explore premium collections for garlands, flowers, events, DJ, catering and gifts.",
      },
    ],
  }),
  component: CollectionsIndex,
});

function slug(s?: string) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type ServiceKey = "garlands" | "flowers" | "events" | "dj" | "catering" | "gifts";

type ServiceCard = {
  key: ServiceKey;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
};

type CategoryItem = {
  name: string;
  to: "/custom" | "/collections/$slug" | "/flowers";
  slug?: string;
};

const SERVICE_CARDS: ServiceCard[] = [
  {
    key: "garlands",
    title: "Garlands",
    description: "Wedding, temple and custom floral malas.",
    image: IMAGES.heroImg,
    icon: Flower2,
  },
  {
    key: "flowers",
    title: "Flowers",
    description: "Fresh blooms curated for every occasion.",
    image: IMAGES.jasmineImg,
    icon: Sparkles,
  },
  {
    key: "events",
    title: "Events",
    description: "Complete decor and floral experiences.",
    image: IMAGES.templeImg,
    icon: Sparkles,
  },
  {
    key: "dj",
    title: "DJ",
    description: "Music, lights and stage entertainment.",
    image: IMAGES.r11Img,
    icon: Music2,
  },
  {
    key: "catering",
    title: "Catering",
    description: "Regional menus and live counters.",
    image: IMAGES.r12Img,
    icon: UtensilsCrossed,
  },
  {
    key: "gifts",
    title: "Gifts",
    description: "Curated gifting for celebrations.",
    image: IMAGES.bouquetImg,
    icon: Gift,
  },
];

const GARLAND_CATEGORIES: CategoryItem[] = [
  { name: "Customized Order", to: "/custom" },
  { name: "Rose Model", to: "/collections/$slug", slug: "rose-model" },
  { name: "Rose Petal", to: "/collections/$slug", slug: "rose-petal" },
  { name: "Nandhiyavattai", to: "/collections/$slug", slug: "nandhiyavattai" },
  { name: "Chamanki", to: "/collections/$slug", slug: "chamanki" },
  { name: "Lotus", to: "/collections/$slug", slug: "lotus" },
  { name: "Special", to: "/collections/$slug", slug: "special" },
  { name: "Mallipoo", to: "/collections/$slug", slug: "mallipoo" },
  { name: "Temple Garlands", to: "/collections/$slug", slug: "temple-garlands" },
  { name: "Handpicked", to: "/collections/$slug", slug: "handpicked" },
];

const FLOWER_CATEGORIES: CategoryItem[] = [
  { name: "Rose", to: "/flowers", slug: "rose" },
  { name: "Jasmine", to: "/flowers", slug: "jasmine" },
  { name: "Flower String", to: "/flowers", slug: "flower-string" },
  { name: "Lily", to: "/flowers", slug: "lily" },
  { name: "Orchid", to: "/flowers", slug: "orchid" },
  { name: "Marigold", to: "/flowers", slug: "marigold" },
  { name: "Bouquets", to: "/flowers", slug: "bouquets" },
  { name: "Flower Baskets", to: "/flowers", slug: "flower-baskets" },
  { name: "Flower Boxes", to: "/flowers", slug: "flower-boxes" },
  { name: "Loose Flowers", to: "/flowers", slug: "loose-flowers" },
];

const EVENT_CATEGORIES: CategoryItem[] = [
  { name: "Puberty Function", to: "/collections/$slug", slug: "puberty-function" },
  { name: "Engagement", to: "/collections/$slug", slug: "engagement" },
  { name: "Birthday", to: "/collections/$slug", slug: "birthday" },
  { name: "Marriage", to: "/collections/$slug", slug: "marriage" },
  { name: "Kathukuthu", to: "/collections/$slug", slug: "kathukuthu" },
];

const DJ_CATEGORIES: CategoryItem[] = [
  { name: "DJ Sound System", to: "/collections/$slug", slug: "dj-sound-system" },
  { name: "LED Wall", to: "/collections/$slug", slug: "led-wall" },
  { name: "Stage Lighting", to: "/collections/$slug", slug: "stage-lighting" },
  { name: "Smoke Machine", to: "/collections/$slug", slug: "smoke-machine" },
  { name: "Laser Lights", to: "/collections/$slug", slug: "laser-lights" },
  { name: "Live Music", to: "/collections/$slug", slug: "live-music" },
  { name: "Dance Floor", to: "/collections/$slug", slug: "dance-floor" },
  { name: "Anchor Service", to: "/collections/$slug", slug: "anchor-service" },
];

const CATERING_CATEGORIES: CategoryItem[] = [
  { name: "South Indian Veg", to: "/collections/$slug", slug: "south-indian-veg" },
  { name: "South Indian Non-Veg", to: "/collections/$slug", slug: "south-indian-non-veg" },
  { name: "North Indian", to: "/collections/$slug", slug: "north-indian" },
  { name: "Chinese", to: "/collections/$slug", slug: "chinese" },
  { name: "Live Counters", to: "/collections/$slug", slug: "live-counters" },
  { name: "Wedding Catering", to: "/collections/$slug", slug: "wedding-catering" },
  { name: "Birthday Catering", to: "/collections/$slug", slug: "birthday-catering" },
  { name: "Corporate Catering", to: "/collections/$slug", slug: "corporate-catering" },
  { name: "Juice Counter", to: "/collections/$slug", slug: "juice-counter" },
  { name: "Sweet Stall", to: "/collections/$slug", slug: "sweet-stall" },
];

const GIFT_CATEGORIES: CategoryItem[] = [
  { name: "Flower Bouquets", to: "/collections/$slug", slug: "flower-bouquets" },
  { name: "Chocolate Bouquet", to: "/collections/$slug", slug: "chocolate-bouquet" },
  { name: "Teddy Gifts", to: "/collections/$slug", slug: "teddy-gifts" },
  { name: "Gift Hampers", to: "/collections/$slug", slug: "gift-hampers" },
  { name: "Customized Gifts", to: "/collections/$slug", slug: "customized-gifts" },
  { name: "Photo Frames", to: "/collections/$slug", slug: "photo-frames" },
  { name: "Greeting Cards", to: "/collections/$slug", slug: "greeting-cards" },
  { name: "Indoor Plants", to: "/collections/$slug", slug: "indoor-plants" },
  { name: "Wedding Return Gifts", to: "/collections/$slug", slug: "wedding-return-gifts" },
];

const CATEGORY_VIEW_CONTENT: Record<
  ServiceKey,
  { heading: string; description: string; items: CategoryItem[]; icon: LucideIcon }
> = {
  garlands: {
    heading: "Garland Categories",
    description: "Select a garland category to continue.",
    items: GARLAND_CATEGORIES,
    icon: Flower2,
  },
  flowers: {
    heading: "Flower Categories",
    description: "Choose your preferred flower collection.",
    items: FLOWER_CATEGORIES,
    icon: Sparkles,
  },
  events: {
    heading: "Event Categories",
    description: "Browse event service categories.",
    items: EVENT_CATEGORIES,
    icon: Sparkles,
  },
  dj: {
    heading: "DJ Categories",
    description: "Pick a DJ service category.",
    items: DJ_CATEGORIES,
    icon: Music2,
  },
  catering: {
    heading: "Catering Categories",
    description: "Explore catering service categories.",
    items: CATERING_CATEGORIES,
    icon: UtensilsCrossed,
  },
  gifts: {
    heading: "Gift Categories",
    description: "Discover gifting categories.",
    items: GIFT_CATEGORIES,
    icon: Gift,
  },
};

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  // Event Categories
  pubertyfunction: g1,
  engagement: g2,
  birthday: g3,
  marriage: g4,
  kathukuthu: g5,

  // Garland Categories
  customizedorder: IMAGES.heroImg,
  rosemodel: IMAGES.roseImg,
  rosepetal: IMAGES.rosepetalImg,
  nandhiyavattai: g2,
  chamanki: g4,
  lotus: g6,
  special: g5,
  mallipoo: IMAGES.jasmineImg,
  templegarlands: IMAGES.templeImg,
  handpicked: g6,

  // Flower Categories
  rose: IMAGES.roseImg,
  jasmine: IMAGES.jasmineImg,
  lily: g6,
  orchid: g2,
  marigold: IMAGES.marigoldImg,
  bouquets: IMAGES.bouquetImg,
  flowerbaskets: g3,
  flowerboxes: g1,
  looseflowers: IMAGES.jasmineImg,
};

function normalizeCategoryKey(value?: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function resolveCategoryImage(categoryName: string, garlandCategoryImages: Record<string, string>) {
  if (categoryName === "Customized Order") {
    return IMAGES.heroImg;
  }

  const directMatch = garlandCategoryImages[categoryName];
  if (directMatch) {
    return directMatch;
  }

  const normalizedName = normalizeCategoryKey(categoryName);
  const normalizedMatch = garlandCategoryImages[normalizedName];
  if (normalizedMatch) {
    return normalizedMatch;
  }

  const defaultMatch = DEFAULT_CATEGORY_IMAGES[normalizedName];
  if (defaultMatch) {
    return defaultMatch;
  }

  const fallbackMatch = Object.entries(garlandCategoryImages).find((entry) => {
    return normalizeCategoryKey(entry[0]) === normalizedName;
  });

  return fallbackMatch?.[1] ?? IMAGES.heroImg;
}

function CategoryGrid({
  items,
  garlandCategoryImages,
  hideImages = false,
  serviceIcon: ServiceIcon,
}: {
  items: CategoryItem[];
  isGarlandView?: boolean;
  garlandCategoryImages: Record<string, string>;
  hideImages?: boolean;
  serviceIcon?: LucideIcon;
}) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = ServiceIcon || Sparkles;

        if (hideImages) {
          return (
            <Link
              key={item.name}
              to={item.to === "/custom" ? "/custom" : "/collections/$slug"}
              params={item.to === "/custom" ? undefined : { slug: item.slug || slug(item.name) }}
              className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-gradient-to-br from-card via-card to-secondary/50 p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-elegant active:scale-[0.99] min-h-[120px] sm:min-h-[140px]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
              </div>

              <div className="mt-3">
                <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                  {item.name}
                </span>
              </div>
            </Link>
          );
        }

        const categoryImage = resolveCategoryImage(item.name, garlandCategoryImages);
        const cardClassName =
          "group relative block h-[180px] overflow-hidden rounded-xl border border-border bg-card text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant active:scale-[0.99] sm:h-[200px] lg:h-[220px]";

        if (item.to === "/custom") {
          return (
            <Link key={item.name} to="/custom" className={cardClassName}>
              <img
                src={categoryImage}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 text-white">
                <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/90 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        }

        if (item.to === "/flowers") {
          return (
            <Link
              key={item.name}
              to="/flowers"
              search={{ collection: item.name }}
              className={cardClassName}
            >
              <img
                src={categoryImage}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 text-white">
                <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/90 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={item.name}
            to="/collections/$slug"
            params={{ slug: item.slug || slug(item.name) }}
            className={cardClassName}
          >
            <img
              src={categoryImage}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 text-white">
              <span className="text-sm font-semibold tracking-wide">{item.name}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-white/90 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function CollectionsIndex() {
  const [activeService, setActiveService] = useState<ServiceKey | null>(null);
  const [garlandCategoryImages, setGarlandCategoryImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const loadGarlandThumbnails = async () => {
      try {
        const response = await fetch(resolveApiUrl("/api/flowers/collections/images"));
        if (!response.ok) {
          throw new Error("Failed to load collection images");
        }

        const categoryImages = await response.json();
        if (!isMounted) return;

        setGarlandCategoryImages(categoryImages || {});
      } catch {
        setGarlandCategoryImages({});
      }
    };

    void loadGarlandThumbnails();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeContent = activeService ? CATEGORY_VIEW_CONTENT[activeService] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="text-xs uppercase tracking-[0.3em] text-accent">Explore Services</div>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Collections</h1>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
        Select a service to explore curated offerings.
      </p>

      <div className="relative mt-8 min-h-[560px]">
        <section
          className={`transition-all duration-400 ${
            activeService
              ? "pointer-events-none absolute inset-0 translate-x-6 opacity-0"
              : "relative translate-x-0 opacity-100"
          }`}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {SERVICE_CARDS.map((service) => {
              const Icon = service.icon;
              const cardContent = (
                <>
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-background/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground backdrop-blur">
                      <Icon className="h-3.5 w-3.5" /> {service.title}
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <p className="text-xs text-primary-foreground/85 sm:text-sm">{service.description}</p>
                      <ChevronDown className="h-4 w-4 shrink-0 text-primary-foreground" />
                    </div>
                  </div>
                </>
              );

              const cardClassName =
                "group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border text-left shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-elegant active:scale-[0.99]";

              return (
                <button
                  key={service.key}
                  type="button"
                  onClick={() => setActiveService(service.key)}
                  className={cardClassName}
                >
                  {cardContent}
                </button>
              );
            })}
          </div>
        </section>

        <section
          className={`transition-all duration-400 ${
            activeService
              ? "relative translate-x-0 opacity-100"
              : "pointer-events-none absolute inset-0 -translate-x-6 opacity-0"
          }`}
        >
          {activeContent ? (
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-soft sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveService(null)}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-accent hover:text-accent"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  Back
                </button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <activeContent.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{activeContent.description}</span>
                </div>
              </div>

              <h2 className="mt-4 font-display text-3xl">{activeContent.heading}</h2>
              <CategoryGrid
                items={activeContent.items}
                isGarlandView={activeService === "garlands"}
                garlandCategoryImages={garlandCategoryImages}
                hideImages={activeService === "dj" || activeService === "catering" || activeService === "gifts"}
                serviceIcon={activeContent.icon}
              />
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
