import { ChatWindow } from "@/components/chat/ChatWindow";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 max-w-4xl mx-auto w-full relative font-sans">
      <Link href="/fan" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline mb-3">
        <ArrowLeft size={14} /> Back to Fan Dashboard
      </Link>
      
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-white">AI Navigation Assistant</h2>
        <p className="text-[#b9cacb] font-mono text-xs">
          Ask a question in English, Hindi, Marathi, Arabic, French, or Spanish for grounded venue guidance.
        </p>
      </div>
      
      <div className="flex-1 min-h-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <ChatWindow role="fan" apiEndpoint="/api/assistant" />
      </div>
    </div>
  );
}
