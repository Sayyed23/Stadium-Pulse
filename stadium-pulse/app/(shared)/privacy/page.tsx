import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="glass-panel rounded-2xl p-8 space-y-4 max-w-3xl">
      <div className="flex items-center gap-2 text-blue-500 font-semibold text-sm">
        <ShieldCheck size={18} /> Legal & Privacy
      </div>
      <h2 className="text-3xl font-bold">Privacy Policy</h2>
      <p className="text-xs text-slate-400">Last updated: July 2026</p>

      <div className="space-y-4 text-sm text-slate-300 leading-relaxed pt-2">
        <p>
          StadiumPulse AI prioritizes spectator privacy and operational
          security. This policy outlines how data is gathered and handled during
          venue visits.
        </p>

        <h3 className="font-bold text-slate-100 text-base">
          1. Location Telemetry
        </h3>
        <p>
          Indoor navigation features use anonymized zone-level positioning. We
          do not store precise GPS or personal movement history tied to
          individual identities.
        </p>

        <h3 className="font-bold text-slate-100 text-base">
          2. AI Assistant Logging
        </h3>
        <p>
          Queries submitted to the AI assistant are processed securely.
          Grounding audits check queries against database facts to prevent
          hallucinated directions.
        </p>

        <h3 className="font-bold text-slate-100 text-base">
          3. Operational Incidents
        </h3>
        <p>
          Incident reports filed via the Volunteer Copilot are logged strictly
          for emergency response and staff dispatch purposes.
        </p>
      </div>
    </div>
  );
}
