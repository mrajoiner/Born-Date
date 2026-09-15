import React from "react";
import { UserProfile } from "../types";
import { SoloGuide } from "./CelebrationSherpas";
import { CalendarDatePicker } from "./CalendarDatePicker";
import { DietarySelector } from "./DietarySelector";
import {
  IconPartyPopper,
  IconDining,
  IconBudget,
  IconCelebrant,
  IconCalendarParty,
  IconMapPin,
  IconSparkle,
  IconPartyHat,
} from "./BornDayIcons";

interface CustomizationScreenProps {
  profile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
  onBackToLanding: () => void;
  onGeneratePlan: () => void;
  isLoading: boolean;
}

export const CustomizationScreen: React.FC<CustomizationScreenProps> = ({
  profile,
  onChangeProfile,
  onBackToLanding,
  onGeneratePlan,
  isLoading,
}) => {
  const honoreeLabel =
    profile.honoreeRole === "boy"
      ? "Birthday Boy"
      : profile.honoreeRole === "girl"
      ? "Birthday Girl"
      : "Birthday Boy or Birthday Girl";

  const foodOptions = [
    "Creole & Cajun",
    "Fresh Gulf Seafood",
    "Southern Comfort",
    "Craft Cocktails & Wine",
    "Local Bakery Cakes",
    "French Bistro",
    "Wood-fired BBQ",
    "Artisanal Brunch",
    "Small Plates & Tapas",
    "Steakhouse & Grill",
  ];

  const vibePresets = [
    {
      title: "Soulful & Relaxed",
      desc: "Warm acoustic rhythms, intimate conversation, relaxed pacing",
    },
    {
      title: "Lively Party & Music",
      desc: "Live brass/jazz, vibrant energy, dancing, energetic stops",
    },
    {
      title: "Culinary & Foodie Tour",
      desc: "Multi-course feast, craft cocktails, artisan dessert tastings",
    },
    {
      title: "Milestone Grand Gala",
      desc: "Dressed-up elegance, private dining, memorable champagne toasts",
    },
  ];

  const guestCounts = [
    { label: "Intimate Duo", count: 2 },
    { label: "Close Circle", count: 6 },
    { label: "Party Crew", count: 12 },
    { label: "Milestone Gala", count: 24 },
  ];

  const handleFoodTagToggle = (tag: string) => {
    const current = profile.foodPreferences || [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    onChangeProfile({ ...profile, foodPreferences: updated });
  };

  return (
    <section id="customizations-section" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Screen 2: Arlo (girl) holding sign CUSTOMIZE */}
      <SoloGuide
        character="arlo"
        signText="CUSTOMIZE"
        title="Trail Mapping"
        speechText="Base camp details logged—pick your vibe, flavors, and crew scale so we can map out a masterclass celebration."
      />

      {/* Birthday Boy or Birthday Girl Quick Recap Bar */}
      <div className="bg-white rounded-2xl border-2 border-[#090909] p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#090909]">
          <div className="flex items-center gap-1.5 bg-[#FAF082]/60 px-3 py-1 rounded-full border border-[#090909]">
            <IconCelebrant className="w-4 h-4 text-[#090909]" />
            <span>{honoreeLabel}: <strong className="font-bold">{profile.fullName}</strong></span>
          </div>
          <span className="text-[#E7E0D1]">•</span>
          <div className="flex items-center gap-1.5 bg-[#FAF082] px-2.5 py-0.5 rounded-full border border-[#090909]">
            <IconCalendarParty className="w-3.5 h-3.5 text-[#090909]" />
            <span>Born: {profile.dob}</span>
          </div>
          <span className="text-[#E7E0D1]">•</span>
          <div className="flex items-center gap-1.5">
            <IconMapPin className="w-4 h-4 text-[#090909]" />
            <span>{profile.location}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToLanding}
          className="text-xs font-bold text-[#5C584F] hover:text-[#090909] underline hover:no-underline flex items-center gap-1 transition-colors"
        >
          <span>← Edit basic info</span>
        </button>
      </div>

      {/* Customization Options Container */}
      <div className="bg-white rounded-3xl border-2 border-[#090909] p-6 sm:p-10 shadow-sm space-y-8">
        {/* Date of Birth Selection with User-Friendly Calendar Date Picker */}
        <div className="bg-[#FCF7E5] rounded-2xl p-5 border-2 border-[#090909] space-y-3 shadow-xs">
          <CalendarDatePicker
            id="customization-screen-dob"
            value={profile.dob}
            onChange={(val) => onChangeProfile({ ...profile, dob: val })}
            label={`${honoreeLabel}'s Date of Birth`}
            helperText="Tap to view interactive calendar or type directly"
            showQuickPills={true}
          />
        </div>

        {/* 1. Celebration Vibe */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <IconPartyHat className="w-5 h-5 text-[#090909]" />
            <h3 className="font-serif-display text-xl font-bold text-[#090909]">
              Celebration Vibe & Atmosphere
            </h3>
          </div>
          <p className="text-xs text-[#5C584F]">
            Select the overall spirit of the milestone gathering for the {honoreeLabel.toLowerCase()}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {vibePresets.map((vibe) => {
              const isSelected = profile.atmosphere?.includes(vibe.title);
              return (
                <button
                  type="button"
                  key={vibe.title}
                  onClick={() =>
                    onChangeProfile({
                      ...profile,
                      atmosphere: vibe.title,
                    })
                  }
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "border-[#090909] bg-[#FAF082] shadow-2xs"
                      : "border-[#E7E0D1] hover:border-[#090909] bg-[#FCF7E5]/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#090909]">
                      {vibe.title}
                    </span>
                    {isSelected && <IconSparkle className="w-3.5 h-3.5 text-[#090909]" />}
                  </div>
                  <p className="text-xs text-[#5C584F] leading-snug">
                    {vibe.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Cuisine & Flavors */}
        <div className="space-y-3 border-t border-[#E7E0D1] pt-6">
          <div className="flex items-center gap-2">
            <IconDining className="w-5 h-5 text-[#090909]" />
            <h3 className="font-serif-display text-xl font-bold text-[#090909]">
              Food & Culinary Preferences
            </h3>
          </div>
          <p className="text-xs text-[#5C584F]">
            Tap the cuisine styles, cocktail notes, or bakery treats you'd love featured.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {foodOptions.map((item) => {
              const isSelected = profile.foodPreferences?.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleFoodTagToggle(item)}
                  className={`text-xs px-3.5 py-2 rounded-full border-2 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#090909] text-white border-[#090909] font-bold shadow-2xs"
                      : "bg-white text-[#090909] border-[#E7E0D1] hover:border-[#090909]"
                  }`}
                >
                  <span>{item}</span>
                  {isSelected && <IconSparkle className="w-3 h-3 text-[#FAF082]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Multi-Select Dietary Component with Free-Text Entry for Custom Preferences */}
        <div className="border-t border-[#E7E0D1] pt-6">
          <DietarySelector
            id="customization-dietary-selector"
            selectedTags={profile.dietaryRestrictions || []}
            customNotes={profile.dietaryNotes || ""}
            onChange={(tags, notes, interpreted) => {
              onChangeProfile({
                ...profile,
                dietaryRestrictions: tags,
                dietaryNotes: notes,
                interpretedDietary: interpreted,
              });
            }}
            birthdayPersonLabel={honoreeLabel.toLowerCase()}
            title="Dietary Considerations & Custom Preferences"
            subtitle={`Ensure all guests and the ${honoreeLabel.toLowerCase()} are accommodated.`}
          />
        </div>

        {/* 4. Guest Count & Budget Tier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#E7E0D1] pt-6">
          {/* Guest Count */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#090909] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <IconCelebrant className="w-4 h-4" />
                <span>Guest Count (including {honoreeLabel.toLowerCase()})</span>
              </span>
              <span className="text-xs font-bold bg-[#FAF082] px-2 py-0.5 rounded-md border border-[#090909]">
                {profile.guestCount || 8} People
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {guestCounts.map((g) => (
                <button
                  type="button"
                  key={g.label}
                  onClick={() => onChangeProfile({ ...profile, guestCount: g.count })}
                  className={`text-xs p-2.5 rounded-xl border-2 font-semibold transition-all ${
                    profile.guestCount === g.count
                      ? "border-[#090909] bg-[#090909] text-white"
                      : "border-[#E7E0D1] bg-white text-[#090909] hover:border-[#090909]"
                  }`}
                >
                  {g.label} ({g.count})
                </button>
              ))}
            </div>
          </div>

          {/* Budget Tier */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#090909] flex items-center gap-1.5">
              <IconBudget className="w-4 h-4" />
              <span>Budget Direction</span>
            </label>
            <select
              value={profile.budgetTier || "tier_100_to_300"}
              onChange={(e) =>
                onChangeProfile({
                  ...profile,
                  budgetTier: e.target.value as any,
                })
              }
              className="w-full text-sm font-medium bg-white text-[#090909] border-2 border-[#090909] rounded-xl px-3.5 py-3 outline-none focus:ring-2 focus:ring-[#FAF082]"
            >
              <option value="tier_under_100">Pocket-Friendly Bash (Up to $100 / person)</option>
              <option value="tier_100_to_300">The Sweet Spot ($100 - $300 / person)</option>
              <option value="tier_300_to_600">Elevated Milestone Splurge ($300+ / person)</option>
            </select>
            <p className="text-[11px] text-[#5C584F]">
              Your final plan will include realistic estimates for all 3 tiers.
            </p>
          </div>
        </div>

        {/* 5. Special Birthday Wishes / Notes */}
        <div className="space-y-2 border-t border-[#E7E0D1] pt-6">
          <label
            htmlFor="special-notes-input"
            className="text-xs font-bold uppercase tracking-wider text-[#090909] block"
          >
            Special Wishes, Passions, or Favorite Spots (Optional)
          </label>
          <textarea
            id="special-notes-input"
            rows={2}
            placeholder={`e.g. Loves live jazz horns, prefers outdoor courtyards, favorite color is midnight blue, surprise champagne toast for the ${honoreeLabel.toLowerCase()}...`}
            value={profile.atmosphere ? `${profile.atmosphere}` : ""}
            onChange={(e) =>
              onChangeProfile({
                ...profile,
                atmosphere: e.target.value,
              })
            }
            className="w-full text-sm bg-white text-[#090909] border-2 border-[#090909] rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-[#FAF082] placeholder:text-[#5C584F]/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-[#E7E0D1]">
          <button
            type="button"
            onClick={onBackToLanding}
            className="w-full sm:w-auto text-xs font-bold text-[#5C584F] hover:text-[#090909] px-4 py-3 rounded-full border border-[#E7E0D1] hover:bg-[#FCF7E5] transition-all"
          >
            ← Back to Name / DOB / Location
          </button>

          <button
            id="generate-plan-submit-btn"
            type="button"
            disabled={isLoading}
            onClick={onGeneratePlan}
            className={`w-full sm:w-auto bg-[#090909] text-white font-bold text-base px-8 py-4 rounded-2xl border-2 border-[#090909] transition-all shadow-md flex items-center justify-center gap-3 ${
              isLoading
                ? "opacity-75 cursor-wait"
                : "hover:bg-neutral-800 active:scale-98"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sherpa is Crafting Born Day Plan...</span>
              </>
            ) : (
              <>
                <IconPartyPopper className="w-5 h-5 text-[#FAF082]" />
                <span>Generate Born Day Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
