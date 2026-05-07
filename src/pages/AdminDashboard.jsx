import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { adminGetUsers, adminGetStats, adminSetRole } from "../api";

export default function AdminDashboard({ profile, onLogout }) {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        adminGetUsers().then((d) => setUsers(d.users ?? []));
        adminGetStats().then((d) => setStats(d));
    }, []);

    const toggleRole = async (uid, current) => {
        const next = current === "superadmin" ? "user" : "superadmin";
        await adminSetRole(uid, next);
        setUsers((prev) =>
            prev.map((u) => (u.uid === uid ? { ...u, role: next } : u))
        );
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar profile={profile} onLogout={onLogout} isAdmin />
            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>
                <p className="text-zinc-400 text-sm mb-8">Platform overview and user management</p>

                {stats && (
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {[
                            { label: "Total Users", value: stats.totalUsers },
                            { label: "Total API Calls", value: stats.totalCalls },
                            {
                                label: "Success Rate",
                                value: stats.totalCalls
                                    ? `${Math.round((stats.successCalls / stats.totalCalls) * 100)}%`
                                    : "N/A",
                            },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                            >
                                <div className="text-3xl font-bold text-violet-400">{s.value}</div>
                                <div className="text-zinc-400 text-sm mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-zinc-800 text-sm font-medium text-zinc-300">
                        Users
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-zinc-500 text-left border-b border-zinc-800">
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Calls</th>
                                    <th className="px-5 py-3">Role</th>
                                    <th className="px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr
                                        key={u.uid}
                                        className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <td className="px-5 py-3 text-white">{u.displayName}</td>
                                        <td className="px-5 py-3 text-zinc-400">{u.email}</td>
                                        <td className="px-5 py-3 text-zinc-400">{u.totalCalls}</td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs ${
                                                    u.role === "superadmin"
                                                        ? "bg-violet-900/50 text-violet-300"
                                                        : "bg-zinc-800 text-zinc-400"
                                                }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            {u.uid !== profile?.uid && (
                                                <button
                                                    onClick={() => toggleRole(u.uid, u.role)}
                                                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                                                >
                                                    {u.role === "superadmin" ? "Demote" : "Make Admin"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
