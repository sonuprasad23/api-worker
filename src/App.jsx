import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useUser } from "./hooks/useUser";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Playground from "./pages/Playground";
import CodePage from "./pages/CodePage";
import AdminDashboard from "./pages/AdminDashboard";
import { useState } from "react";
import BinanceModal from "./components/BinanceModal";

function DashboardLayout({ profile, onLogout }) {
    const [binanceOpen, setBinanceOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#050507] text-white flex">
            <div className="orb-top-left" />
            <div className="orb-bottom-right" />
            <Sidebar profile={profile} onLogout={onLogout} />
            <main
                className="flex-1 min-h-screen relative z-10"
                style={{ marginLeft: "240px" }}
            >
                <Outlet context={{ profile, openBinance: () => setBinanceOpen(true) }} />
            </main>
            <BinanceModal open={binanceOpen} onClose={() => setBinanceOpen(false)} />
        </div>
    );
}

function AdminLayout({ profile, onLogout }) {
    return (
        <div className="min-h-screen bg-[#050507] text-white flex">
            <div className="orb-top-left" />
            <div className="orb-bottom-right" />
            <Sidebar profile={profile} onLogout={onLogout} isAdmin />
            <main
                className="flex-1 min-h-screen relative z-10"
                style={{ marginLeft: "240px" }}
            >
                <AdminDashboard profile={profile} onLogout={onLogout} />
            </main>
        </div>
    );
}

export default function App() {
    const { user, login, logout, authError } = useAuth();
    const profile = useUser(user);

    if (user === undefined) {
        return (
            <div className="min-h-screen bg-[#050507] flex items-center justify-center">
                <div
                    className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
                />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={user ? <Navigate to="/dashboard" /> : <Landing onLogin={login} authError={authError} />}
                />
                <Route
                    path="/dashboard"
                    element={
                        !user ? (
                            <Navigate to="/" />
                        ) : profile?.role === "superadmin" ? (
                            <Navigate to="/admin" />
                        ) : (
                            <DashboardLayout profile={profile} onLogout={logout} />
                        )
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="playground" element={<Playground />} />
                    <Route path="code" element={<CodePage />} />
                    <Route path="settings" element={<Dashboard settingsTab />} />
                </Route>
                <Route
                    path="/admin"
                    element={
                        !user ? (
                            <Navigate to="/" />
                        ) : profile?.role !== "superadmin" ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <AdminLayout profile={profile} onLogout={logout} />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
