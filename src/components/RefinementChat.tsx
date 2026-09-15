import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { SoloGuide } from "./CelebrationSherpas";
import {
  IconBudget,
  IconUmbrella,
  IconCompass,
  IconMapPin,
  IconSparkle,
  IconCelebrant,
  IconBirthdayCake,
} from "./BornDayIcons";
import { Send, RefreshCw } from "lucide-react";

interface RefinementChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onQuickAction: (actionText: string) => void;
}

export const RefinementChat: React.FC<RefinementChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onQuickAction,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const quickActions = [
    {
      label: "Make it more budget-friendly",
      icon: IconBudget,
      prompt: "Make it more budget-friendly",
    },
    {
      label: "Add a rain plan",
      icon: IconUmbrella,
      prompt: "Add a comprehensive rain plan and indoor sheltered contingencies",
    },
    {
      label: "Suggest more activities",
      icon: IconCompass,
      prompt: "Suggest more celebratory activities, music stops, and scenic moments",
    },
    {
      label: "Make it feel more local",
      icon: IconMapPin,
      prompt: "Make it feel more local with authentic hidden-gem traditions and neighborhood spots",
    },
  ];

  return (
    <section
      id="refinement-chat-section"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4"
    >
      {/* Screen 4: Arlo (girl) holding sign REFINE - frameless, big stick figure */}
      <SoloGuide
        character="arlo"
        signText="REFINE"
        title="Trailside Refinement"
        speechText="Drop your tweaks below and we will upgrade the stops, budget, and timings in real time."
      />

      <div className="bg-white rounded-3xl border-2 border-[#090909] p-5 sm:p-8 shadow-sm space-y-6">
        {/* Chat Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E0D1] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <IconSparkle className="w-4 h-4 text-[#090909]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C584F]">
                Conversational Co-Planner
              </span>
            </div>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#090909]">
              Live Plan Refinement
            </h3>
          </div>
        </div>

        {/* Quick Action Suggestions */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#5C584F] block">
            Quick Route Adjustments:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  id={`quick-action-btn-${idx}`}
                  onClick={() => onQuickAction(action.prompt)}
                  disabled={isLoading}
                  className="bg-[#FCF7E5] hover:bg-[#FAF082] text-[#090909] text-xs font-bold px-3.5 py-2 rounded-full border border-[#090909] active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Icon className="w-3.5 h-3.5 text-[#090909]" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Stream */}
        <div
          id="chat-messages-container"
          className="space-y-4 max-h-[440px] overflow-y-auto p-4 rounded-2xl bg-[#FCF7E5]/50 border-2 border-[#090909]"
        >
          {messages.length === 0 ? (
            <div className="text-center py-8 text-[#5C584F] text-xs">
              <IconCompass className="w-8 h-8 text-[#090909]/40 mx-auto mb-2" />
              <p className="font-bold text-[#090909]">No revisions requested yet.</p>
              <p className="text-[11px] mt-0.5">
                Type any tweak above or use the quick action buttons to shape the plan.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#FAF082] border border-[#090909] flex items-center justify-center flex-shrink-0 mt-1">
                      <IconBirthdayCake className="w-4 h-4 text-[#090909]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm ${
                      isUser
                        ? "bg-[#090909] text-white rounded-tr-xs"
                        : "bg-white text-[#090909] border-2 border-[#090909] rounded-tl-xs shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                      <span className="font-bold uppercase tracking-wider">
                        {isUser ? "You" : "Born Day Sherpa"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {/* Diff notice if assistant modified the plan */}
                    {msg.whatChanged && (
                      <div className="mt-2.5 pt-2 border-t border-[#090909]/15 text-xs text-[#090909] bg-[#FAF082] rounded-xl p-2.5 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <IconSparkle className="w-3.5 h-3.5" />
                          <span>Plan Updated:</span>
                        </div>
                        <p className="text-[11px] leading-snug">{msg.whatChanged}</p>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#090909] border border-[#090909] flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <IconCelebrant className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FAF082] border border-[#090909] flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-3.5 h-3.5 text-[#090909] animate-spin" />
              </div>
              <div className="bg-white border-2 border-[#090909] rounded-2xl rounded-tl-xs p-3.5 shadow-2xs">
                <p className="text-xs text-[#090909] flex items-center gap-2">
                  <span>Sherpa is revising the plan...</span>
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id="refinement-input-field"
              type="text"
              placeholder="Ask for changes (e.g., 'Swap to outdoor rooftop', 'Add a 2pm brewery stop', 'Make budget under $600')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white text-sm text-[#090909] border-2 border-[#090909] rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#FAF082] placeholder:text-[#5C584F]/50 transition-all disabled:opacity-50"
            />
          </div>

          <button
            id="refinement-send-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-[#090909] text-white hover:bg-neutral-800 active:scale-95 disabled:opacity-40 font-bold px-5 py-3.5 rounded-2xl border-2 border-[#090909] transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-[#FAF082]" />
            <span className="hidden sm:inline text-xs uppercase tracking-wider">Send</span>
          </button>
        </form>
      </div>
    </section>
  );
};
