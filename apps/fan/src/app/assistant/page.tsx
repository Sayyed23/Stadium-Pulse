'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, Check, Info, Sparkles, Navigation } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Link from 'next/link';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  lang?: string;
  sources?: string[];
  route?: string[];
  walkTime?: number;
}

export default function AssistantPage() {
  const { fontSize, highContrast, locale, setLocale } = useSettings();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: 'Welcome to Stadium Pulse Arena! How can I help you find your way today? (You can type or speak in English, Hindi, or Marathi)',
      lang: 'en'
    }
  ]);
  const [currentZone, setCurrentZone] = useState('zone_gate2');
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please type your query.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = locale === 'mr' ? 'mr-IN' : locale === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setQuery(speechToText);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale === 'mr' ? 'mr-IN' : locale === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setQuery('');

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'session_fan_user_1',
          query: userMsg,
          current_zone_id: currentZone
        })
      });

      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, { sender: 'assistant', text: 'Error contacting AI: ' + data.error }]);
        return;
      }

      setLocale(data.detected_language || 'en');
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: data.answer,
        lang: data.detected_language,
        sources: data.grounded_sources,
        route: data.route,
        walkTime: data.estimated_walk_time_min
      }]);

      if (data.route && data.route.length > 0) {
        // Save the active route in localStorage for /map/route to query
        localStorage.setItem('active_calculated_route', JSON.stringify(data.route));
        localStorage.setItem('active_calculated_walk_time', String(data.estimated_walk_time_min));
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'assistant', text: 'Sorry, connection failed.' }]);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto h-[calc(100vh-140px)]">
      
      {/* Active Position Badge */}
      <div className={`p-3 border-b text-xs flex justify-between items-center ${
        highContrast ? 'border-white bg-black' : 'border-slate-800 bg-slate-900/40'
      }`}>
        <span className="text-slate-400 font-semibold uppercase tracking-wider">Current Stand Location</span>
        <select 
          value={currentZone} 
          onChange={(e) => setCurrentZone(e.target.value)}
          className="bg-transparent border-none font-bold text-emerald-400 outline-none cursor-pointer capitalize"
        >
          <option value="zone_gate2" className="bg-slate-950">Gate 2 Entrance</option>
          <option value="zone_c" className="bg-slate-950">Zone C (Concourse)</option>
          <option value="zone_a" className="bg-slate-950">Zone A (North Stand)</option>
          <option value="zone_b" className="bg-slate-950">Zone B (South Stand)</option>
        </select>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            <div className={`p-3.5 rounded-2xl shadow-md ${
              msg.sender === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none' 
                : (highContrast ? 'bg-black border border-white text-white rounded-bl-none' : 'bg-slate-850 border border-slate-800 text-slate-100 rounded-bl-none')
            }`}>
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              
              {msg.sender === 'assistant' && (
                <div className="flex gap-4 mt-3 pt-2.5 border-t border-slate-800/80">
                  <button 
                    onClick={() => speakText(msg.text)}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold transition"
                    aria-label="Read response aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Hear response
                  </button>
                  {msg.route && msg.route.length > 0 && (
                    <Link 
                      href={`/map/route/live_path`}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold transition"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      View Route
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Cited source badge */}
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-500 font-medium">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Verified:</span>
                {msg.sources.map(s => (
                  <span key={s} className="bg-slate-900 border border-slate-800 text-slate-400 px-1 rounded font-mono">
                    {s.replace('amenity_', '').replace('_', ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input console */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-900/60 sticky bottom-0">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5 focus-within:border-emerald-500/50 transition">
          <button
            type="button"
            onClick={startSpeechRecognition}
            className={`p-2 rounded-lg transition ${isRecording ? 'bg-red-500 text-white animate-bounce' : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-slate-100'}`}
            aria-label="Speak query"
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === 'mr' ? 'मला प्रश्न विचारा...' : locale === 'hi' ? 'मुझसे प्रश्न पूछें...' : 'Ask route assistant...'}
            className="flex-1 bg-transparent border-none outline-none text-slate-100 py-2 px-1 focus:ring-0 text-sm"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg px-4 py-2 text-xs transition"
          >
            Send
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[9px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            AI RAG security active
          </span>
          <span className="font-mono">Session: sess_8x2k</span>
        </div>
      </form>

    </div>
  );
}
