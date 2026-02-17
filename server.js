import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import stockInRoutes from "./routes/stockin.js";
import stockOutRoutes from "./routes/stockOut.js";
import rawMaterialRoutes from "./routes/rawMaterial.js";
import supplierRoutes from "./routes/supplier.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // ✅ fixed
  }),
);

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/reactsec")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rawMaterial", rawMaterialRoutes);
app.use("/api/stockIn", stockInRoutes);
app.use("/api/stockOut", stockOutRoutes);
app.use("/api/suppliers", supplierRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
