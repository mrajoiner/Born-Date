import React, { useState } from "react";
import { ArchivedPlan, BirthdayPlan, UserProfile } from "../types";
import { generateBornDayPdf } from "../utils/pdfGenerator";
import {
  Archive,
  X,
  Calendar,
  MapPin,
  Download,
  RotateCcw,
  Trash2,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface ArchivedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  archives: ArchivedPlan[];
  onRestorePlan: (archived: ArchivedPlan) => void;
  onDeleteArchivedPlan: (id: string) => void;
  onClearAllArchives: () => void;
  currentPlanId?: string;
}

export const ArchivedPlansModal: React.FC<ArchivedPlansModalProps> = ({
  isOpen,
  onClose,
  archives,
  onRestorePlan,
  onDeleteArchivedPlan,
  onClearAllArchives,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredArchives = archives.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.celebrantName.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term) ||
      item.theme.toLowerCase().includes(term) ||
      item.title.toLowerCase().includes(term)
    );
  });

  const handleDownloadPdf = (item: ArchivedPlan) => {
    setDownloadingId(item.id);
    setTimeout(() => {
      try {
        generateBornDayPdf(item.plan, item.profile);
      } catch (err) {
        console.error("Error generating archived PDF:", err);
      } finally {
        setDownloadingId(null);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl border-2 border-[#090909] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#090909] text-white p-5 sm:p-6 border-b-4 border-[#FFE600] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFE600]">
                Plan Archives Vault
              </span>
            </div>
            <h3 className="font-serif-display text-xl sm:text-2xl font-bold">
              Archived Celebration Plans
            </h3>
            <p className="text-xs text-neutral-300">
              {archives.length === 1
                ? "1 celebration masterplan preserved in vault"
                : `${archives.length} celebration masterplans preserved in vault`}
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

        {/* Search Bar & Actions Bar */}
        <div className="p-4 sm:px-6 bg-[#FCF7E5] border-b border-[#E7E0D1] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5C584F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by VIP name, city, or theme..."
              className="w-full bg-white text-[#090909] text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-[#090909] outline-none focus:ring-2 focus:ring-[#FFE600] placeholder:text-[#5C584F]/60"
            />
          </div>

          {archives.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Clear all archived celebration plans permanently?")) {
                  onClearAllArchives();
                }
              }}
              className="text-xs font-bold text-red-700 hover:text-red-900 bg-white hover:bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors self-end sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Vault</span>
            </button>
          )}
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 bg-neutral-50/50">
          {archives.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-2 border-[#090909] mx-auto flex items-center justify-center text-[#090909] shadow-xs">
                <Archive className="w-7 h-7" />
              </div>
              <h4 className="font-serif-display font-bold text-lg text-[#090909]">
                No Archived Plans Stored Yet
              </h4>
              <p className="text-xs text-[#5C584F] max-w-sm mx-auto leading-relaxed">
                Click “Archive Plan” or “Archive & Create New” on any celebration plan to store it here. You will be able to restore, review, and download .PDFs whenever you need.
              </p>
            </div>
          ) : filteredArchives.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#5C584F]">
              No archived plans matched "{searchTerm}".
            </div>
          ) : (
            filteredArchives.map((item) => {
              const archiveDate = new Date(item.archivedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={item.id}
                  className="bg-white border-2 border-[#090909] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E0D1] pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif-display font-bold text-base sm:text-lg text-[#090909]">
                          {item.celebrantName}’s Birthday Plan
                        </h4>
                        <span className="text-[10px] font-bold bg-[#FFE600] text-[#090909] px-2 py-0.5 rounded-full border border-[#090909]">
                          Turning {item.ageTurning}
                        </span>
                      </div>
                      <p className="text-xs text-[#5C584F] flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#090909]" />
                          {item.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#090909]" />
                          {item.celebrationDate}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#5C584F] bg-[#FCF7E5] px-2.5 py-1 rounded-lg border border-[#E7E0D1] self-start sm:self-auto">
                      <Clock className="w-3 h-3" />
                      <span>{archiveDate}</span>
                    </div>
                  </div>

                  {/* Summary & Theme snippet */}
                  <div className="bg-[#FCF7E5]/60 p-2.5 rounded-xl text-xs text-[#090909] space-y-1">
                    <p className="font-semibold flex items-center gap-1.5 text-[#1B3B2B]">
                      <Sparkles className="w-3.5 h-3.5 text-[#FD9773]" />
                      <span>Theme: {item.theme}</span>
                    </p>
                    <p className="text-[#5C584F] line-clamp-2">
                      {item.plan.birthdayOverview.summary}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onRestorePlan(item);
                          onClose();
                        }}
                        className="text-xs font-bold text-[#090909] bg-[#FFE600] hover:bg-yellow-300 px-3.5 py-2 rounded-xl border border-[#090909] flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore to Active</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(item)}
                        disabled={downloadingId === item.id}
                        className="text-xs font-bold text-[#090909] bg-white hover:bg-[#FCF7E5] px-3.5 py-2 rounded-xl border border-[#090909] flex items-center gap-1.5 transition-colors"
                      >
                        {downloadingId === item.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-[#090909]/30 border-t-[#090909] rounded-full animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>Download .PDF</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete archived plan for ${item.celebrantName}?`)) {
                          onDeleteArchivedPlan(item.id);
                        }
                      }}
                      className="p-2 text-neutral-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete from archive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E7E0D1] flex items-center justify-between text-xs text-[#5C584F]">
          <span>Plans are kept safely in your local browser vault.</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-[#090909] hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
