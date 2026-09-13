import { CheckCircle2, ShieldCheck, Activity, Server, Database, Key } from "lucide-react";

export default function StatusPage() {
  const services = [
    { name: "Speed Test Engine Service", status: "OPERATIONAL", icon: Activity, desc: "Latency, download & upload streaming endpoints" },
    { name: "Measurement API Endpoints", status: "OPERATIONAL", icon: Server, desc: "/api/speed/ping, /api/speed/download, /api/speed/upload" },
    { name: "Database & History Storage", status: "OPERATIONAL", icon: Database, desc: "Supabase PostgreSQL & LocalStorage fallback" },
    { name: "User Authentication Service", status: "OPERATIONAL", icon: Key, desc: "Supabase Auth session token verification" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#0f2942]">
          <Activity className="h-4 w-4 text-emerald-600" />
          System Telemetry
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f2942]">Service Operational Status</h1>
        <p className="text-xs text-slate-600">
          Real-time status overview of NetPulse public measurement infrastructure services.
        </p>
      </div>

      {/* Main Overall Status Card */}
      <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall System Status</div>
            <div className="text-lg font-black text-[#0f2942]">All Systems Operational</div>
          </div>
        </div>

        <div className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-sm border border-emerald-200 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          OPERATIONAL
        </div>
      </div>

      {/* Services List Table */}
      <div className="bg-white rounded-sm border border-slate-300 shadow-sm overflow-hidden">
        <div className="bg-[#0f2942] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider">
          Individual Service Component Status
        </div>
        <div className="divide-y divide-slate-200 text-xs font-sans">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-sm bg-slate-100 text-[#0f2942] border border-slate-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo Disclaimer Note */}
      <div className="p-3 bg-slate-100 border border-slate-300 text-[11px] text-slate-600 rounded-sm">
        <strong className="text-slate-800">Note:</strong> Demo system status — status indicators reflect current local application runtime availability.
      </div>
    </div>
  );
}
