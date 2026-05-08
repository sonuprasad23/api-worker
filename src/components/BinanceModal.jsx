import { useState, useEffect } from "react";

const BINANCE_ID = "[YOUR_BINANCE_ID]";

export default function BinanceModal({ open, onClose, defaultPlan = "monthly" }) {
    const [plan, setPlan] = useState(defaultPlan);
    const [copied, setCopied] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            setPlan(defaultPlan);
            setSent(false);
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open, defaultPlan]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const copyId = async () => {
        try {
            await navigator.clipboard.writeText(BINANCE_ID);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    const amount = plan === "annual" ? "$50 USDT" : "$5 USDT";
    const label = plan === "annual" ? "Annual ($50)" : "Monthly ($5)";

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="glass rounded-2xl w-full max-w-[440px] p-6 relative"
                style={{
                    animation: "modalIn 0.2s ease-out both",
                }}
            >
                <style>{`
                    @keyframes modalIn {
                        from { opacity: 0; transform: scale(0.95) translateY(8px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}</style>

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl font-bold" style={{ color: "#F3BA2F" }}>◈</span>
                    <h2 className="font-display text-xl font-bold text-white">Pay with Binance</h2>
                </div>

                {/* Plan toggle */}
                <div className="flex bg-white/5 rounded-xl p-1 mb-6">
                    {[["monthly", "Monthly ($5)"], ["annual", "Annual ($50)"]].map(([val, lbl]) => (
                        <button
                            key={val}
                            onClick={() => setPlan(val)}
                            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                            style={{
                                background: plan === val ? "#F3BA2F" : "transparent",
                                color: plan === val ? "#000" : "#a1a1aa",
                            }}
                        >
                            {lbl}
                        </button>
                    ))}
                </div>

                {!sent ? (
                    <div className="space-y-4">
                        {/* Step 1 */}
                        <div>
                            <p className="text-sm text-zinc-300 mb-3">
                                <span className="text-white font-semibold">Step 1.</span> Send{" "}
                                <span className="text-white font-semibold">{amount}</span> to this Binance ID:
                            </p>
                            <div className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                                <span className="font-mono text-lg text-white tracking-wide">{BINANCE_ID}</span>
                                <button
                                    onClick={copyId}
                                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                                    style={{
                                        background: copied ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.08)",
                                        color: copied ? "#818cf8" : "#a1a1aa",
                                    }}
                                >
                                    {copied ? "✓ Copied" : "Copy"}
                                </button>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div>
                            <p className="text-sm text-zinc-300">
                                <span className="text-white font-semibold">Step 2.</span> Email your Transaction ID to{" "}
                                <a
                                    href="mailto:support@nexusapi.dev"
                                    className="text-[#6366f1] hover:text-[#818cf8] transition-colors"
                                >
                                    support@nexusapi.dev
                                </a>
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="glass rounded-xl px-4 py-3">
                            <p className="text-sm text-zinc-400">
                                <span className="text-zinc-300 font-medium">Step 3.</span> Access activated within{" "}
                                <span className="text-white">2 hours</span> of payment confirmation.
                            </p>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => setSent(true)}
                            className="w-full py-3 rounded-xl font-display font-semibold text-black transition-all hover:opacity-90 active:scale-[0.98]"
                            style={{ background: "#F3BA2F" }}
                        >
                            I've Sent Payment ✓
                        </button>

                        <p className="text-center text-zinc-600 text-xs">
                            Also accepts BNB equivalent at current rate
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <div className="text-4xl mb-3">🎉</div>
                        <h3 className="font-display text-lg font-bold text-white mb-2">Payment Noted!</h3>
                        <p className="text-zinc-400 text-sm mb-6">
                            We'll verify your transaction and activate your {plan === "annual" ? "Annual" : "Pro"} plan
                            within 2 hours. Check your email for confirmation.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
