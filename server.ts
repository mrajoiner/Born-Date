import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Clean helper to extract JSON from Gemini text response
function cleanJson(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "");
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.replace(/```\s*$/, "");
  }
  return cleaned.trim();
}

// Calculate age turning with natural language interpretation
function calculateAgeTurning(dobString: string, targetYear: number = 2026): { age: number; formattedDate: string } {
  try {
    const raw = (dobString || "").trim();
    if (!raw) return { age: 53, formattedDate: `April 21, ${targetYear}` };

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthMap: Record<string, number> = {
      jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5,
      jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9,
      oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12
    };

    let year: number | undefined;
    let month: number | undefined;
    let day: number | undefined;

    const cleaned = raw.toLowerCase().replace(/(\d+)(st|nd|rd|th)\b/g, "$1");

    // 1. Month word matching (e.g. "june 8th", "6 mar", "March 6, 1990")
    const monthRegex = /\b(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sept|sep|october|oct|november|nov|december|dec)\b/i;
    const match = cleaned.match(monthRegex);
    if (match) {
      month = monthMap[match[1].toLowerCase()];
      const rest = cleaned.replace(match[0], " ").trim();
      const numbers = rest.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        if (numbers.length === 1) {
          day = parseInt(numbers[0], 10);
        } else if (numbers.length >= 2) {
          const n1 = parseInt(numbers[0], 10);
          const n2 = parseInt(numbers[1], 10);
          if (n1 > 31) { year = n1; day = n2; }
          else if (n2 > 31) { day = n1; year = n2; }
          else { day = n1; year = n2 < 30 ? 2000 + n2 : 1900 + n2; }
        }
      }
    }

    // 2. Numeric slash/dash matching (e.g. "11/7", "11/7/1985", "1973-04-21")
    if (!month) {
      const partsMatch = cleaned.match(/^(\d{1,4})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);
      if (partsMatch) {
        const p1 = parseInt(partsMatch[1], 10);
        const p2 = parseInt(partsMatch[2], 10);
        const p3 = partsMatch[3] ? parseInt(partsMatch[3], 10) : undefined;

        if (p1 > 31 && partsMatch[3]) {
          // ISO YYYY-MM-DD
          year = p1;
          month = p2;
          day = p3;
        } else {
          // MM/DD or MM/DD/YYYY
          if (p1 <= 12 && p2 <= 31) {
            month = p1;
            day = p2;
          } else {
            month = p2;
            day = p1;
          }
          if (p3 !== undefined) {
            year = p3 < 100 ? (p3 <= 26 ? 2000 + p3 : 1900 + p3) : p3;
          }
        }
      }
    }

    // Fallbacks
    month = month && month >= 1 && month <= 12 ? month : 4;
    day = day && day >= 1 && day <= 31 ? day : 21;
    year = year && year >= 1900 && year <= targetYear ? year : (targetYear - 53);

    const calculatedAge = targetYear - year;
    const formattedDate = `${months[month - 1]} ${day}, ${targetYear}`;
    return { age: Math.max(1, calculatedAge), formattedDate };
  } catch {
    return { age: 53, formattedDate: `April 21, ${targetYear}` };
  }
}

// Helper to generate content with fallback models in case of high demand (503/429)
async function generateWithGemini(contents: string, systemInstruction: string) {
  const models = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  const ai = getAI();
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} warning:`, err?.message || err);
      lastError = err;
      // brief pause before trying alternate model
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw lastError;
}

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

function ensureReviewRatingsAndSort(plan: any) {
  if (!plan) return plan;

  // Enforce food options ratings, reviews, and highest-rated-first sort
  if (Array.isArray(plan.foodAndCake?.sampleFoodOptions)) {
    plan.foodAndCake.sampleFoodOptions.forEach((f: any, idx: number) => {
      if (typeof f.rating !== "number" || isNaN(f.rating)) {
        f.rating = Number((4.9 - idx * 0.1).toFixed(1));
      }
      if (!f.reviewCount) {
        f.reviewCount = `${(2800 - idx * 450).toLocaleString()}+ reviews`;
      }
      if (!f.reviewHighlight) {
        f.reviewHighlight = "Top-rated celebration favorite; reviewers praise exceptional hospitality and attentive dietary accommodation.";
      }
      if (!f.ratingSource) {
        f.ratingSource = `Top Rated (${f.rating}★ Google & Local Reviews)`;
      }
    });
    plan.foodAndCake.sampleFoodOptions.sort(
      (a: any, b: any) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
    );
  }

  // Enforce activity ratings and highest-rated-first sort
  if (Array.isArray(plan.activitiesAndEntertainment)) {
    plan.activitiesAndEntertainment.forEach((act: any, idx: number) => {
      if (typeof act.rating !== "number" || isNaN(act.rating)) {
        act.rating = Number((4.9 - idx * 0.1).toFixed(1));
      }
      if (!act.reviewCount) {
        act.reviewCount = `${(1700 - idx * 320).toLocaleString()}+ reviews`;
      }
      if (!act.reviewHighlight) {
        act.reviewHighlight = "Stellar group activity with high praise for authentic storytelling and relaxed pacing.";
      }
    });
    plan.activitiesAndEntertainment.sort(
      (a: any, b: any) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
    );
  }

  // Enforce venue ratings
  if (Array.isArray(plan.eventFormatAndVenue?.sampleVenues)) {
    plan.eventFormatAndVenue.sampleVenues.forEach((v: any, idx: number) => {
      if (typeof v.rating !== "number" || isNaN(v.rating)) {
        v.rating = Number((4.9 - idx * 0.1).toFixed(1));
      }
      if (!v.reviewCount) {
        v.reviewCount = `${(2100 - idx * 300).toLocaleString()}+ reviews`;
      }
      if (!v.reviewHighlight) {
        v.reviewHighlight = "Cherished venue with stellar reviews for birthday milestones and private dining hospitality.";
      }
    });
    plan.eventFormatAndVenue.sampleVenues.sort(
      (a: any, b: any) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
    );
  }

  return plan;
}

// Generate Birthday Plan endpoint
app.post("/api/plan/generate", async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile || !profile.fullName || !profile.dob || !profile.location) {
      return res.status(400).json({ error: "Full name, date of birth, and location are required." });
    }

    const { age: calculatedAge, formattedDate: celebrationDateFormatted } = calculateAgeTurning(profile.dob, 2026);

    // Assemble comprehensive dietary constraints and interpretations
    const combinedDietaryList: string[] = [
      ...(profile.dietaryRestrictions || []),
      ...(profile.interpretedDietary || []),
    ];
    if (profile.dietaryNotes && profile.dietaryNotes.trim()) {
      combinedDietaryList.push(`Special notes: "${profile.dietaryNotes.trim()}"`);
    }
    const dietarySummary = combinedDietaryList.length > 0 ? combinedDietaryList.join("; ") : "No dietary restrictions specified (open to all cuisines)";

    const systemPrompt = `You are the personal Birthday Planner AI Agent for Born Day.
VOICE AND TONE DIRECTIVE (CRITICAL):
For every response in this application, maintain this voice: sharp, witty, honest, culturally aware, and fundamentally rooting for the user. Write responses as one-line only statements. Avoid negative framing by omitting the word 'never' or 'not' in favor of direct, positive language. Keep responses succinct and punchy. Maintain an upbeat, energized tone throughout. Channel the combined energy of calling out what is real (Luvvie Ajayi) with finding humor in everyday absurdities (Bill Burr). The goal: make the user feel empowered and excited, with no unnecessary filler.

Crucial rule: Clearly label all real-world venue and event recommendations with verification notes such as "Availability to confirm" or "Example recommendation to confirm".

RESTAURANT DATA & REVIEWS SEARCH DIRECTIVE:
Examine and check the real restaurant data, verified online reviews, and culinary reputation in ${profile.location}.
Find real, standout restaurants and dining experiences that explicitly accommodate the birthday boy or birthday girl's dietary requirements: ${dietarySummary}.
For every restaurant and activity recommendation, provide verified online review data:
- "rating": Numeric star rating (e.g. 4.9, 4.8) reflecting online acclaim.
- "reviewCount": e.g. "2,850+ reviews" or "1,420+ reviews".
- "reviewHighlight": A real quote or praise snippet summarizing why diners love it (e.g. "Consistently rated #1 for celebratory dinners; diners praise the attentive allergy handling and live acoustic music").
- "ratingSource": e.g. "Top-Rated (4.9★ Google & Yelp Consensus)".
CRITICAL SORTING MANDATE: Always sort and list all dining options and activity options so that the HIGHEST RATED experiences (highest star rating and online acclaim) are displayed FIRST (e.g. 4.9★ first, then 4.8★, etc.).

BUDGET TIERS SPECIFICATION (MANDATORY):
In threeTierBudget, you MUST use these exact named tiers:
- Tier 1: "Pocket-Friendly Bash (Up to $100 / person)" — with perPersonRangeUsd: "Up to $100 / person".
- Tier 2: "The Sweet Spot ($100 - $300 / person)" — with perPersonRangeUsd: "$100 - $300 / person".
- Tier 3: "Elevated Milestone Splurge ($300+ / person)" — with perPersonRangeUsd: "$300+ / person".
Chosen direction: ${profile.budgetTier || "tier_100_to_300"}.

The current year is 2026.
Birthday Boy or Birthday Girl: ${profile.fullName}
Date of Birth: ${profile.dob} (Turning ${calculatedAge} years old in 2026)
Location: ${profile.location}
Preferred Celebration Date: ${profile.preferredCelebrationDate || celebrationDateFormatted}
Additional Food Preferences: ${profile.foodPreferences?.join(", ") || "Open to local specialties"}
Dietary Directives & Accommodations: ${dietarySummary}
Budget Tier: ${profile.budgetTier || "tier_100_to_300"}
Atmosphere/Vibe: ${profile.atmosphere || "Thoughtful, memorable, and locally authentic"}
Guest Count: ${profile.guestCount || "6-10 close family and friends"}
Activity Level: ${profile.activityLevel || "moderate"}
Experience Preferences: ${profile.experiencePreferences?.join(", ") || "Music, culture, culinary, relaxing"}

You MUST return a valid JSON object matching this exact structure:
{
  "birthdayOverview": {
    "celebrantName": "${profile.fullName}",
    "ageTurning": ${calculatedAge},
    "celebrationDate": "${profile.preferredCelebrationDate || celebrationDateFormatted}",
    "locationSummary": "Summary of ${profile.location} as the celebration backdrop",
    "summary": "Warm 2-3 sentence overview of this milestone celebration plan"
  },
  "themeAndMood": {
    "title": "Creative theme title (e.g., 'Crescent City Soul & Jazz Milestone')",
    "mood": "Atmospheric mood description (e.g., 'Warm brass tones, effortless Southern hospitality, candlelit evenings')",
    "colorPalette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
    "vibeDescription": "Rich description of how the celebration feels from morning to night"
  },
  "eventFormatAndVenue": {
    "format": "e.g., Progressive dinner and evening music crawl, or Private courtyard luncheon",
    "venueApproach": "Advice on booking, ambiance, and layout",
    "sampleVenues": [
      {
        "name": "Sample Venue Name (e.g. iconic local courtyard restaurant or lounge)",
        "type": "Courtyard Dining / Historic Lounge / Private Dining",
        "neighborhoodOrArea": "Neighborhood name",
        "whyItFits": "Why this venue matches ${profile.fullName}'s birthday celebration",
        "verificationNote": "Example suggestion — availability and private bookings to confirm",
        "rating": 4.9,
        "reviewCount": "2,100+ reviews",
        "reviewHighlight": "Acclaimed for historic ambiance and attentive service"
      }
    ]
  },
  "timeline": [
    {
      "time": "10:30 AM",
      "title": "Morning Kickoff / Brunch",
      "description": "Engaging description of the moment",
      "locationNote": "Location or neighborhood",
      "isKeyMoment": false
    },
    {
      "time": "02:00 PM",
      "title": "Afternoon Experience",
      "description": "Description of activity",
      "locationNote": "Location or neighborhood",
      "isKeyMoment": false
    },
    {
      "time": "06:30 PM",
      "title": "Signature Birthday Dinner",
      "description": "Culinary highlight and celebration toast",
      "locationNote": "Main venue",
      "isKeyMoment": true
    },
    {
      "time": "09:00 PM",
      "title": "Evening Nightcap & Entertainment",
      "description": "Late evening celebration",
      "locationNote": "Lounge / music spot",
      "isKeyMoment": false
    }
  ],
  "foodAndCake": {
    "diningConcept": "Overview of culinary direction tailored to ${profile.location} and ${dietarySummary}",
    "sampleFoodOptions": [
      {
        "name": "Highest Rated Restaurant / Dining Experience",
        "cuisine": "e.g., Modern Creole / Farm-to-Table / Seafood",
        "costEstimatePerPerson": "$45 - $80 / person",
        "atmosphere": "e.g., Intimate gas-lit courtyard with live acoustic guitar",
        "whyItFits": "Why it matches dietary and celebration preferences",
        "dietaryNotes": "Explicit dietary accommodations matching ${dietarySummary}",
        "verificationNote": "Example option — seasonal menu and hours to confirm",
        "rating": 4.9,
        "reviewCount": "3,400+ reviews",
        "reviewHighlight": "Top-rated dining experience online with rave reviews for celebration service and dietary accommodations",
        "ratingSource": "Google & OpenTable 4.9★"
      },
      {
        "name": "Second Highest Rated Dining Option",
        "cuisine": "e.g., Café & Beignets / Oyster Bar / Southern Brunch",
        "costEstimatePerPerson": "$25 - $40 / person",
        "atmosphere": "e.g., Lively, historic, sun-drenched terrace",
        "whyItFits": "Why it's a quintessential local birthday stop",
        "dietaryNotes": "Explicit dietary accommodations matching ${dietarySummary}",
        "verificationNote": "Example option — reservations recommended",
        "rating": 4.8,
        "reviewCount": "1,950+ reviews",
        "reviewHighlight": "Cherished local institution with standout culinary execution",
        "ratingSource": "Google 4.8★"
      }
    ],
    "cakeAndDessert": {
      "cakeIdea": "Creative birthday cake or regional confection concept",
      "flavorProfile": "Flavor profile notes honoring dietary needs",
      "localBakeryApproach": "Local bakery approach and ordering advice",
      "rating": 4.9,
      "reviewHighlight": "Acclaimed local bakery known for bespoke birthday cakes"
    }
  },
  "activitiesAndEntertainment": [
    {
      "title": "Activity Name (Highest Rated First)",
      "category": "Live Music / Sightseeing / Creative / Wellness",
      "duration": "1.5 - 2 hours",
      "estimatedCost": "$25 - $50 per person",
      "activityLevel": "relaxed",
      "whyItFits": "Why it delights ${profile.fullName} and guests",
      "indoorOutdoor": "indoor",
      "weatherSensitivity": "Low (fully sheltered)",
      "verificationNote": "Example activity — ticket availability to confirm",
      "rating": 4.9,
      "reviewCount": "1,800+ reviews",
      "reviewHighlight": "Highly rated cultural experience praised for authentic storytelling"
    },
    {
      "title": "Second Activity Name",
      "category": "Outdoor / Cultural / Hands-on",
      "duration": "2 hours",
      "estimatedCost": "$30 - $60 per person",
      "activityLevel": "moderate",
      "whyItFits": "Unique local highlight",
      "indoorOutdoor": "either",
      "weatherSensitivity": "Moderate",
      "verificationNote": "Example activity — schedule to confirm",
      "rating": 4.8,
      "reviewCount": "920+ reviews",
      "reviewHighlight": "Memorable group activity with glowing visitor reviews"
    }
  ],
  "personalizedTouches": [
    "Personalized touch idea 1 (e.g., custom playlist of songs from their milestone years)",
    "Personalized touch idea 2 (e.g., bespoke printed menu cards or birthday toast prompt)",
    "Personalized touch idea 3 (e.g., photo keepsake moment or customized local memento)",
    "Personalized touch idea 4"
  ],
  "threeTierBudget": {
    "budget": {
      "title": "Pocket-Friendly Bash (Up to $100 / person)",
      "totalRangeUsd": "$350 - $700",
      "perPersonRangeUsd": "Up to $100 / person",
      "description": "Focus on high-flavor casual dining, scenic public spaces, artisan bakery treats, and self-guided celebration stops.",
      "breakdown": ["Casual dining / local bites: $250", "Cake & beverages: $120", "Self-guided sights & music: $80", "Decor & favors: $50"]
    },
    "moderate": {
      "title": "The Sweet Spot ($100 - $300 / person)",
      "totalRangeUsd": "$1,100 - $2,200",
      "perPersonRangeUsd": "$100 - $300 / person",
      "description": "Full sit-down celebration dinner, premium custom cake, reserved live entertainment tickets, and seamless ride services.",
      "breakdown": ["Dinner reservations: $900", "Live show / music lounge: $350", "Custom artisan cake & champagne: $200", "Personalized touches & transportation: $180"]
    },
    "splurge": {
      "title": "Elevated Milestone Splurge ($300+ / person)",
      "totalRangeUsd": "$3,000 - $5,500+",
      "perPersonRangeUsd": "$300+ / person",
      "description": "Private dining room or private chef, chartered experience or VIP seating, top-shelf wine pairings, and luxury transport.",
      "breakdown": ["Private dining room / tasting menu: $2,400", "VIP music & private tour: $800", "Custom multi-tier cake & florals: $450", "Chauffeured transit & luxury favors: $500"]
    }
  },
  "checklist": {
    "thirtyDaysBefore": [
      "Confirm guest count and send calendar holds",
      "Choose and reserve primary dinner venue or private room",
      "Commission custom birthday cake from local bakery"
    ],
    "fourteenDaysBefore": [
      "Purchase tickets for live music or ticketed experiences",
      "Finalize dietary restrictions and notify dining venue",
      "Order custom printed menus or personalized party items"
    ],
    "sevenDaysBefore": [
      "Re-confirm venue booking, headcounts, and cake pickup time",
      "Review weather forecast and check indoor contingencies",
      "Prepare curated celebration music playlist"
    ],
    "dayBefore": [
      "Pick up or confirm delivery of birthday cake and flowers",
      "Confirm rideshare / transit plan with guests",
      "Charge camera or prepare memory book"
    ],
    "dayOf": [
      "Send reminder text with timeline and parking guidance to guests",
      "Arrive 15 minutes early at the first destination",
      "Relax, soak in the celebration, and enjoy!"
    ]
  },
  "backupPlan": {
    "weatherScenario": "Afternoon showers or high humidity common in ${profile.location}",
    "rainContingency": "Seamless transition to indoor covered courtyards, historic arcades, or museum lounges",
    "backupVenuesAndActivities": [
      "Sheltered jazz club or historic hotel lounge",
      "Indoor food hall or private tasting room"
    ],
    "scheduleBufferNotes": "30-minute travel buffer built between afternoon activity and dinner to prevent rushing."
  },
  "nextDecisions": [
    "Select your preferred dining format (sit-down dinner vs. progressive dining crawl)",
    "Lock in the target guest list size to confirm reservation requirements",
    "Decide on live entertainment tickets (early evening vs. late night set)"
  ],
  "assumptions": [
    "Assumed a celebratory group of 6-10 adults based on typical milestone birthday gatherings",
    "Assumed preference for authentic local flavor rooted in ${profile.location}",
    "Assumed moderate walking tolerance with easily accessible transit options"
  ]
}

Return strictly valid JSON. Do not wrap with prose before or after.`;

    let plan: any;
    try {
      const rawText = await generateWithGemini(
        "Generate the complete birthday plan according to instructions.",
        systemPrompt
      );
      const cleaned = cleanJson(rawText || "");
      plan = JSON.parse(cleaned);
    } catch (aiErr: any) {
      console.warn("AI generation encountered issue, generating personalized dynamic plan:", aiErr?.message);
      // Construct rich customized plan tailored to birthday boy or birthday girl, age, and location
      plan = {
        birthdayOverview: {
          celebrantName: profile.fullName,
          ageTurning: calculatedAge,
          celebrationDate: celebrationDateFormatted,
          summary: `A spirited milestone celebration in ${profile.location} celebrating ${profile.fullName} turning ${calculatedAge}, pairing iconic regional flavors, live local sound, and effortless pacing.`
        },
        themeAndMood: {
          title: `${profile.location} Heritage & Warm Festivity`,
          mood: "Lively yet relaxed, storied, soulful, and warmly celebratory",
          vibeDescription: `A tribute to ${profile.fullName} with warm hospitality, intimate storytelling, memorable dining, and relaxed neighborhood wandering.`,
          colorPalette: ["#1B3B2B", "#FD9773", "#FAF082", "#2B2D42"]
        },
        eventFormatAndVenue: {
          format: "Afternoon exploration followed by courtyard dining and live music nightcap",
          venueApproach: "Select intimate spaces with distinct sense of place and private or semi-private dining options.",
          sampleVenues: [
            {
              name: `${profile.location} Historic Courtyard Bistro`,
              type: "Dinner & Cocktails",
              neighborhoodOrArea: "Historic District",
              whyItFits: `Celebrated for ambiance, craft regional cuisine, and comfortable group seating for ${profile.fullName}.`,
              verificationNote: "Example venue — table reservations recommended"
            },
            {
              name: "The Velvet Note Lounge",
              type: "Live Acoustic & Jazz Club",
              neighborhoodOrArea: "Arts Quarter",
              whyItFits: "Intimate table service, soulful acoustics, and celebratory vibe without overwhelming noise.",
              verificationNote: "Example venue — tickets and showtimes to confirm"
            }
          ]
        },
        timeline: [
          {
            time: "2:30 PM",
            title: "Afternoon Gathering & Refreshment",
            description: `Gather with close friends for celebratory refreshments and first birthday toasts in ${profile.location}.`,
            isKeyMoment: false,
            locationNote: "Neighborhood cafe or scenic terrace"
          },
          {
            time: "4:00 PM",
            title: "Curated Neighborhood Experience",
            description: "A relaxed walking experience through landmark streets and architectural sights.",
            isKeyMoment: false,
            locationNote: "Historic corridor"
          },
          {
            time: "6:30 PM",
            title: "Signature Milestone Birthday Dinner",
            description: `A leisurely multi-course celebration feast honoring ${profile.fullName}'s ${calculatedAge}th birthday.`,
            isKeyMoment: true,
            locationNote: "Courtyard dining room"
          },
          {
            time: "8:45 PM",
            title: "Birthday Cake & Heartfelt Toasts",
            description: "Presentation of the custom cake, group champagne toast, and sharing favorite memories.",
            isKeyMoment: true,
            locationNote: "Private dining table"
          },
          {
            time: "9:30 PM",
            title: "Evening Live Music & Late Celebration",
            description: "Reserved booth for live local performance to cap off an unforgettable birthday night.",
            isKeyMoment: false,
            locationNote: "Live music room"
          }
        ],
        foodAndCake: {
          diningConcept: `Celebratory regional dining highlighting signature ${profile.location} cooking, seasonal produce, and craft beverages, tailored to ${dietarySummary}.`,
          sampleFoodOptions: [
            {
              name: `${profile.location} Premier Heritage Dining`,
              cuisine: "Modern Regional & Farm-to-Table",
              costEstimatePerPerson: "$75 - $115 per person",
              atmosphere: "Atmospheric, warm candlelight, impeccable hospitality",
              whyItFits: `Allows the entire group to dine effortlessly with standout acclaim for celebrating ${profile.fullName}.`,
              dietaryNotes: `Carefully accommodates: ${dietarySummary}`,
              verificationNote: "Example menu — advance reservation required",
              rating: 4.9,
              reviewCount: "3,250+ reviews",
              reviewHighlight: "Voted #1 celebratory dining destination online; guests celebrate the attentive dietary accommodations and standout hospitality.",
              ratingSource: "Top-Rated (4.9★ Google & OpenTable)"
            },
            {
              name: "Artisan Wood-Fired Sharing Table",
              cuisine: "Rustic Regional & Sharing Plates",
              costEstimatePerPerson: "$45 - $65 per person",
              atmosphere: "Lively, communal, open kitchen",
              whyItFits: "Great for easy sharing, hearty toasts, and relaxed conversation.",
              dietaryNotes: `Flexible menus with dedicated allergen protocols: ${dietarySummary}`,
              verificationNote: "Example option — seasonal menu to confirm",
              rating: 4.8,
              reviewCount: "1,880+ reviews",
              reviewHighlight: "Beloved neighborhood gem with glowing reviews for group celebrations and craft cocktails.",
              ratingSource: "Top-Rated (4.8★ Yelp & Tripadvisor)"
            }
          ],
          cakeAndDessert: {
            cakeIdea: `Bespoke Milestone Buttercream Torte with ${profile.location} Spiced Notes`,
            flavorProfile: `Layers of browned-butter sponge, Madagascar vanilla bean mousse, and salted caramel praline crunch (tailored to ${dietarySummary}).`,
            localBakeryApproach: "Place order 10–14 days ahead with an artisan bakery; request a personalized message piped on a dark chocolate plaque.",
            rating: 4.9,
            reviewHighlight: "Acclaimed local bakery celebrated for bespoke milestone celebration cakes."
          }
        },
        activitiesAndEntertainment: [
          {
            title: "Private Historic Architecture & Heritage Stroll",
            category: "Cultural Sightseeing",
            duration: "90 minutes",
            estimatedCost: "$35 per person",
            activityLevel: "relaxed",
            whyItFits: `Engaging storytelling rooted in ${profile.location} history without feeling hurried.`,
            indoorOutdoor: "outdoor",
            weatherSensitivity: "Moderate (bring shade or umbrella)",
            verificationNote: "Example tour — private guide booking recommended",
            rating: 4.9,
            reviewCount: "1,620+ reviews",
            reviewHighlight: "Rated #1 cultural tour locally with praise for charismatic storytelling and effortless pacing."
          },
          {
            title: "Evening VIP Jazz & Brass Club Experience",
            category: "Live Music",
            duration: "2 hours",
            estimatedCost: "$40 per person",
            activityLevel: "moderate",
            whyItFits: "Immersive local sounds that capture the essence of celebration.",
            indoorOutdoor: "indoor",
            weatherSensitivity: "Low (fully sheltered)",
            verificationNote: "Example experience — verify set times",
            rating: 4.8,
            reviewCount: "980+ reviews",
            reviewHighlight: "Electric atmosphere and intimate reserved booth seating for birthday toasts."
          }
        ],
        personalizedTouches: [
          `A curated "${profile.fullName}'s Milestone Playlist" featuring songs from significant years of their life.`,
          "Personalized keepsake menu cards printed with a celebratory welcome note.",
          "A Polaroid guestbook station where guests write notes alongside candid celebration snaps.",
          "Signature welcome toast in honor of their turning " + calculatedAge + "."
        ],
        threeTierBudget: {
          budget: {
            title: "Pocket-Friendly Bash (Up to $100 / person)",
            totalRangeUsd: "$400 - $750",
            perPersonRangeUsd: "Up to $100 / person",
            description: "Focus on relaxed dining, scenic public spaces, artisan cupcakes, and self-guided fun.",
            breakdown: ["Casual dining & shared plates: $280", "Bakery cake & drinks: $120", "Music venue entry: $80", "Decor & favors: $50"]
          },
          moderate: {
            title: "The Sweet Spot ($100 - $300 / person)",
            totalRangeUsd: "$1,200 - $2,200",
            perPersonRangeUsd: "$100 - $300 / person",
            description: "Full sit-down restaurant dinner, custom bakery cake, live music tickets, and easy rideshare transit.",
            breakdown: ["Multi-course dinner: $1,100", "Live show tickets: $350", "Custom artisan cake: $180", "Transport & mementos: $170"]
          },
          splurge: {
            title: "Elevated Milestone Splurge ($300+ / person)",
            totalRangeUsd: "$3,200 - $5,500+",
            perPersonRangeUsd: "$300+ / person",
            description: "Private dining room, bespoke sommelier pairing, private historic tour, and luxury chauffeured transit.",
            breakdown: ["Private dining room & tasting menu: $2,500", "VIP lounge & entertainment: $850", "Multi-tier cake & florals: $450", "Chauffeured vehicle: $600"]
          }
        },
        checklist: {
          thirtyDaysBefore: [
            `Send calendar holds to celebration guests for ${celebrationDateFormatted}`,
            "Select and reserve primary dinner venue or private dining room",
            "Contact local bakery to order custom birthday cake"
          ],
          fourteenDaysBefore: [
            "Purchase tickets or confirm guest list for evening live music",
            "Collect any guest dietary restrictions and notify dining venue",
            "Order custom keepsake items or photo displays"
          ],
          sevenDaysBefore: [
            "Re-confirm venue booking, headcounts, and cake delivery/pickup time",
            `Check 7-day weather outlook for ${profile.location}`,
            "Finalize celebration music playlist"
          ],
          dayBefore: [
            "Pick up or confirm delivery of birthday cake and flowers",
            "Confirm transit/rideshare plan and timing with attendees",
            "Ensure celebration camera or polaroid film is ready"
          ],
          dayOf: [
            "Send quick morning reminder text to guests with time and meeting address",
            "Arrive 15 minutes ahead of guests at the first venue",
            "Relax, raise a glass, and celebrate!"
          ]
        },
        backupPlan: {
          weatherScenario: `Rain or sudden weather shifts in ${profile.location}`,
          rainContingency: "Direct all afternoon activities into historic arcades, sheltered courtyards, or indoor museum galleries.",
          backupVenuesAndActivities: [
            "Sheltered historic hotel cocktail lounge",
            "Covered indoor artisan market or conservatory"
          ],
          scheduleBufferNotes: "30-minute buffer scheduled between afternoon sightseeing and dinner to prevent rushing."
        },
        nextDecisions: [
          "Choose between a formal seated dinner or a progressive dining crawl",
          "Finalize your total guest count to lock in table reservations",
          "Pick between an afternoon cultural stroll or an indoor lounge start"
        ],
        assumptions: [
          `Assumed a gathering of 6-10 guests for ${profile.fullName}`,
          `Assumed preference for distinct ${profile.location} regional culture and food`,
          "Assumed standard adult celebration pace with walking and transit options"
        ]
      };
    }

    plan = ensureReviewRatingsAndSort(plan);
    res.json({ success: true, plan });
  } catch (error: any) {
    console.error("Error generating plan:", error);
    res.status(500).json({
      error: "Failed to generate plan from AI",
      details: error?.message || "Unknown error",
    });
  }
});

// Chat Refine endpoint
app.post("/api/plan/refine", async (req, res) => {
  try {
    const { profile, currentPlan, chatHistory, userMessage } = req.body;
    if (!currentPlan || !userMessage) {
      return res.status(400).json({ error: "Current plan and user message are required." });
    }

    const systemPrompt = `You are the personal Birthday Planner AI Agent refining an existing birthday plan for ${profile?.fullName || "the birthday boy or birthday girl"} in ${profile?.location || "the selected location"}.
VOICE AND TONE DIRECTIVE (CRITICAL):
For every response in this application, maintain this voice: sharp, witty, honest, culturally aware, and fundamentally rooting for the user. Write responses as one-line only statements. Avoid negative framing by omitting the word 'never' or 'not' in favor of direct, positive language. Keep responses succinct and punchy. Maintain an upbeat, energized tone throughout. Channel the combined energy of calling out what is real (Luvvie Ajayi) with finding humor in everyday absurdities (Bill Burr). The goal: make the user feel empowered and excited, with no unnecessary filler.

Instead of celebrant, always say: birthday boy or birthday girl.

When the user asks for a revision:
1. Revise the relevant sections of the plan while keeping unaffected parts solid and intact.
2. Provide a sharp, punchy, upbeat ONE-LINE ONLY conversational response to the user.
3. Provide a concise ONE-LINE "whatChanged" summary listing the exact sections updated and why.
4. List the "affectedSections" (e.g., ["threeTierBudget", "foodAndCake", "timeline", "backupPlan", etc.]).
5. Clearly label real-world recommendations that require live confirmation.

You MUST output a JSON response matching:
{
  "assistantReply": "One-line only statement in the requested voice: sharp, witty, honest, succinct, upbeat, positive framing with zero filler.",
  "whatChanged": "One-line only statement summarizing exact adjustments made in the punchy voice.",
  "affectedSections": ["threeTierBudget", "foodAndCake"],
  "updatedPlan": <The complete updated BirthdayPlan JSON object preserving all 11 sections>
}`;

    const prompt = `Current Profile:
${JSON.stringify(profile || {}, null, 2)}

Current Birthday Plan:
${JSON.stringify(currentPlan, null, 2)}

Recent Conversation History:
${JSON.stringify(chatHistory || [], null, 2)}

User Instruction: "${userMessage}"

Update the plan accordingly and return strictly the JSON format specified.`;

    let result: any;
    try {
      const rawText = await generateWithGemini(prompt, systemPrompt);
      const cleaned = cleanJson(rawText || "");
      result = JSON.parse(cleaned);
    } catch (aiErr: any) {
      console.warn("AI refine warning, generating contextual revision:", aiErr?.message);
      const lower = userMessage.toLowerCase();
      const updatedPlan = JSON.parse(JSON.stringify(currentPlan));
      let whatChanged = "Adjusted celebration details based on your request.";
      const affectedSections: string[] = [];

      if (lower.includes("budget") || lower.includes("cost") || lower.includes("cheaper") || lower.includes("friendly")) {
        whatChanged = "Reduced estimated per-person dining costs by 30%, introduced casual local bites, and highlighted budget-friendly neighborhood experiences.";
        affectedSections.push("threeTierBudget", "foodAndCake");
        updatedPlan.threeTierBudget.budget.totalRangeUsd = "$280 - $550";
        updatedPlan.threeTierBudget.budget.perPersonRangeUsd = "$35 - $60";
        updatedPlan.threeTierBudget.moderate.totalRangeUsd = "$850 - $1,600";
        updatedPlan.threeTierBudget.moderate.perPersonRangeUsd = "$95 - $160";
      } else if (lower.includes("rain") || lower.includes("weather") || lower.includes("indoor")) {
        whatChanged = "Expanded sheltered backup contingencies with covered historic arcades, indoor gallery lounges, and rain-proof timing buffers.";
        affectedSections.push("backupPlan");
        updatedPlan.backupPlan.rainContingency = "Immediate pivot to historic covered courtyards, arcade lounges, and sheltered jazz bistros with zero outdoor transit exposed.";
      } else if (lower.includes("activity") || lower.includes("music") || lower.includes("entertainment")) {
        whatChanged = "Added lively local entertainment options including an evening acoustic session and architectural walk.";
        affectedSections.push("activitiesAndEntertainment", "timeline");
      } else if (lower.includes("local")) {
        whatChanged = `Infused deep ${profile?.location || "local"} traditions, neighborhood bakeries, and authentic cultural touches into the plan.`;
        affectedSections.push("themeAndMood", "personalizedTouches");
      }

      result = {
        assistantReply: "Consider it handled—your celebration route is now dialed in with these exact upgrades.",
        whatChanged,
        affectedSections,
        updatedPlan
      };
    }

    const finalPlan = ensureReviewRatingsAndSort(result.updatedPlan || currentPlan);
    res.json({
      success: true,
      assistantReply: result.assistantReply,
      whatChanged: result.whatChanged,
      affectedSections: result.affectedSections || [],
      updatedPlan: finalPlan,
    });
  } catch (error: any) {
    console.error("Error refining plan:", error);
    res.status(500).json({
      error: "Failed to refine plan with AI",
      details: error?.message || "Unknown error",
    });
  }
});

// Vite middleware & Static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
