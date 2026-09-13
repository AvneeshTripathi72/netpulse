"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Radio, Play, Square, Info, ShieldCheck, Zap, Server } from "lucide-react";
import { formatPing, formatJitter } from "@/lib/utils";

export default function DiagnosticsPage() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [pingLog, setPingLog] = useState<{ id: number; rtt: number; timestamp: string }[]>([]);
  const [currentPing, setCurrentPing] = useState<number | null>(null);
  const [currentJitter, setCurrentJitter] = useState<number | null>(null);
  const intervalRef = useRef<any>(null);

  const startContinuousPing = () => {
    setIsMonitoring(true);
    setPingLog([]);

    const runPing = async () => {
      const start = performance.now();
      try {
        const res = await fetch(`/api/speed/ping?t=${Date.now()}`, { cache: "no-store" });
        const end = performance.now();
        if (res.ok) {
          const rtt = Math.round(end - start);
          setCurrentPing(rtt);

          setPingLog((prev) => {
            const newLog = [...prev, { id: Date.now(), rtt, timestamp: new Date().toLocaleTimeString() }].slice(-20);
            if (newLog.length > 1) {
              let jitterSum = 0;
              for (let i = 1; i < newLog.length; i++) {
                jitterSum += Math.abs(newLog[i].rtt - newLog[i - 1].rtt);
              }
              setCurrentJitter(Math.round((jitterSum / (newLog.length - 1)) * 10) / 10);
            }
            return newLog;
          });
        }
      } catch (err) {
        console.warn("Ping monitor error:", err);
      }
    };

    runPing();
    intervalRef.current = setInterval(runPing, 1000);
  };

  const stopContinuousPing = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="border-b border-border/60 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <Activity className="h-4 w-4" />
          Realtime Telemetry
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Network Diagnostics</h1>
        <p className="text-xs text-muted-foreground mt-1">Live latency monitoring, packet variation analyzer, and network guides.</p>
      </div>

      {/* Live Continuous Ping Tool */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-border/80 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Continuous Ping Monitor</h2>
              <p className="text-xs text-muted-foreground">Sends 1-second interval pings to measure real-time latency stability</p>
            </div>
          </div>

          {!isMonitoring ? (
            <button
              onClick={startContinuousPing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              Start Ping Monitor
            </button>
          ) : (
            <button
              onClick={stopContinuousPing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
            >
              <Square className="h-4 w-4 fill-white" />
              Stop Monitor
            </button>
          )}
        </div>

        {/* Live Readout Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-center">
            <span className="text-xs font-mono text-muted-foreground uppercase">Current Ping</span>
            <div className="text-3xl font-black font-mono text-cyan-400 mt-1">
              {formatPing(currentPing)} <span className="text-xs font-normal text-muted-foreground">ms</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-center">
            <span className="text-xs font-mono text-muted-foreground uppercase">Calculated Jitter</span>
            <div className="text-3xl font-black font-mono text-purple-400 mt-1">
              {formatJitter(currentJitter)} <span className="text-xs font-normal text-muted-foreground">ms</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-center col-span-2 sm:col-span-1">
            <span className="text-xs font-mono text-muted-foreground uppercase">Packets Sent</span>
            <div className="text-3xl font-black font-mono text-foreground mt-1">
              {pingLog.length}
            </div>
          </div>
        </div>

        {/* Log stream ticker */}
        {pingLog.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase text-muted-foreground">Recent Ping Stream (Last 20)</span>
            <div className="h-40 overflow-y-auto rounded-xl bg-slate-950 p-4 border border-border/60 font-mono text-xs text-emerald-400 space-y-1">
              {pingLog.slice().reverse().map((entry) => (
                <div key={entry.id} className="flex justify-between items-center border-b border-slate-900 pb-1">
                  <span>[{entry.timestamp}] Reply from Edge Server</span>
                  <span>time={entry.rtt}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Network Metrics Explanations Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Network Metrics Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-2">
            <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Ping (Latency)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              How quickly your connection responds to a request. Lower values (e.g. &lt; 20 ms) mean instant responsiveness for online gaming, voice calls, and interactive apps.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-2">
            <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Jitter (Latency Variation)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Variation in latency over consecutive ping requests. Lower values (e.g. &lt; 3 ms) indicate a steady, stable connection without random lag spikes.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-2">
            <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
              <Server className="h-4 w-4" />
              Download Speed
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              How quickly data can be received from remote servers to your device. High download bandwidth allows fast website loading, 4K streaming, and quick file downloads.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-2">
            <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Upload Speed
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              How quickly data can be sent from your device to remote servers. Important for video calls, uploading large files, backing up data, and live streaming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
