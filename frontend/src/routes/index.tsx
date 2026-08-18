import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { IMAGES, PRODUCTS, GARLAND_COLLECTIONS, OCCASIONS, COLLECTION_IMAGES, type Product } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { fetchAllFlowers, fetchFlowersByCategory, resolveApiUrl } from "@/lib/flower-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DUVIX Flowers & Events — Fresh Garlands & Flowers for Every Occasion" },
      {
        name: "description",
        content:
          "Fresh hand-crafted garlands, flowers, event decor, stage decorations, and custom floral arrangements.",
      },
    ],
  }),
  component: Home,
});

// Collections to show on the home categories grid. Ensure each has a representative image.
const HERO_COLLECTION_NAMES = [
  "Rose Model",
  "Rose Petal",
  "Lotus",
  "Chamanki",
  "Mallipoo",
  "Nandhiyavattai",

];

const HERO_CATEGORIES = HERO_COLLECTION_NAMES.map((name) => ({
  name,
  image: COLLECTION_IMAGES[name] ?? IMAGES.heroImg,
  to: `/collections/${String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
}));

function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [handpickedProducts, setHandpickedProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [collectionImages, setCollectionImages] = useState<Record<string, string>>({});

  function normalizeKey(s: string) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  function isHandpickedProduct(product: Product) {
    if (product.category !== "garlands") return false;
    const collectionKey = normalizeKey(product.collection || "");
    const sourceKey = normalizeKey(product.sourceCategory || "");
    return collectionKey === "handpicked" || sourceKey === "handpicked";
  }

  useEffect(() => {
    let mounted = true;
    fetch(resolveApiUrl("/api/flowers/collections/images"))
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data) => {
        if (!mounted) return;
        setCollectionImages(data || {});
      })
      .catch(() => {
        /* ignore - fall back to local images */
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      try {
        const allProducts = await fetchAllFlowers();
        const handpickedByCategory = await fetchFlowersByCategory("handpicked");
        if (!mounted) return;

        const isGift = (product: Product) =>
          product.collection?.toLowerCase().includes("gift") ||
          // product.category === "gifts" ||
          String(product.sourceCategory || "").toLowerCase().includes("gift") ||
          product.name?.toLowerCase().includes("gift");

        const nonGiftProducts = allProducts.filter((p) => !isGift(p));
        const arrivals = nonGiftProducts.filter((product) => product.newArrival);

        setBestSellers(nonGiftProducts.filter((product) => product.category === "garlands").slice(0, 8));
        setNewArrivals(arrivals.length >= 4 ? arrivals.slice(0, 8) : nonGiftProducts.slice(0, 8));
        setHandpickedProducts(handpickedByCategory.slice(0, 6));

        if (handpickedByCategory.length === 0) {
          setHandpickedProducts(nonGiftProducts.filter(isHandpickedProduct).slice(0, 6));
        }
      } catch {
        if (!mounted) return;
        setBestSellers([]);
        setNewArrivals([]);
        setHandpickedProducts([]);
      }
    }

    void loadHomeData();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!name || !phone || !message) {
      return;
    }

    const whatsappMessage = encodeURIComponent(`New feedback from ${name}\nPhone: ${phone}\nMessage: ${message}`);
    const whatsappUrl = `https://wa.me/919342886507?text=${whatsappMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <div>
      {/* 4-Slide Automatic Hero Carousel */}
      <HeroCarousel />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <SectionTitle eyebrow="Shop by category" title="Handpicked collections" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {handpickedProducts.map((product) => (
            <Link
              key={product.id}
              to="/garlands"
              search={{ collection: "Handpicked" }}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all duration-200 md:rounded-2xl md:shadow-soft md:hover:-translate-y-1 md:hover:shadow-lg"
            >
              <img
                src={product.image || COLLECTION_IMAGES[product.collection] || IMAGES.heroImg}
                alt={product.name}
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  const target = event.currentTarget as HTMLImageElement;
                  if (target.src !== IMAGES.heroImg) target.src = IMAGES.heroImg;
                }}
                className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white md:p-4">
                <div className="line-clamp-2 text-sm font-semibold leading-snug text-white md:text-base">
                  {product.name}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-white/20 md:text-xs">
                  Shop Now <span aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex items-end justify-between gap-2">
          <SectionTitle eyebrow="Loved by our customers" title="Best-selling garlands" />
          <Link to="/garlands" className="hidden text-sm font-semibold text-accent hover:underline md:inline">View all →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Offer banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#cda54d]/30 bg-[#032814] p-6 text-[#f8f0da] shadow-[0_24px_60px_rgba(4,22,11,0.35)] sm:p-8 md:p-10 lg:p-12">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 18% 20%, rgba(217, 171, 63, 0.16), transparent 28%), radial-gradient(circle at 80% 16%, rgba(166, 194, 72, 0.18), transparent 24%), radial-gradient(circle at 78% 78%, rgba(217, 171, 63, 0.12), transparent 30%), linear-gradient(135deg, #022312 0%, #06331b 48%, #041d0f 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(241, 213, 138, 0.55) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="pointer-events-none absolute left-3 top-2 hidden h-24 w-10 rounded-b-full border-l border-[#dfbe6e]/45 md:block" />
          <div className="pointer-events-none absolute left-8 top-3 hidden h-20 w-8 rounded-b-full border-l border-[#dfbe6e]/35 md:block" />
          <div className="pointer-events-none absolute right-0 top-0 hidden h-28 w-40 rounded-bl-[100%] bg-[linear-gradient(140deg,rgba(132,176,60,0.95),rgba(59,109,42,0.75),transparent_75%)] md:block" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-28 w-28 rounded-full border border-[#cfa750]/15" />
          <div className="pointer-events-none absolute right-10 top-10 h-36 w-36 rounded-full border border-[#cfa750]/20" />
          <div className="pointer-events-none absolute left-1/2 top-10 hidden h-[calc(100%-5rem)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#d9b15a] to-transparent md:block" />

          <div className="relative grid gap-8 md:grid-cols-[1fr_auto_0.92fr] md:gap-10">
            <div className="flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-3">
                  <span className="h-px w-8 bg-[#d9b15a]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f0cb72] sm:text-xs">
                    ONAM FESTIVAL OFFER
                  </p>
                  <span className="h-px w-8 bg-[#d9b15a]" />
                </div>

                <div className="mt-5">
                  <p className="text-3xl leading-none text-[#f7efde] sm:text-4xl">Celebrate</p>
                  <h3 className="mt-1 font-display text-6xl leading-[0.9] text-[#e3b549] drop-shadow-[0_2px_10px_rgba(227,181,73,0.2)] sm:text-7xl lg:text-8xl">
                    Onam
                  </h3>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-base font-semibold uppercase tracking-[0.35em] text-[#f9f0dd] sm:text-lg">
                    with DUVIX
                  </p>
                  <p className="text-sm uppercase tracking-[0.4em] text-[#d6bb7a] sm:text-base">
                    FLOWERS & EVENTS
                  </p>
                </div>

                <p className="mt-6 max-w-md text-sm leading-relaxed text-[#f7ecd6]/85 sm:text-base">
                  Make your celebrations beautiful
                </p>
                <p className="mt-1 font-display text-2xl italic text-[#e0b24d] sm:text-3xl">
                  The Onam Way!
                </p>
              </div>

              <div className="mt-8">
                <Link
                  to="/garlands"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d6ad58] bg-[#0a2818]/70 px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f1d180] shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#123520] hover:text-[#ffe6a8] sm:w-auto sm:px-7"
                >
                  BOOK YOUR CELEBRATION TODAY
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="hidden w-px bg-gradient-to-b from-transparent via-[#d9b15a]/90 to-transparent md:block" />

            <div className="relative flex flex-col justify-center overflow-hidden rounded-[1.5rem] border border-[#cda54d]/25 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.06),transparent_30%),rgba(5,32,18,0.55)] px-5 py-6 sm:px-7 md:px-8">
              <div className="mx-auto w-fit rounded-full border border-[#d2ab56]/40 px-4 py-2 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f4d48e] sm:text-xs">
                  SPECIAL FESTIVE OFFER
                </p>
              </div>

              <div className="mt-5 text-center leading-none">
                <p className="font-display text-7xl text-[#e3b549] drop-shadow-[0_4px_14px_rgba(227,181,73,0.24)] sm:text-8xl lg:text-[7rem]">
                  20%
                </p>
                <p className="mt-2 text-3xl font-medium uppercase tracking-[0.08em] text-[#f7efdd] sm:text-4xl">
                  OFF
                </p>
              </div>

              <div className="mt-5 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f2cf84] sm:text-base">
                  FLAT
                </p>
                <p className="mt-3 inline-block bg-gradient-to-r from-[#8f6517] via-[#d0a144] to-[#8f6517] px-4 py-2 text-lg font-semibold uppercase tracking-[0.18em] text-[#fff5dd] shadow-[0_12px_24px_rgba(123,87,15,0.28)] sm:text-xl">
                  ON ALL Flowers COLLECTIONS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <SectionTitle eyebrow="Curated for every moment" title="Celebrate Every Moment in DUVIX flowers & events" />
        <div className="mt-8 flex flex-wrap gap-3">
          {OCCASIONS.map((o) => (
            <Link
              key={o}
              to="/collections/$slug"
              params={{ slug: String(o || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") }}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium hover:border-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {o}
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <SectionTitle eyebrow="Fresh from the studio" title="New arrivals" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Feedback */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <SectionTitle eyebrow="Share your feedback" title="We’d love to hear from you" />
        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              placeholder="Your name"
              className="mt-2 flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Phone number"
              className="mt-2 flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
              placeholder="Your feedback"
              rows={4}
              className="mt-2 flex min-h-[110px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
          >
            Submit
          </button>
          <p className="text-sm text-muted-foreground">
            A verification code has been sent to your registered mobile number.
          </p>
        </form>
      </section>

    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</div>
      <h2 className="mt-2 font-display text-3xl md:text-4xl">{title}</h2>
    </div>
  );
}

