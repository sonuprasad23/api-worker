import { useState } from "react";
import Navbar from "../components/Navbar";
import ApiTester from "../components/ApiTester";
import CodeSnippet from "../components/CodeSnippet";
import UsageStats from "../components/UsageStats";

export default function Dashboard({ profile, onLogout }) {
    const [tab, setTab] = useState("tester");

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar profile={profile} onLogout={onLogout} />
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold">
                        Welcome back, {profile?.displayName?.split(" ")[0]}
                    </h1>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Your API key:{" "}
                        <code className="bg-zinc-800 px-2 py-0.5 rounded text-violet-300">
                            {profile?.apiKey}
                        </code>
                    </p>
                </div>

                <UsageStats totalCalls={profile?.totalCalls ?? 0} />

                <div className="flex gap-2 mb-6 mt-8">
                    {["tester", "code"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                                tab === t
                                    ? "bg-violet-600 text-white"
                                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                        >
                            {t === "tester" ? "API Tester" : "Code Examples"}
                        </button>
                    ))}
                </div>

                {tab === "tester" && <ApiTester />}
                {tab === "code" && <CodeSnippet apiKey={profile?.apiKey} />}
            </div>
        </div>
    );
}
