"use client";

import { useState } from "react";
import { Utensils, Droplets, Cross, Landmark, ShoppingBag, GlassWater, MapPin, Clock, Star } from "lucide-react";

const categories = [
  { id: "all", label: "All", icon: MapPin },
  { id: "food", label: "Food & Drinks", icon: Utensils },
  { id: "restroom", label: "Restrooms", icon: Droplets },
  { id: "medical", label: "Medical", icon: Cross },
  { id: "atm", label: "ATM", icon: Landmark },
  { id: "merch", label: "Merchandise", icon: ShoppingBag },
  { id: "water", label: "Water Stations", icon: GlassWater },
];

const amenities = [
  { name: "North Food Court", type: "food", zone: "Zone A", distance: "120m", status: "open", wait: "~5 min", rating: 4.2 },
  { name: "South Food Court", type: "food", zone: "Zone B", distance: "200m", status: "open", wait: "~12 min", rating: 4.5 },
  { name: "Chai Point", type: "food", zone: "Zone C", distance: "85m", status: "open", wait: "~3 min", rating: 4.0 },
  { name: "Restroom A1", type: "restroom", zone: "Zone A", distance: "45m", status: "open", wait: "~2 min", rating: null },
  { name: "Restroom B2", type: "restroom", zone: "Zone B", distance: "60m", status: "open", wait: "No wait", rating: null },
  { name: "Restroom C3", type: "restroom", zone: "Zone C", distance: "150m", status: "maintenance", wait: "Closed", rating: null },
  { name: "Medical Center", type: "medical", zone: "Zone A", distance: "200m", status: "open", wait: "Available", rating: null },
  { name: "First Aid Post", type: "medical", zone: "Zone D", distance: "100m", status: "open", wait: "Available", rating: null },
  { name: "ATM — SBI", type: "atm", zone: "Zone A", distance: "180m", status: "open", wait: "~3 min", rating: null },
  { name: "ATM — HDFC", type: "atm", zone: "Zone C", distance: "220m", status: "open", wait: "No wait", rating: null },
  { name: "Official Merch Store", type: "merch", zone: "Zone B", distance: "90m", status: "open", wait: "~8 min", rating: 4.7 },
  { name: "Water Station 1", type: "water", zone: "Zone A", distance: "30m", status: "open", wait: "No wait", rating: null },
  { name: "Water Station 2", type: "water", zone: "Zone C", distance: "70m", status: "open", wait: "No wait", rating: null },
  { name: "Water Station 3", type: "water", zone: "Zone D", distance: "55m", status: "open", wait: "~1 min", rating: null },
];

export default function AmenitiesPage() {
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? amenities : amenities.filter((a) => a.type === active);

  return (
    <div className="flex flex-col gap-5 p-4 pb-28 max-w-lg mx-auto font-sans">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Amenities</h2>
        <p className="text-xs text-[#b9cacb]">Find nearby stadium food, restrooms, medical & services</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? "bg-[#00f2ff] text-[#00363a] font-bold shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                  : "bg-[#1d2022] border border-[#3a494b]/50 text-[#e0e3e5] hover:border-[#00f2ff]/40"
              }`}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Amenity Cards */}
      <div className="space-y-2.5">
        {filtered.map((item) => (
          <div
            key={item.name}
            className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-4 flex items-center justify-between hover:border-[#00f2ff]/30 transition-all cursor-pointer shadow-lg"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white truncate">{item.name}</span>
                {item.status === "maintenance" && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 uppercase">Closed</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-[#b9cacb] font-mono">
                <span className="flex items-center gap-1 text-[#00f2ff]"><MapPin size={11} />{item.zone}</span>
                <span>{item.distance}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{item.wait}</span>
                {item.rating && (
                  <span className="flex items-center gap-0.5"><Star size={11} className="text-amber-400 fill-amber-400" />{item.rating}</span>
                )}
              </div>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.status === "open" ? "bg-[#5cf968] animate-pulse" : "bg-red-500"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
