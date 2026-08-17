import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/site/CatalogPage";
import { PRODUCTS, type Product } from "@/data/products";
import { fetchAllFlowers, fetchFlowersByCategory } from "@/lib/flower-api";
import { useCallback, useEffect, useState } from "react";

const FLOWER_PAGE_COLLECTIONS = [
  "Flower String",
  "Loose Flowers",
  "Rose",
  "Bouquets",
  "Flower Boxes",
];

export const Route = createFileRoute("/flowers")({
  validateSearch: (search: Record<string, unknown>): { collection?: string; q?: string } => ({
    collection: typeof search.collection === "string" ? search.collection : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  loaderDeps: ({ search: { collection } }) => ({ collection }),
  loader: async ({ deps: { collection } }) => {
    try {
      if (collection) {
        const categorySlug = toCategoryParam(collection);
        const fetched = await fetchFlowersByCategory(categorySlug);
        const flowerResults = fetched.filter(
          (item) => item.category === "flowers" || toCategoryParam(item.collection) === categorySlug,
        );
        return { initialProducts: flowerResults };
      }
      const allProducts = await fetchAllFlowers();
      const flowerItems = allProducts.filter(
        (item) =>
          item.category === "flowers" ||
          FLOWER_PAGE_COLLECTIONS.map(toCategoryParam).includes(toCategoryParam(item.collection)),
      );
      return { initialProducts: flowerItems };
    } catch {
      return { initialProducts: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Fresh Flowers — Roses, Jasmines, Lilies, Orchids & Bouquets | Malligai" },
      { name: "description", content: "Fresh roses, jasmine, lilies, orchids, bouquets, flower baskets and boxes — hand-picked and delivered chilled." },
    ],
  }),
  component: FlowersPage,
});

function toCategoryParam(value?: string) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function FlowersPage() {
  const loaderData = Route.useLoaderData();
  const search = Route.useSearch();
  const [products, setProducts] = useState<Product[]>(loaderData?.initialProducts || []);
  const [allFlowerProducts, setAllFlowerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!loaderData?.initialProducts?.length);
  const [error, setError] = useState<string | null>(null);

  const getFallbackFlowers = useCallback(() => {
    return PRODUCTS.filter((item) => item.category === "flowers");
  }, []);

  const loadAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allProducts = await fetchAllFlowers();
      const flowerItems = allProducts.filter(
        (item) => item.category === "flowers" || FLOWER_PAGE_COLLECTIONS.map(toCategoryParam).includes(toCategoryParam(item.collection)),
      );
      const itemsToSet = flowerItems.length > 0 ? flowerItems : getFallbackFlowers();
      setAllFlowerProducts(itemsToSet);
      setProducts(itemsToSet);
    } catch {
      const fallback = getFallbackFlowers();
      setAllFlowerProducts(fallback);
      setProducts(fallback);
    } finally {
      setLoading(false);
    }
  }, [getFallbackFlowers]);

  useEffect(() => {
    if (loaderData?.initialProducts && loaderData.initialProducts.length > 0) {
      setProducts(loaderData.initialProducts);
      setLoading(false);
      return;
    }

    if (search.collection) {
      void handleCollectionChange(search.collection);
      return;
    }

    void loadAllProducts();
  }, [loaderData, loadAllProducts, search.collection]);

  const handleCollectionChange = async (collection: string | null) => {
    if (!collection) {
      await loadAllProducts();
      return;
    }

    setLoading(true);
    setError(null);

    const categorySlug = toCategoryParam(collection);
    console.log(`[FlowersPage] Loading category products strictly for: "${collection}" (${categorySlug})`);

    try {
      const fetched = await fetchFlowersByCategory(categorySlug);
      const flowerResults = fetched.filter(
        (item) => item.category === "flowers" || toCategoryParam(item.collection) === categorySlug,
      );

      if (flowerResults.length > 0) {
        setProducts(flowerResults);
      } else {
        // Strict fallback filter for ONLY this selected category
        const fallbackSource = getFallbackFlowers();
        const filtered = fallbackSource.filter(
          (p) =>
            toCategoryParam(p.collection) === categorySlug ||
            toCategoryParam(p.sourceCategory || "") === categorySlug,
        );
        setProducts(filtered);
      }
    } catch {
      const fallbackSource = getFallbackFlowers();
      const filtered = fallbackSource.filter(
        (p) =>
          toCategoryParam(p.collection) === categorySlug ||
          toCategoryParam(p.sourceCategory || "") === categorySlug,
      );
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CatalogPage
      title="Flower Collection"
      eyebrow="Farm-fresh blooms"
      products={products}
      collections={FLOWER_PAGE_COLLECTIONS}
      activeCollection={search.collection}
      searchQuery={search.q}
      loading={loading}
      error={error}
      onCollectionChange={handleCollectionChange}
    />
  );
}
