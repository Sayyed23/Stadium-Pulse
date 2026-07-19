"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarHeaderProps {
  readonly collapsed: boolean;
  readonly setCollapsed: (val: boolean) => void;
  readonly badgeText: string;
  readonly badgeColorClass: string;
  readonly logoGradientClass: string;
}

export function SidebarHeader({
  collapsed,
  setCollapsed,
  badgeText,
  badgeColorClass,
  logoGradientClass,
}: SidebarHeaderProps) {
  return (
    <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800/50 justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer overflow-hidden"
      >
        <div
          className={`w-8 h-8 rounded-full ${logoGradientClass} flex items-center justify-center shadow-lg shrink-0`}
        >
          <span className="text-white font-bold text-xs tracking-tighter">
            SP
          </span>
        </div>
        {!collapsed && (
          <h1 className="font-bold text-lg tracking-tight whitespace-nowrap">
            StadiumPulse{" "}
            <span className={`font-light ${badgeColorClass}`}>
              {badgeText}
            </span>
          </h1>
        )}
      </Link>
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
}
