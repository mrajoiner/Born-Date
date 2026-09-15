import React, { useState, useEffect, useRef } from "react";
import { parseNaturalDob, ParsedDateResult } from "../utils/dateParser";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Type,
  X,
} from "lucide-react";
import { IconCalendarParty } from "./BornDayIcons";

interface CalendarDatePickerProps {
  id?: string;
  value: string;
  onChange: (value: string, parsed: ParsedDateResult) => void;
  label?: string;
  helperText?: string;
  placeholder?: string;
  showQuickPills?: boolean;
  minYear?: number;
  maxYear?: number;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  id = "calendar-date-picker",
  value,
  onChange,
  label = "Birthday Boy or Birthday Girl's Date of Birth",
  helperText = "Pick on the calendar or type naturally (e.g. 'June 8th', '11/7/1985')",
  placeholder = "e.g. June 8, 1996 or click calendar",
  showQuickPills = true,
  minYear = 1920,
  maxYear = 2026,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [textInput, setTextInput] = useState(value || "");
  const [parsed, setParsed] = useState<ParsedDateResult>(() => parseNaturalDob(value || ""));

  // Calendar navigation state (year & month)
  const today = new Date();
  const initialYear = parsed.year || 1996;
  const initialMonth = (parsed.month ? parsed.month - 1 : today.getMonth());
  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewMonth, setViewMonth] = useState<number>(initialMonth);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with prop changes
  useEffect(() => {
    if (value !== textInput) {
      setTextInput(value);
      const res = parseNaturalDob(value);
      setParsed(res);
      if (res.year) setViewYear(res.year);
      if (res.month) setViewMonth(res.month - 1);
    }
  }, [value]);

  // Close calendar popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleTextChange = (raw: string) => {
    setTextInput(raw);
    const res = parseNaturalDob(raw);
    setParsed(res);
    if (res.isValid) {
      if (res.year) setViewYear(res.year);
      if (res.month) setViewMonth(res.month - 1);
    }
    onChange(raw, res);
  };

  const handleSelectDay = (day: number) => {
    const monthName = MONTH_NAMES[viewMonth];
    const formatted = `${monthName} ${day}, ${viewYear}`;
    setTextInput(formatted);
    const res = parseNaturalDob(formatted);
    setParsed(res);
    onChange(formatted, res);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => Math.max(minYear, prev - 1));
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => Math.min(maxYear, prev + 1));
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleYearChange = (newYear: number) => {
    setViewYear(newYear);
    if (parsed.month && parsed.day) {
      const formatted = `${MONTH_NAMES[viewMonth]} ${parsed.day}, ${newYear}`;
      setTextInput(formatted);
      const res = parseNaturalDob(formatted);
      setParsed(res);
      onChange(formatted, res);
    }
  };

  // Generate calendar grid days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Generate Year options
  const yearOptions: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    yearOptions.push(y);
  }

  // Quick preset pills
  const presetPills = [
    { label: "June 8, 1996", val: "June 8, 1996" },
    { label: "March 15, 1985", val: "March 15, 1985" },
    { label: "Nov 7, 1973", val: "Nov 7, 1973" },
    { label: "April 20, 2000", val: "April 20, 2000" },
  ];

  return (
    <div ref={containerRef} className="space-y-2 relative">
      {/* Label and Helper */}
      <div className="flex flex-wrap items-center justify-between gap-1">
        <label
          htmlFor={`${id}-input`}
          className="text-xs font-bold uppercase tracking-wider text-[#090909] flex items-center gap-2"
        >
          <IconCalendarParty className="w-4 h-4 text-[#090909]" />
          <span>{label}</span>
        </label>
        <span className="text-[11px] text-[#5C584F] font-normal">
          {helperText}
        </span>
      </div>

      {/* Main Input with Calendar Toggle Button */}
      <div className="relative">
        <input
          id={`${id}-input`}
          ref={inputRef}
          type="text"
          value={textInput}
          onChange={(e) => handleTextChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-white text-[#090909] text-base px-4 py-3.5 pr-24 rounded-2xl border-2 border-[#090909] focus:bg-[#FAF082]/10 focus:ring-2 focus:ring-[#090909] outline-none transition-all font-medium placeholder:text-[#5C584F]/50 shadow-2xs"
        />

        {/* Clear & Calendar action buttons */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {textInput.trim().length > 0 && (
            <button
              type="button"
              onClick={() => handleTextChange("")}
              className="p-1.5 rounded-lg text-[#5C584F] hover:text-[#090909] hover:bg-neutral-100 transition-colors"
              title="Clear date"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            id={`${id}-calendar-toggle`}
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
              isOpen
                ? "bg-[#090909] text-white border-[#090909]"
                : "bg-[#FAF082] text-[#090909] border-[#090909] hover:bg-[#F3E768]"
            }`}
            title="Open interactive calendar date picker"
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase hidden sm:inline">
              {isOpen ? "Close" : "Calendar"}
            </span>
          </button>
        </div>
      </div>

      {/* Live Interpretation Badge */}
      {parsed.isValid ? (
        <div className="bg-[#FAF082]/30 rounded-xl border border-[#090909] px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-[#090909]">
            <span className="w-4 h-4 rounded-full bg-[#090909] text-white flex items-center justify-center text-[10px]">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>
              Confirmed: <strong className="font-bold underline decoration-[#090909]">{parsed.displayDate}</strong>
            </span>
          </div>

          {parsed.ageTurning !== undefined ? (
            <span className="bg-[#FAF082] px-2.5 py-0.5 rounded-full border border-[#090909] font-bold text-[#090909]">
              Turning {parsed.ageTurning} in 2026!
            </span>
          ) : (
            <span className="text-[11px] text-[#5C584F]">
              (Select year in calendar to calculate milestone age)
            </span>
          )}
        </div>
      ) : textInput.trim().length > 0 ? (
        <p className="text-[11px] text-[#5C584F] italic flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#090909]" />
          <span>Type naturally like "june 8th", "6 mar", "11/7", or click the calendar.</span>
        </p>
      ) : null}

      {/* Interactive Calendar Popover */}
      {isOpen && (
        <div
          id={`${id}-calendar-popover`}
          className="absolute z-50 left-0 right-0 sm:right-auto sm:w-[350px] mt-1 bg-white rounded-3xl border-2 border-[#090909] p-4 shadow-xl animate-fadeIn space-y-4"
        >
          {/* Calendar Header: Month and Year Navigators */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D1]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-neutral-100 text-[#090909] transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-neutral-100 text-[#090909] transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Month & Year Selectors */}
            <div className="flex items-center gap-1.5">
              <select
                aria-label="Select month"
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="bg-[#FCF7E5] text-[#090909] font-bold text-xs px-2.5 py-1.5 rounded-xl border border-[#090909] focus:outline-none cursor-pointer"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                aria-label="Select year"
                value={viewYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="bg-[#FAF082] text-[#090909] font-bold text-xs px-2.5 py-1.5 rounded-xl border border-[#090909] focus:outline-none cursor-pointer"
              >
                {yearOptions.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="text-[11px] font-bold text-[#5C584F] uppercase py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty offset spaces */}
            {Array.from({ length: firstDay }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-9" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isSelected =
                parsed.isValid &&
                parsed.day === dayNum &&
                parsed.month === viewMonth + 1 &&
                (parsed.year ? parsed.year === viewYear : true);

              return (
                <button
                  type="button"
                  key={dayNum}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#090909] text-[#FAF082] font-bold shadow-sm scale-105 border border-[#090909]"
                      : "hover:bg-[#FAF082] text-[#090909] hover:font-bold"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Calendar Footer Actions */}
          <div className="pt-2 border-t border-[#E7E0D1] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
                handleSelectDay(now.getDate());
              }}
              className="font-bold text-[#090909] hover:underline"
            >
              Select Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-lg bg-[#090909] text-white font-bold hover:bg-neutral-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Quick Example Presets */}
      {showQuickPills && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-[#5C584F] font-medium">Quick Presets:</span>
          {presetPills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={() => handleTextChange(pill.val)}
              className="px-2 py-0.5 rounded-lg bg-[#FAF082]/20 hover:bg-[#FAF082] text-[#090909] border border-[#090909]/40 font-medium text-[11px] transition-colors"
            >
              {pill.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
