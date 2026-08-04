import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Heart, Phone, Search, ShoppingBag, User, X } from "lucide-react";
import { useShop } from "@/store/shop";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAllFlowers, searchProducts } from "@/lib/flower-api";
import { COLLECTION_IMAGES, formatINR, getAllKnownProducts, IMAGES, type Product } from "@/data/products";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/garlands", label: "Garlands" },
  { to: "/flowers", label: "Flowers" },
  { to: "/collections", label: "Collections" },
  { to: "/collections/wedding", label: "Events" },
  { to: "/custom", label: "Custom Orders" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const QUICK_LINKS = [
  { to: "/garlands", label: "Garlands" },
  { to: "/flowers", label: "Flowers" },
  { to: "/collections/wedding", label: "Events" },
  { to: "/custom", label: "Customer Order" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function HeaderSearchBar({ isMobile = false }: { isMobile?: boolean }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const products = await fetchAllFlowers();
        if (isMounted) {
          setAllProducts(products.length > 0 ? products : getAllKnownProducts());
        }
      } catch {
        if (isMounted) setAllProducts(getAllKnownProducts());
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(allProducts, query);
  }, [query, allProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    void navigate({ to: "/search", search: { q: query.trim() } });
  };

  const getImg = (p: Product) => {
    if (p.image) return p.image;
    return COLLECTION_IMAGES[p.collection] ?? IMAGES.heroImg;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
            isMobile ? "text-pink-500" : "text-muted-foreground"
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          placeholder={isMobile ? "Search garlands, flowers…" : "Search garlands, roses, jasmine, occasions…"}
          className={
            isMobile
              ? "h-9 w-full max-w-[70vw] rounded-full border border-pink-200 bg-pink-50/90 pl-10 pr-8 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-pink-400 focus:bg-white"
              : "h-11 w-full rounded-full border border-border bg-secondary/60 pl-10 pr-8 text-sm outline-none transition-colors focus:border-accent focus:bg-background"
          }
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Live Search Results Popup Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-2xl border border-border/80 bg-background/95 p-2 shadow-2xl backdrop-blur-md">
          {results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Matching Products ({results.length})
              </div>
              {results.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  to="/product/$id"
                  params={{ id: product.id }}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary/80"
                >
                  <img
                    src={getImg(product)}
                    alt={product.name}
                    className="h-11 w-11 shrink-0 rounded-lg bg-secondary object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.collection}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-primary">{formatINR(product.price)}</span>
                </Link>
              ))}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  void navigate({ to: "/search", search: { q: query.trim() } });
                }}
                className="mt-1 flex w-full items-center justify-between rounded-xl bg-primary/10 px-3 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <span>View all {results.length} results for "{query.trim()}"</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-foreground">No products found for "{query.trim()}"</p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  void navigate({ to: "/search", search: { q: query.trim() } });
                }}
                className="mt-2 text-xs font-semibold text-accent hover:underline"
              >
                Search all products for "{query.trim()}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { cartCount, wishlist, isAuthenticated, currentUser, signOut } = useShop();

  return (
    <header className="sticky top-0 z-40 w-full overflow-x-hidden border-b border-border/60 bg-background/95 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-lg">
      <div className="hidden md:flex items-center justify-between border-b border-border/40 bg-primary px-6 py-2 text-xs text-primary-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> +91 8637686493</span>
          <span className="opacity-80">GARLANDS · FLOWERS · DJ · STAGE DECORATION · CUSTOM ORDERS </span>
        </div>
        <div className="flex items-center gap-4 opacity-90">
          <Link to="/track">Track Order</Link>
          {isAuthenticated && currentUser ? (
            <button onClick={signOut} className="hover:text-accent">
              Sign out {currentUser.name ? `(${currentUser.name})` : ""}
            </button>
          ) : (
            <Link to="/auth">Sign in</Link>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 md:hidden md:px-6 md:py-3">
        <Link to="/" className="flex shrink-0 items-center">
          <span className="font-display text-xl font-semibold text-primary">DUVIX</span>
        </Link>

        <div className="min-w-0 flex-1">
          <HeaderSearchBar isMobile={true} />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {isAuthenticated && currentUser ? (
            <button
              onClick={signOut}
              className="inline-flex h-8 items-center justify-center rounded-full bg-accent/15 px-2.5 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-flex h-8 items-center justify-center rounded-full border border-pink-200 bg-pink-50/80 px-2.5 text-xs font-semibold text-primary hover:bg-pink-100 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="md:hidden px-3">
        <div className="overflow-x-auto whitespace-nowrap scroll-smooth [&::-webkit-scrollbar]:hidden scrollbar-hide">
          <div className="inline-flex gap-2 pb-2">
            {QUICK_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex h-8 min-w-max items-center justify-center rounded-full border border-pink-200 bg-white/80 px-3 text-[11px] font-medium text-foreground/80 transition-colors hover:border-pink-300 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto hidden max-w-7xl items-center gap-4 px-4 py-4 md:flex md:px-6">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="font-display text-3xl font-semibold text-primary">DUVIX</span>
          <span className="hidden text-xs uppercase tracking-[0.25em] text-muted-foreground sm:inline">
            "FLOWERS & EVENTS"
          </span>
        </Link>

        <div className="ml-6 hidden max-w-xl flex-1 lg:block">
          <HeaderSearchBar isMobile={false} />
        </div>

        <div className="ml-auto flex items-center gap-1">
          {isAuthenticated && currentUser ? (
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={signOut}>
              Sign out
            </Button>
          ) : (
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
          <Button asChild variant="ghost" size="icon" aria-label="Account">
            <Link to={isAuthenticated ? "/wishlist" : "/auth"}><User className="h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Wishlist">
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Cart">
            <Link to="/cart">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>

      <nav className="hidden border-t border-border/50 lg:block">
        <ul className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-2.5 text-sm">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                className="text-foreground/80 transition-colors hover:text-accent"
                activeProps={{ className: "text-accent font-semibold" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
