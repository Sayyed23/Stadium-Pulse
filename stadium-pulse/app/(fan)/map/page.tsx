"use client";

import { useState } from "react";
import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 19.0760, // Default to a central location (e.g., Mumbai)
  lng: 72.8777
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
      { lat: 19.0760, lng: 72.8777 },
      { lat: 19.0790, lng: 72.8810 },
      { lat: 19.0820, lng: 72.8790 },
    ],
  },
  {
    id: "metro",
    name: "Metro Line 1 Connector",
    color: "#ef4444", // red
    path: [
      { lat: 19.0760, lng: 72.8777 },
      { lat: 19.0720, lng: 72.8750 },
      { lat: 19.0690, lng: 72.8780 },
    ],
  },
  {
    id: "pedestrian",
    name: "Zone C Pedestrian Walkway",
    color: "#10b981", // green
    path: [
      { lat: 19.0760, lng: 72.8777 },
      { lat: 19.0780, lng: 72.8730 },
      { lat: 19.0750, lng: 72.8710 },
    ],
  },
];

export default function MapPage() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const handleRouteSelect = (routeId: string) => {
    setSelectedRoute(routeId === selectedRoute ? null : routeId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, routeId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRouteSelect(routeId);
    }
  };

  const activeRoute = ROUTES.find((r) => r.id === selectedRoute);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full relative">
      <div className="absolute z-10 p-4 w-full bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <h2 className="text-xl font-bold text-white">Stadium Map</h2>
      </div>

      {loadError ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">Map is currently unavailable. Please try again later.</p>
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
                strokeOpacity: 0.8,
                strokeWeight: 6,
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-zinc-500">Loading Map...</p>
        </div>
      )}

      {/* Accessible Route Selector Overlay */}
      <div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md shadow-2xl"
        role="region"
        aria-label="Route Selection Panel"
      >
        <h3 className="text-sm font-semibold text-zinc-400 mb-3">Select Route Sequence</h3>
        <div className="flex flex-col gap-2">
          {ROUTES.map((route) => {
            const isSelected = selectedRoute === route.id;
            return (
              <div
                key={route.id}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                onClick={() => handleRouteSelect(route.id)}
                onKeyDown={(e) => handleKeyDown(e, route.id)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-sky-500 focus:outline-none border ${
                  isSelected
                    ? "bg-sky-500/10 border-sky-500 text-sky-400 font-medium"
                    : "bg-zinc-800/40 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: route.color }}
                  />
                  <span className="text-sm">{route.name}</span>
                </div>
                {isSelected && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
