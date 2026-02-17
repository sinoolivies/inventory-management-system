import express from "express";
import {
  createRawMaterial,
  updateRawMaterial,
  getAllRawMaterials,
} from "../controllers/rawMaterialController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", createRawMaterial);
router.put("/:id", updateRawMaterial);
router.get("/", getAllRawMaterials);

export default router;
