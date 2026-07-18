import { Languages, Plus } from "lucide-react";

const languages = [
  { code: "en", name: "English", isDefault: true, coverage: "100%" },
  { code: "hi", name: "Hindi (हिन्दी)", isDefault: false, coverage: "98%" },
  { code: "mr", name: "Marathi (मराठी)", isDefault: false, coverage: "95%" },
  { code: "ar", name: "Arabic (العربية)", isDefault: false, coverage: "90%" },
];

export default function LanguagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Language Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
          <Plus size={16} /> Add Language
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Code</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Language</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Translation Coverage</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {languages.map((l) => (
              <tr key={l.code} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                <td className="py-3 px-5 text-sm font-mono uppercase font-bold text-violet-400">{l.code}</td>
                <td className="py-3 px-5 text-sm font-medium flex items-center gap-2">
                  <Languages size={14} className="text-zinc-400" />
                  {l.name}
                </td>
                <td className="py-3 px-5 text-sm">{l.coverage}</td>
                <td className="py-3 px-5">
                  {l.isDefault ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 uppercase">Default</span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 uppercase">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
