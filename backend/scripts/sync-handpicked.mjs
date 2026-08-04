import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import {
  Flower,
  RosePetalFlower,
  NandhiyavattaiFlower,
  LotusFlower,
  ChamankiFlower,
  MallipooFlower,
  TempleGarlandsFlower,
  HandpickedFlower,
} from "../models/Flower.js";

const SOURCE_MODELS = [
  Flower,
  RosePetalFlower,
  NandhiyavattaiFlower,
  LotusFlower,
  ChamankiFlower,
  MallipooFlower,
  TempleGarlandsFlower,
];

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function buildHandpickedPayload(item) {
  return {
    _id: item._id,
    name: item.name,
    category: "Handpicked",
    price: item.price,
    description: item.description,
    image: item.image,
  };
}

async function loadSourceItems() {
  const items = [];
  for (const model of SOURCE_MODELS) {
    const docs = await model.find({}).lean();
    items.push(...docs);
  }
  return items;
}

async function main() {
  try {
    await connectDB();

    const sourceItems = await loadSourceItems();
    const curated = sourceItems.filter((item) => {
      const key = normalize(item.name || item.category || item.collection || "");
      return key && key !== "customizedorder";
    });

    let upserted = 0;
    for (const item of curated) {
      const payload = buildHandpickedPayload(item);
      await HandpickedFlower.updateOne(
        { _id: payload._id },
        { $set: payload },
        { upsert: true },
      );
      upserted += 1;
    }

    console.log(`Synced ${upserted} documents into ${HandpickedFlower.collection.collectionName}.`);
  } catch (error) {
    console.error("sync-handpicked failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();