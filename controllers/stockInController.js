import StockIn from "../models/StockIn.js";
import RawMaterial from "../models/RawMaterial.js";

export function createStockIn(req, res) {
  const { materialId, stockInQuantity, supplierId } = req.body;
  if (!materialId || !stockInQuantity || !supplierId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const stockIn = new StockIn({
    materialId,
    stockInQuantity,
    supplierId,
  });
  stockIn
    .save()
    .then((result) => {
      // Update the quantity of the raw material
      RawMaterial.findByIdAndUpdate(
        materialId,
        { $inc: { Quantity: stockInQuantity } },
        { new: true },
      )
        .then(() => {
          res.status(201).json({
            message: "Stock in created successfully",
            stockIn: result,
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

export function getAllStockIns(req, res) {
  StockIn.find()
    .populate("materialId", "MaterialName")
    .populate("supplierId", "SupplierName")
    .then((stockIns) => {
      res.status(200).json(stockIns);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function getStockInById(req, res) {
  const { id } = req.params;
  StockIn.findById(id)
    .then((stockIn) => {
      if (!stockIn) {
        return res.status(404).json({ message: "Stock in not found" });
      }
      res.status(200).json(stockIn);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
