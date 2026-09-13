"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X, Send, CheckCircle2, AlertCircle } from "lucide-react";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-open 1 second after user lands on website (if not previously dismissed in session)
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
      {/* Floating Popup Box */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-md border border-slate-300 shadow-xl overflow-hidden text-slate-900">
          {/* Navy Enterprise Header */}
          <div className="bg-[#0b2545] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-cyan-400" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">User Feedback Portal</h3>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Close feedback form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5">
            {submitted ? (
              /* Success State */
              <div className="py-4 text-center space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-[#0b2545]">Feedback Submitted</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your message has been sent successfully to the portal team.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-4 py-2 rounded-md bg-[#0b2545] hover:bg-[#133c6d] text-white text-xs font-bold"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              /* Clean Form Body */
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {errorMsg && (
                  <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Feedback Message Textarea */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Your Message <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your feedback or message here..."
                    className="w-full rounded-md bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2545] resize-none"
                  />
                </div>

                {/* Name & Email Inputs (Optional) */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name (Optional)"
                    className="w-full rounded-md bg-slate-50 border border-slate-300 px-3 py-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2545]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (Optional)"
                    className="w-full rounded-md bg-slate-50 border border-slate-300 px-3 py-2 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2545]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-[#0b2545] hover:bg-[#133c6d] text-white font-bold text-xs uppercase tracking-wider shadow-sm disabled:opacity-50"
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
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#0b2545] hover:bg-[#133c6d] text-white font-bold text-xs uppercase tracking-wider shadow-md border border-slate-600 transition-all"
        aria-label="Toggle feedback form"
      >
        <MessageSquare className="h-4 w-4 text-cyan-400" />
        <span>Feedback</span>
      </button>
    </div>
  );
}
