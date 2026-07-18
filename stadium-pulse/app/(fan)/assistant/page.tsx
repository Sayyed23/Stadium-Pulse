import { ChatWindow } from "@/components/chat/ChatWindow";

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-full p-4 max-w-3xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-2">Navigation Assistant</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Ask a question in your preferred language to get grounded venue directions.
      </p>
      <div className="flex-1 min-h-0">
        <ChatWindow role="fan" apiEndpoint="/api/assistant" />
      </div>
    </div>
  );
}
