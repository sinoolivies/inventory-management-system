import mongoose from "mongoose";

const stockInSchema = new mongoose.Schema({
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawMaterial",
    required: true,
  },
  stockInQuantity: {
    type: Number,
    required: true,
  },
  stockInDate: {
    type: Date,
    default: Date.now,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
});

const StockIn = mongoose.model("StockIn", stockInSchema);

export default StockIn;
