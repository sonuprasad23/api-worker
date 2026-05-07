export default function Landing({ onLogin }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
            <nav className="px-8 py-5 flex items-center justify-between border-b border-zinc-800">
                <span className="text-xl font-semibold tracking-tight text-white">Nexus API</span>
                <button
                    onClick={onLogin}
                    className="px-5 py-2 text-sm bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors"
                >
                    Sign in with Google
                </button>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="inline-block mb-6 px-3 py-1 text-xs font-medium bg-violet-900/40 text-violet-300 rounded-full border border-violet-700/50">
                    Free LLM API Platform
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                    Instant access to<br />ChatGPT &amp; Google AI
                </h1>
                <p className="text-zinc-400 text-lg max-w-xl mb-10">
                    Query the world's best LLMs through a clean API. No OpenAI keys, no billing. Just ship.
                </p>
                <button
                    onClick={onLogin}
                    className="flex items-center gap-3 px-7 py-3.5 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-colors"
                >
                    <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
                    Continue with Google
                </button>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full text-left">
                    {[
                        {
                            title: "Two LLM Sources",
                            desc: "Route queries to ChatGPT or Google AI Mode from a single unified endpoint.",
                        },
                        {
                            title: "API Key Access",
                            desc: "Use your personal API key to integrate Nexus into any app or script.",
                        },
                        {
                            title: "Zero Cost",
                            desc: "No paid subscriptions, no per-token billing. Ship faster without the overhead.",
                        },
                    ].map((f) => (
                        <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                            <div className="text-white font-medium mb-2">{f.title}</div>
                            <div className="text-zinc-400 text-sm leading-relaxed">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="px-8 py-5 border-t border-zinc-800 text-center text-zinc-600 text-sm">
                © {new Date().getFullYear()} Nexus API
            </footer>
        </div>
    );
}
