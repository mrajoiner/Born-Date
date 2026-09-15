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
          <div className="w-8 h-8 rounded-full bg-[#090909] flex items-center justify-center text-[#FAF082] shadow-2xs">
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
                ? "bg-[#FAF082] text-[#090909] border-[#090909]"
                : "border-transparent"
            }`}
          >
            <span>1. Essentials</span>
          </span>
          <span className="text-[#E7E0D1]">→</span>
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              currentStep === "customize"
                ? "bg-[#FAF082] text-[#090909] border-[#090909]"
                : "border-transparent"
            }`}
          >
            <span>2. Customize</span>
          </span>
          <span className="text-[#E7E0D1]">→</span>
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              currentStep === "plan"
                ? "bg-[#FAF082] text-[#090909] border-[#090909]"
                : "border-transparent"
            }`}
          >
            <span>3. Summit Plan</span>
          </span>
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-2">
          {/* Archives Vault Button */}
          <button
            id="nav-archives-btn"
            type="button"
            onClick={onOpenArchives}
            className="text-xs font-bold text-[#090909] px-3 py-1.5 rounded-full border border-[#090909] hover:bg-[#FAF082]/50 flex items-center gap-1.5 transition-all shadow-2xs"
            title="Open plan archives vault"
          >
            <Archive className="w-3.5 h-3.5 text-[#090909]" />
            <span className="hidden sm:inline">Archives</span>
            {archivedCount > 0 && (
              <span className="bg-[#090909] text-[#FAF082] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {archivedCount}
              </span>
            )}
          </button>

          {hasPlan ? (
            <button
              id="nav-new-plan-btn"
              type="button"
              onClick={onCreateNewPlan}
              className="text-xs font-bold text-[#090909] bg-white hover:bg-[#FCF7E5] px-3 py-1.5 rounded-full border border-[#090909] flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#090909]" />
              <span className="hidden sm:inline">New Plan</span>
            </button>
          ) : null}

          {currentStep === "plan" ? (
            <button
              id="nav-download-pdf-btn"
              type="button"
              onClick={onDownloadPdf}
              className="bg-[#FAF082] hover:bg-yellow-300 text-[#090909] border-2 border-[#090909] text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#090909]" />
              <span className="hidden sm:inline">Download .PDF</span>
              <span className="bg-[#090909] text-white text-[9px] px-1 py-0.2 rounded font-black">
                FREE
              </span>
            </button>
          ) : (
            <button
              onClick={onNavigateHome}
              className="bg-[#090909] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full hover:bg-neutral-800 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
            >
              <IconCompass className="w-3.5 h-3.5 text-[#FAF082]" />
              <span>{currentStep === "customize" ? "Customizing" : "Plan Birthday"}</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

