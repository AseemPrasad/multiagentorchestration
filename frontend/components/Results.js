import React from 'react';
import { FileCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function Results({ task }) {
    if (!task) return null;

    return (
        <div className="bg-slate-900/30 rounded-3xl border border-slate-800 p-10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold">Execution Result</h2>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        task.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse'
                    }`}>
                    {task.status === 'completed' ? <FileCheck className="w-4 h-4" /> :
                        task.status === 'failed' ? <AlertCircle className="w-4 h-4" /> :
                            <Loader2 className="w-4 h-4 animate-spin" />}
                    {task.status.toUpperCase()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div className="space-y-4">
                    <h3 className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Task Request</h3>
                    <p className="text-xl text-slate-200 leading-relaxed font-medium">{task.request}</p>
                </div>
                {task.plan && (
                    <div className="space-y-4">
                        <h3 className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Execution Plan</h3>
                        <ul className="space-y-2">
                            {task.plan.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-300">
                                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] shrink-0 mt-0.5">{i + 1}</span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {task.final_report && (
                <div className="space-y-6 pt-10 border-t border-slate-800">
                    <h3 className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Synthesized Report</h3>
                    <div className="bg-slate-950/50 p-8 rounded-2xl border border-slate-800/50 text-slate-300 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                        {task.final_report}
                    </div>
                </div>
            )}

            {task.feedback && !task.final_report && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <h3 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4" /> Reviewer Feedback
                    </h3>
                    <p className="text-red-300/80 italic">{task.feedback}</p>
                </div>
            )}
        </div>
    );
}
