import mongoose from "mongoose";

const stockOutSchema = new mongoose.Schema(
  {
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterial",
      required: true,
    },
    stockOutQuantity: {
      type: Number,
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    stockOutDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }, // optional but recommended
);

const StockOut = mongoose.model("StockOut", stockOutSchema);

export default StockOut;
