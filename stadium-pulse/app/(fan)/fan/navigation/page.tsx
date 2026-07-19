"use client";

import { useState } from "react";
import { Navigation, MapPin, Clock, Accessibility, ArrowRight, Search, Locate } from "lucide-react";

const nearbyPlaces = [
  { name: "Restroom B2", distance: "45m", type: "restroom", zone: "Zone B" },
  { name: "Food Court North", distance: "120m", type: "food", zone: "Zone A" },
  { name: "Medical Center", distance: "200m", type: "medical", zone: "Zone C" },
  { name: "Merchandise Store", distance: "85m", type: "shop", zone: "Zone B" },
  { name: "Water Station 3", distance: "60m", type: "water", zone: "Zone B" },
];

const routeSteps = [
  { instruction: "Head north from your current position", distance: "30m", zone: "Zone B" },
  { instruction: "Turn left at the concourse junction", distance: "50m", zone: "Zone B" },
  { instruction: "Continue straight past Gate 5", distance: "80m", zone: "Zone A" },
  { instruction: "Your destination is on the right", distance: "10m", zone: "Zone A" },
];

export default function NavigationPage() {
  const [from, setFrom] = useState("My Location");
  const [to, setTo] = useState("");
  const [showRoute, setShowRoute] = useState(false);
  const [accessibleOnly, setAccessibleOnly] = useState(false);

  return (
  
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 font-sans space-y-6">
      {/* Header */}
      <div className="bg-[#1d2022] border border-[#3a494b]/40 p-5 rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Indoor Turn-by-Turn Wayfinding</h2>
        <p className="text-xs sm:text-sm text-[#b9cacb] font-mono mt-1">Navigate seamlessly inside Azteca Stadium with live BLE indoor positioning</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Route Finder */}
          <div className="bg-[#1d2022] border border-[#00f2ff]/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-bold text-[#00f2ff] uppercase tracking-wider flex items-center gap-2">
              <Navigation size={16} />
              Set Origin & Destination
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#00f2ff] shrink-0 animate-pulse" />
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="flex-1 bg-[#101415] rounded-xl px-4 py-3 text-xs text-[#e0e3e5] border border-[#3a494b] focus:outline-none focus:border-[#00f2ff]"
                  placeholder="Starting point"
                />
                <button type="button" className="w-10 h-10 rounded-xl bg-[#101415] border border-[#3a494b] flex items-center justify-center hover:border-[#00f2ff] transition-colors">
                  <Locate size={18} className="text-[#00f2ff]" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#5cf968] shrink-0" />
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="flex-1 bg-[#101415] rounded-xl px-4 py-3 text-xs text-[#e0e3e5] border border-[#3a494b] focus:outline-none focus:border-[#00f2ff]"
                  placeholder="Destination (e.g. Section 214, Gate 7)"
                />
              </div>
            </div>

            {/* Accessibility Toggle */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <div className={`w-9 h-5 rounded-full transition-colors relative ${accessibleOnly ? "bg-[#00f2ff]" : "bg-[#3a494b]"}`} onClick={() => setAccessibleOnly(!accessibleOnly)}>
                <div className={`absolute top-0.5 w-4 h-4 bg-[#101415] rounded-full shadow transition-transform ${accessibleOnly ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
              <Accessibility size={16} className={accessibleOnly ? "text-[#00f2ff]" : "text-[#b9cacb]"} />
              <span className="text-xs text-[#e0e3e5]">Accessible elevator routes only</span>
            </label>

            <button type="button"
              onClick={() => setShowRoute(true)}
              className="w-full bg-[#00f2ff] hover:bg-[#74f5ff] text-[#00363a] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] text-xs font-mono uppercase"
            >
              <Search size={18} />
              Start Indoor Guidance
            </button>
          </div>

          {/* Turn-by-Turn Navigation */}
          {showRoute && (
            <div className="bg-[#1d2022] border border-[#00f2ff]/30 rounded-2xl p-5 space-y-4 animate-slide-up shadow-xl">
              <div className="flex items-center justify-between border-b border-[#3a494b]/30 pb-3">
                <h3 className="text-xs font-mono font-bold text-[#00f2ff] uppercase tracking-wider">Turn-by-Turn Route Timeline</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#5cf968] font-mono font-bold">
                  <Clock size={14} />
                  ~4 min walk (250m)
                </div>
              </div>
              <div className="space-y-0 pt-2">
                {routeSteps.map((step, i) => (
                  <div key={i} className="flex gap-4 pb-5 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        i === routeSteps.length - 1
                          ? "bg-[#5cf968] text-[#00390a]"
                          : "bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40"
                      }`}>
                        {i + 1}
                      </div>
                      {i < routeSteps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-[#3a494b] mt-1" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-xs font-bold text-white">{step.instruction}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-[#00f2ff] font-mono font-bold">{step.distance}</span>
                        <span className="text-xs text-[#b9cacb]">·</span>
                        <span className="text-[11px] text-[#b9cacb] font-mono">{step.zone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Interactive Stadium Map Card */}
          <div className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-[16/10] bg-gradient-to-br from-[#101415] to-[#272a2c] flex items-center justify-center relative p-4">
              <div className="absolute inset-4 border border-dashed border-[#00f2ff]/30 rounded-xl flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin size={36} className="text-[#00f2ff] mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-white">Indoor Positioning Signal Active</p>
                  <p className="text-[11px] text-[#b9cacb] font-mono mt-1">Azteca Level 3 Concourse · Gate 12 Proximity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Places */}
          <section className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-mono font-bold text-[#00f2ff] uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} />
              Nearby Points of Interest
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nearbyPlaces.map((place) => (
                <div key={place.name} className="bg-[#101415] border border-[#3a494b]/40 rounded-xl p-3.5 flex items-center justify-between hover:border-[#00f2ff]/40 transition-all cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">{place.name}</div>
                    <div className="text-[11px] text-[#b9cacb] font-mono">{place.zone} · {place.distance}</div>
                  </div>
                  <ArrowRight size={16} className="text-[#00f2ff]" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
