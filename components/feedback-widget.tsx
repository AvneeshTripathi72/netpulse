"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X, Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-open 1 second after user lands on website (if not previously dismissed in this session)
  useEffect(() => {
    const hasSeenAutoPopup = sessionStorage.getItem("netpulse_feedback_auto_shown");
    if (!hasSeenAutoPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("netpulse_feedback_auto_shown", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg("Please write a message before submitting.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          rating: 5,
          category: "General",
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setSubmitted(true);
        setMessage("");
      } else {
        setErrorMsg(data.error || "Failed to submit feedback.");
      }
    } catch (err: any) {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMsg(null);
    setMessage("");
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("netpulse_feedback_auto_shown", "true");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Right-Side Popup Modal Box */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 animate-fade-in text-slate-900 dark:text-white relative backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Feedback</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Write your feedback or message</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Close feedback form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {submitted ? (
            /* Success State */
            <div className="py-6 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Thank You!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-4">
                Your feedback message has been sent successfully.
              </p>
              <button
                onClick={handleReset}
                className="mt-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* Clean Form Body: Message + Optional Name/Email */
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Feedback Message Textarea */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message or feedback here..."
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Name & Email Inputs (Optional) */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (Optional)"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-[11px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (Optional)"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-[11px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-600/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Floating Bottom-Right Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wide shadow-xl shadow-cyan-600/30 border border-cyan-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Toggle feedback form"
      >
        <MessageSquare className="h-4 w-4 stroke-[2.5]" />
        <span>Feedback</span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
        </span>
      </button>
    </div>
  );
}
