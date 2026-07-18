"use client";

import { useState } from "react";
import { Send, User, Bot } from "lucide-react";
import { z } from "zod";

// Zod schemas for runtime validation
const AssistantResponseSchema = z.object({
  detected_language: z.string().optional().default("en"),
  answer: z.string(),
  route: z.array(z.string()).optional().default([]),
  estimated_walk_time_min: z.number().optional().default(0),
  grounded_sources: z.array(z.string()).optional().default([]),
});

const DraftIncidentSchema = z.object({
  category: z.string(),
  zone_id: z.string().nullable(),
  priority: z.string(),
  description: z.string(),
});

const CopilotResponseSchema = z.object({
  draft_incident: DraftIncidentSchema,
  suggested_volunteer: z.object({
    id: z.string(),
    name: z.string(),
    language: z.string(),
    zone_assignment: z.string(),
  }).optional(),
  dispatch_message_localized: z.string().optional(),
  requires_confirmation: z.boolean().optional(),
});

export interface SuggestedVolunteer {
  id: string;
  name: string;
  language: string;
  zone_assignment: string;
}

export interface DraftIncident {
  category: string;
  zone_id: string | null;
  priority: string;
  description: string;
}

export interface CopilotResponse {
  draft_incident: DraftIncident;
  suggested_volunteer?: SuggestedVolunteer;
  dispatch_message_localized?: string;
  requires_confirmation?: boolean;
}

export interface AssistantResponse {
  detected_language: string;
  answer: string;
  route: string[];
  estimated_walk_time_min: number;
  grounded_sources: string[];
}

export type ChatResponse = AssistantResponse | CopilotResponse;

export function ChatWindow({ 
  role = "fan",
  apiEndpoint,
  onResponse
}: { 
  role?: "fan" | "ops",
  apiEndpoint?: string,
  onResponse?: (data: ChatResponse) => void
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      text: role === "fan" 
        ? "Hi! I'm the StadiumPulse assistant. How can I help you find your way around today?"
        : "Incident Copilot online. Please describe the incident to draft a ticket.",
    }
  ]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: userText }]);
    setInput("");
    setIsLoading(true);
    
    if (apiEndpoint) {
      try {
        const payload = role === "fan" 
          ? { session_id: "demo_session", query: userText, current_zone_id: "zone_a" }
          : { reporter_id: "demo_volunteer", description: userText };

        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `HTTP error ${res.status}`);
        }
        
        if (role === "fan") {
          const parsed = AssistantResponseSchema.safeParse(data);
          if (parsed.success) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", text: parsed.data.answer }]);
            if (onResponse) onResponse(parsed.data as AssistantResponse);
          } else {
            console.error("Invalid AssistantResponse payload:", parsed.error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", text: "Invalid response format received from assistant." }]);
          }
        } else if (role === "ops") {
          const parsed = CopilotResponseSchema.safeParse(data);
          if (parsed.success) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", text: "Draft generated. Please review and confirm the ticket." }]);
            if (onResponse) onResponse(parsed.data as CopilotResponse);
          } else {
            console.error("Invalid CopilotResponse payload:", parsed.error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", text: "Invalid response format received from copilot." }]);
          }
        }
      } catch (error) {
        console.error("Chat API Error:", error);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", text: "An error occurred connecting to the backend." }]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback if no endpoint provided
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: "assistant", 
          text: role === "fan" 
            ? "I am connected to the StadiumPulse AI backend. Once the API is integrated, I'll provide grounded venue directions."
            : "Analyzing incident report... (Backend API integration pending)"
        }]);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[80vh] w-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              <Bot size={16} />
            </div>
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 animate-pulse">
              ...
            </div>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={role === "fan" ? "Ask a question..." : "Describe the incident..."}
            className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
