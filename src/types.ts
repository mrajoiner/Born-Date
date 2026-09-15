export interface UserProfile {
  fullName: string;
  dob: string; // MM/DD/YYYY or YYYY-MM-DD
  location: string;
  preferredCelebrationDate?: string;
  foodPreferences?: string[];
  dietaryRestrictions?: string[];
  dietaryNotes?: string; // Freeform typed dietary details
  interpretedDietary?: string[]; // Natural language parsed tags
  honoreeRole?: 'boy' | 'girl' | 'either'; // Birthday boy or birthday girl
  budgetTier?: 'tier_under_100' | 'tier_100_to_300' | 'tier_300_to_600' | 'tier_600_plus' | 'budget' | 'moderate' | 'upscale' | 'luxury';
  atmosphere?: string;
  guestCount?: number;
  activityLevel?: 'relaxed' | 'moderate' | 'adventurous';
  experiencePreferences?: string[];
}

export interface SampleVenue {
  name: string;
  type: string;
  neighborhoodOrArea: string;
  whyItFits: string;
  verificationNote: string; // e.g., "Availability to confirm"
  rating?: number; // e.g. 4.9
  reviewCount?: string | number; // e.g. "1,820+ reviews"
  reviewHighlight?: string;
}

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  locationNote?: string;
  isKeyMoment?: boolean;
}

export interface FoodOption {
  name: string;
  cuisine: string;
  costEstimatePerPerson: string;
  atmosphere: string;
  whyItFits: string;
  dietaryNotes: string;
  verificationNote: string;
  rating?: number; // e.g. 4.9
  reviewCount?: string | number; // e.g. "2,450+ reviews"
  reviewHighlight?: string; // Online review snippet/highlight
  ratingSource?: string; // e.g. "Top Rated • Google 4.9"
}

export interface CakeAndDessert {
  cakeIdea: string;
  flavorProfile: string;
  localBakeryApproach: string;
  rating?: number;
  reviewHighlight?: string;
}

export interface ActivityOption {
  title: string;
  category: string;
  duration: string;
  estimatedCost: string;
  activityLevel: string;
  whyItFits: string;
  indoorOutdoor: 'indoor' | 'outdoor' | 'either';
  weatherSensitivity: string;
  verificationNote: string;
  rating?: number; // e.g. 4.8
  reviewCount?: string | number; // e.g. "980+ reviews"
  reviewHighlight?: string;
}

export interface BudgetTierDetails {
  title: string;
  totalRangeUsd: string;
  perPersonRangeUsd: string;
  description: string;
  breakdown: string[];
}

export interface BirthdayPlan {
  birthdayOverview: {
    celebrantName: string;
    ageTurning: string | number;
    celebrationDate: string;
    locationSummary: string;
    summary: string;
  };
  themeAndMood: {
    title: string;
    mood: string;
    colorPalette: string[];
    vibeDescription: string;
  };
  eventFormatAndVenue: {
    format: string;
    venueApproach: string;
    sampleVenues: SampleVenue[];
  };
  timeline: TimelineEvent[];
  foodAndCake: {
    diningConcept: string;
    sampleFoodOptions: FoodOption[];
    cakeAndDessert: CakeAndDessert;
  };
  activitiesAndEntertainment: ActivityOption[];
  personalizedTouches: string[];
  threeTierBudget: {
    budget: BudgetTierDetails;
    moderate: BudgetTierDetails;
    splurge: BudgetTierDetails;
  };
  checklist: {
    thirtyDaysBefore: string[];
    fourteenDaysBefore: string[];
    sevenDaysBefore: string[];
    dayBefore: string[];
    dayOf: string[];
  };
  backupPlan: {
    weatherScenario: string;
    rainContingency: string;
    backupVenuesAndActivities: string[];
    scheduleBufferNotes: string;
  };
  nextDecisions: [string, string, string];
  assumptions: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  whatChanged?: string;
  affectedSections?: string[];
}

export interface SavedSelection {
  id: string;
  type: 'food' | 'experience';
  title: string;
  subtitle: string;
  badge: string;
}

export interface ArchivedPlan {
  id: string;
  archivedAt: string;
  title: string;
  celebrantName: string;
  ageTurning: string | number;
  celebrationDate: string;
  location: string;
  theme: string;
  plan: BirthdayPlan;
  profile: UserProfile;
}
