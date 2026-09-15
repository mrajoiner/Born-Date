// Dietary Requirements Parser & Interpreter

export interface InterpretedDietaryResult {
  allTags: string[];
  strictAllergies: string[];
  preferencesAndAvoids: string[];
  summary: string;
  hasInput: boolean;
}

interface DietaryPattern {
  id: string;
  label: string;
  isAllergy?: boolean;
  regex: RegExp;
}

const DIETARY_PATTERNS: DietaryPattern[] = [
  {
    id: "celiac",
    label: "Celiac (Strict Gluten-Free)",
    isAllergy: true,
    regex: /\b(celiac|coeliac)\b/i,
  },
  {
    id: "gluten-free",
    label: "Gluten-Free",
    regex: /\b(gluten[- ]?free|no gluten|gf|wheat[- ]?free)\b/i,
  },
  {
    id: "peanut-allergy",
    label: "Peanut Allergy (Strict)",
    isAllergy: true,
    regex: /\b(peanut(s)?|severe peanut)\b/i,
  },
  {
    id: "tree-nut-allergy",
    label: "Tree Nut Allergy",
    isAllergy: true,
    regex: /\b(tree nut(s)?|almond(s)?|walnut(s)?|cashew(s)?|pecan(s)?|pistachio(s)?)\b/i,
  },
  {
    id: "shellfish-allergy",
    label: "Shellfish Allergy",
    isAllergy: true,
    regex: /\b(shellfish|shrimp|crab|lobster|oyster(s)?|clam(s)?|mussel(s)?)\b/i,
  },
  {
    id: "dairy-free",
    label: "Dairy-Free / Lactose Intolerant",
    regex: /\b(dairy[- ]?free|lactose|no dairy|no milk|oat milk|almond milk)\b/i,
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
    regex: /\b(vegetarian|veggie|no meat)\b/i,
  },
  {
    id: "vegan",
    label: "Vegan (Plant-Based)",
    regex: /\b(vegan|plant[- ]?based)\b/i,
  },
  {
    id: "pescatarian",
    label: "Pescatarian",
    regex: /\b(pescatarian|pescetarian|fish only)\b/i,
  },
  {
    id: "halal",
    label: "Halal",
    regex: /\b(halal|zabiha)\b/i,
  },
  {
    id: "kosher",
    label: "Kosher",
    regex: /\b(kosher)\b/i,
  },
  {
    id: "no-pork",
    label: "No Pork / Bacon",
    regex: /\b(no pork|no bacon|pork[- ]?free)\b/i,
  },
  {
    id: "no-beef",
    label: "No Beef",
    regex: /\b(no beef|beef[- ]?free)\b/i,
  },
  {
    id: "no-mushrooms",
    label: "No Mushrooms",
    regex: /\b(no mushroom(s)?|mushroom allergy|hate mushroom(s)?)\b/i,
  },
  {
    id: "no-cilantro",
    label: "No Cilantro",
    regex: /\b(no cilantro|coriander allergy|soap cilantro)\b/i,
  },
  {
    id: "no-onions-garlic",
    label: "Low FODMAP / No Onion & Garlic",
    regex: /\b(no onion(s)?|no garlic|fodmap)\b/i,
  },
  {
    id: "keto",
    label: "Keto / Low-Carb",
    regex: /\b(keto|ketogenic|low[- ]?carb)\b/i,
  },
  {
    id: "low-sodium",
    label: "Low-Sodium",
    regex: /\b(low[- ]?sodium|low[- ]?salt|heart[- ]?healthy)\b/i,
  },
  {
    id: "mocktails",
    label: "Mocktails / Non-Alcoholic",
    regex: /\b(mocktail(s)?|no alcohol|non[- ]?alcoholic|sober|alcohol[- ]?free)\b/i,
  },
];

export function interpretDietary(selectedTags: string[], freeformText: string): InterpretedDietaryResult {
  const combinedTags = new Set<string>();
  const strictAllergies = new Set<string>();
  const preferencesAndAvoids = new Set<string>();

  // Add all manually selected tags
  selectedTags.forEach((t) => {
    if (t && t !== "No Restrictions") {
      combinedTags.add(t);
      if (t.toLowerCase().includes("allergy") || t.toLowerCase().includes("celiac")) {
        strictAllergies.add(t);
      } else {
        preferencesAndAvoids.add(t);
      }
    }
  });

  const text = (freeformText || "").trim();

  // Pattern matching on the typed text
  if (text) {
    DIETARY_PATTERNS.forEach((pat) => {
      if (pat.regex.test(text)) {
        combinedTags.add(pat.label);
        if (pat.isAllergy || text.toLowerCase().includes("allergy") || text.toLowerCase().includes("allergic")) {
          strictAllergies.add(pat.label);
        } else {
          preferencesAndAvoids.add(pat.label);
        }
      }
    });

    // Capture custom negative patterns like "can't eat X" or "no X"
    const noMatch = text.match(/\b(?:no|can't do|avoid|allergic to)\s+([a-zA-Z0-9\s]+?)(?:,|\.|\band\b|$)/gi);
    if (noMatch) {
      noMatch.forEach((m) => {
        const cleaned = m.replace(/^(no|can't do|avoid|allergic to)\s+/i, "").trim();
        if (cleaned.length > 1 && cleaned.length < 30) {
          const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
          preferencesAndAvoids.add(`Avoids: ${capitalized}`);
          combinedTags.add(`No ${capitalized}`);
        }
      });
    }
  }

  const allTagsList = Array.from(combinedTags);
  const strictList = Array.from(strictAllergies);
  const prefList = Array.from(preferencesAndAvoids);

  let summary = "";
  if (allTagsList.length === 0) {
    summary = "No restrictions logged—open to all local specialties and culinary creations.";
  } else {
    const highlights = [...strictList, ...prefList].slice(0, 4);
    summary = `Accommodating: ${highlights.join(", ")}${allTagsList.length > 4 ? ` (+${allTagsList.length - 4} more)` : ""}`;
  }

  return {
    allTags: allTagsList,
    strictAllergies: strictList,
    preferencesAndAvoids: prefList,
    summary,
    hasInput: allTagsList.length > 0 || text.length > 0,
  };
}
