import React, { useMemo, useState } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import { clearToken, getToken } from "./auth.js";
import Overview from "./pages/Overview.jsx";
import Materials from "./pages/Materials.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import StockIn from "./pages/StockIn.jsx";
import StockOut from "./pages/StockOut.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function ProtectedShell({ onLogout }) {
  return (
    <Layout onLogout={onLogout}>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  const [token, setTokenState] = useState(getToken());
  const navigate = useNavigate();

  const handleAuth = () => {
    setTokenState(getToken());
  };

  const handleLogout = () => {
    clearToken();
    setTokenState(null);
    navigate("/login");
  };

  const hasToken = useMemo(() => Boolean(token), [token]);

  return (
    <Routes>
      <Route path="/login" element={<Login onAuth={handleAuth} />} />
      <Route path="/register" element={<Register onAuth={handleAuth} />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <ProtectedShell onLogout={handleLogout} />
          </RequireAuth>
        }
      >
        <Route index element={<Overview />} />
        <Route path="materials" element={<Materials />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="stock-in" element={<StockIn />} />
        <Route path="stock-out" element={<StockOut />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={hasToken ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}
