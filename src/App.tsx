import React, { useState, useEffect, useRef } from "react";
import { UserProfile, BirthdayPlan, ChatMessage, SavedSelection, ArchivedPlan } from "./types";
import { DEFAULT_DEMO_PROFILE, FALLBACK_INITIAL_PLAN } from "./data/demoData";
import { Navbar } from "./components/Navbar";
import { LandingScreen } from "./components/LandingScreen";
import { CustomizationScreen } from "./components/CustomizationScreen";
import { PlanView } from "./components/PlanView";
import { RefinementChat } from "./components/RefinementChat";
import { Toast, ToastData } from "./components/Toast";
import { AlertCircle, RefreshCw } from "lucide-react";
import { IconBirthdayCake, IconSparkle } from "./components/BornDayIcons";
import { generateBornDayPdf } from "./utils/pdfGenerator";
import { ArchivedPlansModal } from "./components/ArchivedPlansModal";
import { NewPlanConfirmModal } from "./components/NewPlanConfirmModal";

const STORAGE_KEY = "born_day_celebration_session_v2";
const ARCHIVE_STORAGE_KEY = "born_day_archived_plans_v1";

type AppStep = "landing" | "customize" | "plan";

export default function App() {
  const [step, setStep] = useState<AppStep>("landing");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_DEMO_PROFILE);
  const [plan, setPlan] = useState<BirthdayPlan | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [savedSelections, setSavedSelections] = useState<SavedSelection[]>([]);
  const [archives, setArchives] = useState<ArchivedPlan[]>([]);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const topRef = useRef<HTMLDivElement | null>(null);

  // 1. Load session & archives from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.plan) {
          setPlan(parsed.plan);
          setStep("plan");
        }
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
        if (parsed.savedSelections) setSavedSelections(parsed.savedSelections);
      }
    } catch (e) {
      console.warn("Could not load stored session from localStorage:", e);
    }

    try {
      const savedArchives = localStorage.getItem(ARCHIVE_STORAGE_KEY);
      if (savedArchives) {
        const parsedArchives = JSON.parse(savedArchives);
        if (Array.isArray(parsedArchives)) {
          setArchives(parsedArchives);
        }
      }
    } catch (e) {
      console.warn("Could not load stored archives from localStorage:", e);
    }
  }, []);

  // 2. Persist latest session in localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        profile,
        plan,
        chatMessages,
        savedSelections,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("Could not save session to localStorage:", e);
    }
  }, [profile, plan, chatMessages, savedSelections]);

  // 3. Persist archives in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archives));
    } catch (e) {
      console.warn("Could not save archives to localStorage:", e);
    }
  }, [archives]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({
      id: Date.now().toString(),
      type,
      message,
    });
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Archive current active plan
  const handleArchivePlan = () => {
    if (!plan) return;
    const honoree = plan.birthdayOverview.celebrantName || profile.fullName || "Birthday VIP";
    const existingIndex = archives.findIndex(
      (a) =>
        a.celebrantName.toLowerCase() === honoree.toLowerCase() &&
        a.celebrationDate === plan.birthdayOverview.celebrationDate &&
        a.theme === plan.themeAndMood.title
    );

    const newArchivedItem: ArchivedPlan = {
      id: existingIndex >= 0 ? archives[existingIndex].id : `plan-archived-${Date.now()}`,
      archivedAt: new Date().toISOString(),
      title: `${honoree}’s Born Day Celebration Plan`,
      celebrantName: honoree,
      ageTurning: plan.birthdayOverview.ageTurning,
      celebrationDate: plan.birthdayOverview.celebrationDate,
      location: profile.location || plan.birthdayOverview.locationSummary,
      theme: plan.themeAndMood.title,
      plan,
      profile,
    };

    setArchives((prev) => {
      const filtered = prev.filter((a) => a.id !== newArchivedItem.id);
      return [newArchivedItem, ...filtered];
    });

    showToast(`Preserved "${honoree}’s Birthday Plan" in your Archives Vault!`, "success");
  };

  // Restore archived plan to active view
  const handleRestorePlan = (archived: ArchivedPlan) => {
    setPlan(archived.plan);
    setProfile(archived.profile);
    setStep("plan");
    const welcomeMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      text: `Restored ${archived.celebrantName}’s celebration masterplan from your archives vault.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages([welcomeMessage]);
    showToast(`Restored ${archived.celebrantName}’s plan to active view!`, "success");
    scrollToTop();
  };

  // Delete single archived plan
  const handleDeleteArchivedPlan = (id: string) => {
    setArchives((prev) => prev.filter((a) => a.id !== id));
    showToast("Archived plan removed from vault.", "info");
  };

  // Clear all archives
  const handleClearAllArchives = () => {
    setArchives([]);
    localStorage.removeItem(ARCHIVE_STORAGE_KEY);
    showToast("All archived celebration plans cleared.", "info");
  };

  // Handle Archive & Create New
  const handleArchiveAndCreateNew = () => {
    if (plan) {
      handleArchivePlan();
    }
    // Reset state to fresh blank intake
    setPlan(null);
    setChatMessages([]);
    setSavedSelections([]);
    setProfile({
      fullName: "",
      dob: "",
      location: "",
      foodPreferences: ["Creole & Cajun", "Fresh Gulf Seafood"],
      dietaryRestrictions: [],
      atmosphere: "Lively Party & Music",
      guestCount: 8,
      budgetTier: "moderate",
    });
    setStep("landing");
    localStorage.removeItem(STORAGE_KEY);
    showToast("Previous plan safely archived. Ready to craft your next celebration!", "success");
    scrollToTop();
  };

  // Handle Discard & Create New
  const handleDiscardAndCreateNew = () => {
    setPlan(null);
    setChatMessages([]);
    setSavedSelections([]);
    setProfile({
      fullName: "",
      dob: "",
      location: "",
      foodPreferences: ["Creole & Cajun", "Fresh Gulf Seafood"],
      dietaryRestrictions: [],
      atmosphere: "Lively Party & Music",
      guestCount: 8,
      budgetTier: "moderate",
    });
    setStep("landing");
    localStorage.removeItem(STORAGE_KEY);
    showToast("Previous plan discarded. Clean canvas ready for a fresh Born Day!", "info");
    scrollToTop();
  };

  // Quick refresh alternatives for the current VIP
  const handleQuickRefreshPlan = () => {
    if (plan) {
      // Auto-archive previous so nothing is lost
      handleArchivePlan();
    }
    showToast("Generating fresh celebration itinerary alternatives for " + (profile.fullName || "VIP") + "...", "info");
    handleGeneratePlan();
  };

  const handleStartOver = () => {
    if (plan || profile.fullName || profile.location) {
      setIsNewPlanModalOpen(true);
    } else {
      handleDiscardAndCreateNew();
    }
  };

  const handleToggleSaveItem = (item: SavedSelection) => {
    setSavedSelections((prev) => {
      const exists = prev.some((s) => s.id === item.id);
      if (exists) {
        showToast(`Removed "${item.title}" from saved selections.`, "info");
        return prev.filter((s) => s.id !== item.id);
      } else {
        showToast(`Saved "${item.title}" to your birthday highlights!`, "success");
        return [...prev, item];
      }
    });
  };

  // Generate initial plan via Gemini backend API
  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setNetworkError(null);

    try {
      const res = await fetch("/api/plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
        setStep("plan");
        const welcomeMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          text: `Your ${profile.location} birthday blueprint is locked in, and we made sure every single stop hits properly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setChatMessages([welcomeMessage]);
        showToast(`Complete Born Day plan crafted for ${profile.fullName}!`, "success");
        scrollToTop();
      } else {
        throw new Error("Invalid plan response received.");
      }
    } catch (err: any) {
      console.error("Plan generation error:", err);
      setNetworkError(err.message || "Failed to generate plan.");
      showToast(`Unable to generate celebration plan: ${err.message}`, "error");

      // Auto-fallback for demo if desired
      if (profile.fullName.toLowerCase().includes("ray") || profile.location.toLowerCase().includes("new orleans")) {
        setPlan(FALLBACK_INITIAL_PLAN);
        setStep("plan");
        const welcomeMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          text: `Ray's 53rd New Orleans birthday blueprint is loaded and ready to celebrate in style.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setChatMessages([welcomeMessage]);
        showToast("Loaded Ray Simpson New Orleans plan.", "info");
        scrollToTop();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Conversational refinement via Gemini chat API
  const handleSendMessage = async (text: string) => {
    if (!plan) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/plan/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPlan: plan,
          userPrompt: text,
          chatHistory: [...chatMessages, userMessage],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.updatedPlan) {
        setPlan(data.updatedPlan);
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        text: data.assistantReply || "Your celebration itinerary is refreshed and ready to roll.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        whatChanged: data.whatChanged,
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
      showToast("Born Day itinerary updated successfully!", "success");
    } catch (err: any) {
      console.error("Refinement error:", err);
      showToast(`Could not refine plan: ${err.message}`, "error");

      const errorReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        text: "Connection hit a quick bump, so give that adjustment one more shot and we will lock it in.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Copy full plan markdown to clipboard
  const handleCopyPlan = async () => {
    if (!plan) return;

    const formattedText = `
# ${plan.birthdayOverview.celebrantName}'s Born Day Celebration Plan
Location: ${profile.location} | Date: ${plan.birthdayOverview.celebrationDate} | Age: ${plan.birthdayOverview.ageTurning} years young!

## 1. Birthday Overview
${plan.birthdayOverview.summary}

## 2. Theme & Mood
Theme: ${plan.themeAndMood.title}
Mood: ${plan.themeAndMood.mood}
${plan.themeAndMood.vibeDescription}

## 3. Event Format & Venue Approach
Format: ${plan.eventFormatAndVenue.format}
Approach: ${plan.eventFormatAndVenue.venueApproach}
Sample Venues:
${plan.eventFormatAndVenue.sampleVenues.map((v) => `- ${v.name} (${v.neighborhoodOrArea}, ${v.type}): ${v.whyItFits} [${v.verificationNote}]`).join("\n")}

## 4. Detailed Timeline
${plan.timeline.map((t) => `${t.time} | ${t.title}: ${t.description} ${t.locationNote ? `(${t.locationNote})` : ""}`).join("\n")}

## 5. Food & Cake
Dining Concept: ${plan.foodAndCake.diningConcept}
Signature Cake: ${plan.foodAndCake.cakeAndDessert.cakeIdea} (${plan.foodAndCake.cakeAndDessert.flavorProfile})
Bakery Approach: ${plan.foodAndCake.cakeAndDessert.localBakeryApproach}
Recommended Dining:
${plan.foodAndCake.sampleFoodOptions.map((f) => `- ${f.name} (${f.cuisine}, ${f.costEstimatePerPerson}): ${f.whyItFits} [${f.verificationNote}]`).join("\n")}

## 6. Activities & Entertainment
${plan.activitiesAndEntertainment.map((a) => `- ${a.title} (${a.category}, ${a.estimatedCost}, ${a.duration}): ${a.whyItFits} [${a.verificationNote}]`).join("\n")}

## 7. Personalized Touches
${plan.personalizedTouches.map((p) => `- ${p}`).join("\n")}

## 8. Three-Tier Budget Estimate (USD)
- Value Tier: ${plan.threeTierBudget.budget.totalRangeUsd} (${plan.threeTierBudget.budget.perPersonRangeUsd}/person)
  ${plan.threeTierBudget.budget.description}
- Balanced Tier (Recommended): ${plan.threeTierBudget.moderate.totalRangeUsd} (${plan.threeTierBudget.moderate.perPersonRangeUsd}/person)
  ${plan.threeTierBudget.moderate.description}
- Milestone Luxury Tier: ${plan.threeTierBudget.splurge.totalRangeUsd} (${plan.threeTierBudget.splurge.perPersonRangeUsd}/person)
  ${plan.threeTierBudget.splurge.description}

## 9. Shopping & Preparation Checklist
30 Days Before:
${plan.checklist.thirtyDaysBefore.map((c) => `[ ] ${c}`).join("\n")}

14 Days Before:
${plan.checklist.fourteenDaysBefore.map((c) => `[ ] ${c}`).join("\n")}

7 Days Before:
${plan.checklist.sevenDaysBefore.map((c) => `[ ] ${c}`).join("\n")}

Day Before:
${plan.checklist.dayBefore.map((c) => `[ ] ${c}`).join("\n")}

Day Of:
${plan.checklist.dayOf.map((c) => `[ ] ${c}`).join("\n")}

## 10. Backup Plan
Weather Scenario: ${plan.backupPlan.weatherScenario}
Rain Contingency: ${plan.backupPlan.rainContingency}
Sheltered Venues: ${plan.backupPlan.backupVenuesAndActivities.join(", ")}
Buffer: ${plan.backupPlan.scheduleBufferNotes}

## 11. Three Next Decisions
1. ${plan.nextDecisions[0]}
2. ${plan.nextDecisions[1]}
3. ${plan.nextDecisions[2]}
`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(formattedText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = formattedText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      showToast("Full Born Day celebration plan copied to clipboard!", "success");
      setTimeout(() => setIsCopied(false), 3000);
    } catch (e) {
      console.error("Clipboard copy error:", e);
      showToast("Could not copy to clipboard automatically.", "error");
    }
  };

  const handleDownloadPdf = () => {
    if (!plan) return;
    try {
      generateBornDayPdf(plan, profile);
      showToast("Official .PDF Masterplan downloaded! Check your downloads folder.", "success");
    } catch (e) {
      console.error("PDF download failed:", e);
      showToast("Could not generate PDF. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF7E5] text-[#090909]">
      <div ref={topRef} />

      {/* Toast Notification Container */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Floating Navigation */}
      <Navbar
        onStartOver={handleStartOver}
        onNavigateHome={() => setStep(plan ? "plan" : "landing")}
        currentStep={step}
        hasPlan={!!plan}
        onDownloadPdf={handleDownloadPdf}
        archivedCount={archives.length}
        onOpenArchives={() => setIsArchiveModalOpen(true)}
        onCreateNewPlan={() => setIsNewPlanModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full space-y-6 py-6 pb-20">
        {/* Network or Key Error Alert Banner if occurred */}
        {networkError && (
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 text-xs text-red-800 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="font-bold text-sm">Celebration Sherpa Notice</p>
                <p>{networkError}</p>
                <button
                  onClick={() => handleGeneratePlan()}
                  className="mt-2 text-xs font-bold underline text-red-900 hover:text-black flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Plan Generation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 1: LANDING INTAKE (Simply says: Let's Plan a Birthday!) */}
        {step === "landing" && (
          <LandingScreen
            profile={profile}
            onChangeProfile={setProfile}
            onContinueToCustomizations={() => {
              setStep("customize");
              scrollToTop();
            }}
          />
        )}

        {/* SCREEN 2: CUSTOMIZATIONS SCREEN */}
        {step === "customize" && (
          <CustomizationScreen
            profile={profile}
            onChangeProfile={setProfile}
            onBackToLanding={() => {
              setStep("landing");
              scrollToTop();
            }}
            onGeneratePlan={handleGeneratePlan}
            isLoading={isLoading}
          />
        )}

        {/* SCREEN 3: PLAN VIEW & REFINEMENT CHAT */}
        {step === "plan" && plan && (
          <div className="space-y-8 animate-fadeIn">
            <PlanView
              plan={plan}
              profile={profile}
              onEditInputs={() => {
                setStep("customize");
                scrollToTop();
              }}
              onStartOver={handleStartOver}
              onCopyPlan={handleCopyPlan}
              isCopied={isCopied}
              savedSelections={savedSelections}
              onToggleSaveItem={handleToggleSaveItem}
              onArchivePlan={handleArchivePlan}
              isArchived={archives.some(
                (a) =>
                  a.celebrantName.toLowerCase() ===
                    (plan.birthdayOverview.celebrantName || "").toLowerCase() &&
                  a.celebrationDate === plan.birthdayOverview.celebrationDate &&
                  a.theme === plan.themeAndMood.title
              )}
              onCreateNewPlan={() => setIsNewPlanModalOpen(true)}
              onOpenArchives={() => setIsArchiveModalOpen(true)}
              archivedCount={archives.length}
              onQuickRefreshPlan={handleQuickRefreshPlan}
            />

            {/* Live Chat Refinement Area with Sherpa */}
            <RefinementChat
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
              onQuickAction={(actionText) => handleSendMessage(actionText)}
            />
          </div>
        )}
      </main>

      {/* Archived Plans Vault Modal */}
      <ArchivedPlansModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        archives={archives}
        onRestorePlan={handleRestorePlan}
        onDeleteArchivedPlan={handleDeleteArchivedPlan}
        onClearAllArchives={handleClearAllArchives}
      />

      {/* New Plan Confirm & Options Modal */}
      <NewPlanConfirmModal
        isOpen={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
        onArchiveAndCreateNew={handleArchiveAndCreateNew}
        onDiscardAndCreateNew={handleDiscardAndCreateNew}
        onQuickRefreshPlan={plan ? handleQuickRefreshPlan : undefined}
        currentPlan={plan}
        currentProfile={profile}
      />

      {/* Footer */}
      <footer className="border-t-2 border-[#090909] bg-white py-6 px-4 text-center">
        <p className="font-serif-display text-sm sm:text-base font-bold text-[#090909]">
          Born Day - Birthday planning
        </p>
      </footer>
    </div>
  );
}
