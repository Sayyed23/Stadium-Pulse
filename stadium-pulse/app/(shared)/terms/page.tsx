import { ScrollText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="glass-panel rounded-2xl p-8 space-y-4 max-w-3xl">
      <div className="flex items-center gap-2 text-blue-500 font-semibold text-sm">
        <ScrollText size={18} /> Legal & Terms
      </div>
      <h2 className="text-3xl font-bold">Terms of Service</h2>
      <p className="text-xs text-slate-400">Last updated: July 2026</p>

      <div className="space-y-4 text-sm text-slate-300 leading-relaxed pt-2">
        <p>
          By using the StadiumPulse AI progressive web application, you agree to
          comply with venue safety regulations and platform terms.
        </p>

        <h3 className="font-bold text-slate-100 text-base">
          1. Acceptable Use
        </h3>
        <p>
          The platform is designed for tournament navigation, facility
          discovery, and emergency reporting. Misuse of the SOS system or
          submission of false incidents is prohibited.
        </p>

        <h3 className="font-bold text-slate-100 text-base">
          2. Grounded AI Directions
        </h3>
        <p>
          AI navigation responses are generated based on real-time database
          facts. Follow physical stadium signage and staff directions in case of
          any discrepancy.
        </p>
      </div>
    </div>
  );
}
