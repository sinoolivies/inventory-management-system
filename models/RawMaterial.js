import mongoose from "mongoose";

const rawMaterialSchema = new mongoose.Schema({
  MaterialName: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Unit: { type: String, required: true },
  UnitPrice: { type: Number, required: true },
});
const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);

export default RawMaterial;
