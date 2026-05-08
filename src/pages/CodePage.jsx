import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const SNIPPETS = {
    javascript: (apiKey) => `// Google AI Mode — JavaScript
const response = await fetch(
  "https://allfreeapi.netlify.app/.netlify/functions/api/query/google/apikey",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: "${apiKey || "YOUR_API_KEY"}",
      system_prompt: "Return structured JSON with name, email, and LinkedIn URL.",
      question: "Find the Head of Growth at Stripe.",
    }),
  }
);

const data = await response.json();
console.log(data.response);
// → "Head of Growth at Stripe is Alex Johnson.
//    Email: alex@stripe.com
//    LinkedIn: linkedin.com/in/alexjohnson"`,

    python: (apiKey) => `# Google AI Mode — Python
import requests

response = requests.post(
    "https://allfreeapi.netlify.app/.netlify/functions/api/query/google/apikey",
    json={
        "api_key": "${apiKey || "YOUR_API_KEY"}",
        "system_prompt": "Return structured JSON with name, email, and LinkedIn URL.",
        "question": "Find the Head of Growth at Stripe.",
    },
)

data = response.json()
print(data["response"])
# → Head of Growth at Stripe is Alex Johnson.
#   Email: alex@stripe.com
#   LinkedIn: linkedin.com/in/alexjohnson`,

    curl: (apiKey) => `# Google AI Mode — cURL
curl -X POST \\
  https://allfreeapi.netlify.app/.netlify/functions/api/query/google/apikey \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "${apiKey || "YOUR_API_KEY"}",
    "system_prompt": "Return structured JSON with name, email, LinkedIn URL.",
    "question": "Find the Head of Growth at Stripe."
  }'

# Response:
# {
#   "response": "Head of Growth at Stripe is Alex Johnson.
#   Email: alex@stripe.com
#   LinkedIn: linkedin.com/in/alexjohnson"
# }`,
};

const SCHEMA_ROWS = [
    { field: "api_key", type: "string", required: true, desc: "Your Nexus API key from the dashboard" },
    { field: "question", type: "string", required: true, desc: "The query to send to Google AI Mode" },
    { field: "system_prompt", type: "string", required: false, desc: "Optional context/instructions for the model" },
];

const USE_CASES = [
    {
        title: "Lead Enrichment",
        icon: "🎯",
        query: `Find the Head of Marketing at Notion.
Return their full name, work email, LinkedIn URL, and
whether they've posted on LinkedIn in the last 30 days.`,
    },
    {
        title: "Company Research",
        icon: "🏢",
        query: `What is the current headcount, funding stage, and
most recent funding round for Vercel?
Include the lead investors and total amount raised.`,
    },
    {
        title: "Outreach Personalization",
        icon: "✉️",
        query: `Find the most recent blog post or press release
from Stripe in the last 2 weeks. Summarize it in
2 sentences suitable for a personalized cold email opener.`,
    },
];

function CodeBlock({ code, lang }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    };

    // Simple syntax highlight (comments, strings, keywords)
    const highlighted = code
        .split("\n")
        .map((line, i) => {
            const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
            if (isComment) {
                return (
                    <div key={i} className="text-zinc-500">
                        {line}
                    </div>
                );
            }
            return <div key={i}>{line}</div>;
        });

    return (
        <div className="glass rounded-2xl overflow-hidden">
            <div
                className="flex items-center justify-between px-5 py-3 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
            >
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">{lang}</span>
                <button
                    onClick={copy}
                    className="text-xs px-3 py-1.5 rounded-lg font-mono transition-all"
                    style={{
                        background: copied ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)",
                        color: copied ? "#818cf8" : "#a1a1aa",
                    }}
                >
                    {copied ? "✓ Copied" : "Copy"}
                </button>
            </div>
            <pre className="font-mono text-sm leading-[1.8] p-5 overflow-x-auto text-zinc-300">
                {highlighted}
            </pre>
        </div>
    );
}

export default function CodePage() {
    const ctx = useOutletContext();
    const profile = ctx?.profile;
    const apiKey = profile?.apiKey;

    const [lang, setLang] = useState("javascript");

    return (
        <div className="px-8 py-10 max-w-[860px]">
            {/* Header */}
            <div className="mb-10">
                <h1 className="font-display font-bold text-3xl text-white mb-1">Code Examples</h1>
                <p className="font-body text-zinc-400 text-sm">
                    Copy-ready snippets for Google AI Mode.
                </p>
            </div>

            {/* Language selector */}
            <div className="flex items-center gap-2 mb-6">
                {["javascript", "python", "curl"].map((l) => (
                    <button
                        key={l}
                        onClick={() => setLang(l)}
                        className="px-4 py-2 rounded-xl text-sm font-mono font-medium transition-all"
                        style={{
                            background: lang === l ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
                            color: lang === l ? "#818cf8" : "#71717a",
                            border: lang === l ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                        }}
                    >
                        {l === "javascript" ? "JavaScript" : l === "python" ? "Python" : "cURL"}
                    </button>
                ))}

                <div className="ml-auto flex items-center gap-2">
                    <span
                        className="px-3 py-2 rounded-xl text-xs font-mono"
                        style={{
                            background: "rgba(99,102,241,0.12)",
                            border: "1px solid rgba(99,102,241,0.25)",
                            color: "#818cf8",
                        }}
                    >
                        Google AI Mode
                    </span>
                </div>
            </div>

            {/* Code block */}
            <div className="mb-10">
                <CodeBlock code={SNIPPETS[lang](apiKey)} lang={lang} />
                {!apiKey && (
                    <p className="font-body text-xs text-zinc-600 mt-2">
                        Your API key will appear automatically once loaded.
                    </p>
                )}
            </div>

            {/* Request Schema */}
            <div className="mb-12">
                <h2 className="font-display font-bold text-white text-lg mb-4">Request Schema</h2>
                <div className="glass rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr
                                className="text-left border-b"
                                style={{ borderColor: "rgba(255,255,255,0.06)" }}
                            >
                                {["field", "type", "required", "description"].map((h) => (
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
                            {SCHEMA_ROWS.map((row, i) => (
                                <tr
                                    key={row.field}
                                    className="border-b transition-colors"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.04)",
                                        background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                                    }}
                                >
                                    <td className="px-5 py-3.5 font-mono text-sm" style={{ color: "#818cf8" }}>
                                        {row.field}
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-amber-400">
                                        {row.type}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className="px-2 py-0.5 rounded text-[10px] font-mono"
                                            style={
                                                row.required
                                                    ? { background: "rgba(99,102,241,0.15)", color: "#818cf8" }
                                                    : { background: "rgba(255,255,255,0.06)", color: "#71717a" }
                                            }
                                        >
                                            {row.required ? "required" : "optional"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 font-body text-sm text-zinc-400">
                                        {row.desc}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Example use cases */}
            <div>
                <h2 className="font-display font-bold text-white text-lg mb-4">Example Use Cases</h2>
                <div className="space-y-4">
                    {USE_CASES.map((uc) => (
                        <div key={uc.title} className="glass rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xl">{uc.icon}</span>
                                <h3 className="font-display font-semibold text-white">{uc.title}</h3>
                            </div>
                            <pre
                                className="font-mono text-sm text-zinc-400 whitespace-pre-wrap leading-relaxed p-4 rounded-xl"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                                {uc.query}
                            </pre>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
