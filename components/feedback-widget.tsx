"use client";

import { useState } from "react";
import { MessageSquare, X, Send, CheckCircle2, AlertCircle } from "lucide-react";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Corner Dialog Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-lg border border-slate-300 shadow-2xl overflow-hidden text-slate-900 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header Strip */}
          <div className="bg-[#0f2942] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">User Feedback</h3>
            </div>

            <button
              onClick={handleClose}
              className="p-1 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Close feedback dialog"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Dialog Body */}
          <div className="p-4 space-y-3">
            {submitted ? (
              /* Success State */
              <div className="py-4 text-center space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-[#0f2942]">Thank You!</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your feedback has been recorded successfully.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-1 px-3 py-1.5 rounded bg-[#0f2942] hover:bg-[#163a5c] text-white text-[11px] font-bold uppercase tracking-wider"
                >
                  Send Another
                </button>
              </div>
            ) : (
              /* Clean Form Body */
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {errorMsg && (
                  <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Message Field */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex justify-between">
                    <span>Your Feedback / Message</span>
                    <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or issues..."
                    className="w-full rounded bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f2942] focus:border-transparent resize-none leading-relaxed"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold text-[11px] uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded bg-[#0f2942] hover:bg-[#163a5c] text-white font-bold text-[11px] uppercase tracking-wider shadow-xs disabled:opacity-50 transition-colors"
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
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Corner Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded bg-[#0f2942] hover:bg-[#163a5c] text-white font-bold text-xs uppercase tracking-wider shadow-xl border border-slate-600 transition-all hover:scale-105"
        aria-label="Toggle feedback dialog"
      >
        <MessageSquare className="h-4 w-4 text-cyan-400" />
        <span>Feedback</span>
      </button>
    </div>
  );
}
