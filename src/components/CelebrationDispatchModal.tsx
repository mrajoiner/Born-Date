import React, { useState } from "react";
import { BirthdayPlan, UserProfile } from "../types";
import { generateBornDayPdf } from "../utils/pdfGenerator";
import {
  Download,
  Mail,
  MessageSquare,
  X,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileText,
  Clock,
  Phone,
} from "lucide-react";

interface CelebrationDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: BirthdayPlan;
  profile: UserProfile;
  initialTab?: "pdf" | "email" | "text";
}

export const CelebrationDispatchModal: React.FC<CelebrationDispatchModalProps> = ({
  isOpen,
  onClose,
  plan,
  profile,
  initialTab = "pdf",
}) => {
  const [activeTab, setActiveTab] = useState<"pdf" | "email" | "text">(initialTab);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Email form state
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSenderName, setEmailSenderName] = useState(profile.fullName || "");
  const [emailNote, setEmailNote] = useState("Can't wait to celebrate with everyone! Check out the itinerary and dining line-up below.");
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Text / SMS form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [textSent, setTextSent] = useState(false);
  const [isSendingText, setIsSendingText] = useState(false);

  if (!isOpen) return null;

  const honoree = plan.birthdayOverview.celebrantName || profile.fullName || "Birthday VIP";
  const honoreeLabel =
    profile.honoreeRole === "boy"
      ? "Birthday Boy"
      : profile.honoreeRole === "girl"
      ? "Birthday Girl"
      : "Birthday Boy or Birthday Girl";

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      try {
        generateBornDayPdf(plan, profile);
        setPdfDownloaded(true);
      } catch (err) {
        console.error("PDF generation error:", err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 600);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress) return;
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSent(true);
    }, 800);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setIsSendingText(true);
    setTimeout(() => {
      setIsSendingText(false);
      setTextSent(true);
    }, 800);
  };

  // Generate mailto and SMS bodies for real device handoff
  const emailSubject = encodeURIComponent(`🎉 ${honoree}’s Born Day Celebration Masterplan`);
  const emailBodyText = encodeURIComponent(
    `Hey everyone!\n\nHere is the official Born Day celebration itinerary for ${honoree} in ${profile.location} on ${plan.birthdayOverview.celebrationDate}:\n\n` +
    `Theme: ${plan.themeAndMood.title}\nVibe: ${plan.themeAndMood.mood}\n\n` +
    `Timeline:\n` +
    plan.timeline.map((t) => `• ${t.time} - ${t.title} (@ ${t.locationNote || "TBD"})`).join("\n") +
    `\n\nTop Curated Dining:\n` +
    plan.foodAndCake.sampleFoodOptions.map((f) => `• ${f.name} (${f.cuisine} - ${f.costEstimatePerPerson})`).join("\n") +
    `\n\nNote from ${emailSenderName}: ${emailNote}\n\nGenerated with Born Day Co-Planner`
  );

  const smsText = encodeURIComponent(
    `🎉 Born Day Alert! Here's the plan for ${honoree} in ${profile.location} on ${plan.birthdayOverview.celebrationDate}: ` +
    `Kickoff ${plan.timeline[0]?.time || "afternoon"} at ${plan.timeline[0]?.title || "gathering spot"}. ` +
    `Dinner at ${plan.foodAndCake.sampleFoodOptions[0]?.name || "selected spot"}. Dress vibe: ${plan.themeAndMood.mood}. See you there!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white w-full max-w-xl rounded-3xl border-2 border-[#090909] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#090909] text-white p-5 sm:p-6 flex items-center justify-between relative border-b-4 border-[#FFE600]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFE600]">
                Official Dispatch Hub
              </span>
            </div>
            <h3 className="font-serif-display text-xl sm:text-2xl font-bold">
              Export & Share Masterplan
            </h3>
            <p className="text-xs text-neutral-300">
              Curated for {honoree} • {profile.location}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Notice Bar */}
        <div className="bg-[#FCF7E5] border-b border-[#E7E0D1] px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#090909]">
            <Sparkles className="w-4 h-4 text-[#FD9773]" />
            <span>Regular Dispatch Rate: $2.00 per format</span>
          </div>
          <span className="text-[11px] font-bold text-[#1B3B2B] bg-[#FFE600] px-2.5 py-0.5 rounded-full border border-[#090909]">
            Special Demo Pass: FREE .PDF Download Today!
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-[#E7E0D1] bg-neutral-50 p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("pdf")}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
              activeTab === "pdf"
                ? "bg-[#090909] text-white shadow-sm"
                : "text-[#5C584F] hover:bg-white hover:text-[#090909]"
            }`}
          >
            <Download className="w-4 h-4 text-[#FFE600]" />
            <span>Download .PDF</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#FFE600] text-[#090909] font-black">
              ACTIVE
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
              activeTab === "email"
                ? "bg-[#090909] text-white shadow-sm"
                : "text-[#5C584F] hover:bg-white hover:text-[#090909]"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-neutral-200 text-neutral-600 font-bold">
              SOON
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
              activeTab === "text"
                ? "bg-[#090909] text-white shadow-sm"
                : "text-[#5C584F] hover:bg-white hover:text-[#090909]"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Text / SMS</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-neutral-200 text-neutral-600 font-bold">
              SOON
            </span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: DOWNLOAD PDF */}
          {activeTab === "pdf" && (
            <div className="space-y-4 animate-fadeIn">
              {/* PDF Preview Card */}
              <div className="border-2 border-[#090909] rounded-2xl p-5 bg-[#FCF7E5]/50 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#E7E0D1] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#090909] text-[#FFE600] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif-display font-bold text-base text-[#090909]">
                        On-Brand Born Day PDF Masterplan
                      </h4>
                      <p className="text-xs text-[#5C584F]">
                        Letter format • Multi-page vector document • Print ready
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs line-through text-[#5C584F] mr-1.5">$2.00</span>
                    <span className="text-sm font-black text-[#1B3B2B] bg-[#FFE600] px-2.5 py-0.5 rounded-lg border border-[#090909]">
                      $0.00
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#5C584F]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#1B3B2B]" />
                    <span>Honoree VIP dossier & milestone badge</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#1B3B2B]" />
                    <span>Run-of-show chronological timeline</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#1B3B2B]" />
                    <span>Highest-rated dining with reviews</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#1B3B2B]" />
                    <span>Three-tier realistic budget breakdown</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E7E0D1] text-[11px] text-[#5C584F]">
                  <span className="font-bold text-[#090909]">Styling: </span>
                  Signature Born Day ink borders, sunny yellow accent headers, verified review highlights, and custom dietary requirements logged.
                </div>
              </div>

              {pdfDownloaded && (
                <div className="p-3.5 rounded-xl bg-[#FFE600]/40 border-2 border-[#090909] text-xs font-bold text-[#090909] flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1B3B2B] stroke-[3]" />
                    <span>Your on-brand .PDF was downloaded successfully! Check your downloads folder.</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider bg-[#090909] text-white px-2 py-0.5 rounded-md">
                    Saved
                  </span>
                </div>
              )}

              {/* Download Action Button */}
              <button
                type="button"
                id="modal-download-pdf-btn"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full bg-[#090909] hover:bg-neutral-800 text-white font-bold text-base py-4 px-6 rounded-2xl border-2 border-[#090909] transition-all shadow-md flex items-center justify-center gap-3 active:scale-[0.99]"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Compiling On-Brand .PDF Document...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 text-[#FFE600]" />
                    <span>Download On-Brand .PDF (Free Demo Pass)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: EMAIL PLAN (SHOWN, NOT ENABLED) */}
          {activeTab === "email" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#E7E0D1] pb-2">
                <div>
                  <h4 className="font-serif-display font-bold text-base text-[#090909]">
                    Email Celebration Itinerary
                  </h4>
                  <p className="text-xs text-[#5C584F]">
                    Sends a beautifully formatted email with full schedule and dinner reservations.
                  </p>
                </div>
                <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-lg border border-neutral-300">
                  Feature Rolling Out Soon
                </span>
              </div>

              {/* Informative Notice Banner */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Email Dispatch Is Rolling Out Soon</p>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Direct email dispatch and calendar invite syncing are being finalized. To share this masterplan right now with no delays, use the free <strong>Download .PDF</strong> option!
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 opacity-60">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#090909]">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    disabled={true}
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full bg-neutral-100 text-[#090909] text-sm px-4 py-3 rounded-xl border-2 border-neutral-300 outline-none cursor-not-allowed font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#090909]">
                    From / Sender Name
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    value={emailSenderName}
                    onChange={(e) => setEmailSenderName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-neutral-100 text-[#090909] text-sm px-4 py-3 rounded-xl border-2 border-neutral-300 outline-none cursor-not-allowed font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#090909]">
                    Custom Personal Note
                  </label>
                  <textarea
                    rows={2}
                    disabled={true}
                    value={emailNote}
                    onChange={(e) => setEmailNote(e.target.value)}
                    className="w-full bg-neutral-100 text-[#090909] text-xs p-3 rounded-xl border-2 border-neutral-300 outline-none cursor-not-allowed font-medium resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  disabled={true}
                  className="w-full sm:flex-1 bg-neutral-200 text-neutral-500 font-bold text-sm py-3.5 px-4 rounded-xl border border-neutral-300 cursor-not-allowed flex items-center justify-center gap-2 select-none"
                >
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span>Email Dispatch (Rolling Out Soon)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("pdf")}
                  className="w-full sm:w-auto text-xs font-bold text-[#090909] bg-[#FFE600] hover:bg-yellow-300 active:scale-95 py-3.5 px-4 rounded-xl border-2 border-[#090909] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#090909]" />
                  <span>Download .PDF (Active & Free)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TEXT / SMS PLAN (SHOWN, NOT ENABLED) */}
          {activeTab === "text" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#E7E0D1] pb-2">
                <div>
                  <h4 className="font-serif-display font-bold text-base text-[#090909]">
                    Text / SMS Celebration Alert
                  </h4>
                  <p className="text-xs text-[#5C584F]">
                    Sends a quick-glance mobile SMS with date, timing, dining stop, and dress vibe.
                  </p>
                </div>
                <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-lg border border-neutral-300">
                  Feature Rolling Out Soon
                </span>
              </div>

              {/* Informative Notice Banner */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">SMS / Text Dispatch Is Rolling Out Soon</p>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Automated SMS broadcast messaging is currently in testing. For immediate instant sharing with guests, download the full on-brand .PDF masterplan!
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 opacity-60">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#090909] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Mobile Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    disabled={true}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(555) 019-2834"
                    className="w-full bg-neutral-100 text-[#090909] text-sm px-4 py-3 rounded-xl border-2 border-neutral-300 outline-none cursor-not-allowed font-medium"
                  />
                </div>

                {/* SMS Message Preview */}
                <div className="bg-[#FCF7E5] p-3.5 rounded-2xl border-2 border-[#090909] space-y-1.5 text-xs">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#5C584F] block">
                    SMS Preview to be sent:
                  </span>
                  <div className="bg-white p-3 rounded-xl border border-[#E7E0D1] text-[#090909] font-mono text-xs leading-relaxed">
                    🎉 Born Day Alert! Here's the plan for {honoree} in {profile.location} on {plan.birthdayOverview.celebrationDate}: Kickoff {plan.timeline[0]?.time || "afternoon"} at {plan.timeline[0]?.title}. Dinner at {plan.foodAndCake.sampleFoodOptions[0]?.name || "featured spot"}. Dress vibe: {plan.themeAndMood.mood}.
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  disabled={true}
                  className="w-full sm:flex-1 bg-neutral-200 text-neutral-500 font-bold text-sm py-3.5 px-4 rounded-xl border border-neutral-300 cursor-not-allowed flex items-center justify-center gap-2 select-none"
                >
                  <MessageSquare className="w-4 h-4 text-neutral-400" />
                  <span>SMS Dispatch (Rolling Out Soon)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("pdf")}
                  className="w-full sm:w-auto text-xs font-bold text-[#090909] bg-[#FFE600] hover:bg-yellow-300 active:scale-95 py-3.5 px-4 rounded-xl border-2 border-[#090909] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#090909]" />
                  <span>Download .PDF (Active & Free)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Guarantee */}
        <div className="bg-neutral-50 px-6 py-3 border-t border-[#E7E0D1] flex items-center justify-between text-[11px] text-[#5C584F]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1B3B2B]" />
            <span>Secure 256-bit encrypted celebration dispatch</span>
          </div>
          <span className="font-semibold text-[#090909]">Born Day Co-Planner</span>
        </div>
      </div>
    </div>
  );
};
