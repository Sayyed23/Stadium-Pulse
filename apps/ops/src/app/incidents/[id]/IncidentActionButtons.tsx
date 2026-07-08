'use client';

import React, { useState } from 'react';
import { CheckCircle2, Navigation2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  incidentId: string;
  initialStatus: string;
}

export default function IncidentActionButtons({ incidentId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async (nextStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/incidents/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: incidentId,
          status: nextStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus(nextStatus);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'resolved') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 animate-pulse">
        <Check className="w-4 h-4" />
        Incident successfully resolved and logged.
      </div>
    );
  }

  return (
    <div className="flex gap-4 pt-2">
      {status === 'reported' && (
        <button
          onClick={() => handleUpdateStatus('dispatched')}
          disabled={loading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition"
        >
          <Navigation2 className="w-4 h-4" />
          Dispatch Volunteer
        </button>
      )}
      <button
        onClick={() => handleUpdateStatus('resolved')}
        disabled={loading}
        className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition"
      >
        <CheckCircle2 className="w-4 h-4" />
        Resolve Incident
      </button>
    </div>
  );
}
