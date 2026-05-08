import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { queryLLM, getJobStatus } from "../api";

const EXAMPLE_CHIPS = [
    "Find CEO email at [company]",
    "Summarize latest news about [brand]",
    "Extract contact info from [URL]",
    "Find funding round for [startup]",
];

function useTypewriter(text, speed = 8, trigger = false) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);
    const timerRef = useRef(null);
    const iRef = useRef(0);

    useEffect(() => {
        if (!trigger || !text) return;
        setDisplayed("");
        setDone(false);
        iRef.current = 0;
        timerRef.current = setInterval(() => {
            iRef.current += 1;
            setDisplayed(text.slice(0, iRef.current));
            if (iRef.current >= text.length) {
                clearInterval(timerRef.current);
                setDone(true);
            }
        }, speed);
        return () => clearInterval(timerRef.current);
    }, [text, trigger, speed]);

    return { displayed, done };
}

export default function Playground() {
    const ctx = useOutletContext();
    const profile = ctx?.profile;
    const openBinance = ctx?.openBinance;

    const [systemPrompt, setSystemPrompt] = useState("");
    const [question, setQuestion] = useState("");
    const [state, setState] = useState("idle"); // idle | loading | done | error
    const [statusText, setStatusText] = useState("");
    const [rawResponse, setRawResponse] = useState("");
    const [error, setError] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(null);
    const [copied, setCopied] = useState(false);

    const { displayed, done } = useTypewriter(rawResponse, 8, state === "done");

    const isPro = profile?.plan === "pro" || profile?.plan === "annual";
    const usedToday = profile?.usedToday ?? 0;
    const remaining = Math.max(0, 5 - usedToday);

    const run = async () => {
        if (!question.trim() || state === "loading") return;
        setState("loading");
        setStatusText("Sending query to Google AI Mode…");
        setRawResponse("");
        setError("");
        setElapsed(null);
        const t0 = Date.now();
        setStartTime(t0);

        try {
            const data = await queryLLM("google", systemPrompt, question);

            if (data.jobId) {
                setStatusText("Processing in background…");
                let attempts = 0;
                while (attempts < 90) {
                    await new Promise((r) => setTimeout(r, 2000));
                    const job = await getJobStatus(data.jobId);
                    if (job.status === "done") {
                        setRawResponse(job.response ?? "");
                        setElapsed(((Date.now() - t0) / 1000).toFixed(1));
                        setState("done");
                        return;
                    }
                    if (job.status === "error") {
                        setError(job.error ?? "Query failed. Please try again.");
                        setState("error");
                        return;
                    }
                    attempts++;
                    setStatusText(`Processing… (${attempts * 2}s)`);
                }
                setError("Query timed out. Please try again.");
                setState("error");
            } else if (data.response) {
                setRawResponse(data.response);
                setElapsed(((Date.now() - t0) / 1000).toFixed(1));
                setState("done");
            } else if (data.error) {
                setError(data.error);
                setState("error");
            } else {
                setRawResponse(JSON.stringify(data, null, 2));
                setElapsed(((Date.now() - t0) / 1000).toFixed(1));
                setState("done");
            }
        } catch {
            setError("Request failed. Check your connection and try again.");
            setState("error");
        }
    };

    const copyResponse = async () => {
        if (!rawResponse) return;
        try {
            await navigator.clipboard.writeText(rawResponse);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    };

    const reset = () => {
        setState("idle");
        setRawResponse("");
        setError("");
        setStatusText("");
    };

    return (
        <div className="h-[calc(100vh-0px)] flex flex-col overflow-hidden">
            {/* Topbar */}
            <div
                className="px-8 py-4 border-b flex items-center justify-between shrink-0"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
                <div>
                    <h1 className="font-display font-bold text-xl text-white">Playground</h1>
                    <p className="font-body text-xs text-zinc-500 mt-0.5">Google AI Mode · Live web data</p>
                </div>
                {!isPro && (
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-zinc-500">
                            {remaining} / 5 free requests left today
                        </span>
                        {openBinance && (
                            <button
                                onClick={openBinance}
                                className="text-xs px-3 py-1.5 rounded-lg font-body font-medium"
                                style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
                            >
                                Upgrade
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Two-column layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left panel — Request */}
                <div
                    className="w-[45%] border-r flex flex-col overflow-y-auto"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                    {/* Panel header */}
                    <div
                        className="px-6 py-3 border-b flex items-center gap-2 shrink-0"
                        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
                    >
                        <span className="font-mono text-xs text-zinc-500">Request</span>
                        <span
                            className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold"
                            style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}
                        >
                            POST
                        </span>
                    </div>

                    <div className="p-6 space-y-5 flex-1">
                        {/* Source — Google AI only */}
                        <div>
                            <p className="font-mono text-xs text-zinc-500 mb-2">source</p>
                            <div
                                className="flex items-center gap-2 px-4 py-3 rounded-xl"
                                style={{
                                    background: "rgba(99,102,241,0.12)",
                                    border: "1px solid rgba(99,102,241,0.3)",
                                    boxShadow: "0 0 20px rgba(99,102,241,0.1)",
                                }}
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-body font-semibold text-sm text-white">Google AI Mode</span>
                                <span
                                    className="ml-auto text-xs px-2 py-0.5 rounded font-mono"
                                    style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
                                >
                                    Live web data · Email & contact extraction
                                </span>
                            </div>
                        </div>

                        {/* Endpoint */}
                        <div>
                            <p className="font-mono text-xs text-zinc-500 mb-2">endpoint</p>
                            <div
                                className="glass rounded-xl px-4 py-2.5"
                                style={{ cursor: "default" }}
                            >
                                <span className="font-mono text-xs text-zinc-400">
                                    POST <span style={{ color: "#818cf8" }}>/query/google/apikey</span>
                                </span>
                            </div>
                        </div>

                        {/* System prompt */}
                        <div>
                            <label className="font-mono text-xs text-zinc-500 mb-2 block">
                                system_prompt <span className="text-zinc-700">optional</span>
                            </label>
                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                placeholder="You are a data enrichment assistant. Return structured JSON…"
                                rows={3}
                                className="w-full glass rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none resize-none transition-all"
                                style={{ caretColor: "#6366f1" }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)")}
                                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                            />
                        </div>

                        {/* Question */}
                        <div>
                            <label className="font-mono text-xs text-zinc-500 mb-2 block">
                                question <span style={{ color: "#6366f1" }}>*</span>
                            </label>
                            <textarea
                                value={question}
                                onChange={(e) => { setQuestion(e.target.value); if (state !== "idle") reset(); }}
                                placeholder="Find the Head of Growth at Stripe. Return their email and LinkedIn URL."
                                rows={6}
                                className="w-full glass rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none resize-none transition-all"
                                style={{ caretColor: "#6366f1" }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)")}
                                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                            />

                            {/* Example chips */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {EXAMPLE_CHIPS.map((chip) => (
                                    <button
                                        key={chip}
                                        onClick={() => { setQuestion(chip); if (state !== "idle") reset(); }}
                                        className="text-xs px-3 py-1.5 rounded-lg font-mono transition-all"
                                        style={{ background: "rgba(255,255,255,0.05)", color: "#71717a" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.color = "#818cf8"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#71717a"; }}
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Send button */}
                        <div>
                            <button
                                onClick={run}
                                disabled={!question.trim() || state === "loading"}
                                className="w-full py-3.5 rounded-xl font-display font-semibold text-white transition-all relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: state === "loading"
                                        ? "rgba(99,102,241,0.5)"
                                        : "#6366f1",
                                }}
                            >
                                {state === "loading" ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span
                                            className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                                            style={{ borderColor: "#fff", borderTopColor: "transparent" }}
                                        />
                                        {statusText || "Querying…"}
                                    </span>
                                ) : (
                                    "Send Request →"
                                )}
                            </button>

                            {/* Progress bar — free users */}
                            {!isPro && (
                                <div className="mt-3">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-mono text-xs text-zinc-500">Requests today</span>
                                        <span className="font-mono text-xs text-zinc-400">{usedToday} / 5</span>
                                    </div>
                                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${(usedToday / 5) * 100}%`, background: "#6366f1" }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right panel — Response */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Panel header */}
                    <div
                        className="px-6 py-3 border-b flex items-center gap-2 shrink-0"
                        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
                    >
                        <span className="font-mono text-xs text-zinc-500">Response</span>
                        {state === "done" && (
                            <>
                                <span
                                    className="px-2 py-0.5 rounded font-mono text-[10px]"
                                    style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}
                                >
                                    200 OK
                                </span>
                                <span className="font-mono text-[10px] text-zinc-600">{elapsed}s</span>
                                <button
                                    onClick={copyResponse}
                                    className="ml-auto text-xs px-2 py-1 rounded-lg font-mono transition-all"
                                    style={{
                                        background: copied ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)",
                                        color: copied ? "#818cf8" : "#a1a1aa",
                                    }}
                                >
                                    {copied ? "✓ Copied" : "Copy"}
                                </button>
                            </>
                        )}
                        {state === "error" && (
                            <span
                                className="px-2 py-0.5 rounded font-mono text-[10px]"
                                style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5" }}
                            >
                                Error
                            </span>
                        )}
                        {state === "loading" && (
                            <span className="font-mono text-[10px] text-zinc-500 animate-pulse">
                                {statusText}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Idle */}
                        {state === "idle" && (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="text-4xl mb-4 opacity-30">⌨</div>
                                <p className="font-mono text-sm text-zinc-600">
                                    Send a request to see the response
                                </p>
                            </div>
                        )}

                        {/* Loading skeleton */}
                        {state === "loading" && (
                            <div className="space-y-3 pt-2">
                                {[70, 90, 55, 80, 45].map((w, i) => (
                                    <div
                                        key={i}
                                        className="h-3 rounded-full"
                                        style={{
                                            width: `${w}%`,
                                            background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(99,102,241,0.1) 50%, rgba(255,255,255,0.05) 100%)",
                                            backgroundSize: "200% 100%",
                                            animation: `shimmer 1.5s infinite`,
                                            animationDelay: `${i * 0.1}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Done */}
                        {state === "done" && (
                            <div>
                                <div
                                    className="glass rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.03)" }}
                                >
                                    <pre
                                        className="font-mono text-sm text-zinc-200 whitespace-pre-wrap leading-7"
                                        style={{ wordBreak: "break-word" }}
                                    >
                                        {displayed}
                                        {!done && <span className="typewriter-cursor" />}
                                    </pre>
                                </div>
                                <p className="font-body text-xs text-zinc-600 mt-4">
                                    Results provided by Google AI Mode. Always verify data before outreach.
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {state === "error" && (
                            <div
                                className="rounded-xl p-5"
                                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
                            >
                                <p className="font-mono text-sm text-red-300 leading-relaxed">{error}</p>
                                <button
                                    onClick={reset}
                                    className="mt-4 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                                >
                                    ← Clear and retry
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
