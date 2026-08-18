import { createFileRoute, Link } from "@tanstack/react-router";
import { CatalogPage } from "@/components/site/CatalogPage";
import type { Product } from "@/data/products";
import { fetchFlowersByCategory } from "@/lib/flower-api";
import { useCallback, useEffect, useState } from "react";
import { Gift, Sparkles, Truck, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/gifts")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  loader: async () => {
    try {
      const products = await fetchFlowersByCategory("gifts");
      return { initialProducts: products };
    } catch {
      return { initialProducts: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Gifts & Floral Surprises | DUVIX" },
      {
        name: "description",
        content:
          "Send gorgeous fresh gift surprises and custom hampers. Handcrafted with farm-fresh blooms.",
      },
    ],
  }),
  component: GiftsPage,
});

function GiftsPage() {
  const loaderData = Route.useLoaderData();
  const search = Route.useSearch();
  const [products, setProducts] = useState<Product[]>(loaderData?.initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGiftProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const giftItems = await fetchFlowersByCategory("gifts");
      setProducts(giftItems);
    } catch (loadError) {
      console.warn("Could not fetch gift products from MongoDB API:", loadError);
      setError(loadError instanceof Error ? loadError.message : "Failed to load gift products from MongoDB.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loaderData?.initialProducts && loaderData.initialProducts.length > 0) {
      setProducts(loaderData.initialProducts);
      setLoading(false);
      return;
    }

    void loadGiftProducts();
  }, [loaderData, loadGiftProducts]);

  return (
    <div>
      {/* Gift Page Top Perks Bar */}
      <div className="border-b border-border/60 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 py-3 dark:from-pink-950/20 dark:via-rose-950/30 dark:to-pink-950/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 text-xs font-medium text-foreground/80 sm:justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            <span>Complimentary Personalized Message Card with every order</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <span>Same-day Hand Delivery &amp; Express Pan-India Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>100% Fresh Farm Blooms &amp; Luxury Packaging Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Main Catalog View without Category sidebar and without prices */}
      <CatalogPage
        title="Gifts & Floral Surprises"
        eyebrow="Thoughtful Moments &amp; Fresh Surprises"
        products={products}
        collections={[]}
        showSidebar={false}
        showAllOption={false}
        hidePrice={true}
        searchQuery={search.q}
        loading={loading}
        error={error}
      />

      {/* Custom Gift Hamper CTA Box */}
      <section className="border-t border-border/60 bg-secondary/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:p-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-primary sm:text-2xl">
                Need a Custom Gift Hamper or Surprise Delivery?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Customize flowers, colors, customized greeting cards, and preferred delivery slots directly with our florist.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                to="/custom"
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                Custom Gift Order
              </Link>
              <a
                href="https://wa.me/918637686493?text=Hello%20DUVIX%2C%20I%20am%20looking%20for%20a%20custom%20gift%20hamper%20%2F%20floral%20gift%20delivery."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
