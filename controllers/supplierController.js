import Supplier from "../models/Supplier.js";
export function createSupplier(req, res) {
  const { phoneNumber, SupplierName } = req.body;
  if (!phoneNumber || !SupplierName) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const supplier = new Supplier({
    phoneNumber,
    SupplierName,
  });
  supplier
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Supplier created successfully",
        supplier: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function getAllSuppliers(req, res) {
  Supplier.find()
    .then((suppliers) => {
      res.status(200).json(suppliers);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function getSupplierById(req, res) {
  const { id } = req.params;
  Supplier.findById(id)
    .then((supplier) => {
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(200).json(supplier);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
