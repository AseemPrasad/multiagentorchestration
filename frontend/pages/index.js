import React, { useState, useEffect } from 'react';
import GraphView from '../components/GraphView';
import Timeline from '../components/Timeline';
import Results from '../components/Results';

export default function Home() {
  const [request, setRequest] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request }),
      });
      const data = await res.json();
      setTaskId(data.id);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!taskId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/task/${taskId}`);
        const data = await res.json();
        setTask(data);
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [taskId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Multi-Agent Orchestrator
        </h1>
        <p className="mt-4 text-slate-400 text-lg">Event-Sourced Task Management System</p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-12 flex gap-4">
        <input
          type="text"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Enter your request (e.g. Research AI trends)..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          {loading ? 'Submitting...' : 'Run Pipeline'}
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[700px]">
        <div className="lg:col-span-3 bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-hidden relative">
          <GraphView currentStatus={task?.status} />
        </div>
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6 overflow-y-auto custom-scrollbar">
          <Timeline events={task?.events || []} />
        </div>
      </div>

      <div className="mt-12 max-w-5xl mx-auto">
        <Results task={task} />
      </div>
    </div>
  );
}
