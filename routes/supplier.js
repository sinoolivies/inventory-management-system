import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
} from "../controllers/supplierController.js";
import express from "express";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();
router.use(authMiddleware);

router.post("/", createSupplier);
router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);

export default router;
