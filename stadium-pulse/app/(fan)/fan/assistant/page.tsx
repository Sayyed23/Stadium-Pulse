import { ChatWindow } from "@/components/chat/ChatWindow";

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-full p-4 md:p-8 max-w-4xl mx-auto w-full relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none -z-10" />
      
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Navigation Assistant</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Ask a question in your preferred language to get grounded venue directions and recommendations.
        </p>
      </div>
      
      <div className="flex-1 min-h-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <ChatWindow role="fan" apiEndpoint="/api/assistant" />
      </div>
    </div>
  );
}
