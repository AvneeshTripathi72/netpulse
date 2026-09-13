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
    sessionStorage.setItem("netpulse_feedback_auto_shown", "true");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Compact Dialog Box */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-md border border-slate-300 shadow-xl overflow-hidden text-slate-900 animate-fade-in">
          {/* Navy Enterprise Header */}
          <div className="bg-[#0b2545] text-white px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Feedback</h3>
            </div>

            <button
              onClick={handleClose}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4">
            {submitted ? (
              /* Success State */
              <div className="py-3 text-center space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-[#0b2545]">Feedback Sent!</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Thank you for your feedback.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-1 px-3 py-1.5 rounded-md bg-[#0b2545] hover:bg-[#133c6d] text-white text-[11px] font-bold"
                >
                  Send Another
                </button>
              </div>
            ) : (
              /* Clean Form Body: Message Only */
              <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
                {errorMsg && (
                  <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Short Compact Textarea */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    Your Feedback / Message <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={2.5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type message here..."
                    className="w-full rounded-md bg-slate-50 border border-slate-300 p-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2545] resize-none h-16"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#0b2545] hover:bg-[#133c6d] text-white font-bold text-xs uppercase tracking-wider shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Submit
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#0b2545] hover:bg-[#133c6d] text-white font-bold text-xs uppercase tracking-wider shadow-md border border-slate-600 transition-all"
        aria-label="Toggle feedback dialog"
      >
        <MessageSquare className="h-4 w-4 text-cyan-400" />
        <span>Feedback</span>
      </button>
    </div>
  );
}
