import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Truck, Shield, Flower2, Star } from "lucide-react";
import { IMAGES, PRODUCTS, GARLAND_COLLECTIONS, OCCASIONS, COLLECTION_IMAGES, type Product } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { fetchAllFlowers, fetchFlowersByCategory } from "@/lib/flower-api";

export const Route = createFileRoute("/")({
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
    fetch("/api/flowers/collections/images")
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

        setBestSellers(allProducts.filter((product) => product.category === "garlands").slice(0, 8));
        setNewArrivals(allProducts.filter((product) => product.newArrival).slice(0, 8));
        setHandpickedProducts(handpickedByCategory.slice(0, 6));

        if (handpickedByCategory.length === 0) {
          setHandpickedProducts(allProducts.filter(isHandpickedProduct).slice(0, 6));
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-16 md:grid-cols-2 md:gap-10 md:py-24 lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Freshly hand-crafted, daily
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              Fresh Flowers & <br />
              <span className="text-gradient-gold">Premium Garlands</span>
              <br />form DUVIX SHOP
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Wedding garlands, temple garland, roses and jasmine — assembled by master florists
              and delivered chilled to your doorstep.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/garlands"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.03]"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/collections"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-background/80 px-6 py-3.5 text-sm font-semibold text-primary hover:border-accent hover:text-accent"
              >
                Explore Collections
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> Same-day delivery</span>
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-accent" /> Freshness guarantee</span>
              <span className="flex items-center gap-2"><Flower2 className="h-4 w-4 text-accent" /> Custom orders</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/20 via-gold/10 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border border-gold/30 shadow-elegant">
              <img
                src={IMAGES.heroImg}
                alt="Traditional Indian wedding garlands with red roses, jasmine and marigolds"
                width={1920}
                height={1200}
                loading="lazy"
                className="h-[260px] w-full object-cover sm:h-[360px] md:h-[560px]"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-background/95 p-4 shadow-elegant backdrop-blur md:block">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-accent to-rose" />)}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-semibold">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" /> 4.9 · 10 reviews
                  </div>
                  <div className="text-[11px] text-muted-foreground">Trusted by customers across Dindigul and Madurai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-elegant sm:p-10 md:p-16">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-30" style={{ background: "radial-gradient(circle at 70% 30%, var(--gold), transparent 60%)" }} />
          <div className="relative max-w-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-gold">Festive Offer</div>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl">Flat 20% off on <span className="text-gradient-gold">Wedding Collections</span></h3>
            <p className="mt-3 opacity-85">Book your special day's varmalas, mandap decor and reception garlands with us.</p>
            <Link
              to="/collections/$slug"
              params={{ slug: "wedding" }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:brightness-110"
            >
              Shop Wedding Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <SectionTitle eyebrow="Curated for every moment" title="Shop by occasion" />
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

