import React, { useEffect, useState } from "react";
import { apiFetch } from "../api.js";
import { getToken } from "../auth.js";

const emptyForm = {
  MaterialName: "",
  Quantity: "",
  Unit: "",
  UnitPrice: "",
};

export default function Materials() {
  const token = getToken();
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/rawMaterial", { token });
      setMaterials(data);
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
      const payload = {
        MaterialName: form.MaterialName,
        Quantity: Number(form.Quantity),
        Unit: form.Unit,
        UnitPrice: Number(form.UnitPrice),
      };

      if (editingId) {
        await apiFetch(`/rawMaterial/${editingId}`, {
          method: "PUT",
          token,
          body: payload,
        });
        setMessage("Raw material updated.");
      } else {
        await apiFetch("/rawMaterial", {
          method: "POST",
          token,
          body: payload,
        });
        setMessage("Raw material created.");
      }

      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (material) => {
    setEditingId(material._id);
    setForm({
      MaterialName: material.MaterialName || "",
      Quantity: material.Quantity ?? "",
      Unit: material.Unit || "",
      UnitPrice: material.UnitPrice ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Raw Materials</h2>
          <p className="text-sm text-slate-500">
            Add new materials or update existing stock details.
          </p>
        </div>
        <span className="badge">{materials.length} items</span>
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

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-600">
              {editingId ? "Edit material" : "Create material"}
            </p>
            <h3 className="text-lg font-semibold text-ink">
              {editingId ? "Update details" : "New material"}
            </h3>
          </div>

          <div className="grid gap-3">
            <input
              name="MaterialName"
              value={form.MaterialName}
              onChange={handleChange}
              placeholder="Material name"
              className="rounded-xl border border-slate-200 px-3 py-2"
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="Quantity"
                value={form.Quantity}
                onChange={handleChange}
                placeholder="Quantity"
                type="number"
                min="0"
                step="0.01"
                className="rounded-xl border border-slate-200 px-3 py-2"
                required
              />
              <input
                name="Unit"
                value={form.Unit}
                onChange={handleChange}
                placeholder="Unit (kg, pcs, etc.)"
                className="rounded-xl border border-slate-200 px-3 py-2"
                required
              />
            </div>
            <input
              name="UnitPrice"
              value={form.UnitPrice}
              onChange={handleChange}
              placeholder="Unit price"
              type="number"
              min="0"
              step="0.01"
              className="rounded-xl border border-slate-200 px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
            >
              {editingId ? "Save changes" : "Create material"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-ink">Current stock</h3>
          <p className="text-sm text-slate-500">
            {loading ? "Loading data..." : "Tap an item to edit."}
          </p>
          <div className="mt-4 space-y-3">
            {materials.map((material) => (
              <button
                key={material._id}
                type="button"
                onClick={() => startEdit(material)}
                className="w-full rounded-2xl border border-slate-100 px-4 py-3 text-left transition hover:border-slate-200 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink">
                      {material.MaterialName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {material.Quantity} {material.Unit} · ${material.UnitPrice}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    Edit
                  </span>
                </div>
              </button>
            ))}
            {!loading && materials.length === 0 && (
              <p className="text-sm text-slate-500">No materials yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
