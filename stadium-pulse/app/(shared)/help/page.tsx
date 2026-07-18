import { Search, MessageSquare, Phone, BookOpen } from "lucide-react";

export default function HelpCenterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h2 className="text-3xl font-bold">How can we help?</h2>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search help articles, gates, amenities..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="glass-panel rounded-xl p-5 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
            <MessageSquare size={20} />
          </div>
          <h3 className="font-semibold text-sm">AI Assistant</h3>
          <p className="text-xs text-slate-400">Ask real-time questions in English, Hindi, or Marathi</p>
        </div>
        <div className="glass-panel rounded-xl p-5 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Phone size={20} />
          </div>
          <h3 className="font-semibold text-sm">Helpline</h3>
          <p className="text-xs text-slate-400">Call stadium support for emergency assistance</p>
        </div>
        <div className="glass-panel rounded-xl p-5 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
            <BookOpen size={20} />
          </div>
          <h3 className="font-semibold text-sm">Stadium Guide</h3>
          <p className="text-xs text-slate-400">Read rules, accessibility info, and gate maps</p>
        </div>
      </div>
    </div>
  );
}
