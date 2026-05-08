import { useState, useEffect, useRef } from "react";
import { adminGetUsers, adminGetStats, adminSetRole } from "../api";
import { useCountUp } from "../hooks/useCountUp";

function StatCard({ label, value, color = "#6366f1", delay = 0, visible }) {
    const isNum = typeof value === "number";
    const count = useCountUp(isNum ? value : 0, 1200, visible);

    return (
        <div
            className="glass rounded-2xl p-6 transition-all duration-500"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${delay}ms`,
            }}
        >
            <p className="font-mono text-xs text-zinc-500 mb-2">{label}</p>
            <p
                className="font-display font-extrabold"
                style={{ fontSize: "40px", lineHeight: 1, color }}
            >
                {isNum ? count.toLocaleString() : value ?? "—"}
            </p>
        </div>
    );
}

function PlanBadge({ plan }) {
    const styles = {
        pro: { background: "rgba(99,102,241,0.2)", color: "#818cf8" },
        annual: { background: "rgba(16,185,129,0.15)", color: "#34d399" },
        free: { background: "rgba(255,255,255,0.06)", color: "#71717a" },
    };
    const key = plan?.toLowerCase() ?? "free";
    const s = styles[key] ?? styles.free;
    return (
        <span className="px-2 py-0.5 rounded-full text-xs font-mono capitalize" style={s}>
            {key}
        </span>
    );
}

function RoleBadge({ role }) {
    const isSuperAdmin = role === "superadmin";
    return (
        <span
            className="px-2 py-0.5 rounded-full text-xs font-mono"
            style={
                isSuperAdmin
                    ? { background: "rgba(99,102,241,0.2)", color: "#818cf8" }
                    : { background: "rgba(255,255,255,0.06)", color: "#71717a" }
            }
        >
            {role}
        </span>
    );
}

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export default function AdminDashboard({ profile }) {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [statsVisible, setStatsVisible] = useState(false);
    const [loadingRole, setLoadingRole] = useState(null);
    const statsRef = useRef(null);

    useEffect(() => {
        adminGetUsers().then((d) => setUsers(d.users ?? []));
        adminGetStats().then((d) => setStats(d));
    }, []);

    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [stats]);

    const toggleRole = async (uid, current) => {
        const next = current === "superadmin" ? "user" : "superadmin";
        setLoadingRole(uid);
        try {
            await adminSetRole(uid, next);
            setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: next } : u)));
        } finally {
            setLoadingRole(null);
        }
    };

    const successRate =
        stats?.totalCalls
            ? `${Math.round(((stats.successCalls ?? stats.totalCalls) / stats.totalCalls) * 100)}%`
            : "N/A";

    return (
        <div className="px-8 py-10">
            {/* Header */}
            <div className="mb-10">
                <h1 className="font-display font-bold text-3xl text-white mb-1">Admin Dashboard</h1>
                <p className="font-body text-zinc-400 text-sm">Platform overview and user management</p>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <StatCard label="TOTAL USERS" value={stats?.totalUsers ?? 0} color="#6366f1" delay={0} visible={statsVisible} />
                <StatCard label="TOTAL API CALLS" value={stats?.totalCalls ?? 0} color="#8b5cf6" delay={100} visible={statsVisible} />
                <StatCard label="SUCCESS RATE" value={successRate} color="#34d399" delay={200} visible={statsVisible} />
            </div>

            {/* Users table */}
            <div className="glass rounded-2xl overflow-hidden">
                <div
                    className="px-6 py-4 border-b flex items-center justify-between"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                    <span className="font-display font-semibold text-white text-sm">Users</span>
                    <span className="font-mono text-xs text-zinc-500">{users.length} total</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead>
                            <tr
                                className="text-left border-b"
                                style={{ borderColor: "rgba(255,255,255,0.06)" }}
                            >
                                {["User", "Email", "Plan", "API Calls", "Role", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-3 font-mono text-xs text-zinc-500 uppercase tracking-wider"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center font-body text-sm text-zinc-600">
                                        No users yet
                                    </td>
                                </tr>
                            )}
                            {users.map((u) => (
                                <tr
                                    key={u.uid}
                                    className="border-b transition-colors"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.04)",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.04)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    {/* User */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                                                style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}
                                            >
                                                {getInitials(u.displayName)}
                                            </div>
                                            <span className="font-body text-white">{u.displayName}</span>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="px-5 py-4 font-mono text-xs text-zinc-400">
                                        {u.email}
                                    </td>

                                    {/* Plan */}
                                    <td className="px-5 py-4">
                                        <PlanBadge plan={u.plan} />
                                    </td>

                                    {/* Calls */}
                                    <td className="px-5 py-4 font-mono text-sm text-zinc-300">
                                        {(u.totalCalls ?? 0).toLocaleString()}
                                    </td>

                                    {/* Role */}
                                    <td className="px-5 py-4">
                                        <RoleBadge role={u.role} />
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        {u.uid !== profile?.uid && (
                                            <button
                                                onClick={() => toggleRole(u.uid, u.role)}
                                                disabled={loadingRole === u.uid}
                                                className="text-xs font-body transition-colors disabled:opacity-40"
                                                style={{
                                                    color: u.role === "superadmin" ? "#f87171" : "#818cf8",
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                                            >
                                                {loadingRole === u.uid
                                                    ? "…"
                                                    : u.role === "superadmin"
                                                    ? "Demote"
                                                    : "Make Admin"}
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
    );
}
