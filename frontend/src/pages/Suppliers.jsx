import React, { useEffect, useState } from "react";
import { apiFetch } from "../api.js";
import { getToken } from "../auth.js";

const emptyForm = { SupplierName: "", phoneNumber: "" };

export default function Suppliers() {
  const token = getToken();
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/suppliers", { token });
      setSuppliers(data);
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
      await apiFetch("/suppliers", {
        method: "POST",
        token,
        body: form,
      });
      setMessage("Supplier added.");
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
          <h2 className="text-2xl font-semibold text-ink">Suppliers</h2>
          <p className="text-sm text-slate-500">
            Capture supplier contacts for inbound and outbound records.
          </p>
        </div>
        <span className="badge">{suppliers.length} total</span>
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

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-600">New supplier</p>
            <h3 className="text-lg font-semibold text-ink">Create record</h3>
          </div>
          <input
            name="SupplierName"
            value={form.SupplierName}
            onChange={handleChange}
            placeholder="Supplier name"
            className="rounded-xl border border-slate-200 px-3 py-2"
            required
          />
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone number"
            className="rounded-xl border border-slate-200 px-3 py-2"
            required
          />
          <button
            type="submit"
            className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
          >
            Add supplier
          </button>
        </form>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-ink">Supplier list</h3>
          <p className="text-sm text-slate-500">
            {loading ? "Loading suppliers..." : "Tap to copy phone numbers."}
          </p>
          <div className="mt-4 space-y-3">
            {suppliers.map((supplier) => (
              <div
                key={supplier._id}
                className="rounded-2xl border border-slate-100 px-4 py-3"
              >
                <p className="font-semibold text-ink">
                  {supplier.SupplierName}
                </p>
                <p className="text-xs text-slate-500">
                  {supplier.phoneNumber}
                </p>
              </div>
            ))}
            {!loading && suppliers.length === 0 && (
              <p className="text-sm text-slate-500">No suppliers yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
