import { NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
    {
        to: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M2 4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V4zM2 14a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" />
            </svg>
        ),
        end: true,
    },
    {
        to: "/dashboard/playground",
        label: "Playground",
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
        ),
    },
    {
        to: "/dashboard/code",
        label: "Code",
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    },
    {
        to: "/dashboard/settings",
        label: "Settings",
        icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    },
];

function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

export default function Sidebar({ profile, onLogout, isAdmin = false }) {
    const navigate = useNavigate();

    return (
        <aside
            className="fixed left-0 top-0 h-screen w-[240px] flex flex-col z-40 border-r"
            style={{
                background: "#0a0a0c",
                borderColor: "rgba(255,255,255,0.06)",
            }}
        >
            {/* Logo */}
            <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xl text-white">NEXUS</span>
                    <sup
                        className="text-[10px] font-mono font-semibold"
                        style={{ color: "#6366f1" }}
                    >
                        API
                    </sup>
                    {isAdmin && (
                        <span
                            className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono"
                            style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}
                        >
                            Admin
                        </span>
                    )}
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                isActive
                                    ? "text-[#818cf8] font-medium"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`
                        }
                        style={({ isActive }) =>
                            isActive
                                ? {
                                      background: "rgba(99,102,241,0.08)",
                                      borderLeft: "3px solid #6366f1",
                                      paddingLeft: "calc(0.75rem - 3px)",
                                  }
                                : {}
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}

                {isAdmin && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mt-2 ${
                                isActive
                                    ? "text-[#818cf8] font-medium"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`
                        }
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        Admin Panel
                    </NavLink>
                )}
            </nav>

            {/* User section */}
            <div
                className="px-4 py-4 border-t"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                        style={{ background: "rgba(99,102,241,0.25)", color: "#818cf8" }}
                    >
                        {getInitials(profile?.displayName)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">
                            {profile?.displayName ?? "Loading…"}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">{profile?.email}</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full text-left text-xs text-zinc-500 hover:text-white transition-colors px-1 py-1"
                >
                    Sign out →
                </button>
            </div>
        </aside>
    );
}
