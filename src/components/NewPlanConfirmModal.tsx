import React, { useState } from "react";
import { BirthdayPlan, UserProfile } from "../types";
import {
  Archive,
  Trash2,
  X,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  PlusCircle,
  ShieldAlert,
} from "lucide-react";

interface NewPlanConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArchiveAndCreateNew: () => void;
  onDiscardAndCreateNew: () => void;
  onQuickRefreshPlan?: () => void;
  currentPlan: BirthdayPlan | null;
  currentProfile: UserProfile;
}

export const NewPlanConfirmModal: React.FC<NewPlanConfirmModalProps> = ({
  isOpen,
  onClose,
  onArchiveAndCreateNew,
  onDiscardAndCreateNew,
  onQuickRefreshPlan,
  currentPlan,
  currentProfile,
}) => {
  const [showDiscardWarning, setShowDiscardWarning] = useState(false);

  if (!isOpen) return null;

  const honoree = currentPlan?.birthdayOverview.celebrantName || currentProfile.fullName || "Birthday VIP";
  const location = currentProfile.location || "selected city";
  const date = currentPlan?.birthdayOverview.celebrationDate || currentProfile.preferredCelebrationDate || "Celebration date";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white w-full max-w-lg rounded-3xl border-2 border-[#090909] shadow-2xl overflow-hidden flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#090909] text-white p-5 sm:p-6 border-b-4 border-[#FAF082] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FAF082]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FAF082]">
                New Plan Action Hub
              </span>
            </div>
            <h3 className="font-serif-display text-xl sm:text-2xl font-bold">
              Ready to Start Fresh?
            </h3>
            <p className="text-xs text-neutral-300">
              Decide how you want to handle your current celebration itinerary.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowDiscardWarning(false);
              onClose();
            }}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Plan Badge Card */}
        {currentPlan && (
          <div className="p-4 sm:px-6 bg-[#FCF7E5] border-b border-[#E7E0D1] space-y-1 text-xs">
            <span className="font-bold uppercase tracking-wider text-[#5C584F] text-[10px]">
              Current Active Celebration Itinerary:
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-serif-display font-bold text-sm text-[#090909]">
                {honoree}’s Birthday ({location})
              </span>
              <span className="bg-[#FAF082] text-[#090909] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-[#090909]">
                {date}
              </span>
            </div>
          </div>
        )}

        {/* Action Choices */}
        <div className="p-5 sm:p-6 space-y-4">
          {!showDiscardWarning ? (
            <>
              {/* Choice 1: Archive & Create New (Recommended) */}
              <button
                type="button"
                id="archive-and-create-new-btn"
                onClick={() => {
                  onArchiveAndCreateNew();
                  onClose();
                }}
                className="w-full text-left p-4 rounded-2xl bg-[#FAF082]/30 hover:bg-[#FAF082]/60 border-2 border-[#090909] transition-all group shadow-xs active:scale-[0.99] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#090909] text-[#FAF082] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Archive className="w-4 h-4" />
                    </div>
                    <span className="font-serif-display font-bold text-base text-[#090909]">
                      Archive & Create New
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#090909] text-white px-2 py-0.5 rounded-md">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-[#5C584F] pl-10 leading-relaxed">
                  Safely preserves this entire plan in your Archives Vault so you can restore or download it anytime, then clears the canvas to craft a brand-new plan.
                </p>
              </button>

              {/* Choice 2: Quick Refresh Ideas for this Honoree */}
              {onQuickRefreshPlan && currentPlan && (
                <button
                  type="button"
                  id="quick-refresh-plan-btn"
                  onClick={() => {
                    onQuickRefreshPlan();
                    onClose();
                  }}
                  className="w-full text-left p-4 rounded-2xl bg-white hover:bg-[#FCF7E5] border-2 border-[#090909] transition-all group shadow-2xs active:scale-[0.99] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#1B3B2B] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <span className="font-serif-display font-bold text-base text-[#090909]">
                        Refresh Options for {honoree}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#1B3B2B] bg-[#FAF082] px-2 py-0.5 rounded-md border border-[#090909]">
                      Keep VIP
                    </span>
                  </div>
                  <p className="text-xs text-[#5C584F] pl-10 leading-relaxed">
                    Generates fresh creative alternative venues, restaurant stops, and activities for this same profile without retyping your info.
                  </p>
                </button>
              )}

              {/* Choice 3: Discard & Create New */}
              <button
                type="button"
                id="prompt-discard-btn"
                onClick={() => setShowDiscardWarning(true)}
                className="w-full text-left p-4 rounded-2xl bg-white hover:bg-red-50/70 border border-neutral-300 hover:border-red-300 transition-all group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-600 group-hover:bg-red-100 group-hover:text-red-700 flex items-center justify-center transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[#090909] group-hover:text-red-700">
                      Discard & Create New
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-semibold">
                    Permanent
                  </span>
                </div>
                <p className="text-xs text-[#5C584F] pl-10 leading-relaxed">
                  Permanently deletes the current celebration plan without saving it to your vault.
                </p>
              </button>
            </>
          ) : (
            /* Warning Confirmation when user clicked Discard */
            <div className="space-y-4 bg-red-50/90 border-2 border-red-500 rounded-2xl p-5 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-red-900 text-base">
                    Warning: Permanent Discard
                  </h4>
                  <p className="text-xs text-red-800 font-medium leading-relaxed">
                    If you discard this plan, all current customization, timeline items, curated restaurants, and chats are lost permanently.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/90 rounded-xl border border-red-200 text-xs text-red-900 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>We recommend choosing "Archive & Create New" instead to keep a copy.</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  type="button"
                  id="confirm-discard-btn"
                  onClick={() => {
                    onDiscardAndCreateNew();
                    setShowDiscardWarning(false);
                    onClose();
                  }}
                  className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-xs"
                >
                  Yes, Discard All & Start Fresh
                </button>

                <button
                  type="button"
                  onClick={() => setShowDiscardWarning(false)}
                  className="w-full sm:w-auto text-xs font-bold text-[#090909] bg-white hover:bg-neutral-100 py-3 px-4 rounded-xl border border-neutral-300 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-[#E7E0D1] flex items-center justify-between text-xs text-[#5C584F]">
          <span>Born Day Plan Vault Protection</span>
          <button
            type="button"
            onClick={() => {
              setShowDiscardWarning(false);
              onClose();
            }}
            className="font-bold text-[#090909] hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
