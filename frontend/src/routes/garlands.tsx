import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/site/CatalogPage";
import { GARLAND_COLLECTIONS, type Product } from "@/data/products";
import { fetchAllFlowers, fetchFlowersByCategory } from "@/lib/flower-api";
import { useCallback, useEffect, useState } from "react";

export const Route = createFileRoute("/garlands")({
  validateSearch: (search: Record<string, unknown>): { collection?: string; q?: string } => ({
    collection: typeof search.collection === "string" ? search.collection : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Garlands — Wedding, Temple, Rose, Jasmine & More | Malligai" },
      { name: "description", content: "Shop hand-crafted garlands: wedding varmalas, temple malas, rose, jasmine, marigold and designer garlands. Fresh, delivered." },
    ],
  }),
  component: GarlandsPage,
});

function toCategoryParam(value?: string) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function GarlandsPage() {
  const search = Route.useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allProducts = await fetchAllFlowers();
      setProducts(allProducts.filter((item) => item.category === "garlands"));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (search.collection) {
      void handleCollectionChange(search.collection);
      return;
    }

    void loadAllProducts();
  }, [loadAllProducts, search.collection]);

  const handleCollectionChange = async (collection: string | null) => {
    if (!collection) {
      await loadAllProducts();
      return;
    }

    if (collection === "Customized order") {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const categorySlug = toCategoryParam(collection);
      const byCategory = await fetchFlowersByCategory(categorySlug);
      setProducts(byCategory);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load category products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatalogPage
      title="Garland Collection"
      eyebrow="Fresh · Hand-crafted · Delivered daily"
      products={products}
      collections={GARLAND_COLLECTIONS}
      activeCollection={search.collection}
      searchQuery={search.q}
      loading={loading}
      error={error}
      onCollectionChange={handleCollectionChange}
    />
  );
}
