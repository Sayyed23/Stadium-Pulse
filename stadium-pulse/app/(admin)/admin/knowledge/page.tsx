import { BookOpen, Plus, Search, Edit, Trash2, Tag } from "lucide-react";

const articles = [
  { id: "kb1", title: "Wheelchair Accessible Entrance Locations", category: "Navigation", tags: ["accessibility", "gates"], updatedAt: "2026-07-15" },
  { id: "kb2", title: "Emergency Medical Response Protocol", category: "Safety", tags: ["medical", "emergency"], updatedAt: "2026-07-10" },
  { id: "kb3", title: "Food & Beverage Pricing & Outlets", category: "Amenities", tags: ["food", "prices"], updatedAt: "2026-07-12" },
  { id: "kb4", title: "Shuttle Service Frequency & Timings", category: "Transport", tags: ["shuttle", "parking"], updatedAt: "2026-07-14" },
];

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Knowledge Base</h2>
        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
          <Plus size={16} /> Add KB Article
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search ground truth knowledge items..."
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Title</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Category</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Tags</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Last Updated</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                <td className="py-3 px-5 text-sm font-medium flex items-center gap-2">
                  <BookOpen size={14} className="text-violet-500" />
                  {art.title}
                </td>
                <td className="py-3 px-5 text-sm text-zinc-400">{art.category}</td>
                <td className="py-3 px-5">
                  <div className="flex gap-1">
                    {art.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Tag size={10} /> {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-5 text-sm text-zinc-400">{art.updatedAt}</td>
                <td className="py-3 px-5 flex items-center gap-2">
                  <button type="button" className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <Edit size={14} className="text-zinc-400" />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
