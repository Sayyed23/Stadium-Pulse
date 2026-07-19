import { Sparkles, Plus } from "lucide-react";
import { TableRowActions } from "@/components/admin/TableRowActions";

const prompts = [
  {
    id: "p1",
    name: "Fan Wayfinding Prompt",
    model: "gemini-1.5-flash",
    version: "v2.1",
    status: "active",
  },
  {
    id: "p2",
    name: "Incident Extraction Copilot",
    model: "gemini-1.5-pro",
    version: "v1.4",
    status: "active",
  },
  {
    id: "p3",
    name: "Situation Report Summarizer",
    model: "gemini-1.5-flash",
    version: "v1.0",
    status: "active",
  },
  {
    id: "p4",
    name: "Multilingual Dispatch Translator",
    model: "gemini-1.5-pro",
    version: "v1.2",
    status: "draft",
  },
];

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">AI Prompt Management</h2>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Create Prompt
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">
                Prompt Name
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">
                Model
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">
                Version
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">
                Status
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {prompts.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
              >
                <td className="py-3 px-5 text-sm font-medium flex items-center gap-2">
                  <Sparkles size={14} className="text-violet-500" />
                  {p.name}
                </td>
                <td className="py-3 px-5 text-sm font-mono text-zinc-400">
                  {p.model}
                </td>
                <td className="py-3 px-5 text-sm font-mono">{p.version}</td>
                <td className="py-3 px-5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${p.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                  >
                    {p.status}
                  </span>
                </td>
                <TableRowActions />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
