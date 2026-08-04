import { Link } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { COLLECTION_IMAGES, formatINR, type Product, IMAGES } from "@/data/products";
import { useShop } from "@/store/shop";
import { toast } from "sonner";

function getProductImage(product: Product) {
  if (product.image) return product.image;
  return COLLECTION_IMAGES[product.collection] ?? IMAGES.heroImg;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist, isAuthenticated } = useShop();
  const router = useRouter();
  const wished = inWishlist(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all duration-200 md:rounded-2xl md:shadow-soft md:hover:-translate-y-1 md:hover:shadow-lg">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative aspect-square overflow-hidden bg-secondary/40"
      >
        <img
          src={getProductImage(product)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const t = e.currentTarget as HTMLImageElement;
            if (t.src !== IMAGES.heroImg) t.src = IMAGES.heroImg;
          }}
          className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
        />
      </Link>

      <button
        onClick={() => {
          if (!isAuthenticated) {
            toast.error("Sign in to save items to your wishlist.");
            router.navigate({ to: "/auth" });
            return;
          }
          toggleWishlist(product.id);
          toast(wished ? "Removed from wishlist" : "Added to wishlist");
        }}
        aria-label="wishlist"
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 shadow-sm backdrop-blur md:right-3 md:top-3 md:h-9 md:w-9 md:shadow-soft"
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-accent text-accent" : "text-foreground"}`} />
      </button>

      <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3 pt-2 md:gap-2 md:px-4 md:py-4">
        <p className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground md:text-[11px]">{product.collection}</p>
        <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-2 text-sm font-medium leading-snug hover:text-accent md:text-[15px]">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-[10px] md:text-xs">
          <Star className="h-3 w-3 fill-gold text-gold md:h-3.5 md:w-3.5" />
          <span className="font-semibold">{product.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-primary md:text-lg">{formatINR(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-[10px] text-muted-foreground line-through md:text-xs">{formatINR(product.mrp)}</span>
          )}
        </div>

        <button
          onClick={() => {
            addToCart(product.id);
            toast.success("Added to cart", { description: product.name });
          }}
          className="mt-2 inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg bg-primary px-2 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:h-10 md:px-3 md:text-sm"
        >
          <ShoppingBag className="h-3.5 w-3.5 md:h-4 md:w-4" /> Add to cart
        </button>
      </div>
    </div>
  );
}
