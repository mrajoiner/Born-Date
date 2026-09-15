// Date of Birth Parser & Interpreter
export interface ParsedDateResult {
  isValid: boolean;
  raw: string;
  month?: number; // 1-12
  monthName?: string;
  day?: number; // 1-31
  year?: number; // e.g. 1985
  ageTurning?: number;
  formattedIso?: string; // YYYY-MM-DD if year present
  displayDate: string; // e.g. "June 8, 1985" or "June 8"
  interpretationNote?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_MAP: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

export function parseNaturalDob(input: string, currentYear: number = 2026): ParsedDateResult {
  if (!input || !input.trim()) {
    return { isValid: false, raw: input, displayDate: "" };
  }

  const raw = input.trim();
  // Strip ordinal suffixes: 1st, 2nd, 3rd, 4th, etc.
  const cleaned = raw.toLowerCase().replace(/(\d+)(st|nd|rd|th)\b/g, "$1");

  let month: number | undefined;
  let day: number | undefined;
  let year: number | undefined;

  // 1. ISO format: YYYY-MM-DD
  const isoMatch = cleaned.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    month = parseInt(isoMatch[2], 10);
    day = parseInt(isoMatch[3], 10);
  }

  // 2. Month name formats: e.g. "june 8", "june 8 1985", "june 8, 1985", "8 june", "8 june 1985", "6 mar", "mar 6"
  if (!month) {
    // Check if contains a month name word
    const monthRegex = /\b(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sept|sep|october|oct|november|nov|december|dec)\b/i;
    const match = cleaned.match(monthRegex);
    if (match) {
      const monthWord = match[1].toLowerCase();
      month = MONTH_MAP[monthWord];

      // Remove the month word and inspect the remaining numbers
      const rest = cleaned.replace(match[0], " ").trim();
      const numbers = rest.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        if (numbers.length === 1) {
          day = parseInt(numbers[0], 10);
        } else if (numbers.length >= 2) {
          // One is day, one is year
          const n1 = parseInt(numbers[0], 10);
          const n2 = parseInt(numbers[1], 10);
          if (n1 > 31) {
            year = n1;
            day = n2;
          } else if (n2 > 31) {
            day = n1;
            year = n2;
          } else {
            day = n1;
            // 2-digit year like 85 -> 1985
            year = n2 < 30 ? 2000 + n2 : 1900 + n2;
          }
        }
      }
    }
  }

  // 3. Numeric slash / dash formats: "11/7", "11/7/1985", "11-7-85", "04/21/1973", "6/8"
  if (!month) {
    const slashMatch = cleaned.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);
    if (slashMatch) {
      const p1 = parseInt(slashMatch[1], 10);
      const p2 = parseInt(slashMatch[2], 10);
      const p3 = slashMatch[3] ? parseInt(slashMatch[3], 10) : undefined;

      // In US format: MM/DD or MM/DD/YYYY
      if (p1 <= 12 && p2 <= 31) {
        month = p1;
        day = p2;
      } else if (p2 <= 12 && p1 <= 31) {
        // e.g. 25/12
        month = p2;
        day = p1;
      } else {
        month = p1;
        day = p2;
      }

      if (p3 !== undefined) {
        if (p3 < 100) {
          year = p3 <= 26 ? 2000 + p3 : 1900 + p3;
        } else {
          year = p3;
        }
      }
    }
  }

  // Validate bounds
  if (month && (month < 1 || month > 12)) month = undefined;
  if (day && (day < 1 || day > 31)) day = undefined;
  if (year && (year < 1900 || year > currentYear)) year = undefined;

  if (!month || !day) {
    return {
      isValid: false,
      raw,
      displayDate: raw,
      interpretationNote: "Type a date like 'June 8th', '6 Mar', '11/7', or pick on the calendar."
    };
  }

  const monthName = MONTH_NAMES[month - 1];
  let ageTurning: number | undefined;
  let formattedIso: string | undefined;
  let displayDate = "";

  if (year) {
    ageTurning = currentYear - year;
    formattedIso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    displayDate = `${monthName} ${day}, ${year}`;
  } else {
    displayDate = `${monthName} ${day}`;
  }

  return {
    isValid: true,
    raw,
    month,
    monthName,
    day,
    year,
    ageTurning,
    formattedIso,
    displayDate,
    interpretationNote: year
      ? `Interpreted: ${displayDate} (${ageTurning} years young!)`
      : `Interpreted: ${displayDate}`
  };
}
