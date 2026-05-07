export default function UsageStats({ totalCalls }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="text-3xl font-bold text-violet-400">{totalCalls}</div>
                <div className="text-zinc-400 text-sm mt-1">Total API Calls</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="text-3xl font-bold text-emerald-400">2</div>
                <div className="text-zinc-400 text-sm mt-1">Active Sources</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="text-3xl font-bold text-sky-400">∞</div>
                <div className="text-zinc-400 text-sm mt-1">Rate Limit</div>
            </div>
        </div>
    );
}
