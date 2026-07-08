'use client';

import React, { useState } from 'react';
import { Map, Info, Check, Filter } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const ZONE_MAP_COORDS: Record<string, { cx: number; cy: number; label: string }> = {
  'zone_gate2': { cx: 100, cy: 300, label: 'Gate 2' },
  'zone_concourse_a': { cx: 220, cy: 200, label: 'Concourse A' },
  'zone_restroom_3': { cx: 200, cy: 400, label: 'Restroom 3 Zone' },
  'zone_c': { cx: 350, cy: 300, label: 'Zone C (Concourse)' },
  'zone_a': { cx: 380, cy: 120, label: 'Zone A (North Stand)' },
  'zone_b': { cx: 380, cy: 480, label: 'Zone B (South Stand)' },
  'zone_d': { cx: 500, cy: 300, label: 'Zone D (VIP Boxes)' },
  'zone_gate7': { cx: 620, cy: 300, label: 'Gate 7 (Overflow)' },
};

// Seeded amenities mapping
const AMENITIES_LIST = [
  { id: 'amenity_restroom_3', type: 'restroom', name: 'Restroom-3', zone: 'zone_c', cx: 350, cy: 270 },
  { id: 'amenity_medical_1', type: 'medical', name: 'Medical-1', zone: 'zone_a', cx: 380, cy: 90 },
  { id: 'amenity_lift_1', type: 'lift', name: 'Lift-1', zone: 'zone_c', cx: 330, cy: 310 },
  { id: 'amenity_restroom_gate2', type: 'restroom', name: 'Restroom at Gate 2', zone: 'zone_gate2', cx: 100, cy: 270 }
];

export default function StandaloneMapPage() {
  const { highContrast } = useSettings();
  const [filter, setFilter] = useState<string>('all');
  const [hoveredAmenity, setHoveredAmenity] = useState<string | null>(null);

  const filterChips = [
    { label: 'All', value: 'all' },
    { label: 'Restrooms', value: 'restroom' },
    { label: 'Medical Aids', value: 'medical' },
    { label: 'Lifts', value: 'lift' }
  ];

  const filteredAmenities = filter === 'all' 
    ? AMENITIES_LIST 
    : AMENITIES_LIST.filter(a => a.type === filter);

  return (
    <div className="flex-1 p-4 md:p-6 max-w-md mx-auto space-y-4">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Map className="w-5 h-5 text-emerald-400" />
          Interactive Stadium Map
        </h1>
        <p className="text-xs text-slate-400 mt-1">Select filters to display accessible gates and amenities.</p>
      </div>

      {/* Filter chips (FR-1.4 accessibility/filter options) */}
      <div className="flex flex-wrap gap-2 py-1">
        {filterChips.map(chip => (
          <button
            key={chip.value}
            onClick={() => setFilter(chip.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              filter === chip.value 
                ? (highContrast ? 'bg-white text-black border-white' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40')
                : (highContrast ? 'bg-black text-white border-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700')
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Map viewport */}
      <div className={`relative bg-slate-900 border rounded-xl p-2 min-h-[350px] flex items-center justify-center overflow-hidden shadow-2xl ${
        highContrast ? 'border-white' : 'border-slate-800'
      }`}>
        <svg className="w-full h-full max-w-[400px] max-h-[380px]" viewBox="0 0 700 600">
          {/* Static Walkways grid */}
          {Object.keys(ZONE_MAP_COORDS).map((key) => {
            const start = ZONE_MAP_COORDS[key];
            return (
              <g key={`links-${key}`}>
                {key === 'zone_gate2' && (
                  <>
                    <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_concourse_a'].cx} y2={ZONE_MAP_COORDS['zone_concourse_a'].cy} stroke="#1e293b" strokeWidth="4" />
                    <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_c'].cx} y2={ZONE_MAP_COORDS['zone_c'].cy} stroke="#1e293b" strokeWidth="4" />
                  </>
                )}
                {key === 'zone_concourse_a' && (
                  <>
                    <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_restroom_3'].cx} y2={ZONE_MAP_COORDS['zone_restroom_3'].cy} stroke="#1e293b" strokeWidth="4" />
                    <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_a'].cx} y2={ZONE_MAP_COORDS['zone_a'].cy} stroke="#1e293b" strokeWidth="4" />
                  </>
                )}
                {key === 'zone_restroom_3' && (
                  <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_c'].cx} y2={ZONE_MAP_COORDS['zone_c'].cy} stroke="#1e293b" strokeWidth="4" />
                )}
                {key === 'zone_c' && (
                  <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_d'].cx} y2={ZONE_MAP_COORDS['zone_d'].cy} stroke="#1e293b" strokeWidth="4" />
                )}
                {key === 'zone_a' && (
                  <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_b'].cx} y2={ZONE_MAP_COORDS['zone_b'].cy} stroke="#1e293b" strokeWidth="4" />
                )}
                {key === 'zone_b' && (
                  <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_d'].cx} y2={ZONE_MAP_COORDS['zone_d'].cy} stroke="#1e293b" strokeWidth="4" />
                )}
                {key === 'zone_d' && (
                  <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_gate7'].cx} y2={ZONE_MAP_COORDS['zone_gate7'].cy} stroke="#1e293b" strokeWidth="4" />
                )}
              </g>
            );
          })}

          {/* Zones */}
          {Object.keys(ZONE_MAP_COORDS).map((key) => {
            const zone = ZONE_MAP_COORDS[key];
            return (
              <g key={`node-${key}`}>
                <circle cx={zone.cx} cy={zone.cy} r="16" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <text x={zone.cx} y={zone.cy + 30} textAnchor="middle" fill="#94a3b8" fontSize="10px" fontWeight="bold">
                  {zone.label}
                </text>
              </g>
            );
          })}

          {/* Filtered Amenities Markers */}
          {filteredAmenities.map((amenity) => (
            <g 
              key={amenity.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredAmenity(amenity.name)}
              onMouseLeave={() => setHoveredAmenity(null)}
            >
              <circle 
                cx={amenity.cx} 
                cy={amenity.cy} 
                r="10" 
                fill={amenity.type === 'restroom' ? '#3b82f6' : amenity.type === 'medical' ? '#ef4444' : '#f59e0b'} 
                stroke="#ffffff" 
                strokeWidth="1.5" 
              />
              <text x={amenity.cx} y={amenity.cy - 14} textAnchor="middle" fill="#ffffff" fontSize="8px" className="font-semibold bg-slate-950 px-1 rounded">
                {amenity.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-slate-950/90 border border-slate-800 rounded p-2 text-[9px] space-y-1 text-slate-400">
          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1">Legend</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Restrooms
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Medical aids
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Accessible Lifts
          </div>
        </div>
      </div>

      {hoveredAmenity && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2 text-xs">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Focused Item: <strong>{hoveredAmenity}</strong> - Accessible & Open.</span>
        </div>
      )}

    </div>
  );
}
