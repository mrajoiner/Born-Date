import React, { useState, useEffect, useRef } from "react";
import { parseNaturalDob, ParsedDateResult } from "../utils/dateParser";
import { IconCalendarParty } from "./BornDayIcons";
import { Calendar, Type, Check, Sparkles } from "lucide-react";

interface DobSelectorProps {
  id?: string;
  value: string;
  onChange: (value: string, parsed: ParsedDateResult) => void;
  variant?: "hero" | "compact" | "inline";
  label?: string;
  showQuickPills?: boolean;
}

export const DobSelector: React.FC<DobSelectorProps> = ({
  id = "dob-selector",
  value,
  onChange,
  variant = "hero",
  label = "DOB (Date of Birth)",
  showQuickPills = true,
}) => {
  const [activeMode, setActiveMode] = useState<"text" | "calendar">("text");
  const [textInput, setTextInput] = useState<string>(value || "");
  const [parsed, setParsed] = useState<ParsedDateResult>(() => parseNaturalDob(value || ""));
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when external value changes
  useEffect(() => {
    if (value !== textInput) {
      setTextInput(value);
      setParsed(parseNaturalDob(value));
    }
  }, [value]);

  const handleTextChange = (raw: string) => {
    setTextInput(raw);
    const result = parseNaturalDob(raw);
    setParsed(result);
    onChange(raw, result);
  };

  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoVal = e.target.value; // "YYYY-MM-DD"
    if (!isoVal) return;
    const result = parseNaturalDob(isoVal);
    setTextInput(result.displayDate || isoVal);
    setParsed(result);
    onChange(result.displayDate || isoVal, result);
  };

  const handleApplyPreset = (preset: string) => {
    handleTextChange(preset);
  };

  const handleAddYear = (year: number) => {
    if (parsed.month && parsed.day) {
      const updated = `${parsed.monthName} ${parsed.day}, ${year}`;
      handleTextChange(updated);
    }
  };

  const openNativeCalendar = () => {
    const el = dateInputRef.current;
    if (el) {
      try {
        if ("showPicker" in el && typeof (el as any).showPicker === "function") {
          (el as any).showPicker();
        } else {
          el.focus();
        }
      } catch {
        try {
          el.focus();
        } catch {
          // ignore
        }
      }
    }
  };

  return (
    <div className="space-y-2">
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={`${id}-input`}
          className="text-xs font-bold uppercase tracking-wider text-[#090909] flex items-center gap-2"
        >
          <IconCalendarParty className="w-4 h-4 text-[#090909]" />
          <span>{label}</span>
        </label>

        {/* Calendar vs Text Mode Toggle */}
        <div className="inline-flex items-center p-0.5 bg-[#FAF082]/40 rounded-xl border border-[#090909] text-xs font-semibold">
          <button
            type="button"
            id={`${id}-mode-text-btn`}
            onClick={() => setActiveMode("text")}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              activeMode === "text"
                ? "bg-[#090909] text-white shadow-xs"
                : "text-[#090909] hover:bg-white/60"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Open Text</span>
          </button>
          <button
            type="button"
            id={`${id}-mode-calendar-btn`}
            onClick={() => {
              setActiveMode("calendar");
              setTimeout(openNativeCalendar, 50);
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              activeMode === "calendar"
                ? "bg-[#090909] text-white shadow-xs"
                : "text-[#090909] hover:bg-white/60"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar Selector</span>
          </button>
        </div>
      </div>

      {/* Hidden Native Date Input for Calendar Picker */}
      <input
        ref={dateInputRef}
        type="date"
        id={`${id}-native-date`}
        value={parsed.formattedIso || ""}
        onChange={handleCalendarChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Active Input Controls */}
      {activeMode === "text" ? (
        <div className="relative">
          <input
            id={`${id}-input`}
            type="text"
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="e.g. june 8th, 6 mar, 11/7, or 04/21/1973"
            className="w-full bg-white text-[#090909] text-base px-4 py-3.5 pr-12 rounded-2xl border-2 border-[#090909] focus:bg-[#FAF082]/10 focus:ring-2 focus:ring-[#090909] transition-all font-medium placeholder:text-[#5C584F]/60"
          />
          {/* Quick Calendar Popout Icon inside input */}
          <button
            type="button"
            id={`${id}-inline-calendar-trigger`}
            title="Open calendar picker"
            onClick={openNativeCalendar}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-[#090909] hover:bg-[#FAF082] transition-colors"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-[#090909] flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF082] border border-[#090909] flex items-center justify-center text-[#090909]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-[#5C584F]">Selected Date</p>
              <p className="text-base font-bold text-[#090909]">
                {parsed.isValid ? parsed.displayDate : "Click to select a date"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id={`${id}-calendar-open-btn`}
              onClick={openNativeCalendar}
              className="px-4 py-2 bg-[#FAF082] hover:bg-[#F3E768] text-[#090909] font-bold text-xs uppercase tracking-wider rounded-xl border border-[#090909] flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Choose Date</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("text")}
              className="px-3 py-2 text-xs font-semibold text-[#5C584F] hover:text-[#090909] underline"
            >
              Or type text
            </button>
          </div>
        </div>
      )}

      {/* Real-time System Interpretation Banner */}
      {parsed.isValid ? (
        <div className="bg-[#FAF082]/30 rounded-xl border border-[#090909] p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-[#090909]">
            <span className="w-4 h-4 rounded-full bg-[#090909] text-white flex items-center justify-center text-[10px]">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>
              Interpreted: <strong className="font-bold underline decoration-[#090909] decoration-1">{parsed.displayDate}</strong>
            </span>
          </div>

          {parsed.ageTurning !== undefined ? (
            <span className="bg-[#FAF082] px-2.5 py-0.5 rounded-full border border-[#090909] font-bold text-[#090909]">
              {parsed.ageTurning} years young!
            </span>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-[#5C584F]">
              <span>Milestone:</span>
              {[1973, 1985, 1996, 2005].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleAddYear(yr)}
                  className="px-1.5 py-0.5 rounded bg-white hover:bg-[#FAF082] border border-[#090909] font-bold text-[#090909] transition-colors"
                >
                  +{yr} ({2026 - yr}y)
                </button>
              ))}
            </div>
          )}
        </div>
      ) : textInput.trim().length > 0 ? (
        <p className="text-[11px] text-[#5C584F] italic flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#090909]" />
          <span>Type naturally like "june 8th", "6 mar", "11/7", or click the calendar.</span>
        </p>
      ) : null}

      {/* Quick Example Pills */}
      {showQuickPills && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-[#5C584F] font-medium">Examples:</span>
          {[
            { label: "june 8th", val: "june 8th" },
            { label: "6 mar", val: "6 mar" },
            { label: "11/7", val: "11/7" },
            { label: "04/21/1973", val: "04/21/1973" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleApplyPreset(item.val)}
              className="px-2 py-0.5 rounded-lg bg-[#FAF082]/20 hover:bg-[#FAF082] text-[#090909] border border-[#090909]/40 font-mono text-[10px] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
