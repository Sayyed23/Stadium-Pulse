'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FileWarning, 
  Users, 
  Trash2, 
  FileText, 
  LogOut,
  Sparkles
} from 'lucide-react';

export default function OpsLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Basic auth check using cookie
    const checkAuth = () => {
      const cookies = typeof document !== 'undefined' ? document.cookie : '';
      const isLoggedIn = cookies.includes('ops_logged_in=true');
      
      if (!isLoggedIn && pathname !== '/login') {
        router.push('/login');
      } else {
        setAuthenticated(isLoggedIn);
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    document.cookie = "ops_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  if (loading && pathname !== '/login') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <Sparkles className="w-5 h-5 text-emerald-400 animate-spin mr-2" />
        Validating Admin Credentials...
      </div>
    );
  }

  // Render without sidebar for login page
  if (pathname === '/login') {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  const navLinks = [
    { label: 'Live Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Incident Log Queue', href: '/incidents', icon: FileWarning },
    { label: 'Volunteer Roster', href: '/volunteers', icon: Users },
    { label: 'Sustainability & Waste', href: '/sustainability', icon: Trash2 },
    { label: 'Hallucination Reports', href: '/reports', icon: FileText }
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      
      {/* Left Sidebar Menu */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          
          {/* Brand header */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <ShieldAlert className="w-6 h-6 text-emerald-500 animate-pulse" />
            <div>
              <h2 className="font-bold text-sm tracking-wide">StadiumPulse</h2>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Control-Room HUD</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold border transition ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="space-y-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2 bg-slate-950/60 p-2 border border-slate-850 rounded-lg text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <div>
              <p className="font-bold text-slate-300">Operator Meera</p>
              <p className="text-slate-500">Role: Command Chief</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-semibold rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
