import { useState } from "react";
import { queryLLM } from "../api";

export default function ApiTester() {
    const [source, setSource] = useState("chatgpt");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [question, setQuestion] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const run = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setResult("");
        setError("");
        try {
            const data = await queryLLM(source, systemPrompt, question);
            setResult(data.response ?? JSON.stringify(data));
        } catch {
            setError("Request failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                {["chatgpt", "google"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setSource(s)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                            source === s
                                ? "bg-violet-600 text-white"
                                : "bg-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                    >
                        {s === "chatgpt" ? "ChatGPT" : "Google AI"}
                    </button>
                ))}
            </div>
            <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="System prompt (optional)"
                rows={2}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
            />
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question..."
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
            />
            <button
                onClick={run}
                disabled={loading || !question.trim()}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            >
                {loading ? "Running..." : "Send"}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {result && (
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 whitespace-pre-wrap">
                    {result}
                </div>
            )}
        </div>
    );
}
