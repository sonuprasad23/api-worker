import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useUser } from "./hooks/useUser";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
    const { user, login, logout } = useAuth();
    const profile = useUser(user);

    if (user === undefined) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={user ? <Navigate to="/dashboard" /> : <Landing onLogin={login} />}
                />
                <Route
                    path="/dashboard"
                    element={
                        !user ? (
                            <Navigate to="/" />
                        ) : profile?.role === "superadmin" ? (
                            <Navigate to="/admin" />
                        ) : (
                            <Dashboard profile={profile} onLogout={logout} />
                        )
                    }
                />
                <Route
                    path="/admin"
                    element={
                        !user ? (
                            <Navigate to="/" />
                        ) : profile?.role !== "superadmin" ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <AdminDashboard profile={profile} onLogout={logout} />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
