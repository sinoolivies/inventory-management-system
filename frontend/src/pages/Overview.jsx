import React, { useEffect, useState } from "react";
import { apiFetch } from "../api.js";
import { getToken } from "../auth.js";

export default function Overview() {
  const [summary, setSummary] = useState({
    materials: 0,
    suppliers: 0,
    stockIn: 0,
    stockOut: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    const load = async () => {
      try {
        setLoading(true);
        const [materials, suppliers, stockIn, stockOut] = await Promise.all([
          apiFetch("/rawMaterial", { token }),
          apiFetch("/suppliers", { token }),
          apiFetch("/stockIn", { token }),
          apiFetch("/stockOut", { token }),
        ]);
        setSummary({
          materials: materials.length,
          suppliers: suppliers.length,
          stockIn: stockIn.length,
          stockOut: stockOut.length,
        });
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Control Center
        </p>
        <h2 className="text-3xl font-semibold text-ink">Inventory Overview</h2>
        <p className="text-slate-600 max-w-2xl">
          Track inbound, outbound, and supplier activity in one place. Use the
          sections on the left to create new entries or adjust stock.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Raw Materials", value: summary.materials, tone: "bg-white" },
          { label: "Suppliers", value: summary.suppliers, tone: "bg-white" },
          { label: "Stock In Logs", value: summary.stockIn, tone: "bg-white" },
          { label: "Stock Out Logs", value: summary.stockOut, tone: "bg-white" },
        ].map((item) => (
          <div key={item.label} className={`card p-6 ${item.tone}`}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-ink">
              {loading ? "—" : item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-ink">Quick checklist</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li>Review stock levels before creating stock-out records.</li>
          <li>Keep supplier phone numbers updated for fast follow-up.</li>
          <li>Use consistent units to simplify reporting.</li>
        </ul>
      </div>
    </section>
  );
}
