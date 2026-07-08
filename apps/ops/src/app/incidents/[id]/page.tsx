import React from 'react';
import { prisma } from '@stadiumpulse/db';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import IncidentActionButtons from '@/app/incidents/[id]/IncidentActionButtons';

export const dynamic = 'force-dynamic';

export default async function IncidentDetailPage({ params }: { params: { id: string } }) {
  // Fetch details using Prisma (RSC - Efficiency optimization)
  const incident = await prisma.incident.findUnique({
    where: { id: params.id },
    include: {
      zone: true,
      assignedVolunteer: true
    }
  });

  if (!incident) {
    return (
      <div className="p-6 text-center text-slate-500">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
        <p className="text-xs">Incident ID not found. Verify parameters and retry.</p>
        <Link href="/incidents" className="mt-4 inline-block text-xs text-emerald-400 hover:underline">
          Back to Incident Log
        </Link>
      </div>
    );
  }

  const getPriorityStyle = (prio: string) => {
    switch (prio) {
      case 'critical': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'high': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      
      {/* Top breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <Link href="/incidents" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Incident Log
        </Link>
        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          Ticket ID: {incident.id.substring(0, 8)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Ticket Details Panel */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 md:col-span-2 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Category</span>
              <h1 className="text-lg font-bold capitalize mt-0.5">{incident.category.replace('_', ' ')} Incident</h1>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${getPriorityStyle(incident.priority)}`}>
              {incident.priority} Priority
            </span>
          </div>

          <div className="bg-slate-950/40 border border-slate-900 p-3 rounded-lg text-xs leading-relaxed">
            <span className="text-[10px] text-slate-500 block font-bold uppercase mb-1">Description</span>
            <p className="text-slate-200 font-medium">{incident.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/40 p-3 border border-slate-900 rounded-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[9px] text-slate-500 block font-bold uppercase">Location</span>
                <span className="text-slate-300 font-bold capitalize">{incident.zone.name}</span>
              </div>
            </div>
            <div className="bg-slate-950/40 p-3 border border-slate-900 rounded-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[9px] text-slate-500 block font-bold uppercase">Reported At</span>
                <span className="text-slate-300 font-bold font-mono">{incident.createdAt.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Interactive actions wrapper */}
          <IncidentActionButtons incidentId={incident.id} initialStatus={incident.status} />
        </div>

        {/* Volunteer & Timeline sidebar */}
        <div className="space-y-6">
          
          {/* Volunteer Assignment Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold tracking-wide text-slate-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              Assigned Volunteer
            </h2>

            {incident.assignedVolunteer ? (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-950/40 p-2.5 border border-slate-900 rounded-lg">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Name</span>
                  <span className="text-slate-200 font-bold block mt-0.5">{incident.assignedVolunteer.name}</span>
                  <span className="text-[9px] text-slate-500 mt-1 block">Zone assignment: {incident.assignedVolunteer.zoneAssignment}</span>
                </div>
                <div className="bg-slate-950/40 p-2.5 border border-slate-900 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Preferred Language</span>
                    <span className="text-slate-200 font-bold uppercase mt-0.5">{incident.assignedVolunteer.preferredLanguage}</span>
                  </div>
                  <a 
                    href="tel:+15550199" 
                    className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full hover:scale-105 transition"
                    title="Call Volunteer"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-medium">No volunteer currently assigned.</p>
            )}
          </div>

          {/* Ticket Status Timeline */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold tracking-wide text-slate-300">Status Timeline</h2>
            <div className="space-y-4 text-xs font-semibold pl-2 relative border-l border-slate-800">
              <div className="relative">
                <div className="absolute w-2 h-2 bg-emerald-400 rounded-full -left-[13px] top-1"></div>
                <p className="text-slate-300">Ticket Created</p>
                <span className="text-[9px] text-slate-500 font-mono font-bold block">{incident.createdAt.toLocaleTimeString()}</span>
              </div>
              <div className="relative">
                <div className={`absolute w-2 h-2 rounded-full -left-[13px] top-1 ${
                  incident.status !== 'reported' ? 'bg-emerald-400' : 'bg-slate-700'
                }`}></div>
                <p className={incident.status !== 'reported' ? 'text-slate-300' : 'text-slate-500'}>Volunteer Dispatched</p>
              </div>
              <div className="relative">
                <div className={`absolute w-2 h-2 rounded-full -left-[13px] top-1 ${
                  incident.status === 'resolved' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'
                }`}></div>
                <p className={incident.status === 'resolved' ? 'text-slate-300' : 'text-slate-500'}>Resolved & Closed</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
