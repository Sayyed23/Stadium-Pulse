"use client";

import { useState } from "react";
import { Send, User } from "lucide-react";

const threads = [
  { id: "dispatch", name: "Dispatch Center", lastMsg: "New assignment: Gate 3 wheelchair assist", time: "2m", unread: 2 },
  { id: "team-b", name: "Team B — Zone B", lastMsg: "All clear on south concourse", time: "8m", unread: 0 },
  { id: "ops", name: "Ops Control Room", lastMsg: "Zone B alert acknowledged, monitoring.", time: "15m", unread: 0 },
];

const messages = [
  { from: "dispatch", text: "Incident INC-042: Medical emergency at Zone B. You have been assigned.", time: "16:12", self: false },
  { from: "you", text: "Acknowledged. Heading to Zone B concourse now.", time: "16:13", self: true },
  { from: "dispatch", text: "First aid kit location: Cabinet #4, near Gate 5.", time: "16:13", self: false },
  { from: "you", text: "Got it. ETA 2 minutes.", time: "16:14", self: true },
  { from: "dispatch", text: "New assignment: Assist wheelchair guest — Gate 3", time: "16:28", self: false },
];

export default function VolunteerMessagesPage() {
  const [activeThread, setActiveThread] = useState("dispatch");
  const [input, setInput] = useState("");

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-4">
      {/* Thread List */}
      <div className="w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold text-sm">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800">
          {threads.map((t) => (
            <button type="button"
              key={t.id}
              onClick={() => setActiveThread(t.id)}
              className={`w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors ${activeThread === t.id ? "bg-teal-50 dark:bg-teal-900/20" : ""}`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-medium truncate">{t.name}</span>
                <span className="text-[10px] text-zinc-400">{t.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 truncate pr-2">{t.lastMsg}</span>
                {t.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0">{t.unread}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center">
            <User size={16} className="text-teal-500" />
          </div>
          <span className="font-semibold text-sm">{threads.find((t) => t.id === activeThread)?.name}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id || msg.text} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.self
                  ? "bg-teal-500 text-white rounded-br-md"
                  : "bg-zinc-100 dark:bg-zinc-800 rounded-bl-md"
              }`}>
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.self ? "text-teal-200" : "text-zinc-400"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button type="button" className="w-10 h-10 rounded-xl bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
