"use client";

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 19.0760, // Default to a central location (e.g., Mumbai)
  lng: 72.8777
};

export default function MapPage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full relative">
      <div className="absolute z-10 p-4 w-full bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <h2 className="text-xl font-bold text-white">Stadium Map</h2>
      </div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {/* Add Map overlays, routes here */}
        </GoogleMap>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-zinc-500">Loading Map...</p>
        </div>
      )}
    </div>
  );
}
