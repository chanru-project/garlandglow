import {
  FLOWER_COLLECTIONS,
  GARLAND_COLLECTIONS,
  registerProducts,
  type Product,
} from "@/data/products";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const ssrFallbackApiBaseUrl = import.meta.env.PROD ? "" : "http://localhost:5000";

export class FlowerApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "FlowerApiError";
    this.status = status;
  }
}

type FlowerApiItem = {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
};

function slugify(value?: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCategoryKey(value?: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function prettyName(value?: string) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolveCollectionName(category?: string) {
  const categoryKey = normalizeCategoryKey(category);
  const allCollections = [...GARLAND_COLLECTIONS, ...FLOWER_COLLECTIONS];
  const known = allCollections.find((collection) => normalizeCategoryKey(collection) === categoryKey);
  return known ?? prettyName(category);
}

function resolveCategoryType(category?: string): Product["category"] {
  const categoryKey = normalizeCategoryKey(category);
  const isFlowerCategory = FLOWER_COLLECTIONS.some(
    (collection) => normalizeCategoryKey(collection) === categoryKey,
  );
  return isFlowerCategory ? "flowers" : "garlands";
}

function mapFlowerToProduct(item: FlowerApiItem): Product {
  const safeItem = item || ({} as FlowerApiItem);
  const rawCategory = safeItem.category ?? "";
  const rawName = safeItem.name ?? safeItem._id ?? "flower";
  const collection = resolveCollectionName(rawCategory);
  const categoryType = resolveCategoryType(rawCategory);
  const price = typeof safeItem.price === "number" ? safeItem.price : Number(safeItem.price) || 0;
  const mrp = Math.round(price * 1.15);

  const isFlowerStringCategory =
    normalizeCategoryKey(rawCategory) === "flowerstring" ||
    normalizeCategoryKey(rawCategory) === "flowerstrings" ||
    normalizeCategoryKey(rawCategory) === "flowersstring" ||
    normalizeCategoryKey(rawCategory) === "flowersstrings" ||
    normalizeCategoryKey(collection) === "flowerstring" ||
    normalizeCategoryKey(collection) === "flowerstrings" ||
    normalizeCategoryKey(collection) === "flowersstring" ||
    normalizeCategoryKey(collection) === "flowersstrings" ||
    String(rawName).toLowerCase().includes("flower string") ||
    String(rawName).toLowerCase().includes("flowers string");

  return {
    id: String(safeItem._id ?? Math.random()),
    slug: slugify(rawName),
    name: String(rawName),
    category: categoryType,
    collection,
    price,
    mrp,
    image: safeItem.image ?? "",
    rating: 4.8,
    reviews: 10,
    colors: isFlowerStringCategory ? undefined : ["Red", "White", "Pink"],
    size:
      normalizeCategoryKey(rawCategory) === "looseflower" ||
      normalizeCategoryKey(rawCategory) === "looseflowers" ||
      normalizeCategoryKey(collection) === "looseflower" ||
      normalizeCategoryKey(collection) === "looseflowers"
        ? "1 kg"
        : isFlowerStringCategory
        ? "1 feet"
        : "Medium",
    description: String(safeItem.description ?? ""),
    inStock: true,
    newArrival: collection === "Lotus",
    sourceCategory: rawCategory,
  };
}

function mapFlowerToProductForRequestedCategory(item: FlowerApiItem, requestedCategory?: string): Product {
  const product = mapFlowerToProduct(item);
  const requestedCollection = resolveCollectionName(requestedCategory);
  const requestedCategoryType = resolveCategoryType(requestedCategory);

  return {
    ...product,
    collection: requestedCollection,
    category: requestedCategoryType,
  };
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(resolveApiUrl(path));

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    const message =
      errorPayload?.message ||
      `Request failed with status ${response.status}`;
    throw new FlowerApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export function resolveApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (apiBaseUrl) {
    return `${apiBaseUrl}${normalizedPath}`;
  }

  // Node fetch in SSR requires an absolute URL; browser fetch can keep relative /api paths.
  if (typeof window === "undefined") {
    return `${ssrFallbackApiBaseUrl}${normalizedPath}`;
  }

  return normalizedPath;
}

export async function fetchAllFlowers() {
  const items = await request<FlowerApiItem[]>("/api/flowers");
  if (!Array.isArray(items)) return [];
  const products = items.filter(Boolean).map(mapFlowerToProduct);
  registerProducts(products);
  return products;
}

export async function fetchFlowerById(id: string) {
  const item = await request<FlowerApiItem>(`/api/flowers/${id}`);
  const product = mapFlowerToProduct(item);
  registerProducts([product]);
  return product;
}

export async function fetchFlowersByCategory(category: string) {
  const items = await request<FlowerApiItem[]>(`/api/flowers/category/${encodeURIComponent(category || "")}`);
  if (!Array.isArray(items)) return [];
  const products = items.filter(Boolean).map((item) => mapFlowerToProductForRequestedCategory(item, category));
  registerProducts(products);
  return products;
}

const SYNONYMS: Record<string, string[]> = {
  rose: ["gulab", "rosemodel", "rosepetal", "ros", "ro", "red", "pink"],
  jasmine: ["malli", "mallipoo", "malligai", "mogra", "mogr", "jas", "white"],
  garland: ["garlands", "mala", "malai", "haar", "varmala", "gar", "pathimalai"],
  varmala: ["wedding", "bridal", "marriage", "couple", "reception", "varmal"],
  flower: ["flowers", "blooms", "bouquet", "basket", "box", "loose", "poo", "pu", "flo"],
  temple: ["pooja", "puja", "god", "deity", "sacred"],
  lotus: ["lot", "thamarai", "tamara"],
  marigold: ["sammangi", "sevanthi", "mar", "yellow", "orange"],
  chamanki: ["samangi", "sammangi", "cham"],
  nandhiyavattai: ["nandhi", "nandi"],
  wedding: ["marriage", "reception", "engagement", "bridal", "varmala", "event", "wed"],
};

function getExpandedQueryTerms(query: string): string[] {
  const clean = query.toLowerCase().trim();
  const rawWords = clean.split(/\s+/).filter(Boolean);
  const terms = new Set<string>();

  for (const word of rawWords) {
    terms.add(word);
    if (word.length > 3 && word.endsWith("s")) {
      terms.add(word.slice(0, -1));
    }

    for (const [key, list] of Object.entries(SYNONYMS)) {
      if (key.includes(word) || word.includes(key) || list.some((syn) => syn.includes(word) || word.includes(syn))) {
        terms.add(key);
        list.forEach((syn) => terms.add(syn));
      }
    }
  }

  return Array.from(terms);
}

export function searchProducts(products: Product[], query?: string): Product[] {
  if (!query || !query.trim()) return products;

  const rawQuery = query.trim().toLowerCase();
  const queryTerms = getExpandedQueryTerms(query);
  const rawWords = rawQuery.split(/\s+/).filter(Boolean);

  const scored: { product: Product; score: number }[] = [];

  for (const p of products) {
    const nameLower = p.name.toLowerCase();
    const collectionLower = p.collection.toLowerCase();
    const categoryLower = p.category.toLowerCase();
    const descriptionLower = (p.description || "").toLowerCase();
    const colorsLower = (p.colors || []).join(" ").toLowerCase();
    const badgeLower = (p.badge || "").toLowerCase();

    const corpus = `${nameLower} ${collectionLower} ${categoryLower} ${badgeLower} ${colorsLower} ${descriptionLower}`;

    let score = 0;

    // 1. Exact full phrase match in name or collection
    if (nameLower === rawQuery || collectionLower === rawQuery) {
      score += 150;
    } else if (nameLower.startsWith(rawQuery) || collectionLower.startsWith(rawQuery)) {
      score += 100;
    } else if (nameLower.includes(rawQuery) || collectionLower.includes(rawQuery)) {
      score += 70;
    } else if (corpus.includes(rawQuery)) {
      score += 50;
    }

    // 2. Partial prefix & word matches
    for (const word of rawWords) {
      if (!word) continue;

      if (nameLower.startsWith(word) || collectionLower.startsWith(word)) {
        score += 40;
      } else if (nameLower.includes(word) || collectionLower.includes(word)) {
        score += 30;
      } else if (categoryLower.includes(word)) {
        score += 25;
      } else if (corpus.includes(word)) {
        score += 15;
      }
    }

    // 3. Expanded synonym / related terms match
    for (const term of queryTerms) {
      if (!term || rawWords.includes(term)) continue;

      if (nameLower.includes(term) || collectionLower.includes(term)) {
        score += 20;
      } else if (categoryLower.includes(term)) {
        score += 15;
      } else if (corpus.includes(term)) {
        score += 10;
      }
    }

    if (score > 0) {
      scored.push({ product: p, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.product);
}
