import { useState, useEffect, useRef, useCallback } from "react";
import ParticleCanvas from "../components/ParticleCanvas";
import BinanceModal from "../components/BinanceModal";

/* ─── Hooks ──────────────────────────────────────────────────── */

function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);
    return [ref, visible];
}

function useTypewriter(text, speed = 20, active = false) {
    const [displayed, setDisplayed] = useState("");
    useEffect(() => {
        if (!active) { setDisplayed(""); return; }
        let i = 0;
        setDisplayed("");
        const id = setInterval(() => {
            if (i < text.length) {
                setDisplayed(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(id);
            }
        }, speed);
        return () => clearInterval(id);
    }, [text, speed, active]);
    return displayed;
}

function useTilt() {
    const ref = useRef(null);
    const onMouseMove = useCallback((e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        ref.current.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    }, []);
    const onMouseLeave = useCallback(() => {
        if (!ref.current) return;
        ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    }, []);
    return { ref, onMouseMove, onMouseLeave };
}

/* ─── Navbar ─────────────────────────────────────────────────── */

function LandingNav({ onLogin }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: scrolled ? "rgba(5,5,7,0.92)" : "rgba(5,5,7,0.7)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-baseline gap-1.5">
                    <span className="font-display font-bold text-xl text-white">NEXUS</span>
                    <sup className="text-[10px] font-mono font-semibold" style={{ color: "#6366f1" }}>API</sup>
                </a>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-7">
                    {["Features", "Google AI", "Pricing", "Integrations"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(" ", "-")}`}
                            className="text-sm font-body text-zinc-400 hover:text-white transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={onLogin}
                        className="text-sm font-body text-zinc-300 hover:text-white transition-colors px-4 py-2 rounded-lg border border-white/10 hover:border-white/20"
                    >
                        Sign in
                    </button>
                    <button
                        onClick={onLogin}
                        className="text-sm font-body text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: "#6366f1",
                            boxShadow: "0 0 20px rgba(99,102,241,0.25)",
                        }}
                    >
                        Get Started Free
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden w-8 h-8 flex items-center justify-center text-zinc-400"
                    onClick={() => setMobileOpen((v) => !v)}
                >
                    <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 top-16 z-50 flex flex-col items-center justify-center gap-8"
                    style={{ background: "rgba(5,5,7,0.98)", backdropFilter: "blur(20px)" }}
                >
                    {["Features", "Google AI", "Pricing", "Integrations"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(" ", "-")}`}
                            className="text-2xl font-display font-bold text-white hover:text-[#818cf8] transition-colors"
                            onClick={() => setMobileOpen(false)}
                        >
                            {item}
                        </a>
                    ))}
                    <button
                        onClick={() => { setMobileOpen(false); onLogin(); }}
                        className="mt-4 px-8 py-3 rounded-xl text-white font-semibold"
                        style={{ background: "#6366f1" }}
                    >
                        Get Started Free
                    </button>
                </div>
            )}
        </nav>
    );
}

/* ─── Hero ───────────────────────────────────────────────────── */

const HERO_LINES = [
    "The data enrichment API",
    "your GTM stack has",
    "been waiting for.",
];

function HeroSection({ onLogin }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <ParticleCanvas count={200} />

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-16 text-center md:text-left">
                {/* Badge */}
                <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 font-mono text-xs transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{
                        background: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.3)",
                        color: "#818cf8",
                    }}
                >
                    <span>⚡</span>
                    <span>Now with Google AI Mode · Live web data</span>
                </div>

                {/* Headline */}
                <h1 className="font-display font-extrabold leading-[1.05] mb-6" style={{ fontSize: "clamp(36px,6vw,72px)" }}>
                    {HERO_LINES.map((line, i) => (
                        <span
                            key={i}
                            className="block transition-all duration-500"
                            style={{
                                transitionDelay: `${150 + i * 120}ms`,
                                opacity: visible ? 1 : 0,
                                transform: visible ? "translateY(0)" : "translateY(24px)",
                            }}
                        >
                            {line}
                        </span>
                    ))}
                </h1>

                {/* Subheadline */}
                <p
                    className="font-body text-lg text-zinc-400 max-w-xl mb-10 mx-auto md:mx-0 transition-all duration-500"
                    style={{
                        transitionDelay: "600ms",
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(16px)",
                    }}
                >
                    Query Google AI Mode from a single endpoint. Pull live emails, phone numbers,
                    company data, and decision-maker intel — pipe it straight into Clay, n8n, or
                    Instantly AI.
                </p>

                {/* CTA row */}
                <div
                    className="flex flex-wrap gap-4 justify-center md:justify-start mb-12 transition-all duration-500"
                    style={{
                        transitionDelay: "750ms",
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(16px)",
                    }}
                >
                    <button
                        onClick={onLogin}
                        className="px-7 py-3.5 rounded-xl font-display font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] group"
                        style={{
                            background: "#6366f1",
                            boxShadow: "0 0 30px rgba(99,102,241,0.3)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 50px rgba(99,102,241,0.5)")}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 30px rgba(99,102,241,0.3)")}
                    >
                        Start for Free →
                    </button>
                    <a
                        href="#pricing"
                        className="px-7 py-3.5 rounded-xl font-body text-zinc-400 hover:text-white transition-colors group flex items-center gap-1"
                    >
                        View pricing
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                </div>

                {/* Stats */}
                <div
                    className="flex flex-wrap gap-6 justify-center md:justify-start transition-all duration-500"
                    style={{
                        transitionDelay: "900ms",
                        opacity: visible ? 1 : 0,
                    }}
                >
                    {["2 LLM Sources", "Live Web Data", "REST API"].map((stat) => (
                        <span key={stat} className="font-mono text-xs text-zinc-500">
                            {stat}
                        </span>
                    ))}
                </div>

                {/* Integration logos */}
                <div
                    className="mt-12 transition-all duration-500"
                    style={{
                        transitionDelay: "1000ms",
                        opacity: visible ? 1 : 0,
                    }}
                >
                    <p className="font-mono text-xs text-zinc-600 mb-4 text-center md:text-left">Works with</p>
                    <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start">
                        {["Clay", "n8n", "Instantly AI", "Make", "Zapier", "HubSpot"].map((tool) => (
                            <span
                                key={tool}
                                className="text-sm font-body text-zinc-600 hover:text-zinc-300 transition-all duration-300 cursor-default"
                                style={{ opacity: 0.4 }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
                            >
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── GTM Section ────────────────────────────────────────────── */

const GTM_CARDS = [
    {
        icon: "⚡",
        title: "GTM Engineers",
        desc: "Enrich leads at scale. Automate data pipelines. Integrate in one fetch call.",
    },
    {
        icon: "🎯",
        title: "Lead Gen Teams",
        desc: "Surface direct emails, mobile numbers, and LinkedIn profiles for any prospect.",
    },
    {
        icon: "📊",
        title: "RevOps",
        desc: "Feed clean, enriched data into your CRM, sequences, and scoring models automatically.",
    },
];

function GTMSection() {
    const [secRef, visible] = useInView();

    return (
        <section id="features" className="py-32 relative" ref={secRef}>
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="font-mono text-xs text-[#6366f1] tracking-[0.15em] mb-4">WHO IT'S FOR</p>
                    <h2
                        className="font-display font-bold text-white transition-all duration-700"
                        style={{
                            fontSize: "clamp(28px,4vw,48px)",
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(20px)",
                        }}
                    >
                        Stop leaving data on the table
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {GTM_CARDS.map((card, i) => (
                        <TiltCard key={card.title} card={card} delay={i * 100} visible={visible} />
                    ))}
                </div>

                <p className="text-center font-body text-xs text-zinc-600 mt-10">
                    Used in workflows at companies that care about pipeline quality
                </p>
            </div>
        </section>
    );
}

function TiltCard({ card, delay, visible }) {
    const { ref, onMouseMove, onMouseLeave } = useTilt();

    return (
        <div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="tilt-card glass rounded-2xl p-6 cursor-default transition-all duration-500 group"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) perspective(800px)" : "translateY(24px)",
                transitionDelay: `${delay}ms`,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.15)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
            }}
            onMouseLeave2={(e) => {
                onMouseLeave(e);
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "";
            }}
        >
            <div className="text-3xl mb-4">{card.icon}</div>
            <h3 className="font-display font-bold text-white text-lg mb-2">{card.title}</h3>
            <p className="font-body text-zinc-400 text-sm leading-relaxed">{card.desc}</p>
        </div>
    );
}

/* ─── Google AI Section ──────────────────────────────────────── */

const RESPONSE_DEMO = `{
  "response": "Head of Growth at Stripe is
  Alex Johnson. Email: alex@stripe.com
  LinkedIn: linkedin.com/in/alexjohnson"
}`;

const FEATURES = [
    { title: "Blazing fast", desc: "Responses in under 3 seconds. Google's infrastructure, your API call." },
    { title: "Live web data", desc: "Not trained cutoffs. Actual current pages, company sites, news, directories." },
    { title: "Email & phone extraction", desc: "Ask for a decision-maker's contact at any company. Get structured data back." },
    { title: "Company intelligence", desc: "Headcount, funding stage, tech stack, recent hires — in plain text or JSON." },
    { title: "Lead enrichment at scale", desc: "Pass a name + company. Get back a full profile. Loop it 10,000 times." },
];

function GoogleAISection() {
    const [secRef, visible] = useInView();
    const response = useTypewriter(RESPONSE_DEMO, 18, visible);

    return (
        <section
            id="google-ai"
            className="py-32 relative"
            ref={secRef}
            style={{ background: "rgba(99,102,241,0.025)" }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-12">
                    <p className="font-mono text-xs text-[#6366f1] tracking-[0.15em] mb-4">GOOGLE AI MODE</p>
                    <h2
                        className="font-display font-bold text-white transition-all duration-700"
                        style={{
                            fontSize: "clamp(24px,4vw,48px)",
                            maxWidth: "600px",
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(20px)",
                        }}
                    >
                        Real-time intelligence. Straight from the web.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Feature list */}
                    <div className="space-y-5">
                        {FEATURES.map((f, i) => (
                            <div
                                key={f.title}
                                className="flex gap-4 transition-all duration-500"
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? "translateX(0)" : "translateX(-16px)",
                                    transitionDelay: `${i * 80}ms`,
                                }}
                            >
                                <span className="text-[#6366f1] mt-0.5 shrink-0 text-lg">→</span>
                                <div>
                                    <p className="font-display font-semibold text-white text-sm mb-1">{f.title}</p>
                                    <p className="font-body text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Code block */}
                    <div
                        className="glass rounded-2xl overflow-hidden transition-all duration-700"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(20px)",
                            transitionDelay: "200ms",
                        }}
                    >
                        <div
                            className="flex items-center gap-2 px-4 py-3 border-b"
                            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                        >
                            <span className="font-mono text-xs text-zinc-500">POST</span>
                            <span className="font-mono text-xs text-zinc-400">/query/google/apikey</span>
                        </div>
                        <pre className="font-mono text-xs leading-relaxed p-5 text-zinc-300 overflow-x-auto">
{`{
  "api_key": "nxs_••••••••",
  "question": "Find the Head of Growth
               at Stripe. Return their
               email and LinkedIn URL."
}`}
                        </pre>
                        <div
                            className="border-t"
                            style={{ borderColor: "rgba(255,255,255,0.06)" }}
                        >
                            <div className="flex items-center gap-2 px-4 py-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="font-mono text-xs text-emerald-400">200 OK</span>
                                <span className="font-mono text-xs text-zinc-600 ml-auto">1.8s</span>
                            </div>
                            <pre
                                className={`font-mono text-xs leading-relaxed p-5 text-zinc-300 overflow-x-auto min-h-[80px] ${!response ? "" : "typewriter-cursor"}`}
                            >
                                {response || <span className="text-zinc-600">Waiting for response…</span>}
                            </pre>
                        </div>
                        <p className="font-mono text-xs text-zinc-600 px-5 pb-4">
                            Results vary by query. Always verify data before outreach.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Integrations Section ───────────────────────────────────── */

const INTEGRATIONS = [
    {
        logo: "◈",
        name: "Clay",
        desc: "Map the /query/google endpoint as a custom enrichment column. Enrich thousands of rows automatically.",
    },
    {
        logo: "⬡",
        name: "n8n",
        desc: "Use the HTTP Request node. Chain with your CRM, Slack, or Google Sheets in minutes.",
    },
    {
        logo: "⚡",
        name: "Instantly AI",
        desc: "Enrich leads before sequences launch. Pass verified emails directly into campaigns.",
    },
    {
        logo: "◉",
        name: "Make / Zapier",
        desc: "One HTTP module. Trigger on new leads, enrich in real-time, update any connected app.",
    },
];

function IntegrationsSection() {
    const [secRef, visible] = useInView();

    return (
        <section id="integrations" className="py-32" ref={secRef}>
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="font-mono text-xs text-[#6366f1] tracking-[0.15em] mb-4">INTEGRATIONS</p>
                    <h2
                        className="font-display font-bold text-white mb-4 transition-all duration-700"
                        style={{
                            fontSize: "clamp(24px,4vw,48px)",
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(16px)",
                        }}
                    >
                        Drop into any workflow
                    </h2>
                    <p className="font-body text-zinc-400 text-lg">
                        If it can make an HTTP request, it works with Nexus API.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    {INTEGRATIONS.map((item, i) => (
                        <div
                            key={item.name}
                            className="glass rounded-2xl p-6 transition-all duration-500 hover:border-white/15"
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? "translateY(0)" : "translateY(20px)",
                                transitionDelay: `${i * 80}ms`,
                            }}
                        >
                            <div className="text-2xl text-white/70 mb-3">{item.logo}</div>
                            <h3 className="font-display font-semibold text-white text-base mb-2">{item.name}</h3>
                            <p className="font-body text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <p className="text-center font-body text-xs text-zinc-600 mt-8">
                    + Works with any tool that supports HTTP · webhooks · REST
                </p>
            </div>
        </section>
    );
}

/* ─── Pricing Section ────────────────────────────────────────── */

const FREE_FEATURES = [
    "5 requests per day",
    "Google AI Mode",
    "API key included",
    "Dashboard access",
    "Community support",
];

const PRO_FEATURES = [
    "Unlimited requests",
    "Google AI Mode",
    "API key authentication",
    "Full dashboard + analytics",
    "Priority response time",
    "Works with Clay, n8n, Instantly AI",
    "Email support",
];

const ENTERPRISE_FEATURES = [
    "Volume pricing",
    "Dedicated endpoints",
    "SLA guarantee",
    "White-label option",
    "Slack support channel",
];

function PricingSection({ onOpenBinance, onLogin }) {
    const [isAnnual, setIsAnnual] = useState(false);
    const [secRef, visible] = useInView();

    return (
        <section id="pricing" className="py-32" ref={secRef}>
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-14">
                    <p className="font-mono text-xs text-[#6366f1] tracking-[0.15em] mb-4">PRICING</p>
                    <h2
                        className="font-display font-bold text-white mb-8 transition-all duration-700"
                        style={{
                            fontSize: "clamp(24px,4vw,48px)",
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(16px)",
                        }}
                    >
                        Simple, honest pricing
                    </h2>

                    {/* Toggle */}
                    <div className="inline-flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                        {[["monthly", "Monthly"], ["annual", "Annual"]].map(([val, lbl]) => (
                            <button
                                key={val}
                                onClick={() => setIsAnnual(val === "annual")}
                                className="px-5 py-2 rounded-lg text-sm font-body font-medium transition-all"
                                style={{
                                    background: (isAnnual ? val === "annual" : val === "monthly") ? "#6366f1" : "transparent",
                                    color: (isAnnual ? val === "annual" : val === "monthly") ? "#fff" : "#71717a",
                                }}
                            >
                                {lbl}
                                {val === "annual" && (
                                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399" }}>
                                        Save $10
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                    {/* Free */}
                    <div
                        className="glass rounded-2xl p-7 flex flex-col transition-all duration-500"
                        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transitionDelay: "0ms" }}
                    >
                        <h3 className="font-display font-bold text-white text-lg mb-1">Free</h3>
                        <div className="flex items-end gap-1 mb-1">
                            <span className="font-display font-extrabold text-white" style={{ fontSize: "56px", lineHeight: 1 }}>$0</span>
                        </div>
                        <p className="font-body text-zinc-400 text-sm mb-6">/forever</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            {FREE_FEATURES.map((f) => (
                                <li key={f} className="flex items-center gap-2.5 text-sm font-body text-zinc-400">
                                    <span className="text-zinc-500">✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={onLogin}
                            className="w-full py-3 rounded-xl text-sm font-display font-semibold transition-all border hover:bg-white/5"
                            style={{ borderColor: "#6366f1", color: "#818cf8" }}
                        >
                            Get Started Free
                        </button>
                    </div>

                    {/* Pro — elevated */}
                    <div
                        className="shimmer-border rounded-2xl p-7 flex flex-col relative transition-all duration-500"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(-8px)" : "translateY(24px)",
                            transitionDelay: "100ms",
                            boxShadow: "0 0 60px rgba(99,102,241,0.2)",
                        }}
                    >
                        <div
                            className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-mono font-semibold"
                            style={{ background: "#6366f1", color: "#fff" }}
                        >
                            Most Popular
                        </div>
                        <h3 className="font-display font-bold text-white text-lg mb-1">Pro</h3>
                        <div className="flex items-end gap-1 mb-1">
                            <span className="font-display font-extrabold text-white transition-all" style={{ fontSize: "56px", lineHeight: 1 }}>
                                {isAnnual ? "$50" : "$5"}
                            </span>
                        </div>
                        <p className="font-body text-zinc-400 text-sm mb-1">
                            {isAnnual ? "/year · billed annually" : "/month"}
                        </p>
                        {isAnnual && (
                            <p className="font-body text-xs mb-4" style={{ color: "#34d399" }}>$4.17/mo</p>
                        )}
                        <ul className="space-y-3 mb-8 flex-1 mt-2">
                            {PRO_FEATURES.map((f) => (
                                <li key={f} className="flex items-center gap-2.5 text-sm font-body text-zinc-300">
                                    <span style={{ color: "#6366f1" }}>✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={onOpenBinance}
                            className="w-full py-3 rounded-xl text-sm font-display font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                            style={{ background: "#6366f1" }}
                        >
                            Pay with Binance
                        </button>
                    </div>

                    {/* Enterprise */}
                    <div
                        className="glass rounded-2xl p-7 flex flex-col transition-all duration-500"
                        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transitionDelay: "200ms" }}
                    >
                        <h3 className="font-display font-bold text-white text-lg mb-1">Enterprise</h3>
                        <div className="flex items-end gap-1 mb-1">
                            <span className="font-display font-extrabold text-zinc-400" style={{ fontSize: "48px", lineHeight: 1 }}>Custom</span>
                        </div>
                        <p className="font-body text-zinc-500 text-sm mb-6">Volume pricing</p>
                        <ul className="space-y-3 mb-8 flex-1">
                            {ENTERPRISE_FEATURES.map((f) => (
                                <li key={f} className="flex items-center gap-2.5 text-sm font-body text-zinc-400">
                                    <span className="text-zinc-500">✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        <a
                            href="mailto:support@nexusapi.dev"
                            className="w-full py-3 rounded-xl text-sm font-display font-semibold text-center transition-all border hover:bg-white/5"
                            style={{ borderColor: "rgba(255,255,255,0.12)", color: "#a1a1aa" }}
                        >
                            Contact us
                        </a>
                    </div>
                </div>

                <p className="text-center font-body text-xs text-zinc-600 mt-8">
                    All paid plans activated within 2 hours of payment confirmation
                </p>
            </div>
        </section>
    );
}

/* ─── Footer ─────────────────────────────────────────────────── */

function Footer() {
    return (
        <footer
            className="py-16 mt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <a href="/" className="flex items-baseline gap-1.5">
                        <span className="font-display font-bold text-xl text-white">NEXUS</span>
                        <sup className="text-[10px] font-mono" style={{ color: "#6366f1" }}>API</sup>
                    </a>

                    <div className="flex items-center gap-6">
                        {["Features", "Google AI", "Pricing", "Integrations"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(" ", "-")}`}
                                className="font-body text-sm text-zinc-500 hover:text-white transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://twitter.com/PrasadMarco"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-white transition-all hover:scale-110"
                            aria-label="Twitter"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a
                            href="https://linkedin.com/in/sonuprasad23"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-white transition-all hover:scale-110"
                            aria-label="LinkedIn"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <p className="font-body text-xs text-zinc-600">© 2025 Nexus API · Built by @PrasadMarco</p>
                    <div className="flex gap-4">
                        <a href="#" className="font-body text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</a>
                        <a href="#" className="font-body text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ─── Landing page root ──────────────────────────────────────── */

export default function Landing({ onLogin, authError }) {
    const [binanceOpen, setBinanceOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#050507] text-white font-body overflow-x-hidden">
            <LandingNav onLogin={onLogin} />
            <HeroSection onLogin={onLogin} />
            <GTMSection />
            <GoogleAISection />
            <IntegrationsSection />
            <PricingSection onOpenBinance={() => setBinanceOpen(true)} onLogin={onLogin} />
            <Footer />

            {/* Auth error toast */}
            {authError && (
                <div
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-body"
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
                >
                    {authError}
                </div>
            )}

            <BinanceModal open={binanceOpen} onClose={() => setBinanceOpen(false)} />
        </div>
    );
}
