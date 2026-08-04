import express from "express";
import { getAllFlowers, getFlowerById, getFlowersByCategory, getCollectionImages, getHandpicked } from "../controllers/flowerController.js";

const router = express.Router();

router.get("/", getAllFlowers);
router.get("/handpicked", getHandpicked);
router.get("/category/:category", getFlowersByCategory);
router.get("/collections/images", getCollectionImages);
router.get("/:id", getFlowerById);


export default router;
