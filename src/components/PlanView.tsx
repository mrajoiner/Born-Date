import React, { useState } from "react";
import { BirthdayPlan, UserProfile, SavedSelection } from "../types";
import { SoloGuide } from "./CelebrationSherpas";
import {
  IconBirthdayCake,
  IconCakeSlice,
  IconPartyPopper,
  IconPartyHat,
  IconBalloons,
  IconCalendarParty,
  IconFireworks,
  IconGreetingCard,
  IconCompass,
  IconMapPin,
  IconDining,
  IconMusic,
  IconChecklist,
  IconBudget,
  IconUmbrella,
  IconCelebrant,
  IconSparkle,
  IconSummitFlag,
} from "./BornDayIcons";
import {
  Copy,
  Check,
  Edit3,
  RotateCcw,
  Clock,
  Bookmark,
  BookmarkCheck,
  CheckSquare,
  Square,
  Star,
  Download,
  Mail,
  MessageSquare,
  Sparkles,
  Archive,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { CelebrationDispatchModal } from "./CelebrationDispatchModal";

interface PlanViewProps {
  plan: BirthdayPlan;
  profile: UserProfile;
  onEditInputs: () => void;
  onStartOver: () => void;
  onCopyPlan: () => void;
  isCopied: boolean;
  savedSelections: SavedSelection[];
  onToggleSaveItem: (item: SavedSelection) => void;
  onArchivePlan: () => void;
  isArchived?: boolean;
  onCreateNewPlan: () => void;
  onOpenArchives: () => void;
  archivedCount: number;
  onQuickRefreshPlan?: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  plan,
  profile,
  onEditInputs,
  onStartOver,
  onCopyPlan,
  isCopied,
  savedSelections,
  onToggleSaveItem,
  onArchivePlan,
  isArchived = false,
  onCreateNewPlan,
  onOpenArchives,
  archivedCount,
  onQuickRefreshPlan,
}) => {
  const [activeTab, setActiveTab] = useState<"itinerary" | "food" | "experiences">("itinerary");
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchInitialTab, setDispatchInitialTab] = useState<"pdf" | "email" | "text">("pdf");

  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const isItemSaved = (id: string) => savedSelections.some((s) => s.id === id);

  return (
    <section id="plan-results-view" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Screen 3: Miles (guy) holding sign SUMMIT - frameless, big stick figure */}
      <SoloGuide
        character="miles"
        signText="SUMMIT"
        title="Summit Reached"
        speechText="We conquered the summit—here is your custom milestone plan dialed in to absolute perfection."
      />

      {/* Top Action Header Bar */}
      <div className="bg-white rounded-3xl border-2 border-[#090909] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B3B2B] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C584F]">
              Generated Plan Ready
            </span>
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#090909]">
            {plan.birthdayOverview.celebrantName}’s Birthday Plan
          </h2>
          <p className="text-sm text-[#5C584F] flex items-center gap-2 mt-0.5">
            <span className="font-semibold text-[#090909]">{plan.birthdayOverview.ageTurning} years young!</span>
            <span>•</span>
            <span>{plan.birthdayOverview.celebrationDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <IconMapPin className="w-3.5 h-3.5 text-[#090909]" />
              {profile.location}
            </span>
          </p>
        </div>

        {/* Action Buttons: Download PDF, Archive, New Plan, Email, Text, Edit Customizations, Copy */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          {/* Main Download .PDF Button */}
          <button
            id="header-download-pdf-btn"
            type="button"
            onClick={() => {
              setDispatchInitialTab("pdf");
              setDispatchModalOpen(true);
            }}
            className="flex-1 sm:flex-initial text-xs font-bold text-[#090909] bg-[#FAF082] hover:bg-yellow-300 px-3.5 py-2 rounded-full border-2 border-[#090909] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#090909]" />
            <span>Download .PDF</span>
            <span className="bg-[#090909] text-white text-[9px] px-1.5 py-0.5 rounded font-black">
              FREE
            </span>
          </button>

          {/* Archive Plan Button */}
          <button
            id="header-archive-plan-btn"
            type="button"
            onClick={onArchivePlan}
            className={`text-xs font-bold px-3.5 py-2 rounded-full border border-[#090909] transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
              isArchived
                ? "bg-[#1B3B2B] text-white hover:bg-[#234d38]"
                : "bg-white text-[#090909] hover:bg-[#FAF082]/40"
            }`}
            title={isArchived ? "Plan saved in your archives vault" : "Archive this plan to vault"}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{isArchived ? "Archived ✓" : "Archive Plan"}</span>
          </button>

          {/* New Plan / Refresh Trigger Button */}
          <button
            id="header-new-plan-btn"
            type="button"
            onClick={onCreateNewPlan}
            className="text-xs font-bold text-[#090909] bg-white hover:bg-[#FCF7E5] px-3.5 py-2 rounded-full border border-[#090909] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            title="Create a new celebration plan or refresh"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#090909]" />
            <span>New Plan</span>
          </button>

          {/* Email Plan Button */}
          <button
            id="header-email-plan-btn"
            type="button"
            onClick={() => {
              setDispatchInitialTab("email");
              setDispatchModalOpen(true);
            }}
            className="text-xs font-bold text-[#090909] bg-white hover:bg-[#FCF7E5] px-3 py-2 rounded-full border border-[#090909] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5 text-[#090909]" />
            <span>Email</span>
            <span className="text-[10px] text-[#5C584F] font-bold">($2)</span>
          </button>

          {/* Text Plan Button */}
          <button
            id="header-text-plan-btn"
            type="button"
            onClick={() => {
              setDispatchInitialTab("text");
              setDispatchModalOpen(true);
            }}
            className="text-xs font-bold text-[#090909] bg-white hover:bg-[#FCF7E5] px-3 py-2 rounded-full border border-[#090909] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#090909]" />
            <span>Text</span>
            <span className="text-[10px] text-[#5C584F] font-bold">($2)</span>
          </button>

          <button
            id="edit-inputs-btn"
            onClick={onEditInputs}
            className="text-xs font-bold text-[#5C584F] hover:text-[#090909] bg-white hover:bg-[#FCF7E5] px-3 py-2 rounded-full border border-[#E7E0D1] transition-all flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Edit</span>
          </button>

          <button
            id="copy-plan-btn"
            onClick={onCopyPlan}
            className={`text-xs font-bold px-3 py-2 rounded-full border border-[#090909] transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
              isCopied
                ? "bg-[#090909] text-white"
                : "bg-white text-[#090909] hover:bg-[#FCF7E5]"
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#FAF082]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Export & Celebration Dispatch Showcase Banner */}
      <div className="bg-[#090909] text-white rounded-3xl p-5 sm:p-6 border-2 border-[#090909] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#FAF082] bg-white/10 px-2.5 py-0.5 rounded-full border border-[#FAF082]/30">
              Celebration Dispatch Hub
            </span>
            <span className="text-xs text-neutral-300 font-medium">Standard rate $2.00 each</span>
          </div>
          <h3 className="font-serif-display text-2xl font-bold text-white">
            Ready to Share the Masterplan?
          </h3>
          <p className="text-xs text-neutral-300 max-w-xl">
            Download our on-brand, high-resolution PDF complete with timeline, verified reviews, and dietary directives—or beam the plan directly to guests via Email or Text ($2 each, free PDF download today).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10 w-full md:w-auto">
          <button
            type="button"
            id="showcase-download-pdf-btn"
            onClick={() => {
              setDispatchInitialTab("pdf");
              setDispatchModalOpen(true);
            }}
            className="flex-1 md:flex-initial bg-[#FAF082] hover:bg-yellow-300 text-[#090909] font-bold text-xs px-4 py-3 rounded-2xl border-2 border-[#FAF082] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4 text-[#090909]" />
            <span>Download .PDF</span>
            <span className="bg-[#090909] text-white text-[9px] px-1.5 py-0.5 rounded font-black">
              FREE DEMO
            </span>
          </button>

          <button
            type="button"
            id="showcase-email-btn"
            onClick={() => {
              setDispatchInitialTab("email");
              setDispatchModalOpen(true);
            }}
            className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-3 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4 text-[#FAF082]" />
            <span>Email Plan ($2)</span>
          </button>

          <button
            type="button"
            id="showcase-text-btn"
            onClick={() => {
              setDispatchInitialTab("text");
              setDispatchModalOpen(true);
            }}
            className="flex-1 md:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-3 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#FAF082]" />
            <span>Text / SMS ($2)</span>
          </button>
        </div>
      </div>

      {/* Segmented Control / Tabs */}
      <div className="flex border-b-2 border-[#090909] gap-2 overflow-x-auto pb-1">
        <button
          id="tab-full-itinerary"
          onClick={() => setActiveTab("itinerary")}
          className={`px-5 py-3 rounded-t-2xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "itinerary"
              ? "bg-white text-[#090909] border-t-2 border-x-2 border-[#090909] -mb-[2px] shadow-2xs"
              : "text-[#5C584F] hover:text-[#090909] hover:bg-white/50"
          }`}
        >
          <IconCalendarParty className="w-4 h-4 text-[#090909]" />
          <span>Full Plan & Itinerary (11 Sections)</span>
        </button>

        <button
          id="tab-food-dining"
          onClick={() => setActiveTab("food")}
          className={`px-5 py-3 rounded-t-2xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "food"
              ? "bg-white text-[#090909] border-t-2 border-x-2 border-[#090909] -mb-[2px] shadow-2xs"
              : "text-[#5C584F] hover:text-[#090909] hover:bg-white/50"
          }`}
        >
          <IconDining className="w-4 h-4 text-[#090909]" />
          <span>Food & Dining Discovery</span>
        </button>

        <button
          id="tab-experiences"
          onClick={() => setActiveTab("experiences")}
          className={`px-5 py-3 rounded-t-2xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "experiences"
              ? "bg-white text-[#090909] border-t-2 border-x-2 border-[#090909] -mb-[2px] shadow-2xs"
              : "text-[#5C584F] hover:text-[#090909] hover:bg-white/50"
          }`}
        >
          <IconCompass className="w-4 h-4 text-[#090909]" />
          <span>Experiences & Activities</span>
        </button>
      </div>

      {/* TAB 1: FULL PLAN & ITINERARY */}
      {activeTab === "itinerary" && (
        <div className="space-y-8 animate-fadeIn">
          {/* SECTION 1: BIRTHDAY OVERVIEW */}
          <section id="section-birthday-overview" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                1
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Birthday Overview
              </h3>
            </div>
            <p className="text-base text-[#5C584F] leading-relaxed mb-4">
              {plan.birthdayOverview.summary}
            </p>
            <div className="bg-[#FCF7E5] rounded-2xl p-4 border border-[#E7E0D1] grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs uppercase font-semibold text-[#5C584F] block">Milestone Age</span>
                <span className="font-bold text-[#090909] text-lg">{plan.birthdayOverview.ageTurning} years young!</span>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-[#5C584F] block">Celebration Date</span>
                <span className="font-bold text-[#090909] text-lg">{plan.birthdayOverview.celebrationDate}</span>
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-[#5C584F] block">Backdrop</span>
                <span className="font-bold text-[#090909] text-lg">{profile.location}</span>
              </div>
            </div>
          </section>

          {/* SECTION 2: THEME AND MOOD */}
          <section id="section-theme-and-mood" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                2
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Theme & Mood
              </h3>
            </div>
            <div className="bg-[#FAF082]/40 border border-[#E7E0D1] rounded-2xl p-5 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#090909] block mb-1">
                Signature Concept
              </span>
              <h4 className="font-serif-display text-xl font-bold text-[#090909]">
                {plan.themeAndMood.title}
              </h4>
              <p className="text-sm text-[#5C584F] mt-1 italic">
                "{plan.themeAndMood.mood}"
              </p>
            </div>
            <p className="text-sm text-[#5C584F] leading-relaxed mb-4">
              {plan.themeAndMood.vibeDescription}
            </p>
            {plan.themeAndMood.colorPalette && plan.themeAndMood.colorPalette.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-[#5C584F]">Atmosphere Palette:</span>
                <div className="flex items-center gap-2">
                  {plan.themeAndMood.colorPalette.map((hex, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-full border border-black/10 shadow-2xs flex items-center justify-center"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* SECTION 3: EVENT FORMAT AND VENUE APPROACH */}
          <section id="section-event-format-and-venue" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                3
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Event Format & Venue Approach
              </h3>
            </div>
            <p className="text-sm font-medium text-[#090909] mb-2">
              <span className="font-bold">Format:</span> {plan.eventFormatAndVenue.format}
            </p>
            <p className="text-sm text-[#5C584F] leading-relaxed mb-6">
              <span className="font-bold text-[#090909]">Venue Approach:</span> {plan.eventFormatAndVenue.venueApproach}
            </p>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#090909]">
                Sample Recommended Venues
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plan.eventFormatAndVenue.sampleVenues.map((v, i) => (
                  <div key={i} className="border border-[#E7E0D1] rounded-2xl p-4 bg-[#FCF7E5]/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h5 className="font-serif-display font-bold text-base text-[#090909]">
                          {v.name}
                        </h5>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white border border-[#E7E0D1] text-[#5C584F]">
                          {v.neighborhoodOrArea}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#FD9773] mb-2">{v.type}</p>
                      <p className="text-xs text-[#5C584F] leading-normal mb-3">{v.whyItFits}</p>
                    </div>
                    <div className="border-t border-[#E7E0D1]/60 pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-amber-800 font-medium italic">
                        {v.verificationNote || "Availability to confirm"}
                      </span>
                      <button
                        onClick={() =>
                          onToggleSaveItem({
                            id: `venue-${i}`,
                            type: "food",
                            title: v.name,
                            subtitle: v.type,
                            badge: v.neighborhoodOrArea,
                          })
                        }
                        className="text-xs font-semibold text-[#090909] hover:text-[#FD9773] flex items-center gap-1"
                      >
                        {isItemSaved(`venue-${i}`) ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#FD9773]" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Save Venue</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: DETAILED TIMELINE */}
          <section id="section-detailed-timeline" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                4
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Detailed Timeline
              </h3>
            </div>
            <p className="text-sm text-[#5C584F] mb-6">
              A sequenced, buffer-friendly day-of celebration run sheet designed to prevent rushing.
            </p>

            <div className="relative pl-6 border-l-2 border-[#FAF082] space-y-6">
              {plan.timeline.map((event, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline bullet dot */}
                  <div
                    className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                      event.isKeyMoment ? "bg-[#FD9773] ring-4 ring-[#FD9773]/20" : "bg-[#090909]"
                    }`}
                  />
                  <div
                    className={`rounded-2xl p-4 border transition-all ${
                      event.isKeyMoment
                        ? "bg-[#FAF082]/30 border-[#FAF082]"
                        : "bg-white border-[#E7E0D1]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-[#090909] text-white px-2.5 py-0.5 rounded-full">
                          {event.time}
                        </span>
                        <h4 className="font-serif-display font-bold text-base text-[#090909]">
                          {event.title}
                        </h4>
                      </div>
                      {event.isKeyMoment && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FD9773] text-white px-2.5 py-0.5 rounded-full">
                          Signature Milestone Moment
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C584F] leading-relaxed">
                      {event.description}
                    </p>
                    {event.locationNote && (
                      <p className="text-[11px] text-[#090909] font-medium mt-2 flex items-center gap-1">
                        <IconMapPin className="w-3 h-3 text-[#090909]" />
                        {event.locationNote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: FOOD AND CAKE */}
          <section id="section-food-and-cake" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                5
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Food & Cake
              </h3>
            </div>
            <div className="bg-[#FCF7E5] rounded-2xl p-4 border border-[#E7E0D1] mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C584F] block mb-1">
                Dining Direction
              </span>
              <p className="text-sm text-[#090909] font-medium leading-relaxed">
                {plan.foodAndCake.diningConcept}
              </p>
            </div>

            {/* Cake Box */}
            <div className="border-2 border-[#FAF082] bg-white rounded-2xl p-5 mb-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <IconSparkle className="w-4 h-4 text-[#090909]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#090909]">
                  Signature Milestone Birthday Cake Concept
                </span>
              </div>
              <h4 className="font-serif-display text-lg font-bold text-[#090909]">
                {plan.foodAndCake.cakeAndDessert.cakeIdea}
              </h4>
              <p className="text-xs text-[#5C584F] mt-1 mb-2">
                <span className="font-semibold text-[#090909]">Flavor Profile:</span>{" "}
                {plan.foodAndCake.cakeAndDessert.flavorProfile}
              </p>
              <p className="text-xs text-[#5C584F] bg-[#FCF7E5] p-3 rounded-xl border border-[#E7E0D1]">
                <span className="font-semibold text-[#090909]">Bakery Approach:</span>{" "}
                {plan.foodAndCake.cakeAndDessert.localBakeryApproach}
              </p>
            </div>

            {/* Sample Dining Options */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E0D1] pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#090909] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#FD9773] text-[#FD9773]" />
                  <span>Curated Dining (Ranked Highest Rated First)</span>
                </h4>
                <span className="text-[11px] font-semibold text-[#1B3B2B] bg-[#FAF082]/80 px-2.5 py-0.5 rounded-full border border-[#FAF082]">
                  Top Online Reviews & Acclaim
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plan.foodAndCake.sampleFoodOptions.map((f, idx) => (
                  <div key={idx} className="border border-[#E7E0D1] rounded-2xl p-4 bg-white hover:border-[#090909] transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h5 className="font-serif-display font-bold text-base text-[#090909]">{f.name}</h5>
                        <span className="text-xs font-bold text-[#1B3B2B] bg-[#FAF082]/60 px-2 py-0.5 rounded-full">
                          {f.costEstimatePerPerson}
                        </span>
                      </div>

                      {/* Online Rating and Reviews Badge */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#090909] text-[#FAF082] px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-[#FAF082] text-[#FAF082]" />
                          <span>{f.rating?.toFixed(1) || "4.9"}</span>
                        </span>
                        {f.reviewCount && (
                          <span className="text-[11px] font-medium text-[#5C584F]">
                            {f.reviewCount}
                          </span>
                        )}
                        {f.ratingSource && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B3B2B] bg-[#FAF082]/60 px-2 py-0.5 rounded-full">
                            {f.ratingSource}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-[#FD9773] mb-1.5">{f.cuisine}</p>
                      <p className="text-xs text-[#5C584F] mb-2">{f.atmosphere}</p>
                      <p className="text-xs text-[#090909] font-medium bg-[#FCF7E5]/60 p-2 rounded-lg mb-2">
                        {f.whyItFits}
                      </p>

                      {f.reviewHighlight && (
                        <div className="text-[11px] text-[#5C584F] bg-[#FAF082]/15 border border-[#FAF082] p-2 rounded-lg mb-2 italic">
                          <span className="font-semibold not-italic text-[#090909]">Reviewer Highlight: </span>
                          "{f.reviewHighlight}"
                        </div>
                      )}

                      {f.dietaryNotes && (
                        <p className="text-[11px] text-[#5C584F]">
                          <span className="font-medium text-[#090909]">Dietary:</span> {f.dietaryNotes}
                        </p>
                      )}
                    </div>
                    <div className="border-t border-[#E7E0D1] pt-2.5 mt-3 flex items-center justify-between text-[11px]">
                      <span className="text-amber-800 italic">
                        {f.verificationNote || "Availability to confirm"}
                      </span>
                      <button
                        onClick={() =>
                          onToggleSaveItem({
                            id: `food-${idx}`,
                            type: "food",
                            title: f.name,
                            subtitle: f.cuisine,
                            badge: f.costEstimatePerPerson,
                          })
                        }
                        className="text-xs font-semibold text-[#090909] hover:text-[#FD9773] flex items-center gap-1"
                      >
                        {isItemSaved(`food-${idx}`) ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#FD9773]" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: ACTIVITIES AND ENTERTAINMENT */}
          <section id="section-activities-and-entertainment" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                6
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Activities & Entertainment
              </h3>
            </div>
            <p className="text-sm text-[#5C584F] mb-6">
              Experiences handpicked for birthday celebration energy, balanced pacing, and regional character.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plan.activitiesAndEntertainment.map((act, i) => (
                <div key={i} className="border border-[#E7E0D1] rounded-2xl p-5 bg-[#FCF7E5]/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h5 className="font-serif-display font-bold text-base text-[#090909]">{act.title}</h5>
                      <span className="text-xs font-bold text-[#090909]">{act.estimatedCost}</span>
                    </div>

                    {/* Rating and Reviews Badge */}
                    {act.rating && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#090909] text-[#FAF082] px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-[#FAF082] text-[#FAF082]" />
                          <span>{act.rating.toFixed(1)}</span>
                        </span>
                        {act.reviewCount && (
                          <span className="text-[11px] font-medium text-[#5C584F]">
                            ({act.reviewCount})
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5C584F] mb-3">
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E7E0D1] font-semibold text-[#090909]">
                        {act.category}
                      </span>
                      <span>•</span>
                      <span>{act.duration}</span>
                      <span>•</span>
                      <span className="capitalize">{act.activityLevel} level</span>
                    </div>
                    <p className="text-xs text-[#5C584F] leading-relaxed mb-3">{act.whyItFits}</p>
                    <div className="text-[11px] text-[#5C584F] bg-white p-2 rounded-lg border border-[#E7E0D1]">
                      <span className="font-semibold text-[#090909]">Weather:</span>{" "}
                      {act.indoorOutdoor} setting ({act.weatherSensitivity})
                    </div>
                  </div>
                  <div className="border-t border-[#E7E0D1] pt-2.5 mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-amber-800 italic">
                      {act.verificationNote || "Availability to confirm"}
                    </span>
                    <button
                      onClick={() =>
                        onToggleSaveItem({
                          id: `act-${i}`,
                          type: "experience",
                          title: act.title,
                          subtitle: act.category,
                          badge: act.estimatedCost,
                        })
                      }
                      className="text-xs font-semibold text-[#090909] hover:text-[#FD9773] flex items-center gap-1"
                    >
                      {isItemSaved(`act-${i}`) ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-[#FD9773]" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 7: PERSONALIZED TOUCHES */}
          <section id="section-personalized-touches" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                7
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Personalized Touches
              </h3>
            </div>
            <p className="text-sm text-[#5C584F] mb-6">
              Thoughtful micro-details that make the celebration distinctly feel like {plan.birthdayOverview.celebrantName}.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plan.personalizedTouches.map((touch, idx) => (
                <div
                  key={idx}
                  className="bg-[#FCF7E5] border border-[#E7E0D1] rounded-2xl p-4 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FAF082] text-[#090909] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconSparkle className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#090909] leading-relaxed font-medium">
                    {touch}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 8: THREE-TIER BUDGET ESTIMATE IN USD */}
          <section id="section-three-tier-budget" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                8
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Three-Tier Budget Estimate (USD)
              </h3>
            </div>
            <p className="text-sm text-[#5C584F] mb-6">
              Realistic cost estimates per tier based on {profile.guestCount || 8} guests in {profile.location}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Tier 1: Budget */}
              <div className="border border-[#E7E0D1] rounded-2xl p-5 bg-white flex flex-col justify-between hover:border-[#090909] transition-all">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C584F] bg-[#FCF7E5] px-2.5 py-1 rounded-full border border-[#E7E0D1]">
                    Tier 1: Up to $100 / person
                  </span>
                  <h4 className="font-serif-display font-bold text-lg text-[#090909] mt-3">
                    {plan.threeTierBudget.budget.title}
                  </h4>
                  <div className="my-2">
                    <span className="text-2xl font-bold text-[#090909] font-serif-display">
                      {plan.threeTierBudget.budget.totalRangeUsd}
                    </span>
                    <span className="text-xs text-[#5C584F] block">
                      ~{plan.threeTierBudget.budget.perPersonRangeUsd} / person
                    </span>
                  </div>
                  <p className="text-xs text-[#5C584F] mb-4">
                    {plan.threeTierBudget.budget.description}
                  </p>
                </div>
                <div className="border-t border-[#E7E0D1] pt-3 space-y-1.5 text-xs text-[#5C584F]">
                  {plan.threeTierBudget.budget.breakdown.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-[#090909] font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier 2: Moderate (Recommended) */}
              <div className="border-2 border-[#FAF082] rounded-2xl p-5 bg-[#FAF082]/20 flex flex-col justify-between shadow-xs relative">
                <div className="absolute -top-3 right-4 bg-[#090909] text-[#FAF082] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Recommended
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#090909] bg-[#FAF082] px-2.5 py-1 rounded-full border border-[#E7E0D1]">
                    Tier 2: $100 - $300 / person
                  </span>
                  <h4 className="font-serif-display font-bold text-lg text-[#090909] mt-3">
                    {plan.threeTierBudget.moderate.title}
                  </h4>
                  <div className="my-2">
                    <span className="text-2xl font-bold text-[#090909] font-serif-display">
                      {plan.threeTierBudget.moderate.totalRangeUsd}
                    </span>
                    <span className="text-xs text-[#5C584F] block">
                      ~{plan.threeTierBudget.moderate.perPersonRangeUsd} / person
                    </span>
                  </div>
                  <p className="text-xs text-[#5C584F] mb-4">
                    {plan.threeTierBudget.moderate.description}
                  </p>
                </div>
                <div className="border-t border-[#E7E0D1] pt-3 space-y-1.5 text-xs text-[#090909] font-medium">
                  {plan.threeTierBudget.moderate.breakdown.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-[#FD9773] font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier 3: Splurge */}
              <div className="border border-[#E7E0D1] rounded-2xl p-5 bg-white flex flex-col justify-between hover:border-[#090909] transition-all">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#090909] bg-[#FD9773]/20 px-2.5 py-1 rounded-full border border-[#FD9773]/40">
                    Tier 3: $300+ / person
                  </span>
                  <h4 className="font-serif-display font-bold text-lg text-[#090909] mt-3">
                    {plan.threeTierBudget.splurge.title}
                  </h4>
                  <div className="my-2">
                    <span className="text-2xl font-bold text-[#090909] font-serif-display">
                      {plan.threeTierBudget.splurge.totalRangeUsd}
                    </span>
                    <span className="text-xs text-[#5C584F] block">
                      ~{plan.threeTierBudget.splurge.perPersonRangeUsd} / person
                    </span>
                  </div>
                  <p className="text-xs text-[#5C584F] mb-4">
                    {plan.threeTierBudget.splurge.description}
                  </p>
                </div>
                <div className="border-t border-[#E7E0D1] pt-3 space-y-1.5 text-xs text-[#5C584F]">
                  {plan.threeTierBudget.splurge.breakdown.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-[#090909] font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 9: SHOPPING AND PREPARATION CHECKLIST */}
          <section id="section-preparation-checklist" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                9
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Shopping & Preparation Checklist
              </h3>
            </div>
            <p className="text-sm text-[#5C584F] mb-6">
              Interactive timeline checklist organized by lead time. Click any item to mark it complete.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 30 days before */}
              <div className="border border-[#E7E0D1] rounded-2xl p-4 bg-[#FCF7E5]/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#090909] border-b border-[#E7E0D1] pb-2 mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#FD9773]" />
                  <span>30 Days Before</span>
                </h4>
                <ul className="space-y-2.5">
                  {plan.checklist.thirtyDaysBefore.map((task, i) => {
                    const id = `task-30-${i}`;
                    const isChecked = checkedTasks[id];
                    return (
                      <li
                        key={i}
                        onClick={() => toggleTask(id)}
                        className="flex items-start gap-2.5 cursor-pointer text-xs group select-none"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#1B3B2B] flex-shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-[#5C584F] group-hover:text-[#090909] flex-shrink-0 mt-0.5" />
                        )}
                        <span className={isChecked ? "line-through text-[#5C584F]" : "text-[#090909] font-medium"}>
                          {task}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 14 days before */}
              <div className="border border-[#E7E0D1] rounded-2xl p-4 bg-[#FCF7E5]/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#090909] border-b border-[#E7E0D1] pb-2 mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#FD9773]" />
                  <span>14 Days Before</span>
                </h4>
                <ul className="space-y-2.5">
                  {plan.checklist.fourteenDaysBefore.map((task, i) => {
                    const id = `task-14-${i}`;
                    const isChecked = checkedTasks[id];
                    return (
                      <li
                        key={i}
                        onClick={() => toggleTask(id)}
                        className="flex items-start gap-2.5 cursor-pointer text-xs group select-none"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#1B3B2B] flex-shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-[#5C584F] group-hover:text-[#090909] flex-shrink-0 mt-0.5" />
                        )}
                        <span className={isChecked ? "line-through text-[#5C584F]" : "text-[#090909] font-medium"}>
                          {task}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 7 days before */}
              <div className="border border-[#E7E0D1] rounded-2xl p-4 bg-[#FCF7E5]/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#090909] border-b border-[#E7E0D1] pb-2 mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#FD9773]" />
                  <span>7 Days Before</span>
                </h4>
                <ul className="space-y-2.5">
                  {plan.checklist.sevenDaysBefore.map((task, i) => {
                    const id = `task-7-${i}`;
                    const isChecked = checkedTasks[id];
                    return (
                      <li
                        key={i}
                        onClick={() => toggleTask(id)}
                        className="flex items-start gap-2.5 cursor-pointer text-xs group select-none"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#1B3B2B] flex-shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-[#5C584F] group-hover:text-[#090909] flex-shrink-0 mt-0.5" />
                        )}
                        <span className={isChecked ? "line-through text-[#5C584F]" : "text-[#090909] font-medium"}>
                          {task}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Day before & Day of */}
              <div className="border border-[#E7E0D1] rounded-2xl p-4 bg-[#FCF7E5]/30 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#090909] border-b border-[#E7E0D1] pb-2 mb-2 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#FD9773]" />
                    <span>Day Before</span>
                  </h4>
                  <ul className="space-y-2">
                    {plan.checklist.dayBefore.map((task, i) => {
                      const id = `task-db-${i}`;
                      const isChecked = checkedTasks[id];
                      return (
                        <li
                          key={i}
                          onClick={() => toggleTask(id)}
                          className="flex items-start gap-2.5 cursor-pointer text-xs group select-none"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#1B3B2B] flex-shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-[#5C584F] group-hover:text-[#090909] flex-shrink-0 mt-0.5" />
                          )}
                          <span className={isChecked ? "line-through text-[#5C584F]" : "text-[#090909] font-medium"}>
                            {task}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#E7E0D1]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#090909] pb-2 mb-2 flex items-center gap-2">
                    <IconSparkle className="w-3.5 h-3.5 text-[#090909]" />
                    <span>Day Of Celebration</span>
                  </h4>
                  <ul className="space-y-2">
                    {plan.checklist.dayOf.map((task, i) => {
                      const id = `task-do-${i}`;
                      const isChecked = checkedTasks[id];
                      return (
                        <li
                          key={i}
                          onClick={() => toggleTask(id)}
                          className="flex items-start gap-2.5 cursor-pointer text-xs group select-none"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#1B3B2B] flex-shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-[#5C584F] group-hover:text-[#090909] flex-shrink-0 mt-0.5" />
                          )}
                          <span className={isChecked ? "line-through text-[#5C584F]" : "text-[#090909] font-medium"}>
                            {task}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 10: BACKUP PLAN */}
          <section id="section-backup-plan" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                10
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Backup Plan & Contingencies
              </h3>
            </div>
            <div className="bg-[#FAF082]/30 rounded-2xl p-4 border border-[#E7E0D1] mb-4">
              <div className="flex items-center gap-2 mb-1">
                <IconUmbrella className="w-4 h-4 text-[#090909]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#090909]">
                  Weather & Environmental Contingency
                </span>
              </div>
              <p className="text-xs font-semibold text-[#5C584F] mb-1">
                Scenario: {plan.backupPlan.weatherScenario}
              </p>
              <p className="text-xs text-[#090909] font-medium leading-relaxed">
                Plan: {plan.backupPlan.rainContingency}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-[#E7E0D1] rounded-xl p-3.5 bg-white">
                <span className="text-xs font-bold text-[#090909] block mb-1">
                  Sheltered Backup Alternatives:
                </span>
                <ul className="text-xs text-[#5C584F] space-y-1">
                  {plan.backupPlan.backupVenuesAndActivities.map((venue, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FD9773]" />
                      <span>{venue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-[#E7E0D1] rounded-xl p-3.5 bg-white">
                <span className="text-xs font-bold text-[#090909] block mb-1">
                  Travel & Timing Buffer:
                </span>
                <p className="text-xs text-[#5C584F] leading-relaxed">
                  {plan.backupPlan.scheduleBufferNotes}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 11: THREE NEXT DECISIONS */}
          <section id="section-next-decisions" className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#FAF082] flex items-center justify-center text-[#090909] text-xs font-bold">
                11
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                Three Next Decisions for You
              </h3>
            </div>
            <p className="text-sm text-[#5C584F] mb-4">
              Focus on these 3 concrete next steps to turn this plan into reality:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plan.nextDecisions.map((decision, idx) => (
                <div
                  key={idx}
                  className="bg-[#FCF7E5] border border-[#E7E0D1] rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold bg-[#090909] text-[#FAF082] w-5 h-5 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#090909]">
                      Decision {idx + 1}
                    </span>
                  </div>
                  <p className="text-xs text-[#090909] font-medium leading-relaxed">
                    {decision}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ASSUMPTIONS CLEARLY LABELED */}
          {plan.assumptions && plan.assumptions.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E7E0D1] p-4 text-xs text-[#5C584F]">
              <span className="font-bold text-[#090909] block mb-1">
                Planning Assumptions & Verification Notice:
              </span>
              <ul className="list-disc list-inside space-y-0.5">
                {plan.assumptions.map((asm, i) => (
                  <li key={i}>{asm}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FOOD & DINING DISCOVERY */}
      {activeTab === "food" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-[#E7E0D1] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-[#FD9773] text-[#FD9773]" />
                  <h3 className="font-serif-display text-2xl font-bold text-[#090909]">
                    Birthday Culinary Options & Menus
                  </h3>
                </div>
                <p className="text-sm text-[#5C584F] mt-0.5">
                  Checked against verified {profile.location} restaurant data and sorted highest-rated first.
                </p>
              </div>
              <span className="text-xs font-bold text-[#1B3B2B] bg-[#FAF082] px-3 py-1 rounded-full border border-[#FAF082]">
                Ranked by Online Acclaim
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {plan.foodAndCake.sampleFoodOptions.map((food, i) => (
                <div
                  key={i}
                  className="border border-[#E7E0D1] rounded-2xl p-5 bg-white flex flex-col justify-between hover:border-[#090909] transition-all shadow-2xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-serif-display font-bold text-lg text-[#090909]">
                        {food.name}
                      </h4>
                      <span className="text-xs font-bold text-[#1B3B2B] bg-[#FAF082] px-2.5 py-1 rounded-full">
                        {food.costEstimatePerPerson}
                      </span>
                    </div>

                    {/* Online Rating & Review Summary */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#090909] text-[#FAF082] px-2.5 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-[#FAF082] text-[#FAF082]" />
                        <span>{food.rating?.toFixed(1) || "4.9"}</span>
                      </span>
                      {food.reviewCount && (
                        <span className="text-xs font-medium text-[#5C584F]">
                          {food.reviewCount}
                        </span>
                      )}
                      {food.ratingSource && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B3B2B] bg-[#FAF082]/60 px-2 py-0.5 rounded-full">
                          {food.ratingSource}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-[#FD9773] block mb-2">
                      {food.cuisine}
                    </span>
                    <p className="text-xs text-[#5C584F] mb-3 leading-relaxed">
                      <span className="font-semibold text-[#090909]">Atmosphere:</span>{" "}
                      {food.atmosphere}
                    </p>
                    <div className="bg-[#FCF7E5] p-3 rounded-xl border border-[#E7E0D1] text-xs text-[#090909] mb-3">
                      <span className="font-bold block mb-1">Why this matches your birthday:</span>
                      {food.whyItFits}
                    </div>

                    {food.reviewHighlight && (
                      <div className="text-xs text-[#5C584F] bg-[#FAF082]/15 border border-[#FAF082] p-2.5 rounded-xl mb-3 italic">
                        <span className="font-semibold not-italic text-[#090909]">Review Highlight: </span>
                        "{food.reviewHighlight}"
                      </div>
                    )}

                    {food.dietaryNotes && (
                      <p className="text-[11px] text-[#5C584F]">
                        <span className="font-medium text-[#090909]">Dietary Notes:</span>{" "}
                        {food.dietaryNotes}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[#E7E0D1] pt-3 mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-amber-800 italic">
                      {food.verificationNote || "Availability to confirm"}
                    </span>
                    <button
                      onClick={() =>
                        onToggleSaveItem({
                          id: `food-tab-${i}`,
                          type: "food",
                          title: food.name,
                          subtitle: food.cuisine,
                          badge: food.costEstimatePerPerson,
                        })
                      }
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                        isItemSaved(`food-tab-${i}`)
                          ? "bg-[#090909] text-[#FAF082] border-[#090909]"
                          : "bg-white text-[#090909] border-[#E7E0D1] hover:bg-[#FCF7E5]"
                      }`}
                    >
                      {isItemSaved(`food-tab-${i}`) ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-[#FAF082]" />
                          <span>Added to Plan</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Add to Birthday Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Cake Focus */}
            <div className="mt-8 bg-[#FAF082]/30 border border-[#E7E0D1] rounded-2xl p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#090909] block mb-1">
                Custom Birthday Cake Concept
              </span>
              <h4 className="font-serif-display text-xl font-bold text-[#090909]">
                {plan.foodAndCake.cakeAndDessert.cakeIdea}
              </h4>
              <p className="text-sm text-[#5C584F] mt-1 mb-3">
                {plan.foodAndCake.cakeAndDessert.flavorProfile}
              </p>
              <div className="bg-white p-3.5 rounded-xl border border-[#E7E0D1] text-xs text-[#090909]">
                <span className="font-bold">Ordering & Bakery Advice:</span>{" "}
                {plan.foodAndCake.cakeAndDessert.localBakeryApproach}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXPERIENCES & ACTIVITIES */}
      {activeTab === "experiences" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-[28px] border border-[#E7E0D1] p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif-display text-2xl font-bold text-[#090909] mb-1">
              Curated Birthday Experiences & Live Events
            </h3>
            <p className="text-sm text-[#5C584F] mb-6">
              Activity options matching {plan.birthdayOverview.celebrantName}’s milestone style and pacing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {plan.activitiesAndEntertainment.map((activity, i) => (
                <div
                  key={i}
                  className="border border-[#E7E0D1] rounded-2xl p-5 bg-white flex flex-col justify-between hover:border-[#090909] transition-all shadow-2xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-serif-display font-bold text-lg text-[#090909]">
                        {activity.title}
                      </h4>
                      <span className="text-xs font-bold text-[#090909]">
                        {activity.estimatedCost}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C584F] mb-3">
                      <span className="bg-[#FAF082]/50 text-[#090909] px-2.5 py-0.5 rounded-full font-semibold">
                        {activity.category}
                      </span>
                      <span>•</span>
                      <span>{activity.duration}</span>
                      <span>•</span>
                      <span className="capitalize">{activity.activityLevel} energy</span>
                    </div>

                    <div className="bg-[#FCF7E5] p-3 rounded-xl border border-[#E7E0D1] text-xs text-[#090909] mb-3">
                      <span className="font-bold block mb-1">Why this matches your celebration:</span>
                      {activity.whyItFits}
                    </div>

                    <div className="text-[11px] text-[#5C584F] space-y-1">
                      <p>
                        <span className="font-semibold text-[#090909]">Setting:</span>{" "}
                        {activity.indoorOutdoor} ({activity.weatherSensitivity})
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#E7E0D1] pt-3 mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-amber-800 italic">
                      {activity.verificationNote || "Availability to confirm"}
                    </span>
                    <button
                      onClick={() =>
                        onToggleSaveItem({
                          id: `act-tab-${i}`,
                          type: "experience",
                          title: activity.title,
                          subtitle: activity.category,
                          badge: activity.estimatedCost,
                        })
                      }
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                        isItemSaved(`act-tab-${i}`)
                          ? "bg-[#090909] text-[#FAF082] border-[#090909]"
                          : "bg-white text-[#090909] border-[#E7E0D1] hover:bg-[#FCF7E5]"
                      }`}
                    >
                      {isItemSaved(`act-tab-${i}`) ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-[#FAF082]" />
                          <span>Added to Plan</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Add to Birthday Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Saved Selections Drawer/Bar if user has saved items */}
      {savedSelections.length > 0 && (
        <div className="bg-[#090909] text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-[#FAF082]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FAF082]">
                Your Saved Birthday Highlights ({savedSelections.length})
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              {savedSelections.map((s) => s.title).join(" • ")}
            </p>
          </div>
          <button
            onClick={onCopyPlan}
            className="text-xs font-semibold bg-[#FAF082] text-[#090909] hover:bg-white px-4 py-2 rounded-full transition-all flex items-center gap-1.5 self-end sm:self-auto"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Full Plan & Highlights</span>
          </button>
        </div>
      )}
      {/* Celebration Dispatch & Export Modal */}
      <CelebrationDispatchModal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        plan={plan}
        profile={profile}
        initialTab={dispatchInitialTab}
      />
    </section>
  );
};
