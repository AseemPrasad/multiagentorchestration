import React from 'react';
import { Clock, CheckCircle, XCircle, Play, FileText, Search, Edit } from 'lucide-react';

const icons = {
    TaskCreated: <Play className="w-4 h-4 text-blue-400" />,
    PlannerCompleted: <FileText className="w-4 h-4 text-purple-400" />,
    ResearcherCompleted: <Search className="w-4 h-4 text-yellow-400" />,
    WriterDrafted: <Edit className="w-4 h-4 text-green-400" />,
    ReviewerRejected: <XCircle className="w-4 h-4 text-red-500" />,
    RevisionRequested: <Clock className="w-4 h-4 text-orange-400" />,
    TaskCompleted: <CheckCircle className="w-4 h-4 text-emerald-500" />,
};

export default function Timeline({ events }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Event Ledger
            </h2>
            <div className="space-y-6">
                {events.length === 0 && (
                    <p className="text-slate-500 italic">No events recorded yet...</p>
                )}
                {events.map((event, idx) => (
                    <div key={idx} className="relative pl-8 pb-2 border-l border-slate-800 last:border-0">
                        <div className="absolute -left-2.5 top-0 bg-slate-950 p-1 rounded-full border border-slate-800">
                            {icons[event.type] || <FileText className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-200">{event.type}</span>
                            <span className="text-xs text-slate-500">
                                {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                            <div className="mt-2 p-3 bg-slate-800/30 rounded-lg text-xs font-mono text-slate-400 overflow-x-auto">
                                {JSON.stringify(event.payload, null, 2)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
