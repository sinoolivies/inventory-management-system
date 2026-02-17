import RawMaterial from "../models/RawMaterial.js";
export function createRawMaterial(req, res) {
  const { MaterialName, Quantity, Unit, UnitPrice } = req.body;
  if (!MaterialName || !Quantity || !Unit || !UnitPrice) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const rawMaterial = new RawMaterial({
    MaterialName,
    Quantity,
    Unit,
    UnitPrice,
  });
  rawMaterial
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Raw material created successfully",
        rawMaterial: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
// update raw material
export function updateRawMaterial(req, res) {
  const { id } = req.params;
  const { MaterialName, Quantity, Unit, UnitPrice } = req.body;
  RawMaterial.findByIdAndUpdate(
    id,
    { MaterialName, Quantity, Unit, UnitPrice },
    { new: true },
  )
    .then((updatedRawMaterial) => {
      if (!updatedRawMaterial) {
        return res.status(404).json({ message: "Raw material not found" });
      }
      res.status(200).json({
        message: "Raw material updated successfully",
        rawMaterial: updatedRawMaterial,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
export function getAllRawMaterials(req, res) {
  RawMaterial.find()
    .then((rawMaterials) => {
      res.status(200).json(rawMaterials);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}

export function getRawMaterialById(req, res) {
  const { id } = req.params;
  RawMaterial.findById(id)
    .then((rawMaterial) => {
      if (!rawMaterial) {
        return res.status(404).json({ message: "Raw material not found" });
      }
      res.status(200).json(rawMaterial);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
