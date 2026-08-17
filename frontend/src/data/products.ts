import heroImg from "@/assets/hero-garlands.jpg";
import jasmineImg from "@/assets/cat-jasmine.jpg";
import lotusImg from "@/assets/cat-jasmine.jpg";
import roseImg from "@/assets/cat-rose.jpg";
import marigoldImg from "@/assets/cat-marigold.jpg";
import bridalImg from "@/assets/cat-bridal.jpg";
import bouquetImg from "@/assets/cat-bouquet.jpg";
import templeImg from "@/assets/cat-temple.jpg";
import r8Img from "@/assets/g1.jpg";
import r9Img from "@/assets/g2.avif";
import r10Img from "@/assets/g3.jpg";
import r11Img from "@/assets/g4.jpg";
import r12Img from "@/assets/g5.jpg";
import r13Img from "@/assets/g6.jpg";
import r14Img from "@/assets/cat-rose.jpg";
import r15Img from "@/assets/cat-marigold.jpg";
import r16Img from "@/assets/cat-jasmine.jpg";
import r17Img from "@/assets/cat-bouquet.jpg";

export const IMAGES = {
  heroImg,
  jasmineImg,
  roseImg,
  marigoldImg,
  rosepetalImg: roseImg,
  bouquetImg,
  templeImg,
  r8Img,
  r9Img,
  r10Img,
  r11Img,
  r12Img,
  r13Img,
  r14Img,
  r15Img,
  r16Img,
  r17Img,
};

// Mapping of collection display names to representative images used across the UI.
export const COLLECTION_IMAGES: Record<string, string> = {
  "Rose": roseImg,
  "Rose Model": r8Img,
  "Rose Petal": r14Img,
  "Nandhiyavattai": r9Img,
  "Chamanki": r11Img,
  "Lotus": r16Img,
  "Handpicked": r13Img,
  "Bridal Varmala": bridalImg,
  "Rose Garlands": roseImg,
  "Jasmine (Malli)": jasmineImg,
  "Marigold": marigoldImg,
  "Temple Garlands": templeImg,
  "Bouquets": bouquetImg,
  "Mallipoo": r10Img,
  "Special": r12Img,
};

const COLLECTION_DEFAULT_IMAGE: Record<string, string> = {
  "Rose": roseImg,
  "Rose Model": r8Img,
  "Rose Petal": r14Img,
  "Nandhiyavattai": r9Img,
  "Chamanki": r11Img,
  "Lotus": r16Img,
  "Handpicked": r13Img,
  "Bridal Varmala": bridalImg,
  "Rose Garlands": roseImg,
  "Jasmine (Malli)": jasmineImg,
  "Marigold": marigoldImg,
  "Temple Garlands": templeImg,
  "Bouquets": bouquetImg,
  "Mallipoo": r10Img,
  "Special": r12Img,
};

export const ROSEMODEL_IMAGES = [
  heroImg,
  jasmineImg,
  roseImg,
  marigoldImg,
  bridalImg,
  bouquetImg,
  templeImg,
  r8Img,
  r9Img,
  r10Img,
  r11Img,
  r12Img,
  r13Img,
  r14Img,
  r15Img,
  r16Img,
  r17Img,
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "garlands" | "flowers";
  collection: string;
  price: number;
  mrp: number;
  image: string;
  rating: number;
  reviews: number;
  colors?: string[];
  size?: string;
  badge?: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  sourceCategory?: string;
};

export const GARLAND_COLLECTIONS = [
  "Customized order",
  "Rose Model",
  "Rose Petal",
  "Nandhiyavattai",
  "Chamanki",
  "Lotus",
  "Special",
  "Mallipoo",
  "Temple Garlands",
  "Handpicked",
];

export const FLOWER_COLLECTIONS = [
  "Rose",
  "Jasmine",
  "Flower String",
  "Flower",
  "Lily",
  "Orchid",
  "Marigold",
  "Bouquets",
  "Flower Baskets",
  "Flower Boxes",
  "Loose Flower",
];

export const OCCASIONS = [
  "flowers string",
  "Loose flowers",
  "Rose",
  "Flower Boxes",
  "Garlands",
  "Dj and Sounds",
  "Catering",
  "Gifts Collection",
  "Event Stage Decoration",
  "Customized Order",
];

const IMG_POOL = ROSEMODEL_IMAGES;

function makeProduct(
  i: number,
  category: "garlands" | "flowers",
  collection: string,
  overrides: Partial<Product> = {},
): Product {
  const price = overrides.price ?? 499 + ((i * 137) % 4500);
  const mrp = overrides.mrp ?? Math.round(price * (1.15 + ((i % 5) * 0.05)));
  const slug = `${collection}-${i}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    id: `${category}-${slug}`,
    slug,
    name: overrides.name ?? `${collection} — Design ${((i % 12) + 1).toString().padStart(2, "0")}`,
    category,
    collection,
    price,
    mrp,
    image: overrides.image ?? COLLECTION_DEFAULT_IMAGE[collection] ?? IMG_POOL[i % IMG_POOL.length],
    rating: 4 + ((i * 7) % 10) / 10,
    reviews: 12 + ((i * 31) % 480),
    colors: ["Red", "White", "Pink", "Yellow", "Orange", "Mixed"].slice(0, (i % 4) + 2),
    size: ["Small", "Medium", "Large", "XL"][i % 4],
    description:
      "Hand-crafted daily with fresh, farm-sourced blooms. Assembled by our master florists using traditional techniques passed down over generations. Delivered chilled to preserve freshness for your special moment.",
    inStock: i % 13 !== 0,
    featured: i % 6 === 0,
    bestSeller: i % 4 === 0,
    newArrival: i % 9 === 0,
    ...overrides,
  };
}

const roseModelData = [
  { image: heroImg, name: "Rose Model", price: 15000, mrp: 1800 },
  { image: jasmineImg, name: "Rose Model", price: 1750, mrp: 2100 },
  { image: roseImg, name: "Rose Model", price: 2200, mrp: 2600 },
  { image: marigoldImg, name: "Rose Model", price: 2800, mrp: 3300 },
  { image: bridalImg, name: "Rose Model", price: 3500, mrp: 4000 },
  { image: bouquetImg, name: "Rose Model", price: 1900, mrp: 2300 },
  { image: templeImg, name: "Rose Model", price: 2600, mrp: 3100 },
  { image: r8Img, name: "Rose Model", price: 4200, mrp: 4800 },
  { image: r9Img, name: "Rose Model", price: 2400, mrp: 2900 },
  { image: r10Img, name: "Rose Model", price: 3200, mrp: 3800 },
  { image: r11Img, name: "Rose Model", price: 4500, mrp: 5200 },
  { image: r12Img, name: "Rose Model", price: 3800, mrp: 4400 },
  { image: r13Img, name: "Rose Model", price: 2700, mrp: 3200 },
  { image: r14Img, name: "Rose Model", price: 5600, mrp: 6500 },
  { image: r15Img, name: "Rose Model", price: 6100, mrp: 7000 },
  { image: r16Img, name: "Rose Model", price: 7200, mrp: 8200 },
  { image: r17Img, name: "Rose Model", price: 8500, mrp: 9500 },
];

function buildAll(): Product[] {
  const list: Product[] = [];

  GARLAND_COLLECTIONS.forEach((c, ci) => {
    if (c === "Rose Model") {
      roseModelData.forEach((item, i) => {
        list.push(
          makeProduct(ci * 100 + i, "garlands", c, {
            image: item.image,
            name: item.name,
            price: item.price,
            mrp: item.mrp,
          }),
        );
      });
      return;
    }

    const count = ci < 6 ? 8 : 5;

    for (let i = 0; i < count; i++) {
      list.push(makeProduct(ci * 17 + i, "garlands", c));
    }
  });

  FLOWER_COLLECTIONS.forEach((c, ci) => {
    if (c === "Rose") {
      // Do not hardcode product data in frontend for Rose; fetched dynamically from MongoDB
      return;
    }
    for (let i = 0; i < 6; i++) {
      list.push(makeProduct(1000 + ci * 11 + i, "flowers", c));
    }
  });

  return list;
}

export const PRODUCTS: Product[] = buildAll();

const productRegistry = new Map<string, Product>(PRODUCTS.map((product) => [product.id, product]));

export function registerProducts(products: Product[]) {
  products.forEach((product) => {
    productRegistry.set(product.id, product);
  });
}

export function getProduct(id: string) {
  return productRegistry.get(id);
}

export function getProductsByIds(ids: string[]) {
  return ids
    .map((id) => productRegistry.get(id))
    .filter((product): product is Product => Boolean(product));
}

export function getAllKnownProducts() {
  return Array.from(productRegistry.values());
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function isLooseFlower(
  product?: {
    category?: string;
    collection?: string;
    sourceCategory?: string;
    name?: string;
  } | null,
): boolean {
  if (!product) return false;
  const normalize = (s?: string) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

  const coll = normalize(product.collection);
  const src = normalize(product.sourceCategory);
  const cat = normalize(product.category);

  return (
    coll === "looseflower" ||
    coll === "looseflowers" ||
    src === "looseflower" ||
    src === "looseflowers" ||
    cat === "looseflower" ||
    cat === "looseflowers" ||
    String(product.name || "").toLowerCase().includes("loose flower")
  );
}

export function isFlowerString(
  product?: {
    category?: string;
    collection?: string;
    sourceCategory?: string;
    name?: string;
  } | null,
): boolean {
  if (!product) return false;
  const normalize = (s?: string) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

  const coll = normalize(product.collection);
  const src = normalize(product.sourceCategory);
  const cat = normalize(product.category);

  return (
    coll === "flowerstring" ||
    coll === "flowerstrings" ||
    coll === "flowersstring" ||
    coll === "flowersstrings" ||
    src === "flowerstring" ||
    src === "flowerstrings" ||
    src === "flowersstring" ||
    src === "flowersstrings" ||
    cat === "flowerstring" ||
    cat === "flowerstrings" ||
    cat === "flowersstring" ||
    cat === "flowersstrings" ||
    String(product.name || "").toLowerCase().includes("flower string") ||
    String(product.name || "").toLowerCase().includes("flowers string")
  );
}

export function getProductPriceSuffix(
  product?: {
    category?: string;
    collection?: string;
    sourceCategory?: string;
    name?: string;
  } | null,
): string {
  if (isLooseFlower(product)) return " / 1 kg";
  if (isFlowerString(product)) return " / 1 feet";
  return "";
}

