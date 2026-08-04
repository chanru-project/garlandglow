import { connectDB } from "../config/db.js";
import mongoose from "mongoose";
import {
  Flower,
  RosePetalFlower,
  NandhiyavattaiFlower,
  LotusFlower,
  ChamankiFlower,
} from "../models/Flower.js";

const COLLECTION_IMAGE_MAP = {
  rosemodel: "/assets/cat-rose.jpg",
  rosepetal: "/assets/cat-rose.jpg",
  nandhiyavattai: "/assets/g1.jpg",
  lotus: "/assets/g6.jpg",
  chamanki: "/assets/g3.jpg",
};

async function updateCollection(model, defaultImage) {
  const filter = { $or: [{ image: { $exists: false } }, { image: "" }, { image: null }] };
  const update = { $set: { image: defaultImage } };
  const res = await model.updateMany(filter, update);
  console.log(`Updated ${res.modifiedCount} documents on ${model.collection.collectionName} to set default image.`);
}

async function main() {
  try {
    await connectDB();

    // Update each collection's documents where image is missing
    // await updateCollection(Flower, COLLECTION_IMAGE_MAP.rosemodel);
    // await updateCollection(RosePetalFlower, COLLECTION_IMAGE_MAP.rosepetal || "/assets/hero-garlands.jpg");
    // await updateCollection(NandhiyavattaiFlower, COLLECTION_IMAGE_MAP.nandhiyavattai || "/assets/hero-garlands.jpg");
    // await updateCollection(LotusFlower, COLLECTION_IMAGE_MAP.lotus || "/assets/hero-garlands.jpg");
    // await updateCollection(ChamankiFlower, COLLECTION_IMAGE_MAP.chamanki || "/assets/hero-garlands.jpg");

    console.log("Image update completed.");
  } catch (err) {
    console.error("Error updating images:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
