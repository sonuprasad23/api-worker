import { useState, useEffect, useRef } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { useCountUp } from "../hooks/useCountUp";

function StatCard({ label, value, color = "#6366f1", delay = 0, visible }) {
    const count = useCountUp(typeof value === "number" ? value : 0, 1200, visible);
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
                {typeof value === "number" ? count.toLocaleString() : value ?? "—"}
            </p>
        </div>
    );
}

function ApiKeyCard({ apiKey }) {
    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        if (!apiKey) return;
        try {
            await navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    };

    const display = revealed ? apiKey : apiKey ? apiKey.slice(0, 8) + "••••••••••••••" : "Loading…";

    return (
        <div className="glass rounded-2xl p-6 w-full">
            <p className="font-mono text-xs text-zinc-500 tracking-wider mb-4">YOUR API KEY</p>
            <div className="flex items-center gap-3">
                <code
                    className="font-mono text-base text-white flex-1 truncate transition-all duration-300"
                    style={{
                        filter: revealed ? "none" : "blur(6px)",
                        userSelect: revealed ? "auto" : "none",
                    }}
                >
                    {display}
                </code>
                <button
                    onClick={() => setRevealed((v) => !v)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    title={revealed ? "Hide key" : "Reveal key"}
                >
                    {revealed ? (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.450l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                    )}
                </button>
                <button
                    onClick={copy}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                    style={{
                        background: copied ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)",
                        color: copied ? "#818cf8" : "#a1a1aa",
                    }}
                >
                    {copied ? "✓ Copied" : "Copy"}
                </button>
            </div>
        </div>
    );
}

export default function Dashboard({ settingsTab }) {
    const ctx = useOutletContext();
    const profile = ctx?.profile;
    const openBinance = ctx?.openBinance;

    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef(null);

    useEffect(() => {
        const el = statsRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const isPro = profile?.plan === "pro" || profile?.plan === "annual";
    const firstName = profile?.displayName?.split(" ")[0] ?? "there";
    const usedToday = profile?.usedToday ?? 0;

    return (
        <div className="px-8 py-10 max-w-4xl">
            {/* Header */}
            <div className="mb-10">
                <h1 className="font-display font-bold text-3xl text-white mb-1">Dashboard</h1>
                <p className="font-body text-zinc-400 text-sm">Good to see you, {firstName}</p>
            </div>

            {/* API Key */}
            <div className="mb-6">
                <ApiKeyCard apiKey={profile?.apiKey} />
            </div>

            {/* Plan badge row */}
            <div className="flex items-center gap-3 mb-10">
                <span
                    className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold"
                    style={
                        isPro
                            ? { background: "rgba(99,102,241,0.2)", color: "#818cf8" }
                            : { background: "rgba(255,255,255,0.06)", color: "#71717a" }
                    }
                >
                    {isPro ? "Pro · Unlimited" : "Free · 5 req/day"}
                </span>
                {!isPro && openBinance && (
                    <button
                        onClick={openBinance}
                        className="text-xs font-body transition-colors"
                        style={{ color: "#6366f1" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#818cf8")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#6366f1")}
                    >
                        Upgrade to Pro →
                    </button>
                )}
            </div>

            {/* Stats grid */}
            <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard label="TOTAL API CALLS" value={profile?.totalCalls ?? 0} color="#6366f1" delay={0} visible={statsVisible} />
                <StatCard label="GOOGLE AI CALLS" value={profile?.googleCalls ?? 0} color="#8b5cf6" delay={100} visible={statsVisible} />
                <StatCard label="SUCCESS RATE" value={profile?.totalCalls ? `${Math.round(((profile.successCalls ?? profile.totalCalls) / profile.totalCalls) * 100)}%` : "—"} color="#34d399" delay={200} visible={statsVisible} />
            </div>

            {/* Upgrade banner — free users only */}
            {!isPro && openBinance && (
                <div
                    className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    style={{
                        background: "rgba(99,102,241,0.06)",
                        border: "1px solid rgba(99,102,241,0.2)",
                    }}
                >
                    <div>
                        <h3 className="font-display font-semibold text-white text-base mb-1">Unlock unlimited queries</h3>
                        <p className="font-body text-zinc-400 text-sm">
                            You've used <span className="text-white font-medium">{usedToday} of 5</span> free requests today.
                        </p>
                    </div>
                    <button
                        onClick={openBinance}
                        className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-display font-semibold text-white transition-all hover:opacity-90 whitespace-nowrap"
                        style={{ background: "#6366f1" }}
                    >
                        Upgrade for $5/month →
                    </button>
                </div>
            )}

            {/* Quick links */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <Link
                    to="/dashboard/playground"
                    className="glass rounded-2xl p-5 hover:border-white/15 transition-all group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">▶</span>
                        <h3 className="font-display font-semibold text-white">Playground</h3>
                    </div>
                    <p className="font-body text-zinc-400 text-sm">
                        Test queries interactively. See real responses instantly.
                    </p>
                    <span className="text-xs text-[#6366f1] mt-3 block group-hover:translate-x-1 transition-transform">
                        Open →
                    </span>
                </Link>
                <Link
                    to="/dashboard/code"
                    className="glass rounded-2xl p-5 hover:border-white/15 transition-all group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">&lt;/&gt;</span>
                        <h3 className="font-display font-semibold text-white">Code Examples</h3>
                    </div>
                    <p className="font-body text-zinc-400 text-sm">
                        Copy-ready snippets for JavaScript, Python, and cURL.
                    </p>
                    <span className="text-xs text-[#6366f1] mt-3 block group-hover:translate-x-1 transition-transform">
                        View →
                    </span>
                </Link>
            </div>
        </div>
    );
}
