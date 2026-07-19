"use client";

import { useState } from "react";
import { GoogleMap, useJsApiLoader, Polyline } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 19.076, // Default to a central location (e.g., Mumbai)
  lng: 72.8777,
};

interface RouteData {
  id: string;
  name: string;
  color: string;
  path: { lat: number; lng: number }[];
}

const ROUTES: RouteData[] = [
  {
    id: "shuttle",
    name: "Shuttle Route A",
    color: "#3b82f6", // blue
    path: [
      { lat: 19.076, lng: 72.8777 },
      { lat: 19.079, lng: 72.881 },
      { lat: 19.082, lng: 72.879 },
    ],
  },
  {
    id: "metro",
    name: "Metro Line 1 Connector",
    color: "#ef4444", // red
    path: [
      { lat: 19.076, lng: 72.8777 },
      { lat: 19.072, lng: 72.875 },
      { lat: 19.069, lng: 72.878 },
    ],
  },
  {
    id: "pedestrian",
    name: "Zone C Pedestrian Walkway",
    color: "#10b981", // green
    path: [
      { lat: 19.076, lng: 72.8777 },
      { lat: 19.078, lng: 72.873 },
      { lat: 19.075, lng: 72.871 },
    ],
  },
];

export default function MapPage() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId === selectedRoute ? null : routeId);
  };


  const activeRoute = ROUTES.find((r) => r.id === selectedRoute);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full relative font-sans">
      <div className="absolute z-10 p-4 sm:p-6 w-full bg-gradient-to-b from-[#101415]/80 to-transparent pointer-events-none">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Interactive Stadium Map & Wayfinding
        </h2>
        <p className="text-xs text-[#b9cacb] font-mono mt-0.5">
          Real-time facility telemetry & guided route layers
        </p>
      </div>

      {/* Floating Category Filters */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-2xl">
        <div className="flex gap-2 overflow-x-auto py-2 px-2 bg-[#1d2022]/90 backdrop-blur-xl border border-[#00f2ff]/30 rounded-2xl shadow-2xl scrollbar-hide">
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00f2ff] text-[#00363a] font-mono font-bold rounded-xl text-xs shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            All Facilities
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#101415] border border-[#3a494b] text-[#e0e3e5] rounded-xl text-xs transition-all hover:border-[#00f2ff]/50 active:scale-95 whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-[#5cf968]" /> Food Courts
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#101415] border border-[#3a494b] text-[#e0e3e5] rounded-xl text-xs transition-all hover:border-[#00f2ff]/50 active:scale-95 whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-red-400" /> Medical Desks
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#101415] border border-[#3a494b] text-[#e0e3e5] rounded-xl text-xs transition-all hover:border-[#00f2ff]/50 active:scale-95 whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" /> Restrooms
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#101415] border border-[#3a494b] text-[#e0e3e5] rounded-xl text-xs transition-all hover:border-[#00f2ff]/50 active:scale-95 whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400" /> Parking Hubs
          </button>
        </div>
      </div>

      {loadError ? (
        <div className="flex items-center justify-center h-full bg-[#101415]">
          <p className="text-red-400 font-mono text-sm">
            Interactive map engine loading fallback view...
          </p>
        </div>
      ) : isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {activeRoute && (
            <Polyline
              path={activeRoute.path}
              options={{
                strokeColor: activeRoute.color,
                strokeOpacity: 0.9,
                strokeWeight: 6,
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <div className="flex items-center justify-center h-full bg-[#101415]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#00f2ff] border-t-transparent animate-spin" />
            <p className="text-[#00f2ff] font-mono text-xs tracking-wider">
              LOADING STADIUM MAP TELEMETRY...
            </p>
          </div>
        </div>
      )}

      {/* Accessible Route Selector Panel */}
      <div
        className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-20 w-[92%] sm:w-96 p-4 rounded-2xl bg-[#1d2022]/95 backdrop-blur-xl border border-[#00f2ff]/30 shadow-2xl animate-slide-up"
        role="region"
        aria-label="Route Selection Panel"
      >
        <h3 className="text-xs font-mono font-bold text-[#00f2ff] mb-3 uppercase tracking-wider">
          Select Guided Route
        </h3>
        <div className="flex flex-col gap-2">
          {ROUTES.map((route) => {
            const isSelected = selectedRoute === route.id;
            return (
              <button
                key={route.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleRouteSelect(route.id)}
                className={`w-full text-left flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? "bg-[#00f2ff]/10 border-[#00f2ff] text-[#00f2ff] font-medium shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                    : "bg-[#101415]/80 border-[#3a494b]/50 text-[#e0e3e5] hover:bg-[#101415]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: route.color }}
                  />
                  <span className="text-xs font-bold">{route.name}</span>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00f2ff]/20 text-[#00f2ff] uppercase tracking-widest">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
