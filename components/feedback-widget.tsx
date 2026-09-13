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
    <>
      {/* Centered Modal Window Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-lg border border-slate-300 shadow-2xl overflow-hidden text-slate-900">
            {/* Header Strip */}
            <div className="bg-[#0f2942] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">User Feedback</h3>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-md hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors"
                aria-label="Close modal window"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {submitted ? (
                /* Success State */
                <div className="py-6 text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#0f2942]">Thank You for Your Feedback!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    Your feedback has been successfully recorded and sent to our team.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-2 px-4 py-2 rounded-md bg-[#0f2942] hover:bg-[#163a5c] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Send Another Response
                  </button>
                </div>
              ) : (
                /* Clean Form Body */
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {errorMsg && (
                    <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Feedback Message Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex justify-between">
                      <span>Your Feedback / Message</span>
                      <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your thoughts, suggestions, or issues..."
                      className="w-full rounded-md bg-slate-50 border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f2942] focus:border-transparent resize-none leading-relaxed"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2.5 rounded-md border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#0f2942] hover:bg-[#163a5c] text-white font-bold text-xs uppercase tracking-wider shadow-sm disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        "Submitting..."
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
        </div>
      )}

      {/* Floating Button at Bottom Right (visible when modal is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#0f2942] hover:bg-[#163a5c] text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-slate-600 transition-all hover:scale-105"
          aria-label="Open feedback dialog"
        >
          <MessageSquare className="h-4 w-4 text-cyan-400" />
          <span>Feedback</span>
        </button>
      )}
    </>
  );
}
