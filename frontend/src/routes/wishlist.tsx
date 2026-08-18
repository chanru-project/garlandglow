import { createFileRoute, Link } from "@tanstack/react-router";
import { useShop } from "@/store/shop";
import { getProductsByIds } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Your Wishlist | DUVIX" }, { name: "robots", content: "noindex" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, isAuthenticated } = useShop();
  const items = getProductsByIds(wishlist);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto grid max-w-2xl place-items-center px-6 py-24 text-center">
        <Heart className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl">Sign in to save your wishlist</h1>
        <p className="mt-2 text-muted-foreground">
          Create an account or sign in first, then tap the heart on any item to save it.
        </p>
        <Link to="/auth" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl md:text-4xl">Your wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-16 grid place-items-center text-center">
          <Heart className="h-14 w-14 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Nothing saved yet. Tap the heart on any product to add it here.</p>
          <Link to="/garlands" className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Explore Garlands</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
