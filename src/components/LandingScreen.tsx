import React, { useState } from "react";
import { UserProfile } from "../types";
import { DuoGuide } from "./CelebrationSherpas";
import { CalendarDatePicker } from "./CalendarDatePicker";
import { DietarySelector } from "./DietarySelector";
import { parseNaturalDob } from "../utils/dateParser";
import {
  IconCelebrant,
  IconMapPin,
  IconSparkle,
  IconCompass,
} from "./BornDayIcons";

interface LandingScreenProps {
  profile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
  onContinueToCustomizations: () => void;
}

interface ValidationErrors {
  fullName?: string;
  dob?: string;
  location?: string;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  profile,
  onChangeProfile,
  onContinueToCustomizations,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const honoreeLabel =
    profile.honoreeRole === "boy"
      ? "Birthday Boy"
      : profile.honoreeRole === "girl"
      ? "Birthday Girl"
      : "Birthday Boy or Birthday Girl";

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!profile.fullName || profile.fullName.trim().length === 0) {
      newErrors.fullName = `Please enter the ${honoreeLabel.toLowerCase()}'s name.`;
    }

    if (!profile.dob || profile.dob.trim().length === 0) {
      newErrors.dob = `Please enter the ${honoreeLabel.toLowerCase()}'s date of birth or pick a date on the calendar.`;
    } else {
      const parsed = parseNaturalDob(profile.dob);
      if (!parsed.isValid) {
        newErrors.dob = "Please enter a recognizable date (e.g. 'June 8th', '6 Mar', '11/7', or pick on the calendar).";
      }
    }

    if (!profile.location || profile.location.trim().length === 0) {
      newErrors.location = "Please enter a city, town, or location.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, dob: true, location: true });
    if (validate()) {
      onContinueToCustomizations();
    }
  };

  return (
    <section id="landing-intake-section" className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Screen 1: Miles (guy) and Arlo (girl) stick figures with detailed faces holding signs */}
      <DuoGuide
        speechText="Yo, we are throwing out the rulebook and building a birthday that you will never, ever forget."
      />

      {/* Main Card */}
      <div className="bg-white rounded-3xl border-2 border-[#090909] p-6 sm:p-10 shadow-sm relative">
        {/* Simple & Bold Heading */}
        <div className="text-center pb-8 border-b border-[#E7E0D1] space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5C584F]">
            <IconSparkle className="w-3.5 h-3.5 text-[#090909]" />
            <span>Step 1 of 2</span>
            <IconSparkle className="w-3.5 h-3.5 text-[#090909]" />
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#090909] tracking-tight">
            Let's Plan a Birthday!
          </h1>
          <p className="text-sm text-[#5C584F] max-w-lg mx-auto leading-relaxed font-medium">
            Drop the details below and we will customize your theme, cuisine, vibe, and schedule so it actually works.
          </p>

          {/* Birthday Boy / Birthday Girl Selector Toggle */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-[#5C584F] uppercase tracking-wider mr-1">
              Celebrating:
            </span>
            <button
              type="button"
              id="role-boy-btn"
              onClick={() => onChangeProfile({ ...profile, honoreeRole: "boy" })}
              className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                profile.honoreeRole === "boy"
                  ? "bg-[#090909] text-white border-[#090909] shadow-xs"
                  : "bg-white text-[#090909] border-[#E7E0D1] hover:border-[#090909]"
              }`}
            >
              <span>🎂 Birthday Boy</span>
            </button>
            <button
              type="button"
              id="role-girl-btn"
              onClick={() => onChangeProfile({ ...profile, honoreeRole: "girl" })}
              className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                profile.honoreeRole === "girl"
                  ? "bg-[#090909] text-white border-[#090909] shadow-xs"
                  : "bg-white text-[#090909] border-[#E7E0D1] hover:border-[#090909]"
              }`}
            >
              <span>🎈 Birthday Girl</span>
            </button>
            <button
              type="button"
              id="role-either-btn"
              onClick={() => onChangeProfile({ ...profile, honoreeRole: "either" })}
              className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                !profile.honoreeRole || profile.honoreeRole === "either"
                  ? "bg-[#FAF082] text-[#090909] border-[#090909] shadow-xs"
                  : "bg-white text-[#5C584F] border-[#E7E0D1] hover:border-[#090909]"
              }`}
            >
              <span>🌟 Birthday Boy or Birthday Girl</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} noValidate className="pt-8 space-y-7">
          <div className="space-y-6">
            {/* 1. Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="birthday-name-input"
                className="text-xs font-bold uppercase tracking-wider text-[#090909] flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <IconCelebrant className="w-4 h-4 text-[#090909]" />
                  <span>{honoreeLabel}'s Name</span>
                </span>
                <span className="text-xs text-[#5C584F] font-normal">Who are we celebrating?</span>
              </label>
              <div className="relative">
                <input
                  id="birthday-name-input"
                  type="text"
                  required
                  placeholder="e.g. Ray Simpson"
                  value={profile.fullName}
                  onChange={(e) => {
                    onChangeProfile({ ...profile, fullName: e.target.value });
                    if (errors.fullName) validate();
                  }}
                  onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
                  className={`w-full bg-white text-[#090909] text-base px-4 py-3.5 rounded-2xl border-2 ${
                    touched.fullName && errors.fullName
                      ? "border-red-600 focus:ring-2 focus:ring-red-200"
                      : "border-[#090909] focus:bg-[#FAF082]/10 focus:ring-2 focus:ring-[#090909]"
                  } outline-none transition-all placeholder:text-[#5C584F]/50`}
                />
              </div>
              {touched.fullName && errors.fullName && (
                <p id="error-name" className="text-xs text-red-600 font-semibold mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* 2. User-Friendly Calendar Date Picker */}
            <div>
              <CalendarDatePicker
                id="birthday-dob-picker"
                value={profile.dob}
                onChange={(val) => {
                  onChangeProfile({ ...profile, dob: val });
                  if (errors.dob) validate();
                }}
                label={`${honoreeLabel}'s Date of Birth`}
                helperText="Click to open interactive calendar or type naturally"
                placeholder="e.g. June 8, 1996 or click calendar"
                showQuickPills={true}
              />
              {touched.dob && errors.dob && (
                <p id="error-dob" className="text-xs text-red-600 font-semibold mt-1">
                  {errors.dob}
                </p>
              )}
            </div>

            {/* 3. Location */}
            <div className="space-y-1.5">
              <label
                htmlFor="birthday-location-input"
                className="text-xs font-bold uppercase tracking-wider text-[#090909] flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <IconMapPin className="w-4 h-4 text-[#090909]" />
                  <span>Celebration Location</span>
                </span>
                <span className="text-xs text-[#5C584F] font-normal">
                  Where are we celebrating the {honoreeLabel.toLowerCase()}?
                </span>
              </label>
              <div className="relative">
                <input
                  id="birthday-location-input"
                  type="text"
                  required
                  placeholder="e.g. New Orleans, LA"
                  value={profile.location}
                  onChange={(e) => {
                    onChangeProfile({ ...profile, location: e.target.value });
                    if (errors.location) validate();
                  }}
                  onBlur={() => setTouched((p) => ({ ...p, location: true }))}
                  className={`w-full bg-white text-[#090909] text-base px-4 py-3.5 rounded-2xl border-2 ${
                    touched.location && errors.location
                      ? "border-red-600 focus:ring-2 focus:ring-red-200"
                      : "border-[#090909] focus:bg-[#FAF082]/10 focus:ring-2 focus:ring-[#090909]"
                  } outline-none transition-all placeholder:text-[#5C584F]/50`}
                />
              </div>
              {touched.location && errors.location ? (
                <p id="error-location" className="text-xs text-red-600 font-semibold mt-1">
                  {errors.location}
                </p>
              ) : (
                <p className="text-[11px] text-[#5C584F]">
                  Used to check verified restaurant ratings, top-reviewed local bakeries, and venues for the {honoreeLabel.toLowerCase()}.
                </p>
              )}
            </div>

            {/* 4. Multi-Select Dietary Component with Free-Text Entry for Custom Preferences */}
            <div className="pt-4 border-t border-[#E7E0D1]">
              <DietarySelector
                id="landing-dietary-selector"
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
                title="Dietary Restrictions & Custom Food Preferences"
                subtitle={`Ensure all guests and the ${honoreeLabel.toLowerCase()} dine safely and deliciously.`}
                compact={true}
              />
            </div>
          </div>

          {/* Action Button: Continue to Customizations */}
          <div className="pt-4">
            <button
              id="continue-to-customizations-btn"
              type="submit"
              className="w-full bg-[#090909] text-white hover:bg-neutral-800 active:scale-[0.99] font-bold text-base py-4 px-6 rounded-2xl border-2 border-[#090909] transition-all shadow-md flex items-center justify-center gap-3"
            >
              <span>Continue to Customizations</span>
              <IconCompass className="w-5 h-5 text-[#FAF082]" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
