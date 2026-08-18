import mongoose from "mongoose";

const flowerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    strict: false,
  },
);

// Garland & Original Models
export const Flower = mongoose.models.Flower || mongoose.model("Flower", flowerSchema, "rosemodel");
export const RosePetalFlower =
  mongoose.models.RosePetalFlower || mongoose.model("RosePetalFlower", flowerSchema, "rosepetal");
export const NandhiyavattaiFlower =
  mongoose.models.NandhiyavattaiFlower ||
  mongoose.model("NandhiyavattaiFlower", flowerSchema, "Nandhiyavattai");
export const LotusFlower =
  mongoose.models.LotusFlower || mongoose.model("LotusFlower", flowerSchema, "lotus");
export const ChamankiFlower =
  mongoose.models.ChamankiFlower ||
  mongoose.model("ChamankiFlower", flowerSchema, "Chamanki");
export const MallipooFlower =
  mongoose.models.MallipooFlower ||
  mongoose.model("MallipooFlower", flowerSchema, "Mallipoo");
export const TempleGarlandsFlower =
  mongoose.models.TempleGarlandsFlower ||
  mongoose.model("TempleGarlandsFlower", flowerSchema, "TempleGarlands");
export const HandpickedFlower =
  mongoose.models.HandpickedFlower ||
  mongoose.model("HandpickedFlower", flowerSchema, "Handpicked");
export const SpecialFlower =
  mongoose.models.SpecialFlower ||
  mongoose.model("SpecialFlower", flowerSchema, "special");

// Fresh Flower Models mapped to exact MongoDB collection names
export const RoseFlower =
  mongoose.models.RoseFlower || mongoose.model("RoseFlower", flowerSchema, "rose");
export const JasmineFlower =
  mongoose.models.JasmineFlower || mongoose.model("JasmineFlower", flowerSchema, "Jasmine");
export const JasmineLowerFlower =
  mongoose.models.JasmineLowerFlower || mongoose.model("JasmineLowerFlower", flowerSchema, "jasmine");
export const FlowerGarlandsFlower =
  mongoose.models.FlowerGarlandsFlower || mongoose.model("FlowerGarlandsFlower", flowerSchema, "Flower String");
export const FlowerCategory =
  mongoose.models.FlowerCategory || mongoose.model("FlowerCategory", flowerSchema, "Flower");
export const LilyFlower =
  mongoose.models.LilyFlower || mongoose.model("LilyFlower", flowerSchema, "lilly");
export const LilyLowerFlower =
  mongoose.models.LilyLowerFlower || mongoose.model("LilyLowerFlower", flowerSchema, "lily");
export const OrchidFlower =
  mongoose.models.OrchidFlower || mongoose.model("OrchidFlower", flowerSchema, "Orchid");
export const OrchidLowerFlower =
  mongoose.models.OrchidLowerFlower || mongoose.model("OrchidLowerFlower", flowerSchema, "orchid");
export const MarigoldFlower =
  mongoose.models.MarigoldFlower || mongoose.model("MarigoldFlower", flowerSchema, "Marigold");
export const MarigoldLowerFlower =
  mongoose.models.MarigoldLowerFlower || mongoose.model("MarigoldLowerFlower", flowerSchema, "marigold");
export const BouquetsFlower =
  mongoose.models.BouquetsFlower || mongoose.model("BouquetsFlower", flowerSchema, "Bouquets");
export const BouquetsLowerFlower =
  mongoose.models.BouquetsLowerFlower || mongoose.model("BouquetsLowerFlower", flowerSchema, "bouquets");
export const FlowerBasketsFlower =
  mongoose.models.FlowerBasketsFlower || mongoose.model("FlowerBasketsFlower", flowerSchema, "flowerbasket");
export const FlowerBasketsPluralFlower =
  mongoose.models.FlowerBasketsPluralFlower || mongoose.model("FlowerBasketsPluralFlower", flowerSchema, "flowerbaskets");
export const FlowerBoxesFlower =
  mongoose.models.FlowerBoxesFlower || mongoose.model("FlowerBoxesFlower", flowerSchema, "flowerboxes");
export const LooseFlowersFlower =
  mongoose.models.LooseFlowersFlower || mongoose.model("LooseFlowersFlower", flowerSchema, "losseflower");
export const LooseFlowersPluralFlower =
  mongoose.models.LooseFlowersPluralFlower || mongoose.model("LooseFlowersPluralFlower", flowerSchema, "looseflowers");
export const LooseFlowerCategory =
  mongoose.models.LooseFlowerCategory || mongoose.model("LooseFlowerCategory", flowerSchema, "Loose Flowers");

// Gift Models mapped to exact MongoDB collection names
export const GiftProductsFlower =
  mongoose.models.GiftProductsFlower || mongoose.model("GiftProductsFlower", flowerSchema, "gift products");
export const GiftsFlower =
  mongoose.models.GiftsFlower || mongoose.model("GiftsFlower", flowerSchema, "gifts");
export const GiftFlower =
  mongoose.models.GiftFlower || mongoose.model("GiftFlower", flowerSchema, "gift");
export const GiftProductsNoSpaceFlower =
  mongoose.models.GiftProductsNoSpaceFlower || mongoose.model("GiftProductsNoSpaceFlower", flowerSchema, "giftproducts");
