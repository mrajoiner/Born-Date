import { UserProfile, BirthdayPlan } from "../types";

export const DEFAULT_DEMO_PROFILE: UserProfile = {
  fullName: "Ray Simpson",
  dob: "04/21/1973",
  location: "New Orleans",
  preferredCelebrationDate: "April 21, 2026",
  foodPreferences: ["Creole & Cajun", "Fresh Gulf Seafood", "Craft Cocktails", "Pralines & Beignets"],
  dietaryRestrictions: [],
  budgetTier: "moderate",
  atmosphere: "Cultured, soulful, warm, and rich with authentic live music",
  guestCount: 8,
  activityLevel: "moderate",
  experiencePreferences: ["Frenchmen Street Live Jazz", "Historic Architecture", "Culinary Tasting", "Riverfront Walk"],
};

export const FALLBACK_INITIAL_PLAN: BirthdayPlan = {
  birthdayOverview: {
    celebrantName: "Ray Simpson",
    ageTurning: 53,
    celebrationDate: "April 21, 2026",
    locationSummary: "New Orleans, Louisiana — where storied jazz, historic courtyards, and deep culinary tradition set the stage for an unforgettable celebration.",
    summary: "An evocative, relaxed milestone celebration designed for Ray Simpson turning 53 in New Orleans. Balances legendary Creole dining, an intimate brass and jazz evening on Frenchmen Street, and effortless hospitality among close family and friends."
  },
  themeAndMood: {
    title: "Crescent City Soul & Brass Milestone",
    mood: "Warm gas-lit ambiance, soulful brass rhythms, effortless Southern camaraderie, and rich Creole heritage.",
    colorPalette: ["#1B3B2B", "#FFE600", "#FD9773", "#E7E0D1"],
    vibeDescription: "From morning chicory coffee on a shaded balcony to a candlelit dinner in an 18th-century French Quarter courtyard, followed by world-class live jazz with a Sazerac in hand."
  },
  eventFormatAndVenue: {
    format: "Progressive celebration starting with afternoon historic sightseeing, moving into an elevated courtyard dinner, and culminating in a VIP music club experience.",
    venueApproach: "Secure a private courtyard table or semi-private veranda to allow conversational intimacy before heading to a vibrant live music room.",
    sampleVenues: [
      {
        name: "Arnaud's or Brennan's Courtyard",
        type: "Historic Fine Creole Dining",
        neighborhoodOrArea: "French Quarter",
        whyItFits: "Quintessential New Orleans architecture, legendary hospitality, and private dining rooms suited for a 53rd milestone.",
        verificationNote: "Example suggestion — availability and group reservation to confirm"
      },
      {
        name: "The Spotted Cat Music Club / Snug Harbor",
        type: "Live Jazz & Performance Lounge",
        neighborhoodOrArea: "Marigny / Frenchmen Street",
        whyItFits: "Authentic, foot-tapping traditional jazz without the Bourbon Street tourist rush.",
        verificationNote: "Example suggestion — evening show schedule and table holds to confirm"
      }
    ]
  },
  timeline: [
    {
      time: "11:30 AM",
      title: "Chicory Coffee & Beignet Morning Gathering",
      description: "Casual morning meetup for out-of-town guests and family to gather, sip café au lait, and toast the day.",
      locationNote: "City Park or French Quarter balcony",
      isKeyMoment: false
    },
    {
      time: "02:00 PM",
      title: "Private Architectural & Music History Walking Experience",
      description: "A relaxed 90-minute walk through the Garden District or Faubourg Marigny exploring architectural wonders and musical roots.",
      locationNote: "Garden District / Marigny",
      isKeyMoment: false
    },
    {
      time: "05:00 PM",
      title: "Pre-Dinner Cocktails & Milestone Toast",
      description: "Gather for classic New Orleans cocktails (Sazerac, French 75, or non-alcoholic Pimm's cup) and present Ray with his memory book.",
      locationNote: "Carousel Bar or historic hotel lounge",
      isKeyMoment: false
    },
    {
      time: "06:30 PM",
      title: "Signature Birthday Dinner in Courtyard",
      description: "Multi-course Creole feast featuring Gulf shrimp remoulade, pan-roasted redfish, and warm bread pudding.",
      locationNote: "Historic French Quarter courtyard restaurant",
      isKeyMoment: true
    },
    {
      time: "09:30 PM",
      title: "Frenchmen Street Brass & Jazz Nightcap",
      description: "VIP table reservation for an energetic late set of traditional jazz and blues.",
      locationNote: "Frenchmen Street jazz room",
      isKeyMoment: false
    }
  ],
  foodAndCake: {
    diningConcept: "A tribute to Southern Louisiana seafood and classic Creole sauces, celebrating rich flavors without excessive formality.",
    sampleFoodOptions: [
      {
        name: "Galatoire's or Bayona",
        cuisine: "Creole & French Contemporary",
        costEstimatePerPerson: "$65 - $110 / person",
        atmosphere: "Bustling historic dining room or secluded greenery courtyard",
        whyItFits: "Celebrated institution with world-class hospitality tailored for milestone birthdays.",
        dietaryNotes: "Excellent pescatarian and gluten-friendly preparations upon request.",
        verificationNote: "Example suggestion — advance booking required"
      },
      {
        name: "Pêche Seafood Grill",
        cuisine: "Coastal Gulf Seafood & Wood-Fired Fare",
        costEstimatePerPerson: "$45 - $80 / person",
        atmosphere: "Contemporary, airy, and ingredient-forward warehouse district vibe",
        whyItFits: "Unpretentious, award-winning culinary excellence featuring whole-grilled fish and raw bar.",
        dietaryNotes: "Broad variety of dietary options and shellfish-free options.",
        verificationNote: "Example suggestion — availability to confirm"
      }
    ],
    cakeAndDessert: {
      cakeIdea: "Artisan Bourbon Pecan Praline Doberge Cake",
      flavorProfile: "Eight delicate layers of sponge cake layered with rich dark chocolate pudding and Bavarian cream, topped with candied Louisiana pecans.",
      localBakeryApproach: "Order 7-10 days in advance from a storied local bakery (such as Gambino's or Bakery Bar) with custom 53rd birthday gold-foil topper."
    }
  },
  activitiesAndEntertainment: [
    {
      title: "Frenchmen Street VIP Jazz Experience",
      category: "Live Music",
      duration: "2 - 2.5 hours",
      estimatedCost: "$35 - $60 per person",
      activityLevel: "relaxed",
      whyItFits: "Direct connection to New Orleans' musical soul; intimate and authentic.",
      indoorOutdoor: "indoor",
      weatherSensitivity: "None (indoor climate-controlled)",
      verificationNote: "Example suggestion — check showtimes 2 weeks prior"
    },
    {
      title: "Steamboat Natchez Sunset Harbor Cruise",
      category: "Riverfront Sightseeing",
      duration: "2 hours",
      estimatedCost: "$40 - $55 per person",
      activityLevel: "relaxed",
      whyItFits: "Stunning Mississippi river breezes and panoramic skyline views during golden hour.",
      indoorOutdoor: "either",
      weatherSensitivity: "Moderate (covered decks available)",
      verificationNote: "Example suggestion — seasonal sailing schedule to confirm"
    },
    {
      title: "Garden District Architectural Stroll",
      category: "Culture & History",
      duration: "1.5 hours",
      estimatedCost: "$25 - $35 per person",
      activityLevel: "moderate",
      whyItFits: "Marvel at antebellum mansions and ancient moss-draped live oaks with comfortable pacing.",
      indoorOutdoor: "outdoor",
      weatherSensitivity: "High (swap to Historic New Orleans Collection in case of rain)",
      verificationNote: "Example suggestion — certified guide availability to confirm"
    }
  ],
  personalizedTouches: [
    "Milestone Year 1973 Soundtrack: A custom playlist featuring 1973 classics (Stevie Wonder, Pink Floyd, Al Green, Marvin Gaye) played during pre-dinner drinks and transport.",
    "Bespoke Letterpress Menu Cards: Personalized dinner menus featuring Ray's name and favorite birthday quote.",
    "Custom Praline Gift Tins: Small locally boxed pecan pralines as guest favors wrapped with a thank-you note from Ray.",
    "Vintage Brass Toast: A miniature commemorative brass musician figurine or brass bell for the signature celebration toast."
  ],
  threeTierBudget: {
    budget: {
      title: "Value & Intimate Celebration",
      totalRangeUsd: "$450 - $750",
      perPersonRangeUsd: "$55 - $95",
      description: "Casual Creole food hall experience, picnic by the Bayou St. John, bakery Doberge cake, and open-seating live music clubs.",
      breakdown: [
        "Casual dinner & shared plates: $320",
        "Artisan bakery cake & bubbly: $130",
        "Public music venue cover charges: $100",
        "Personalized favors & decorations: $50"
      ]
    },
    moderate: {
      title: "Balanced Celebration (Recommended)",
      totalRangeUsd: "$1,250 - $2,400",
      perPersonRangeUsd: "$150 - $280",
      description: "Full seated 3-course dinner in a private courtyard, reserved jazz club seating, custom Doberge cake, and pre-arranged transit.",
      breakdown: [
        "Courtyard 3-course dinner & wine: $1,200",
        "Reserved music club admission & drinks: $450",
        "Custom artisan bakery cake & champagne toast: $250",
        "Walking tour guide & private ride transfers: $300"
      ]
    },
    splurge: {
      title: "Elevated Milestone Luxury",
      totalRangeUsd: "$3,500 - $6,000+",
      perPersonRangeUsd: "$420 - $750+",
      description: "Private dining room at an iconic Creole institution, chartered riverboat deck, private second-line brass band escort, and luxury transport.",
      breakdown: [
        "Private room multi-course tasting & sommelier pairings: $2,800",
        "Private second line brass band & permit: $1,100",
        "VIP jazz club balcony buyout: $800",
        "Chauffeured towncars & luxury commemorative keepsakes: $600"
      ]
    }
  },
  checklist: {
    thirtyDaysBefore: [
      "Confirm guest count (8 guests) and lock in the celebration weekend",
      "Reserve primary courtyard dinner table or private dining area",
      "Order custom 53rd birthday Doberge cake with local bakery",
      "Verify hotel accommodations for out-of-town guests"
    ],
    fourteenDaysBefore: [
      "Purchase tickets or table holds for Frenchmen Street live jazz",
      "Collect dietary preferences and submit to dinner venue",
      "Assemble 1973 birthday milestone playlist"
    ],
    sevenDaysBefore: [
      "Call dinner venue to re-confirm reservation headcount and cake arrival timing",
      "Check New Orleans 7-day weather forecast for rain or high humidity",
      "Print or prepare personalized menus and toast notes"
    ],
    dayBefore: [
      "Confirm bakery pickup or courier delivery window for the cake",
      "Send reminder group message with timeline and dress code advice",
      "Verify rideshare or transport vouchers for guests"
    ],
    dayOf: [
      "9:00 AM: Send morning welcome text to Ray and party guests",
      "11:15 AM: Arrive early for morning coffee meetup",
      "5:00 PM: Set up personalized dinner table touches",
      "6:30 PM: Raise the milestone 53rd toast!"
    ]
  },
  backupPlan: {
    weatherScenario: "Sudden Gulf subtropical rain shower or summer afternoon downpour",
    rainContingency: "All courtyard dining venues have covered historic verandas. Swap the outdoor walking tour for the indoor air-conditioned Historic New Orleans Collection Museum or the Sazerac House interactive cocktail museum.",
    backupVenuesAndActivities: [
      "The Sazerac House (multi-floor complimentary indoor cocktail history museum)",
      "The Historic New Orleans Collection (French Quarter sheltered galleries)",
      "Preservation Hall (covered historic acoustic jazz hall)"
    ],
    scheduleBufferNotes: "30-45 minute transition cushion provided between afternoon cultural stops and evening dinner so rain transit never disrupts dinner reservations."
  },
  nextDecisions: [
    "Choose between a formal seated courtyard dinner (Brennan's/Arnaud's) or a modern seafood grill (Pêche)",
    "Decide whether to add a private 3-piece acoustic brass escort for the walk from dinner to jazz",
    "Confirm whether any guests require non-alcoholic cocktail pairings"
  ],
  assumptions: [
    "Assumed celebration size of 8 close family members and friends",
    "Calculated Ray Simpson turns 53 in 2026 based on DOB 04/21/1973",
    "Assumed celebration in New Orleans French Quarter and Marigny neighborhoods",
    "All venue availability, ticketing, and pricing are examples subject to direct verification"
  ]
};
