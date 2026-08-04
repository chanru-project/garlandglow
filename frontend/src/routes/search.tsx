import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { getAllKnownProducts, type Product } from "@/data/products";
import { fetchAllFlowers, searchProducts } from "@/lib/flower-api";
import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Search Garlands & Flowers | DUVIX" },
      { name: "description", content: "Search fresh garlands, roses, jasmine, lotus, bouquets and special occasion floral decor." },
    ],
  }),
  component: SearchPage,
});

const POPULAR_SEARCHES = [
  "Rose Garlands",
  "Jasmine (Malli)",
  "Lotus",
  "Bridal Varmala",
  "Temple Garlands",
  "Bouquets",
  "Marigold",
  "Special",
];

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [inputQuery, setInputQuery] = useState(search.q || "");
  const [activeTab, setActiveTab] = useState<"all" | "garlands" | "flowers">("all");
  const [sort, setSort] = useState<"featured" | "priceLow" | "priceHigh" | "rating">("featured");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputQuery(search.q || "");
  }, [search.q]);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const fetched = await fetchAllFlowers();
        if (isMounted) {
          setProducts(fetched.length > 0 ? fetched : getAllKnownProducts());
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load products");
          setProducts(getAllKnownProducts());
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void navigate({ to: "/search", search: { q: inputQuery.trim() } });
  };

  const handleTagClick = (tag: string) => {
    setInputQuery(tag);
    void navigate({ to: "/search", search: { q: tag } });
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];
    const q = (search.q || inputQuery || "").trim();

    if (activeTab !== "all") {
      list = list.filter((p) => p.category === activeTab);
    }

    if (q) {
      list = searchProducts(list, q);
    }

    switch (sort) {
      case "priceLow":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep searchProducts ranking order when sorting is 'featured'
        if (!q) {
          list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
        }
    }

    return list;
  }, [products, search.q, inputQuery, activeTab, sort]);

  const currentQuery = (search.q || "").trim();

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header Banner */}
      <div className="border-b border-border bg-gradient-to-b from-secondary/60 to-background py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            {currentQuery ? (
              <span>
                Search results for <span className="text-primary">"{currentQuery}"</span>
              </span>
            ) : (
              "Search Garlands & Flowers"
            )}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Find wedding garlands, temple malas, fresh roses, jasmine and custom floral arrangements
          </p>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="relative mx-auto mt-6 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search garlands, roses, jasmine, occasions..."
              className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-24 text-base shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => {
                  setInputQuery("");
                  void navigate({ to: "/search", search: { q: "" } });
                }}
                className="absolute right-20 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Search
            </button>
          </form>

          {/* Popular Tag Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="font-medium text-muted-foreground">Popular:</span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`rounded-full border px-3 py-1 transition-colors ${
                  currentQuery.toLowerCase() === tag.toLowerCase()
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card/80 text-foreground/80 hover:border-accent/50 hover:bg-secondary"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Filter and Sort Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            {(["all", "garlands", "flowers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/70 text-foreground/80 hover:bg-secondary"
                }`}
              >
                {tab === "all" ? "All Categories" : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
            </span>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="appearance-none rounded-full border border-border bg-card py-1.5 pl-3 pr-8 text-xs focus:border-accent"
              >
                <option value="featured">Sort: Featured</option>
                <option value="priceLow">Price: Low to high</option>
                <option value="priceHigh">Price: High to low</option>
                <option value="rating">Top rated</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Results Grid / Loading / Empty state */}
        {loading ? (
          <div className="grid place-items-center rounded-2xl border border-dashed py-24 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : error ? (
          <div className="grid place-items-center rounded-2xl border border-dashed py-24 text-center text-sm text-destructive">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-xl font-medium">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We couldn't find any products matching "{currentQuery}". Try checking for spelling errors or searching another keyword.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.slice(0, 4).map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="rounded-full bg-secondary px-4 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Browse {tag}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
