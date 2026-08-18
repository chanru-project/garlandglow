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
    const targetCollection = collection || FLOWER_PAGE_COLLECTIONS[0];
    try {
      const categorySlug = toCategoryParam(targetCollection);
      const fetched = await fetchFlowersByCategory(categorySlug);
      const flowerResults = fetched.filter(
        (item) => item.category === "flowers" || toCategoryParam(item.collection) === categorySlug,
      );
      return { initialProducts: flowerResults, activeCollection: targetCollection };
    } catch {
      return { initialProducts: [], activeCollection: targetCollection };
    }
  },
  head: () => ({
    meta: [
      { title: "Fresh Flowers — Roses, Jasmines, Lilies, Orchids & Bouquets | DUVIX" },
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
  const activeCol = search.collection || loaderData?.activeCollection || FLOWER_PAGE_COLLECTIONS[0];
  const [selectedCollection, setSelectedCollection] = useState<string>(activeCol);
  const [products, setProducts] = useState<Product[]>(loaderData?.initialProducts || []);
  const [loading, setLoading] = useState(!loaderData?.initialProducts?.length);
  const [error, setError] = useState<string | null>(null);

  const getFallbackFlowers = useCallback((col: string) => {
    const categorySlug = toCategoryParam(col);
    return PRODUCTS.filter(
      (p) =>
        toCategoryParam(p.collection) === categorySlug ||
        toCategoryParam(p.sourceCategory || "") === categorySlug,
    );
  }, []);

  const loadCategoryProducts = useCallback(
    async (col: string) => {
      setLoading(true);
      setError(null);

      const categorySlug = toCategoryParam(col);
      console.log(`[FlowersPage] Loading category products strictly for: "${col}" (${categorySlug})`);

      try {
        const fetched = await fetchFlowersByCategory(categorySlug);
        const flowerResults = fetched.filter(
          (item) => item.category === "flowers" || toCategoryParam(item.collection) === categorySlug,
        );

        if (flowerResults.length > 0) {
          setProducts(flowerResults);
        } else {
          const filtered = getFallbackFlowers(col);
          setProducts(filtered);
        }
      } catch {
        const filtered = getFallbackFlowers(col);
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    },
    [getFallbackFlowers],
  );

  useEffect(() => {
    const target = search.collection || FLOWER_PAGE_COLLECTIONS[0];
    setSelectedCollection(target);

    if (
      loaderData?.initialProducts &&
      loaderData.initialProducts.length > 0 &&
      target === loaderData.activeCollection
    ) {
      setProducts(loaderData.initialProducts);
      setLoading(false);
      return;
    }

    void loadCategoryProducts(target);
  }, [search.collection, loaderData, loadCategoryProducts]);

  const handleCollectionChange = (collection: string | null) => {
    const target = collection || FLOWER_PAGE_COLLECTIONS[0];
    setSelectedCollection(target);
    void loadCategoryProducts(target);
  };

  return (
    <CatalogPage
      title="Flower Collection"
      eyebrow="Farm-fresh blooms"
      products={products}
      collections={FLOWER_PAGE_COLLECTIONS}
      activeCollection={selectedCollection}
      searchQuery={search.q}
      showAllOption={false}
      loading={loading}
      error={error}
      onCollectionChange={handleCollectionChange}
    />
  );
}
