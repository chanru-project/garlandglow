import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import type { Product } from "@/data/products";
import { searchProducts } from "@/lib/flower-api";
import { ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";

function normKey(value?: string) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function CatalogPage({
  title,
  eyebrow,
  products,
  collections,
  activeCollection,
  searchQuery,
  showSidebar = true,
  showAllOption = true,
  loading = false,
  error = null,
  onCollectionChange,
}: {
  title: string;
  eyebrow?: string;
  products: Product[];
  collections: string[];
  activeCollection?: string;
  searchQuery?: string;
  showSidebar?: boolean;
  showAllOption?: boolean;
  loading?: boolean;
  error?: string | null;
  onCollectionChange?: (collection: string | null) => void;
}) {
  const [selected, setSelected] = useState<string | null>(
    activeCollection ?? (showAllOption ? null : collections[0] ?? null),
  );
  const [sort, setSort] = useState<"featured" | "priceLow" | "priceHigh" | "rating">("featured");
  const derivedMaxPrice = useMemo(() => {
    const max = products.reduce((top, item) => Math.max(top, item.price), 0);
    return max > 0 ? Math.ceil(max / 100) * 100 : 10000;
  }, [products]);
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  useEffect(() => {
    setSelected(activeCollection ?? (showAllOption ? null : collections[0] ?? null));
  }, [activeCollection, showAllOption, collections]);

  useEffect(() => {
    setMaxPrice(derivedMaxPrice);
  }, [derivedMaxPrice]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selected) {
      const targetKey = normKey(selected);
      const categoryFiltered = list.filter(
        (p) =>
          normKey(p.collection) === targetKey ||
          normKey(p.category) === targetKey ||
          normKey(p.sourceCategory || "") === targetKey,
      );
      if (categoryFiltered.length > 0) {
        list = categoryFiltered;
      }
    }
    if (searchQuery && searchQuery.trim()) {
      list = searchProducts(list, searchQuery);
    }
    list = list.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case "priceLow": list.sort((a, b) => a.price - b.price); break;
      case "priceHigh": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default:
        if (!searchQuery) {
          list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
        }
    }
    return list;
  }, [products, selected, searchQuery, sort, maxPrice]);

  return (
    <div className="overflow-x-hidden">
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          {eyebrow && <div className="text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</div>}
          <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl">{title}</h1>
          {searchQuery && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              <span>Matching "{searchQuery}"</span>
            </div>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{filtered.length} products</p>
        </div>
      </div>

      <div className={`mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-10 ${showSidebar ? "lg:grid-cols-[240px_1fr]" : "grid-cols-1"}`}>
        {showSidebar && (
          <aside className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm md:space-y-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Categories</h3>
              <ul className="flex flex-wrap gap-2 md:max-h-[420px] md:flex-col md:gap-1 md:overflow-y-auto md:pr-2">
                {showAllOption && (
                  <li className="md:w-full">
                    <button
                      onClick={() => {
                        setSelected(null);
                        onCollectionChange?.(null);
                      }}
                      className={`rounded-full px-3 py-2 text-left text-sm md:w-full md:rounded-md ${!selected ? "bg-primary text-primary-foreground" : "bg-secondary/80 hover:bg-secondary"}`}
                    >
                      All
                    </button>
                  </li>
                )}
                {collections.map((c) => (
                  <li key={c} className="md:w-full">
                    {c === "Customized order" ? (
                      <Link
                        to="/custom"
                        className="flex rounded-full px-3 py-2 text-left text-sm hover:bg-secondary md:w-full md:rounded-md"
                      >
                        {c}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setSelected(c);
                          onCollectionChange?.(c);
                        }}
                        className={`rounded-full px-3 py-2 text-left text-sm md:w-full md:rounded-md ${selected && normKey(selected) === normKey(c)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/80 hover:bg-secondary"
                          }`}
                      >
                        {c}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:block">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Max price</h3>
              <input
                type="range"
                min={500}
                max={derivedMaxPrice}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-accent"
              />
              <div className="mt-1 text-sm text-muted-foreground">Up to ₹{maxPrice.toLocaleString("en-IN")}</div>
            </div>
          </aside>
        )}

        <div>
          <div className="mb-4 flex items-center justify-end sm:mb-6">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="appearance-none rounded-full border border-border bg-card py-2 pl-4 pr-9 text-sm focus:border-accent"
              >
                <option value="featured">Sort: Featured</option>
                <option value="priceLow">Price: Low to high</option>
                <option value="priceHigh">Price: High to low</option>
                <option value="rating">Top rated</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </div>

          {loading ? (
            <div className="grid place-items-center rounded-2xl border border-dashed py-20 text-center text-sm text-muted-foreground sm:py-24">
              Loading products...
            </div>
          ) : error ? (
            <div className="grid place-items-center rounded-2xl border border-dashed py-20 text-center text-sm text-destructive sm:py-24">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed py-20 text-center text-sm text-muted-foreground sm:py-24">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
