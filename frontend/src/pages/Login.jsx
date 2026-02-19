import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../api.js";
import { setToken } from "../auth.js";

export default function Login({ onAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: form,
      });
      setToken(data.token);
      onAuth();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-8 space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Welcome back
          </p>
          <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
          <p className="text-sm text-slate-500">
            Manage stock movements and supplier records.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            type="email"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            required
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-slate-500">
          New here?{" "}
          <Link to="/register" className="font-semibold text-ocean">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
