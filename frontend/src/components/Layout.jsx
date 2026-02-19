import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Overview", to: "/" },
  { label: "Raw Materials", to: "/materials" },
  { label: "Suppliers", to: "/suppliers" },
  { label: "Stock In", to: "/stock-in" },
  { label: "Stock Out", to: "/stock-out" },
];

export default function Layout({ onLogout, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[280px_1fr]">
      <aside className="glass p-6 lg:rounded-r-[32px] lg:min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Inventory
            </p>
            <h1 className="text-2xl font-semibold text-ink">Studio</h1>
          </div>
          <span className="badge">Live</span>
        </div>
        <nav className="mt-10 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-ink text-white shadow"
                    : "text-slate-600 hover:bg-white/80"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={onLogout}
          className="mt-10 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:shadow"
        >
          Sign out
        </button>
        <div className="mt-8 text-xs text-slate-400">
          <p>API: http://localhost:5000</p>
          <p className="mt-2">Tailwind + Vite</p>
        </div>
      </aside>

      <main className="p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
