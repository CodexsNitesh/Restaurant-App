import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/admin/AdminSidebar";
import Navbar from "./components/admin/Navbar";
import { getSettings } from "./services/api";

// Pages
import Login from "./pages/admin/Login";
import Overview from "./pages/admin/Overview";
import Categories from "./pages/admin/Categories";
import MenuItems from "./pages/admin/MenuItems";
import Orders from "./pages/admin/Orders";
import Tables from "./pages/admin/Tables";
import Settings from "./pages/admin/Settings";
import MenuPage from "./pages/menu/MenuPage";
import OrderSuccess from "./pages/menu/OrderSuccess";

// Admin layout with sidebar
const AdminLayout = ({ settings, setSettings }) => {
  const { isAuth } = useAuth();
  if (!isAuth) return <Navigate to="/admin/login" />;

  const pageTitles = {
    "/admin/overview": "Overview",
    "/admin/categories": "Categories",
    "/admin/menu-items": "Menu Items",
    "/admin/orders": "Orders",
    "/admin/tables": "Tables & QR Codes",
    "/admin/settings": "Settings",
  };
  // const title = pageTitles[location.pathname] || 'Dashboard';
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title={title} />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet context={{ settings, setSettings }} />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    getSettings()
      .then((r) => setSettings(r.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Customer Menu Routes */}
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:tableId" element={<MenuPage />} />
        <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          element={
            <AdminLayout settings={settings} setSettings={setSettings} />
          }
        >
          <Route
            path="/admin/overview"
            element={<Overview settings={settings} />}
          />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/menu-items" element={<MenuItems />} />
          <Route
            path="/admin/orders"
            element={<Orders settings={settings} />}
          />
          <Route path="/admin/tables" element={<Tables />} />
          <Route
            path="/admin/settings"
            element={<Settings onSettingsUpdate={setSettings} />}
          />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/overview" />} />
      </Routes>
    </>
  );
};

export default App;
