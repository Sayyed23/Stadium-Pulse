'use client';

import React from 'react';
import { Accessibility, Type, Eye, Globe, ChevronRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function AccessibilityPage() {
  const { fontSize, setFontSize, highContrast, setHighContrast, locale, setLocale } = useSettings();

  return (
    <div className="flex-1 p-5 max-w-md mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Accessibility className="w-6 h-6 text-emerald-400" />
          Accessibility HUD Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure language, readability, and contrast options.</p>
      </div>

      {/* Control tiles */}
      <div className={`border rounded-xl divide-y ${
        highContrast ? 'border-white divide-white bg-black' : 'border-slate-800 divide-slate-800 bg-slate-900/40'
      }`}>
        
        {/* Toggle Contrast */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex gap-3">
            <Eye className="w-5 h-5 text-indigo-400 mt-0.5" />
            <div>
              <span className="text-sm font-bold block">High Contrast Mode</span>
              <span className="text-xs text-slate-400 font-medium">Borders and background optimization</span>
            </div>
          </div>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
              highContrast ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
              highContrast ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Change Text Size */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex gap-3">
            <Type className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <span className="text-sm font-bold block">Text Size scaling</span>
              <span className="text-xs text-slate-400 font-medium">Adjust viewport font dimension</span>
            </div>
          </div>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none cursor-pointer"
          >
            <option value="normal">Normal</option>
            <option value="large">Large (+2px)</option>
            <option value="xlarge">Extra Large (+4px)</option>
          </select>
        </div>

        {/* Change Language */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex gap-3">
            <Globe className="w-5 h-5 text-cyan-400 mt-0.5" />
            <div>
              <span className="text-sm font-bold block">Language Preference</span>
              <span className="text-xs text-slate-400 font-medium">Assistant and interface translation</span>
            </div>
          </div>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>

      </div>

      <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-400 text-center font-medium">
        Preferences are cached locally and persist across sessions.
      </div>

    </div>
  );
}
