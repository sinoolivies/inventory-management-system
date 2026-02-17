import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    SupplierName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }, // recommended
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
