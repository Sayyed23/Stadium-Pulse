"use client";

import { useState } from "react";
import { Globe, Accessibility, Bell, Smartphone, Check } from "lucide-react";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "fr", label: "French", native: "Français" },
  { code: "es", label: "Spanish", native: "Español" },
];

export default function SettingsPage() {
  const [selectedLang, setSelectedLang] = useState("en");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [crowdAlerts, setCrowdAlerts] = useState(true);
  const [eventUpdates, setEventUpdates] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-[#00f2ff]" : "bg-[#3a494b]"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-[#101415] rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <div className="flex flex-col gap-6 p-4 pb-28 max-w-lg mx-auto font-sans">
      <h2 className="text-2xl font-bold text-white tracking-tight">System Settings</h2>

      {/* Language */}
      <section className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-4 space-y-3 shadow-xl">
        <h3 className="font-mono font-bold text-xs text-[#00f2ff] flex items-center gap-2 uppercase tracking-wider">
          <Globe size={16} />
          Language Preferences
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                selectedLang === lang.code
                  ? "bg-[#00f2ff]/10 border border-[#00f2ff] text-[#00f2ff] font-bold"
                  : "bg-[#101415] border border-[#3a494b]/40 text-[#e0e3e5] hover:border-[#00f2ff]/30"
              }`}
            >
              <span>{lang.native}</span>
              {selectedLang === lang.code && <Check size={14} />}
            </button>
          ))}
        </div>
      </section>

      {/* Accessibility */}
      <section className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-4 space-y-4 shadow-xl">
        <h3 className="font-mono font-bold text-xs text-[#5cf968] flex items-center gap-2 uppercase tracking-wider">
          <Accessibility size={16} />
          Accessibility Telemetry
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">High Contrast UI</div>
              <div className="text-[11px] text-[#b9cacb]">Maximize screen element contrast</div>
            </div>
            <Toggle value={highContrast} onChange={setHighContrast} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Large Text Rendering</div>
              <div className="text-[11px] text-[#b9cacb]">Increase typography scale</div>
            </div>
            <Toggle value={largeText} onChange={setLargeText} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Screen Reader Optimization</div>
              <div className="text-[11px] text-[#b9cacb]">Enhanced ARIA announcement labels</div>
            </div>
            <Toggle value={screenReader} onChange={setScreenReader} />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-4 space-y-4 shadow-xl">
        <h3 className="font-mono font-bold text-xs text-amber-400 flex items-center gap-2 uppercase tracking-wider">
          <Bell size={16} />
          Notification Dispatch
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Real-Time Push Alerts</div>
              <div className="text-[11px] text-[#b9cacb]">Receive instant stadium updates</div>
            </div>
            <Toggle value={pushNotifs} onChange={setPushNotifs} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Crowd Density Warnings</div>
              <div className="text-[11px] text-[#b9cacb]">Alert when zones approach peak capacity</div>
            </div>
            <Toggle value={crowdAlerts} onChange={setCrowdAlerts} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Match & Gate Announcements</div>
              <div className="text-[11px] text-[#b9cacb]">Official match schedule updates</div>
            </div>
            <Toggle value={eventUpdates} onChange={setEventUpdates} />
          </div>
        </div>
      </section>

      {/* PWA Settings */}
      <section className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-4 space-y-3 shadow-xl">
        <h3 className="font-mono font-bold text-xs text-purple-400 flex items-center gap-2 uppercase tracking-wider">
          <Smartphone size={16} />
          PWA & Cache Management
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-[#3a494b]/20">
            <span className="text-xs text-white">Platform Build</span>
            <span className="text-xs text-[#00f2ff] font-mono">v0.1.0-stitch</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-white">Offline Cache Engine</span>
            <span className="text-xs font-mono font-bold text-[#5cf968]">ACTIVE</span>
          </div>
          <button className="w-full bg-[#00f2ff] hover:bg-[#74f5ff] text-[#00363a] font-bold text-xs py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)]">
            Install PWA to Home Screen
          </button>
        </div>
      </section>
    </div>
  );
}
