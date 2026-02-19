import React, { useEffect, useState } from "react";
import { apiFetch } from "../api.js";
import { getToken } from "../auth.js";

const emptyForm = {
  materialId: "",
  supplierId: "",
  stockOutQuantity: "",
};

export default function StockOut() {
  const token = getToken();
  const [materials, setMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const [materialsData, suppliersData, stockOutData] = await Promise.all([
        apiFetch("/rawMaterial", { token }),
        apiFetch("/suppliers", { token }),
        apiFetch("/stockOut", { token }),
      ]);
      setMaterials(materialsData);
      setSuppliers(suppliersData);
      setRecords(stockOutData);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await apiFetch("/stockOut", {
        method: "POST",
        token,
        body: {
          materialId: form.materialId,
          supplierId: form.supplierId,
          stockOutQuantity: Number(form.stockOutQuantity),
        },
      });
      setMessage("Stock-out record created.");
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Stock Out</h2>
          <p className="text-sm text-slate-500">
            Track outbound stock and update quantities automatically.
          </p>
        </div>
        <span className="badge">{records.length} logs</span>
      </div>

      {(message || error) && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-600"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-600">Dispatch</p>
            <h3 className="text-lg font-semibold text-ink">Create stock-out</h3>
          </div>
          <select
            name="materialId"
            value={form.materialId}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-3 py-2"
            required
          >
            <option value="">Select material</option>
            {materials.map((material) => (
              <option key={material._id} value={material._id}>
                {material.MaterialName}
              </option>
            ))}
          </select>
          <select
            name="supplierId"
            value={form.supplierId}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-3 py-2"
            required
          >
            <option value="">Select supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.SupplierName}
              </option>
            ))}
          </select>
          <input
            name="stockOutQuantity"
            value={form.stockOutQuantity}
            onChange={handleChange}
            placeholder="Quantity"
            type="number"
            min="0"
            step="0.01"
            className="rounded-xl border border-slate-200 px-3 py-2"
            required
          />
          <button
            type="submit"
            className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
          >
            Log stock out
          </button>
        </form>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-ink">Recent stock-outs</h3>
          <p className="text-sm text-slate-500">
            {loading ? "Loading records..." : "Latest outbound activity"}
          </p>
          <div className="mt-4 space-y-3">
            {records.map((record) => (
              <div
                key={record._id}
                className="rounded-2xl border border-slate-100 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">
                    {record.materialId?.MaterialName || "Material"}
                  </p>
                  <span className="text-xs text-slate-400">
                    {new Date(record.stockOutDate || record.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {record.stockOutQuantity} units · {record.supplierId?.SupplierName}
                </p>
              </div>
            ))}
            {!loading && records.length === 0 && (
              <p className="text-sm text-slate-500">No stock-out records yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
