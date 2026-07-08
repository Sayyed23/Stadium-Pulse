'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Plus, 
  AlertCircle, 
  Send,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewIncidentPage() {
  const [reporterId, setReporterId] = useState('vol_arjun');
  const [copilotInput, setCopilotInput] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const router = useRouter();

  // AI draft states
  const [draftIncident, setDraftIncident] = useState<any>(null);
  const [suggestedVolunteer, setSuggestedVolunteer] = useState<any>(null);
  const [dispatchMessage, setDispatchMessage] = useState('');
  const [incidentLogged, setIncidentLogged] = useState(false);
  const [createdIncidentId, setCreatedIncidentId] = useState<string | null>(null);

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;

    setIsDrafting(true);
    setIncidentLogged(false);
    setCreatedIncidentId(null);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporter_id: reporterId,
          description: copilotInput
        })
      });
      const data = await res.json();

      setDraftIncident(data.draft_incident);
      setSuggestedVolunteer(data.suggested_volunteer);
      setDispatchMessage(data.dispatch_message_localized);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleConfirmIncident = async () => {
    if (!draftIncident) return;
    try {
      const res = await fetch('/api/incidents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: draftIncident.category,
          zone_id: draftIncident.zone_id,
          priority: draftIncident.priority,
          description: draftIncident.description,
          assigned_volunteer_id: suggestedVolunteer ? suggestedVolunteer.id : null
        })
      });
      const data = await res.json();
      if (data.success) {
        setIncidentLogged(true);
        setCreatedIncidentId(data.incident.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      
      {/* Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <Link href="/incidents" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Incident Log
        </Link>
        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          Interactive Copilot
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Input box card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-slate-300">
            Log New Ticket
          </h2>
          <form onSubmit={handleCopilotSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Logging Volunteer Reporter</label>
              <select 
                value={reporterId} 
                onChange={(e) => setReporterId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs focus:border-emerald-500 outline-none cursor-pointer text-slate-200 font-medium"
              >
                <option value="vol_arjun">Arjun (Gate 3 - EN)</option>
                <option value="vol_meena">Meena (Gate 2 - HI)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Casual Spoken / Text Incident Details</label>
              <textarea
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder="e.g. lost child, girl about 6 years old, near Gate 2 food court"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs focus:border-emerald-500 outline-none h-28 resize-none text-slate-200 font-medium leading-relaxed"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isDrafting || !copilotInput.trim()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-white text-xs font-bold py-3 rounded-lg transition flex items-center justify-center gap-1.5"
            >
              {isDrafting ? 'Drafting Ticket...' : 'Draft structured Ticket'}
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* AI Auto Draft Details */}
        <div className="bg-slate-900/50 border border-slate-850 rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
          {draftIncident ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Auto-Draft
                  </span>
                  <span className="bg-rose-500/20 text-rose-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-rose-500/30 uppercase">
                    Priority: {draftIncident.priority}
                  </span>
                </div>
                <div className="mt-4 text-xs space-y-2 font-medium">
                  <p><strong className="text-slate-500">Category:</strong> <span className="capitalize text-slate-200">{draftIncident.category.replace('_', ' ')}</span></p>
                  <p><strong className="text-slate-500">Target Zone:</strong> <span className="font-mono text-slate-200">{draftIncident.zone_id}</span></p>
                  <p><strong className="text-slate-500">Details:</strong> <span className="text-slate-300">{draftIncident.description}</span></p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-3">
                {suggestedVolunteer && (
                  <div className="bg-emerald-950/20 border border-emerald-950/40 p-2.5 rounded-lg flex items-center justify-between text-xs font-semibold">
                    <div>
                      <p className="text-slate-300">Assigned Volunteer</p>
                      <p className="text-[10px] text-slate-500">{suggestedVolunteer.name} ({suggestedVolunteer.language.toUpperCase()})</p>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                      {suggestedVolunteer.zone_assignment}
                    </span>
                  </div>
                )}

                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1 uppercase tracking-wider">Localized Dispatch Message</label>
                  <textarea 
                    value={dispatchMessage}
                    onChange={(e) => setDispatchMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-xs text-slate-300 h-16 resize-none font-mono"
                  />
                </div>

                {incidentLogged ? (
                  <div className="space-y-2">
                    <div className="bg-emerald-500/20 border border-emerald-500/50 p-2.5 rounded-lg text-xs text-emerald-400 flex items-center justify-center gap-1.5 font-bold animate-pulse">
                      <Check className="w-4 h-4" />
                      Ticket Logged to Database!
                    </div>
                    {createdIncidentId && (
                      <Link 
                        href={`/incidents/${createdIncidentId}`}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 rounded-lg border border-slate-700 flex items-center justify-center gap-1 transition"
                      >
                        Inspect Ticket
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleConfirmIncident}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-lg transition"
                  >
                    Confirm & Send Dispatch
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-4">
              <Sparkles className="w-8 h-8 text-slate-800 mb-2" />
              <p className="text-xs">Submit incident details on the left to activate AI structuring.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
