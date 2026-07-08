import React from 'react';
import { prisma } from '@stadiumpulse/db';
import { FileText, AlertOctagon, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ReportsAuditPage() {
  // Query database using Prisma (RSC - Efficiency optimization)
  const chatLogs = await prisma.chatLog.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const totalLogs = chatLogs.length;
  const flaggedLogs = chatLogs.filter(log => log.flaggedHallucination).length;
  const hallucinationRate = totalLogs > 0 ? (flaggedLogs / totalLogs) * 100 : 0;

  return (
    <div className="p-6 space-y-6 flex-1 flex flex-col">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI Security Audit & Hallucination Reports</h1>
          <p className="text-xs text-slate-400">Post-event audit log review to evaluate assistant response security parameters.</p>
        </div>
      </div>

      {/* Metrics HUD widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Total AI Queries</span>
            <span className="text-xl font-bold font-mono text-slate-200 mt-1 block">{totalLogs}</span>
          </div>
          <Sparkles className="w-8 h-8 text-emerald-500/20" />
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Flagged Hallucinations</span>
            <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">{flaggedLogs}</span>
          </div>
          <AlertOctagon className="w-8 h-8 text-rose-500/20" />
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Grounding Accuracy Rate</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              {Math.round(100 - hallucinationRate)}%
            </span>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500/20" />
        </div>
      </div>

      {/* Log list table */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-xl overflow-hidden shadow-lg flex-1">
        {chatLogs.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-xs">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-700" />
            No chat queries registered in database. Use /fan assistant to generate logs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider bg-slate-900/50">
                  <th className="p-4">Session ID</th>
                  <th className="p-4">User Query</th>
                  <th className="p-4">AI Response</th>
                  <th className="p-4">Grounded Sources</th>
                  <th className="p-4">Hallucination Gate</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {chatLogs.map((log) => {
                  const sources = JSON.parse(log.groundedSources || '[]');
                  return (
                    <tr key={log.id} className="hover:bg-slate-900/25 transition">
                      <td className="p-4 font-mono text-slate-400">{log.sessionId.substring(0, 10)}</td>
                      <td className="p-4 max-w-[150px] truncate text-slate-300 font-medium">{log.query}</td>
                      <td className="p-4 max-w-[200px] truncate text-slate-400 font-medium">{log.response}</td>
                      <td className="p-4 font-mono text-slate-400">
                        {sources.length === 0 ? (
                          <span className="text-[10px] text-slate-600 font-semibold">None cited</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {sources.map((s: string) => (
                              <span key={s} className="bg-slate-800 text-slate-300 px-1 rounded text-[9px]">
                                {s.replace('amenity_', '').replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          log.flaggedHallucination 
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {log.flaggedHallucination ? 'Hallucination Flag' : 'Safe/Grounded'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 font-mono">
                        {log.createdAt.toLocaleDateString()} {log.createdAt.toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
