import { useState } from "react";

export default function Navbar({ profile, onLogout, isAdmin }) {
    const [open, setOpen] = useState(false);

    return (
        <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
            <span className="font-semibold text-white">
                Nexus API{" "}
                {isAdmin && <span className="text-xs text-violet-400 ml-2">Admin</span>}
            </span>
            <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
                >
                    <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-medium">
                        {profile?.displayName?.[0] ?? "U"}
                    </div>
                </button>
                {open && (
                    <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                        <div className="px-4 py-3 border-b border-zinc-800 text-xs text-zinc-500 truncate">
                            {profile?.email}
                        </div>
                        <button
                            onClick={onLogout}
                            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
