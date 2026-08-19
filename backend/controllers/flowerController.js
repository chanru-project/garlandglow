import mongoose from "mongoose";
import {
  Flower,
  RosePetalFlower,
  NandhiyavattaiFlower,
  LotusFlower,
  ChamankiFlower,
  MallipooFlower,
  TempleGarlandsFlower,
  HandpickedFlower,
  SpecialFlower,
  RoseFlower,
  JasmineFlower,
  JasmineLowerFlower,
  FlowerGarlandsFlower,
  FlowerCategory,
  LilyFlower,
  LilyLowerFlower,
  OrchidFlower,
  OrchidLowerFlower,
  MarigoldFlower,
  MarigoldLowerFlower,
  BouquetsFlower,
  BouquetsLowerFlower,
  FlowerBasketsFlower,
  FlowerBasketsPluralFlower,
  FlowerBoxesFlower,
  LooseFlowersFlower,
  LooseFlowersPluralFlower,
  LooseFlowerCategory,
  GiftProductsFlower,
  GiftsFlower,
  GiftFlower,
  GiftProductsNoSpaceFlower,
} from "../models/Flower.js";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeCategory(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

async function safeFind(model, filter = {}) {
  try {
    return await model.find(filter).maxTimeMS(10000).lean();
  } catch (error) {
    console.warn(`[mongo] ${model.modelName || "unknown-model"} lookup failed:`, error?.message || error);
    return [];
  }
}

function extractDesignNumber(value) {
  const text = String(value || "");
  const match = text.match(/design\s*(\d+)/i) || text.match(/(\d+)/);
  if (!match) return null;
  const numericValue = Number(match[1]);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function sortSpecialCollectionItems(items = []) {
  return [...items].sort((a, b) => {
    const aDesign = extractDesignNumber(a?.name);
    const bDesign = extractDesignNumber(b?.name);

    if (aDesign !== null && bDesign !== null) {
      return aDesign - bDesign;
    }

    if (aDesign !== null) {
      return -1;
    }

    if (bDesign !== null) {
      return 1;
    }

    const aTime = new Date(a?.createdAt || 0).getTime();
    const bTime = new Date(b?.createdAt || 0).getTime();
    return aTime - bTime;
  });
}

const categoryModelMap = {
  // Gifts & Surprises
  gifts: [GiftProductsFlower, GiftsFlower, GiftFlower, GiftProductsNoSpaceFlower],
  gift: [GiftProductsFlower, GiftsFlower, GiftFlower, GiftProductsNoSpaceFlower],
  giftproducts: [GiftProductsFlower, GiftsFlower, GiftFlower, GiftProductsNoSpaceFlower],
  giftproduct: [GiftProductsFlower, GiftsFlower, GiftFlower, GiftProductsNoSpaceFlower],

  // Fresh Flowers
  flowerboxes: [FlowerBoxesFlower],
  flowerbaskets: [FlowerBasketsFlower, FlowerBasketsPluralFlower],
  bouquets: [BouquetsFlower, BouquetsLowerFlower],
  looseflower: [LooseFlowerCategory],
  looseflowers: [LooseFlowerCategory],
  marigold: [MarigoldFlower, MarigoldLowerFlower],
  orchid: [OrchidFlower, OrchidLowerFlower],
  lily: [LilyFlower, LilyLowerFlower],
  jasmine: [JasmineFlower, JasmineLowerFlower],
  flowerstring: [FlowerGarlandsFlower],
  flower: [FlowerCategory],
  rose: [RoseFlower],

  // Garlands
  rosemodel: [Flower],
  rosepetal: [RosePetalFlower],
  nandhiyavattai: [NandhiyavattaiFlower],
  lotus: [LotusFlower],
  chamanki: [ChamankiFlower],
  mallipoo: [MallipooFlower],
  templegarlands: [TempleGarlandsFlower],
  handpicked: [HandpickedFlower],
  special: [SpecialFlower],
};

async function findAcrossCollections(filter = {}) {
  const allModels = Object.values(categoryModelMap).flat();
  const uniqueModels = Array.from(new Set(allModels));

  const settled = await Promise.allSettled(uniqueModels.map((model) => safeFind(model, filter)));
  const items = settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));

  // Deduplicate by string ID
  const map = new Map();
  items.forEach((item) => {
    if (item && item._id) {
      map.set(String(item._id), item);
    }
  });
  return Array.from(map.values());
}

export async function getAllFlowers(_req, res) {
  try {
    const flowers = await findAcrossCollections({});
    flowers.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    console.log(`[Backend Debug] getAllFlowers returned ${flowers.length} total items.`);
    return res.status(200).json(flowers);
  } catch (error) {
    console.error("getAllFlowers error:", error);
    return res.status(500).json({ message: "Failed to fetch flowers." });
  }
}

export async function getFlowerById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid flower id." });
    }

    const allModels = Object.values(categoryModelMap).flat();
    const uniqueModels = Array.from(new Set(allModels));

    const settled = await Promise.allSettled(uniqueModels.map((m) => m.findById(id).lean()));
    const resolvedFlower = settled.map((s) => (s.status === "fulfilled" ? s.value : null)).find(Boolean) || null;

    return res.status(200).json(resolvedFlower);
  } catch (error) {
    console.error("getFlowerById error:", error);
    return res.status(500).json({ message: "Failed to fetch flower." });
  }
}

export async function getFlowersByCategory(req, res) {
  try {
    const rawCategory = (req.params.category || "").trim();
    if (!rawCategory) {
      return res.status(400).json({ message: "Category is required." });
    }

    const normalizedTarget = normalizeCategory(rawCategory);
    console.log(`[Backend Debug] getFlowersByCategory requested category: "${rawCategory}" (normalized: "${normalizedTarget}")`);

    const targetModels = categoryModelMap[normalizedTarget] || [];
    let flowers = [];
    const categoryFilter =
      normalizedTarget === "flowerstring"
        ? { category: /^flower\s+string$/i }
        : normalizedTarget === "looseflower" || normalizedTarget === "looseflowers"
          ? { category: /^\s*loose\s+flower\s*$/i }
        : normalizedTarget === "flower"
          ? { category: /^flower$/i }
        : normalizedTarget === "rose"
          ? { category: /^rose$/i }
        : {};

    if (targetModels.length > 0) {
      const settled = await Promise.allSettled(targetModels.map((m) => safeFind(m, categoryFilter)));
      flowers = settled.flatMap((s) => (s.status === "fulfilled" ? s.value : []));

      // Deduplicate by string ID
      const map = new Map();
      flowers.forEach((item) => {
        if (item && item._id) map.set(String(item._id), item);
      });
      flowers = Array.from(map.values());
    }

    if (flowers.length === 0) {
      const categoryMatcher =
        normalizedTarget === "flowerstring"
          ? /^flower\s+string$/i
          : normalizedTarget === "looseflower" || normalizedTarget === "looseflowers"
            ? /^\s*loose\s+flower\s*$/i
          : normalizedTarget === "flower"
            ? /^flower$/i
          : new RegExp(`^${escapeRegex(rawCategory)}$`, "i");
      flowers = await findAcrossCollections({ category: categoryMatcher });
    }

    if (normalizedTarget === "special") {
      flowers = sortSpecialCollectionItems(flowers);
    } else {
      flowers.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), "en", {
          numeric: true,
          sensitivity: "base",
        }),
      );
    }

    console.log(`[Backend Debug] getFlowersByCategory returning ${flowers.length} documents strictly for category: "${rawCategory}"`);
    return res.status(200).json(flowers);
  } catch (error) {
    console.error("getFlowersByCategory error:", error);
    return res.status(500).json({ message: "Failed to fetch flowers by category." });
  }
}

export async function getCollectionImages(_req, res) {
  try {
    const map = {};

    const [
      roseModelItem,
      rosePetalItem,
      nandhiyavattaiItem,
      lotusItem,
      chamankiItem,
      mallipooItem,
      templeGarlandsItem,
      handpickedItem,
      specialItem,
      roseItem,
      jasmineItem,
      lilyItem,
      orchidItem,
      marigoldItem,
      bouquetsItem,
      flowerBasketsItem,
      flowerBoxesItem,
      looseFlowersItem,
      looseFlowerCategoryItem,
      giftProductsItem,
      flowerStringItem,
    ] = await Promise.allSettled([
      Flower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      RosePetalFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      NandhiyavattaiFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      LotusFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      ChamankiFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      MallipooFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      TempleGarlandsFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      HandpickedFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      SpecialFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      RoseFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      JasmineFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      LilyFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      OrchidFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      MarigoldFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      BouquetsFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      FlowerBasketsFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      FlowerBoxesFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      LooseFlowersFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      LooseFlowerCategory.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      LooseFlowersPluralFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      GiftProductsFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      FlowerGarlandsFlower.findOne({ image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
      FlowerCategory.findOne({ category: /^flower\s*string$/i, image: { $ne: "" } }).sort({ createdAt: -1 }).lean(),
    ]);

    const resolvedLooseFlower =
      (looseFlowerCategoryItem?.status === "fulfilled" && looseFlowerCategoryItem.value) ||
      (looseFlowersItem?.status === "fulfilled" && looseFlowersItem.value) ||
      null;

    const resolvedFlowerString =
      (flowerStringItem?.status === "fulfilled" && flowerStringItem.value) ||
      null;

    const collectionBuckets = [
      // Garlands
      { label: "Rose Model", item: roseModelItem },
      { label: "Rose Petal", item: rosePetalItem },
      { label: "Nandhiyavattai", item: nandhiyavattaiItem },
      { label: "Chamanki", item: chamankiItem },
      { label: "Lotus", item: lotusItem },
      { label: "Mallipoo", item: mallipooItem },
      { label: "Temple Garlands", item: templeGarlandsItem },
      { label: "Handpicked", item: handpickedItem },
      { label: "Special", item: specialItem },

      // Fresh Flowers & Gifts
      { label: "Rose", item: roseItem },
      { label: "Jasmine", item: jasmineItem },
      { label: "Lily", item: lilyItem },
      { label: "Orchid", item: orchidItem },
      { label: "Marigold", item: marigoldItem },
      { label: "Bouquets", item: bouquetsItem },
      { label: "Flower Baskets", item: flowerBasketsItem },
      { label: "Flower Boxes", item: flowerBoxesItem },
      { label: "Loose Flowers", item: { status: "fulfilled", value: resolvedLooseFlower } },
      { label: "Loose Flower", item: { status: "fulfilled", value: resolvedLooseFlower } },
      { label: "Flower String", item: { status: "fulfilled", value: resolvedFlowerString } },
      { label: "Flower Strings", item: { status: "fulfilled", value: resolvedFlowerString } },
      { label: "Gift", item: giftProductsItem },
      { label: "Gifts", item: giftProductsItem },
    ];

    collectionBuckets.forEach(({ label, item }) => {
      const val = item?.status === "fulfilled" ? item.value : null;
      if (val?.image) {
        map[label] = val.image;
        map[normalizeCategory(label)] = val.image;
      }
    });

    const roseProductImage =
      (roseItem?.status === "fulfilled" && roseItem.value?.image) ||
      "";

    if (roseProductImage) {
      map["Rose"] = roseProductImage;
      map["rose"] = roseProductImage;
    }

    console.log("[Backend Debug] getCollectionImages generated map for Rose:", map["Rose"]);
    return res.status(200).json(map);
  } catch (error) {
    console.error("getCollectionImages error:", error);
    return res.status(500).json({ message: "Failed to fetch collection images." });
  }
}

export async function getHandpicked(_req, res) {
  try {
    const items = await safeFind(HandpickedFlower, {});
    return res.status(200).json(items);
  } catch (error) {
    console.error("getHandpicked error:", error);
    return res.status(500).json({
      message: "Failed to fetch handpicked items.",
    });
  }
}
