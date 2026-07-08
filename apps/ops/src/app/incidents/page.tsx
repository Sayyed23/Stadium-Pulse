import React from 'react';
import { prisma } from '@stadiumpulse/db';
import Link from 'next/link';
import { 
  FileWarning, 
  Plus, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Calendar
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function IncidentsPage({
  searchParams
}: {
  searchParams: { status?: string; priority?: string };
}) {
  // Parse query filters
  const statusFilter = searchParams.status || undefined;
  const priorityFilter = searchParams.priority || undefined;

  // Query database using filters
  const incidents = await prisma.incident.findMany({
    where: {
      status: statusFilter,
      priority: priorityFilter
    },
    include: {
      zone: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const getPriorityStyle = (prio: string) => {
    switch (prio) {
      case 'critical': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'high': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'dispatched': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6 flex-1 flex flex-col">
      
      {/* Header section */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Incident Log Queue</h1>
          <p className="text-xs text-slate-400">Track and dispatch active support tickets filed by volunteers.</p>
        </div>
        <Link 
          href="/incidents/new"
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          Create manual Incident
        </Link>
      </div>

      {/* Filter Tabs links */}
      <div className="flex gap-4 border-b border-slate-900 pb-2 text-xs">
        <Link 
          href="/incidents"
          className={`pb-2 font-semibold ${!statusFilter ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          All tickets
        </Link>
        <Link 
          href="/incidents?status=reported"
          className={`pb-2 font-semibold ${statusFilter === 'reported' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Reported
        </Link>
        <Link 
          href="/incidents?status=dispatched"
          className={`pb-2 font-semibold ${statusFilter === 'dispatched' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Dispatched
        </Link>
        <Link 
          href="/incidents?status=resolved"
          className={`pb-2 font-semibold ${statusFilter === 'resolved' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Resolved
        </Link>
      </div>

      {/* Roster table */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-xl overflow-hidden shadow-lg flex-1">
        {incidents.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-xs">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-700" />
            No incidents match these filter configurations.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider bg-slate-900/50">
                  <th className="p-4">Category</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Zone</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-900/25 transition">
                    <td className="p-4 capitalize font-bold text-slate-200">
                      {inc.category.replace('_', ' ')}
                    </td>
                    <td className="p-4 max-w-[250px] truncate text-slate-400 font-medium">
                      {inc.description}
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {inc.zone.name}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${getPriorityStyle(inc.priority)}`}>
                        {inc.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${getStatusStyle(inc.status)}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {inc.createdAt.toLocaleTimeString()}
                    </td>
                    <td className="p-4">
                      <Link 
                        href={`/incidents/${inc.id}`}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-bold transition"
                      >
                        Inspect
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
