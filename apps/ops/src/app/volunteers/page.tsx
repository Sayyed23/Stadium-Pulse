import React from 'react';
import { prisma } from '@stadiumpulse/db';
import { Users, Globe, Phone, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VolunteersRosterPage() {
  // Query database using Prisma (RSC - Efficiency optimization)
  const volunteers = await prisma.volunteer.findMany({
    include: {
      zone: true
    }
  });

  const getAvailabilityStyle = (status: string) => {
    switch (status) {
      case 'offline': return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'busy': return 'bg-rose-500/25 text-rose-400 border-rose-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6 flex-1 flex flex-col">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Volunteer Roster</h1>
          <p className="text-xs text-slate-400">Roster list of student volunteers active across stadium gates.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <span>Active Volunteers: <strong className="text-emerald-400 font-mono">{volunteers.length}</strong></span>
        </div>
      </div>

      {/* Roster table */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-xl overflow-hidden shadow-lg flex-1">
        {volunteers.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-xs">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-700" />
            No volunteers seeded in database. Run pnpm db:seed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider bg-slate-900/50">
                  <th className="p-4">Name</th>
                  <th className="p-4">Zone Assignment</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4">Preferred Language</th>
                  <th className="p-4">Contact Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-900/25 transition">
                    <td className="p-4 font-bold text-slate-200 flex items-center gap-2">
                      <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold text-[10px] uppercase">
                        {vol.name.substring(0, 2)}
                      </div>
                      {vol.name}
                    </td>
                    <td className="p-4 font-medium text-slate-400 capitalize">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {vol.zone.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase ${getAvailabilityStyle(vol.availability)}`}>
                        {vol.availability}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-slate-300 font-medium">
                        <Globe className="w-3.5 h-3.5 text-slate-500" />
                        {vol.preferredLanguage === 'mr' ? 'Marathi (मराठी)' : vol.preferredLanguage === 'hi' ? 'Hindi (हिन्दी)' : 'English'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        {vol.contactChannel}
                      </span>
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
