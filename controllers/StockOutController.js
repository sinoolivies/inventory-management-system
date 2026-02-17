import StockOut from "../models/StockOut.js";
import RawMaterial from "../models/RawMaterial.js";

export function createStockOut(req, res) {
  const { materialId, stockOutQuantity, supplierId } = req.body;
  if (!materialId || !stockOutQuantity || !supplierId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const stockOut = new StockOut({
    materialId,
    stockOutQuantity,
    supplierId,
  });
  stockOut
    .save()
    .then((result) => {
      // Update the quantity of the raw material
      RawMaterial.findByIdAndUpdate(
        materialId,
        { $inc: { Quantity: -stockOutQuantity } },
        { new: true },
      )
        .then(() => {
          res.status(201).json({
            message: "Stock out created successfully",
            stockOut: result,
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function getAllStockOuts(req, res) {
  StockOut.find()
    .populate("materialId", "MaterialName")
    .populate("supplierId", "SupplierName")
    .then((stockOuts) => {
      res.status(200).json(stockOuts);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function getStockOutById(req, res) {
  const { id } = req.params;
  StockOut.findById(id)
    .then((stockOut) => {
      if (!stockOut) {
        return res.status(404).json({ message: "Stock out not found" });
      }
      res.status(200).json(stockOut);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
