import express from "express";
import {
  createStockOut,
  getAllStockOuts,
  getStockOutById,
} from "../controllers/StockOutController.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();
router.use(authMiddleware);

router.post("/", createStockOut);
router.get("/:id", getStockOutById);
router.get("/", getAllStockOuts);

export default router;
