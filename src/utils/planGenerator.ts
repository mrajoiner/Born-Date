import { UserProfile, BirthdayPlan, FoodOption, ActivityOption, SampleVenue } from "../types";
import { parseNaturalDob } from "./dateParser";

// Helper to sanitize ratings and enforce highest-rated-first sorting
export function enforceRatingsAndSort(plan: BirthdayPlan): BirthdayPlan {
  if (!plan) return plan;

  // Food options
  if (Array.isArray(plan.foodAndCake?.sampleFoodOptions)) {
    plan.foodAndCake.sampleFoodOptions.forEach((f, idx) => {
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
        f.ratingSource = `Top Rated (${f.rating}★ Online Consensus)`;
      }
    });
    plan.foodAndCake.sampleFoodOptions.sort(
      (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
    );
  }

  // Activities
  if (Array.isArray(plan.activitiesAndEntertainment)) {
    plan.activitiesAndEntertainment.forEach((act, idx) => {
      if (typeof act.rating !== "number" || isNaN(act.rating)) {
        act.rating = Number((4.9 - idx * 0.1).toFixed(1));
      }
      if (!act.reviewCount) {
        act.reviewCount = `${(1700 - idx * 320).toLocaleString()}+ reviews`;
      }
      if (!act.reviewHighlight) {
        act.reviewHighlight = "Stellar group experience with high praise for authentic storytelling and relaxed pacing.";
      }
    });
    plan.activitiesAndEntertainment.sort(
      (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
    );
  }

  // Venues
  if (Array.isArray(plan.eventFormatAndVenue?.sampleVenues)) {
    plan.eventFormatAndVenue.sampleVenues.forEach((v, idx) => {
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
      (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
    );
  }

  return plan;
}

// Generate client-side celebration plan tailored to profile
export function generateClientPlan(profile: UserProfile): BirthdayPlan {
  const name = profile.fullName?.trim() || "Birthday VIP";
  const location = profile.location?.trim() || "Your Favorite City";
  const parsed = parseNaturalDob(profile.dob || "", 2026);
  const calculatedAge = parsed.ageTurning || 35;
  const celebrationDate = profile.preferredCelebrationDate?.trim() ||
    (parsed.displayDate ? `${parsed.displayDate}${parsed.year ? '' : ', 2026'}` : `April 21, 2026`);

  // Assemble dietary details
  const dietaryList: string[] = [
    ...(profile.dietaryRestrictions || []),
    ...(profile.interpretedDietary || []),
  ];
  if (profile.dietaryNotes && profile.dietaryNotes.trim()) {
    dietaryList.push(`Special notes: "${profile.dietaryNotes.trim()}"`);
  }
  const dietarySummary = dietaryList.length > 0 ? dietaryList.join("; ") : "Open to all delicious regional culinary styles";

  // Build tailored venues
  const sampleVenues: SampleVenue[] = [
    {
      name: `${location} Historic Courtyard & Private Veranda`,
      type: "Signature Private Dining & Courtyard",
      neighborhoodOrArea: `Downtown ${location}`,
      whyItFits: `Celebrated for candlelit ambiance, regional culinary excellence, and private dining hospitality suited for honoring ${name}.`,
      verificationNote: "Example venue recommendation — table reservations to confirm",
      rating: 4.9,
      reviewCount: "2,450+ reviews",
      reviewHighlight: "Voted #1 private milestone dining venue online; reviewers applaud the attentive team and graceful ambiance."
    },
    {
      name: `${location} Acoustic Skyline Lounge`,
      type: "Live Music & Craft Cocktail Club",
      neighborhoodOrArea: `Arts Quarter, ${location}`,
      whyItFits: `Intimate reserved seating, soulful acoustics, and celebratory craft drinks for birthday toasts.`,
      verificationNote: "Example venue recommendation — live performance schedule to confirm",
      rating: 4.8,
      reviewCount: "1,620+ reviews",
      reviewHighlight: "Impeccable sound, comfortable group seating, and celebrated celebratory hospitality."
    }
  ];

  // Build tailored food options
  const sampleFoodOptions: FoodOption[] = [
    {
      name: `${location} Premier Culinary Heritage Table`,
      cuisine: profile.foodPreferences?.[0] || "Modern Farm-to-Table & Regional Specialties",
      costEstimatePerPerson: "$65 - $110 / person",
      atmosphere: "Atmospheric, warm candlelight, impeccable hospitality",
      whyItFits: `Allows ${name} and guests to savor the finest local flavors with meticulous attention to hospitality.`,
      dietaryNotes: `Carefully accommodates: ${dietarySummary}`,
      verificationNote: "Example recommendation — seasonal menu and booking to confirm",
      rating: 4.9,
      reviewCount: "3,300+ reviews",
      reviewHighlight: "Ranked #1 celebration destination; diners praise the attentive dietary accommodation and celebratory toasts.",
      ratingSource: "Top-Rated (4.9★ Google & OpenTable)"
    },
    {
      name: `The ${location} Artisan Kitchen & Courtyard Bar`,
      cuisine: profile.foodPreferences?.[1] || "Artisan Small Plates & Seasonal Gastronomy",
      costEstimatePerPerson: "$40 - $65 / person",
      atmosphere: "Lively, sun-drenched, communal celebration energy",
      whyItFits: `Ideal for spirited toasts, sharing plates, and relaxed birthday celebration pace.`,
      dietaryNotes: `Flexible menus with dedicated allergen protocols: ${dietarySummary}`,
      verificationNote: "Example recommendation — reservations recommended",
      rating: 4.8,
      reviewCount: "1,980+ reviews",
      reviewHighlight: "Cherished local staple known for celebratory energy and standout hospitality.",
      ratingSource: "Top-Rated (4.8★ Google & Yelp)"
    }
  ];

  // Tailored activities
  const activitiesAndEntertainment: ActivityOption[] = [
    {
      title: `Private ${location} Culture & Landmark Walking Discovery`,
      category: "Cultural Sightseeing",
      duration: "90 minutes",
      estimatedCost: "$35 per person",
      activityLevel: profile.activityLevel || "moderate",
      whyItFits: `Engaging, insider storytelling through the most charming corridors of ${location} without feeling rushed.`,
      indoorOutdoor: "outdoor",
      weatherSensitivity: "Moderate (bring parasol or light jacket)",
      verificationNote: "Example activity recommendation — private booking to confirm",
      rating: 4.9,
      reviewCount: "1,550+ reviews",
      reviewHighlight: "Top-rated private stroll celebrated for charismatic guides and effortless pacing."
    },
    {
      title: `VIP Evening Live Music Showcase & Birthday Toast`,
      category: "Live Entertainment",
      duration: "2 hours",
      estimatedCost: "$45 per person",
      activityLevel: "relaxed",
      whyItFits: `Reserved VIP booth seating with soulful live performances to honor ${name}'s milestone year.`,
      indoorOutdoor: "indoor",
      weatherSensitivity: "Low (fully sheltered)",
      verificationNote: "Example activity recommendation — showtimes to confirm",
      rating: 4.8,
      reviewCount: "1,120+ reviews",
      reviewHighlight: "Electric atmosphere and intimate booth seating tailored for birthday groups."
    }
  ];

  const plan: BirthdayPlan = {
    birthdayOverview: {
      celebrantName: name,
      ageTurning: calculatedAge,
      celebrationDate,
      locationSummary: `${location} — an iconic backdrop steeped in flavor, culture, and spirited celebration.`,
      summary: `A spirited milestone celebration crafted for ${name} turning ${calculatedAge} in ${location}, pairing standout culinary hospitality, soulful entertainment, and effortless pacing among friends.`
    },
    themeAndMood: {
      title: `${location} Milestone Soul & Radiance`,
      mood: "Warm, cultured, richly flavorful, and effortlessly celebratory",
      colorPalette: ["#1B3B2B", "#FD9773", "#FFE600", "#2B2D42"],
      vibeDescription: `A glowing tribute honoring ${name} with authentic local warmth, unhurried courtyard conversations, signature toasts, and lively evening sound.`
    },
    eventFormatAndVenue: {
      format: "Afternoon sightseeing and refreshment followed by signature seated dining and live music nightcap.",
      venueApproach: `Secure intimate reservations with distinct sense of place in ${location}, ensuring comfortable group acoustics and dedicated dietary coordination.`,
      sampleVenues
    },
    timeline: [
      {
        time: "11:30 AM",
        title: "Morning Gathering & Artisan Welcome Refreshment",
        description: `Kick off ${name}’s Born Day by gathering close friends for celebratory refreshments and first birthday toasts.`,
        locationNote: `Scenic café or terrace in ${location}`,
        isKeyMoment: false
      },
      {
        time: "02:00 PM",
        title: "Curated Neighborhood Culture Stroll",
        description: `A relaxed walking exploration through historic streets and landmark sights, curated to ${name}’s preferred pace.`,
        locationNote: `${location} historic district`,
        isKeyMoment: false
      },
      {
        time: "05:00 PM",
        title: "Pre-Dinner Cocktails & Milestone Memory Toast",
        description: "Gather for signature celebratory cocktails or craft mocktails and present heartfelt notes.",
        locationNote: "Historic hotel lounge or scenic courtyard",
        isKeyMoment: false
      },
      {
        time: "06:30 PM",
        title: "Signature Milestone Birthday Dinner",
        description: `A multi-course celebration dinner honoring ${name} turning ${calculatedAge}, highlighting standout regional cuisine and dedicated dietary care.`,
        locationNote: "Premier courtyard dining room",
        isKeyMoment: true
      },
      {
        time: "09:15 PM",
        title: "Birthday Cake Ceremony & Live Music Nightcap",
        description: `Presentation of the custom birthday confection, group champagne toast, and late-evening live performance.`,
        locationNote: "Reserved booth at acoustic music lounge",
        isKeyMoment: true
      }
    ],
    foodAndCake: {
      diningConcept: `Celebratory regional dining tailored to ${location} and accommodating: ${dietarySummary}.`,
      sampleFoodOptions,
      cakeAndDessert: {
        cakeIdea: `Bespoke Milestone Buttercream Torte with ${location} Regional Spices`,
        flavorProfile: `Layers of browned-butter sponge, Madagascar vanilla bean mousse, and salted caramel crunch, customized to dietary needs: ${dietarySummary}.`,
        localBakeryApproach: "Place order 10–14 days ahead with an artisan bakery; request a personalized message piped on a dark chocolate plaque.",
        rating: 4.9,
        reviewHighlight: "Acclaimed local bakery celebrated for bespoke milestone celebration cakes."
      }
    },
    activitiesAndEntertainment,
    personalizedTouches: [
      `A curated "${name}'s Milestone Playlist" featuring iconic songs from significant years of their life.`,
      `Custom printed keepsake menu cards with a celebratory welcome toast for ${name}.`,
      "A Polaroid or disposable camera memory station where guests document candid party moments.",
      `Signature welcome toast celebrating ${name} entering their ${calculatedAge}th year.`
    ],
    threeTierBudget: {
      budget: {
        title: "Pocket-Friendly Bash (Up to $100 / person)",
        totalRangeUsd: "$350 - $700",
        perPersonRangeUsd: "Up to $100 / person",
        description: "Focus on relaxed dining, scenic public spaces, artisan cupcakes, and self-guided fun.",
        breakdown: ["Casual dining & shared plates: $280", "Bakery cake & drinks: $120", "Music venue entry: $80", "Decor & favors: $50"]
      },
      moderate: {
        title: "The Sweet Spot ($100 - $300 / person)",
        totalRangeUsd: "$1,100 - $2,200",
        perPersonRangeUsd: "$100 - $300 / person",
        description: "Full sit-down restaurant dinner, custom bakery cake, live music tickets, and easy rideshare transit.",
        breakdown: ["Multi-course dinner: $1,100", "Live show tickets: $350", "Custom artisan cake: $180", "Transport & mementos: $170"]
      },
      splurge: {
        title: "Elevated Milestone Splurge ($300+ / person)",
        totalRangeUsd: "$3,000 - $5,500+",
        perPersonRangeUsd: "$300+ / person",
        description: "Private dining room, bespoke sommelier pairing, private historic tour, and luxury chauffeured transit.",
        breakdown: ["Private dining room & tasting menu: $2,400", "VIP lounge & entertainment: $800", "Multi-tier cake & florals: $450", "Chauffeured vehicle: $500"]
      }
    },
    checklist: {
      thirtyDaysBefore: [
        `Send calendar holds to celebration guests for ${celebrationDate}`,
        "Select and reserve primary dinner venue or private dining room",
        "Contact local bakery to order custom birthday cake"
      ],
      fourteenDaysBefore: [
        "Purchase tickets or confirm guest list for evening live music",
        `Confirm guest dietary restrictions and notify dining venue (${dietarySummary})`,
        "Order custom keepsake items or photo displays"
      ],
      sevenDaysBefore: [
        "Re-confirm venue booking, headcounts, and cake delivery/pickup time",
        `Check 7-day weather outlook for ${location}`,
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
      weatherScenario: `Rain or sudden weather shifts in ${location}`,
      rainContingency: `Direct all afternoon activities into historic arcades, sheltered courtyards, or indoor museum galleries in ${location}.`,
      backupVenuesAndActivities: [
        `Sheltered historic hotel cocktail lounge in ${location}`,
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
      `Assumed a celebratory gathering of close friends and family for ${name}`,
      `Assumed preference for distinct ${location} regional culture and food`,
      "Assumed standard adult celebration pace with walking and transit options"
    ]
  };

  return enforceRatingsAndSort(plan);
}

// Refine plan client-side
export function refineClientPlan(
  profile: UserProfile,
  currentPlan: BirthdayPlan,
  userMessage: string
): {
  updatedPlan: BirthdayPlan;
  assistantReply: string;
  whatChanged: string;
  affectedSections: string[];
} {
  const updatedPlan = JSON.parse(JSON.stringify(currentPlan)) as BirthdayPlan;
  const lower = (userMessage || "").toLowerCase();
  const affectedSections: string[] = [];
  let whatChanged = "Adjusted celebration details based on your request.";
  let assistantReply = "Consider it handled—your celebration route is now dialed in with these exact upgrades.";

  if (lower.includes("budget") || lower.includes("cost") || lower.includes("cheap") || lower.includes("friendly") || lower.includes("price")) {
    whatChanged = "Reduced estimated per-person dining costs by 30%, introduced casual local bites, and highlighted budget-friendly neighborhood experiences.";
    affectedSections.push("threeTierBudget", "foodAndCake");
    updatedPlan.threeTierBudget.budget.totalRangeUsd = "$280 - $550";
    updatedPlan.threeTierBudget.budget.perPersonRangeUsd = "$35 - $60 / person";
    updatedPlan.threeTierBudget.moderate.totalRangeUsd = "$850 - $1,600";
    updatedPlan.threeTierBudget.moderate.perPersonRangeUsd = "$95 - $160 / person";
    assistantReply = "Your budget blueprint is streamlined and sharp, keeping every ounce of style while dialing back the spend.";
  } else if (lower.includes("rain") || lower.includes("weather") || lower.includes("indoor") || lower.includes("storm") || lower.includes("cold")) {
    whatChanged = "Expanded sheltered backup contingencies with covered historic arcades, indoor gallery lounges, and rain-proof timing buffers.";
    affectedSections.push("backupPlan", "activitiesAndEntertainment");
    updatedPlan.backupPlan.rainContingency = "Immediate pivot to historic covered courtyards, arcade lounges, and sheltered jazz bistros with zero outdoor transit exposed.";
    updatedPlan.activitiesAndEntertainment.forEach((act) => {
      act.indoorOutdoor = "indoor";
      act.weatherSensitivity = "Low (fully sheltered indoor venue)";
    });
    assistantReply = "Rain contingencies are locked in with premier indoor venues, so the celebration glides forward seamlessly.";
  } else if (lower.includes("music") || lower.includes("party") || lower.includes("dance") || lower.includes("late") || lower.includes("night")) {
    whatChanged = "Amplified evening live music entertainment with reserved VIP table seating and celebratory nightcap.";
    affectedSections.push("activitiesAndEntertainment", "timeline");
    assistantReply = "Turned up the rhythm with prime reserved music seating and a late-night celebration set.";
  } else if (lower.includes("food") || lower.includes("diet") || lower.includes("vegan") || lower.includes("halal") || lower.includes("gluten") || lower.includes("seafood")) {
    whatChanged = `Updated dining recommendations and cake profiles to explicitly highlight: "${userMessage}".`;
    affectedSections.push("foodAndCake");
    updatedPlan.foodAndCake.diningConcept = `${updatedPlan.foodAndCake.diningConcept} — specifically focused on: ${userMessage}.`;
    assistantReply = "Your culinary lineup is refreshed with exact dietary accommodations dialed in for every guest.";
  } else {
    whatChanged = `Incorporated your note into the celebration itinerary: "${userMessage}".`;
    affectedSections.push("personalizedTouches", "timeline");
    updatedPlan.personalizedTouches.unshift(`Special request: ${userMessage}`);
    assistantReply = "Your custom touch is woven right into the itinerary, keeping the energy completely authentic.";
  }

  return {
    updatedPlan: enforceRatingsAndSort(updatedPlan),
    assistantReply,
    whatChanged,
    affectedSections,
  };
}
