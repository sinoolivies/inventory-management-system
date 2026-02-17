import express from "express";
import {
  createStockIn,
  getAllStockIns,
  getStockInById,
} from "../controllers/stockInController.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();
router.use(authMiddleware);

router.post("/", createStockIn);
router.get("/:id", getStockInById);
router.get("/", getAllStockIns);

export default router;
