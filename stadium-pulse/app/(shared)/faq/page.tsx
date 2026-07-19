import { HelpCircle } from "lucide-react";

const faqs = [
  { q: "How do I find my seat?", a: "Use the AI Assistant or Stadium Map in the Fan Experience. Enter your gate or section number for step-by-step turn-by-turn navigation." },
  { q: "Are wheelchair accessible routes available?", a: "Yes! Enable 'Accessible routes only' in the Indoor Navigation page or visit the Accessibility section for elevator locations." },
  { q: "What languages does the AI Assistant support?", a: "The assistant automatically detects and responds in English, Hindi (हिन्दी), and Marathi (मराठी)." },
  { q: "How do I report an emergency or lost item?", a: "Go to the Emergency page in the Fan Experience and tap the SOS button or select Medical/Security Help." },
];

export default function FAQPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <HelpCircle size={24} className="text-blue-500" /> Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-400">Quick answers to common questions about StadiumPulse AI</p>
      </div>

      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="glass-panel rounded-xl p-5 space-y-2">
            <h3 className="font-semibold text-base text-slate-100">{f.q}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
