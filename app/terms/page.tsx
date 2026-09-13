import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#0f2942]">
          <FileText className="h-4 w-4" />
          Service Agreement
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f2942]">Terms of Service</h1>
        <p className="text-xs text-slate-600">Document Reference: NP-POL-TERMS-2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-sm border border-slate-300 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0f2942] border-b border-slate-200 pb-2">1. Terms of Use</h2>
          <p>
            NetPulse provides an independent, browser-based broadband speed measurement service. By accessing this portal, you agree to use the measurement utility for lawful network analysis purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0f2942] border-b border-slate-200 pb-2">2. Measurement Nature & Disclaimer</h2>
          <p>
            All measurement data, latency metrics, and connection assessments are browser-level estimates performed over standard network connections. They do not constitute official legal certifications or guarantee specific ISP service level agreements.
          </p>
        </section>
      </div>
    </div>
  );
}
