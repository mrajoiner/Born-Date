import React from "react";
import { IconBirthdayCake, IconCompass } from "./BornDayIcons";
import { RotateCcw, Download, Archive, PlusCircle } from "lucide-react";

interface NavbarProps {
  onStartOver: () => void;
  onNavigateHome: () => void;
  currentStep: "landing" | "customize" | "plan";
  hasPlan: boolean;
  onDownloadPdf?: () => void;
  archivedCount: number;
  onOpenArchives: () => void;
  onCreateNewPlan: () => void;
  isAutoRefreshing?: boolean;
  lastSyncedText?: string;
  onManualRefresh?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartOver,
  onNavigateHome,
  currentStep,
  hasPlan,
  onDownloadPdf,
  archivedCount,
  onOpenArchives,
  onCreateNewPlan,
  isAutoRefreshing,
  lastSyncedText,
  onManualRefresh,
}) => {
  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 w-full max-w-5xl mx-auto">
      <nav
        id="main-navigation"
        className="bg-white/95 backdrop-blur-md border-2 border-[#090909] rounded-full px-3.5 py-2 sm:px-6 sm:py-3 shadow-xs flex items-center justify-between transition-all gap-2"
      >
        {/* Brand Mark & Wordmark: Born Day */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={onNavigateHome}
          id="nav-brand-logo"
        >
          <div className="w-8 h-8 rounded-full bg-[#090909] flex items-center justify-center text-[#FFE600] shadow-2xs">
            <IconBirthdayCake className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-serif-display text-xl font-bold tracking-tight text-[#090909] block leading-none">
              Born Day
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5C584F] block">
              Celebration Sherpa
            </span>
          </div>
        </div>

        {/* Center Progress Indicators */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-bold text-[#5C584F]">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              currentStep === "landing"
                ? "bg-[#FFE600] text-[#090909] border-[#090909]"
                : "border-transparent"
            }`}
          >
            <span>1. Essentials</span>
          </span>
          <span className="text-[#E7E0D1]">→</span>
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              currentStep === "customize"
                ? "bg-[#FFE600] text-[#090909] border-[#090909]"
                : "border-transparent"
            }`}
          >
            <span>2. Customize</span>
          </span>
          <span className="text-[#E7E0D1]">→</span>
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              currentStep === "plan"
                ? "bg-[#FFE600] text-[#090909] border-[#090909]"
                : "border-transparent"
            }`}
          >
            <span>3. Summit Plan</span>
          </span>
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Live Auto-Refresh & Sync Status Indicator */}
          {onManualRefresh && (
            <button
              id="nav-auto-sync-btn"
              type="button"
              onClick={onManualRefresh}
              className="text-[11px] font-bold text-[#090909] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 sm:px-2.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
              title="Auto-refresh active on phone. Tap to refresh immediately."
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <RotateCcw className={`w-3 h-3 text-emerald-800 shrink-0 ${isAutoRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden xl:inline text-emerald-900">{lastSyncedText || "Live"}</span>
            </button>
          )}

          {/* Archives Vault Button */}
          <button
            id="nav-archives-btn"
            type="button"
            onClick={onOpenArchives}
            className="text-xs font-bold text-[#090909] px-2.5 sm:px-3 py-1.5 rounded-full border border-[#090909] hover:bg-[#FFE600]/50 flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
            title="Open plan archives vault"
          >
            <Archive className="w-3.5 h-3.5 text-[#090909] shrink-0" />
            <span className="hidden md:inline">Archives</span>
            {archivedCount > 0 && (
              <span className="bg-[#090909] text-[#FFE600] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {archivedCount}
              </span>
            )}
          </button>

          {/* Persistent Reset / Start New Plan Button at ANY stage */}
          <button
            id="nav-start-new-plan-btn"
            type="button"
            onClick={onStartOver}
            className="text-xs font-bold text-[#090909] bg-white hover:bg-[#FFE600] active:scale-95 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#090909] flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
            title="Reset or start a brand new celebration plan at any time"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#090909] shrink-0" />
            <span className="hidden sm:inline">Start New Plan</span>
            <span className="sm:hidden">Reset</span>
          </button>

          {currentStep === "plan" ? (
            <button
              id="nav-download-pdf-btn"
              type="button"
              onClick={onDownloadPdf}
              className="bg-[#FFE600] hover:bg-[#FFF066] text-[#090909] border-2 border-[#090909] text-xs font-bold px-3 sm:px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#090909] shrink-0" />
              <span className="hidden xs:inline sm:inline">Download .PDF</span>
              <span className="xs:hidden">PDF</span>
              <span className="bg-[#090909] text-white text-[9px] px-1 py-0.2 rounded font-black">
                FREE
              </span>
            </button>
          ) : (
            <button
              onClick={onNavigateHome}
              className="bg-[#090909] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-neutral-800 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
            >
              <IconCompass className="w-3.5 h-3.5 text-[#FFE600] shrink-0" />
              <span className="hidden xs:inline">{currentStep === "customize" ? "Customizing" : "Plan Birthday"}</span>
              <span className="xs:hidden">{currentStep === "customize" ? "Step 2" : "Start"}</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

