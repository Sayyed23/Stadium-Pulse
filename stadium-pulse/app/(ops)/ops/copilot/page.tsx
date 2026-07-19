"use client";

import { useState } from "react";
import { ChatWindow, type ChatResponse } from "@/components/chat/ChatWindow";
import { CheckCircle2, User, MapPin, AlertTriangle, Bot } from "lucide-react";

interface SuggestedVolunteer {
  id: string;
  name: string;
  language: string;
  zone_assignment: string;
}

interface DraftIncident {
  category: string;
  zone_id: string | null;
  priority: string;
  description: string;
}

interface CopilotResponse {
  draft_incident: DraftIncident;
  suggested_volunteer?: SuggestedVolunteer;
  dispatch_message_localized?: string;
  requires_confirmation?: boolean;
}

export default function CopilotPage() {
  const [draft, setDraft] = useState<CopilotResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = (data: ChatResponse) => {
    if ("draft_incident" in data && data.draft_incident) {
      setDraft(data as CopilotResponse);
    }
  };

  const handleConfirm = async () => {
    if (!draft) return;
    setIsSubmitting(true);
    try {
      // Call the real API
      const payload = {
        category: draft.draft_incident.category,
        zone_id: draft.draft_incident.zone_id,
        priority: draft.draft_incident.priority,
        description: draft.draft_incident.description,
        created_by: "copilot_user",
        assigned_volunteer_id: draft.suggested_volunteer?.id,
      };

      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create incident");

      alert("Ticket logged & dispatch sent!");
      setDraft(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <h2 className="text-3xl font-bold mb-6">Incident Copilot</h2>
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Panel: Chat Intake */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow
            role="ops"
            apiEndpoint="/api/copilot"
            onResponse={handleResponse}
          />
        </div>

        {/* Right Panel: Draft Ticket */}
        <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 overflow-y-auto flex flex-col">
          <h3 className="text-xl font-semibold mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            Draft Ticket
          </h3>

          {draft ? (
            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-md border border-zinc-200 dark:border-zinc-800">
                  <div className="text-xs text-zinc-500 uppercase font-semibold mb-1">
                    Category
                  </div>
                  <div className="font-medium capitalize">
                    {draft.draft_incident.category.replace("_", " ")}
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-md border border-zinc-200 dark:border-zinc-800">
                  <div className="text-xs text-zinc-500 uppercase font-semibold mb-1">
                    Priority
                  </div>
                  <div className="font-medium capitalize flex items-center gap-2">
                    {draft.draft_incident.priority === "high" ||
                    draft.draft_incident.priority === "critical" ? (
                      <AlertTriangle size={16} className="text-red-500" />
                    ) : null}
                    {draft.draft_incident.priority}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-md border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs text-zinc-500 uppercase font-semibold mb-1 flex items-center gap-1">
                  <MapPin size={14} /> Location
                </div>
                <div className="font-medium">
                  {draft.draft_incident.zone_id || "Unknown"}
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-md border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs text-zinc-500 uppercase font-semibold mb-1">
                  Description
                </div>
                <p className="text-sm">{draft.draft_incident.description}</p>
              </div>

              {draft.suggested_volunteer && (
                <div className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <User size={18} /> Suggested Dispatch
                  </h4>
                  <div className="text-sm space-y-1 mb-3">
                    <p>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Volunteer:
                      </span>{" "}
                      {draft.suggested_volunteer.name}
                    </p>
                    <p>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Language:
                      </span>{" "}
                      {draft.suggested_volunteer.language.toUpperCase()}
                    </p>
                    <p>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Current Zone:
                      </span>{" "}
                      {draft.suggested_volunteer.zone_assignment}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-zinc-950 p-3 rounded border border-zinc-200 dark:border-zinc-800 text-sm italic">
                    &quot;{draft.dispatch_message_localized}&quot;
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  <CheckCircle2 size={20} />
                  {isSubmitting ? "Logging Ticket..." : "Confirm & Dispatch"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 text-center space-y-4">
              <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Bot size={40} />
              </div>
              <p className="max-w-[200px]">
                Describe the incident on the left to generate a structured
                ticket draft.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
