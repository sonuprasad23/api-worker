import { useState } from "react";

export default function CodeSnippet({ apiKey }) {
    const [lang, setLang] = useState("javascript");
    const [source, setSource] = useState("chatgpt");
    const [copied, setCopied] = useState(false);
    const BASE = import.meta.env.VITE_API_BASE_URL;

    const snippets = {
        javascript: `const res = await fetch("${BASE}/query/${source}/apikey", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: "${apiKey}",
    system_prompt: "",
    question: "Your question here"
  })
});
const data = await res.json();
console.log(data.response);`,
        python: `import requests

res = requests.post("${BASE}/query/${source}/apikey", json={
    "api_key": "${apiKey}",
    "system_prompt": "",
    "question": "Your question here"
})
print(res.json()["response"])`,
        curl: `curl -X POST ${BASE}/query/${source}/apikey \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "${apiKey}",
    "system_prompt": "",
    "question": "Your question here"
  }'`,
    };

    const copy = () => {
        navigator.clipboard.writeText(snippets[lang]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap items-center">
                <div className="flex gap-2">
                    {["javascript", "python", "curl"].map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                lang === l
                                    ? "bg-violet-600 text-white"
                                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
                <div className="ml-auto flex gap-2">
                    {["chatgpt", "google"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setSource(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                source === s
                                    ? "bg-zinc-600 text-white"
                                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                        >
                            {s === "chatgpt" ? "ChatGPT" : "Google AI"}
                        </button>
                    ))}
                </div>
            </div>
            <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-4">
                <button
                    onClick={copy}
                    className="absolute top-3 right-3 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
                <pre className="text-sm text-zinc-300 overflow-x-auto whitespace-pre">
                    {snippets[lang]}
                </pre>
            </div>
        </div>
    );
}
