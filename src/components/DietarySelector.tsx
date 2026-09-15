import React, { useState, useEffect } from "react";
import { interpretDietary, InterpretedDietaryResult } from "../utils/dietaryParser";
import { IconCakeSlice } from "./BornDayIcons";
import { Sparkles, Check, AlertCircle, Plus, X, Heart } from "lucide-react";

interface DietarySelectorProps {
  id?: string;
  selectedTags: string[];
  customNotes?: string;
  onChange: (tags: string[], notes: string, interpreted: string[]) => void;
  title?: string;
  subtitle?: string;
  birthdayPersonLabel?: string; // "birthday boy or birthday girl"
  compact?: boolean;
}

const COMMON_DIETARY_OPTIONS = [
  { id: "none", label: "No Restrictions", group: "General" },
  { id: "vegetarian", label: "Vegetarian", group: "Diets" },
  { id: "vegan", label: "Vegan (Plant-Based)", group: "Diets" },
  { id: "pescatarian", label: "Pescatarian", group: "Diets" },
  { id: "gluten-free", label: "Gluten-Free", group: "Allergies" },
  { id: "celiac", label: "Celiac (Strict Gluten-Free)", group: "Allergies" },
  { id: "dairy-free", label: "Dairy-Free / Lactose Intolerant", group: "Allergies" },
  { id: "peanut-allergy", label: "Peanut Allergy", group: "Allergies" },
  { id: "tree-nut-allergy", label: "Tree Nut Allergy", group: "Allergies" },
  { id: "shellfish-allergy", label: "Shellfish Allergy", group: "Allergies" },
  { id: "halal", label: "Halal", group: "Cultural" },
  { id: "kosher", label: "Kosher", group: "Cultural" },
  { id: "no-pork", label: "No Pork", group: "Preferences" },
  { id: "no-beef", label: "No Beef", group: "Preferences" },
  { id: "keto", label: "Keto / Low-Carb", group: "Diets" },
  { id: "no-mushrooms", label: "No Mushrooms", group: "Preferences" },
  { id: "no-cilantro", label: "No Cilantro", group: "Preferences" },
  { id: "no-onions-garlic", label: "Low FODMAP / No Garlic & Onion", group: "Allergies" },
  { id: "mocktails", label: "Mocktails / Non-Alcoholic Focus", group: "Beverages" },
];

const SUGGESTED_NOTES = [
  "Loves spicy food",
  "Mild spice only",
  "Celiac-safe kitchen required",
  "Loves rich chocolate cakes",
  "Extra lemon & citrus desserts",
  "Craft mocktails for everyone",
];

export const DietarySelector: React.FC<DietarySelectorProps> = ({
  id = "dietary-selector",
  selectedTags = [],
  customNotes = "",
  onChange,
  title = "Dietary Restrictions & Custom Preferences",
  subtitle,
  birthdayPersonLabel = "birthday boy or birthday girl",
  compact = false,
}) => {
  const [notes, setNotes] = useState(customNotes || "");
  const [tags, setTags] = useState<string[]>(selectedTags || []);
  const [interpreted, setInterpreted] = useState<InterpretedDietaryResult>(() =>
    interpretDietary(selectedTags || [], customNotes || "")
  );

  // Sync with prop updates
  useEffect(() => {
    setTags(selectedTags || []);
    setNotes(customNotes || "");
    const res = interpretDietary(selectedTags || [], customNotes || "");
    setInterpreted(res);
  }, [selectedTags, customNotes]);

  const handleToggleTag = (tagLabel: string) => {
    let updated: string[];

    if (tagLabel === "No Restrictions") {
      // Toggle No Restrictions clears others, or unchecks it
      if (tags.includes("No Restrictions")) {
        updated = [];
      } else {
        updated = ["No Restrictions"];
      }
    } else {
      // If adding a restriction, remove "No Restrictions"
      const withoutNone = tags.filter((t) => t !== "No Restrictions");
      if (withoutNone.includes(tagLabel)) {
        updated = withoutNone.filter((t) => t !== tagLabel);
      } else {
        updated = [...withoutNone, tagLabel];
      }
    }

    setTags(updated);
    const result = interpretDietary(updated, notes);
    setInterpreted(result);
    onChange(updated, notes, result.allTags);
  };

  const handleNotesChange = (text: string) => {
    setNotes(text);
    const result = interpretDietary(tags, text);
    setInterpreted(result);
    onChange(tags, text, result.allTags);
  };

  const handleAddQuickNote = (noteText: string) => {
    const newNotes = notes.trim().length > 0 ? `${notes.trim()}, ${noteText}` : noteText;
    handleNotesChange(newNotes);
  };

  return (
    <div id={id} className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconCakeSlice className="w-5 h-5 text-[#090909]" />
          <h3 className="font-serif-display text-lg sm:text-xl font-bold text-[#090909]">
            {title}
          </h3>
        </div>
        <span className="text-xs text-[#5C584F] font-medium">
          {subtitle || `Ensure all guests and the ${birthdayPersonLabel} are accommodated.`}
        </span>
      </div>

      {/* Multi-Select Dietary Chips */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#090909] flex items-center justify-between">
          <span>Select Common Dietary Requirements (Multi-Select)</span>
          {tags.length > 0 && tags[0] !== "No Restrictions" && (
            <button
              type="button"
              onClick={() => handleToggleTag("No Restrictions")}
              className="text-[11px] font-semibold text-[#5C584F] hover:text-[#090909] underline"
            >
              Reset to No Restrictions
            </button>
          )}
        </label>

        <div className="flex flex-wrap gap-2 pt-1">
          {COMMON_DIETARY_OPTIONS.map((opt) => {
            const isSelected =
              opt.label === "No Restrictions"
                ? tags.length === 0 || tags.includes("No Restrictions")
                : tags.includes(opt.label);

            const isAllergy = opt.group === "Allergies";

            return (
              <button
                type="button"
                key={opt.id}
                id={`${id}-opt-${opt.id}`}
                onClick={() => handleToggleTag(opt.label)}
                className={`text-xs px-3 py-2 rounded-xl border-2 font-semibold transition-all flex items-center gap-1.5 active:scale-95 ${
                  isSelected
                    ? isAllergy
                      ? "bg-[#090909] text-white border-[#090909] shadow-sm"
                      : "bg-[#FAF082] text-[#090909] border-[#090909] shadow-sm"
                    : "bg-white text-[#5C584F] border-[#E7E0D1] hover:border-[#090909] hover:text-[#090909]"
                }`}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 opacity-50" />
                )}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Free-Text Entry for Custom Preferences & Allergies */}
      <div className="space-y-2 pt-2 border-t border-[#E7E0D1]">
        <label
          htmlFor={`${id}-notes-input`}
          className="text-xs font-bold uppercase tracking-wider text-[#090909] flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#FD9773]" />
            <span>Custom Preferences, Specific Allergies & Craved Flavors (Free-Text)</span>
          </span>
          <span className="text-[11px] text-[#5C584F] font-normal">
            Type anything in your own words
          </span>
        </label>

        <div className="relative">
          <textarea
            id={`${id}-notes-input`}
            rows={compact ? 2 : 3}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder={`e.g. Loves fiery spicy jerk seasoning, allergic to strawberries, no raw red onions, must have a gluten-free cake slice for the ${birthdayPersonLabel}.`}
            className="w-full bg-white text-[#090909] text-sm p-3.5 rounded-2xl border-2 border-[#090909] focus:bg-[#FAF082]/10 focus:ring-2 focus:ring-[#090909] outline-none transition-all placeholder:text-[#5C584F]/50 resize-none font-medium"
          />
          {notes.trim().length > 0 && (
            <button
              type="button"
              onClick={() => handleNotesChange("")}
              className="absolute right-3 top-3 text-[#5C584F] hover:text-[#090909] p-1 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Clear custom notes"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
          <span className="text-[#5C584F] font-medium">Quick Suggestions:</span>
          {SUGGESTED_NOTES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleAddQuickNote(s)}
              className="px-2 py-0.5 rounded-lg bg-[#FCF7E5] hover:bg-[#FAF082] text-[#090909] border border-[#090909]/40 font-medium transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Dietary & Preference Interpreter Feedback */}
      {(interpreted.allTags.length > 0 || notes.trim().length > 0) && (
        <div className="bg-[#FCF7E5] rounded-2xl border-2 border-[#090909] p-3.5 space-y-2 text-xs shadow-xs animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#090909]">
              <Sparkles className="w-4 h-4 text-[#090909]" />
              <span>Interpreted Dining Profile</span>
            </div>
            <span className="text-[11px] font-semibold text-[#1B3B2B] bg-[#FAF082] px-2 py-0.5 rounded-md border border-[#090909]">
              Checked against local restaurant data
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {interpreted.strictAllergies.map((tag) => (
              <span
                key={tag}
                className="bg-red-50 text-red-800 border border-red-300 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs"
              >
                <AlertCircle className="w-3 h-3 text-red-600" />
                <span>Strict Allergy: {tag}</span>
              </span>
            ))}

            {interpreted.preferencesAndAvoids.map((tag) => (
              <span
                key={tag}
                className="bg-white text-[#090909] border border-[#090909] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs"
              >
                <Check className="w-3 h-3 text-[#1B3B2B]" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {notes.trim().length > 0 && (
            <p className="text-[11px] text-[#5C584F] italic border-t border-[#E7E0D1] pt-1.5">
              <span className="font-semibold not-italic text-[#090909]">Custom notes logged: </span>
              "{notes.trim()}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};
