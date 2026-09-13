"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Radio, Play, Square, Info, ShieldCheck, Server, Globe, Cpu } from "lucide-react";
import { formatPing, formatJitter } from "@/lib/utils";

export default function DiagnosticsPage() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [pingLog, setPingLog] = useState<{ id: number; rtt: number; timestamp: string }[]>([]);
  const [currentPing, setCurrentPing] = useState<number | null>(null);
  const [currentJitter, setCurrentJitter] = useState<number | null>(null);
  const [minPing, setMinPing] = useState<number | null>(null);
  const [maxPing, setMaxPing] = useState<number | null>(null);
  const intervalRef = useRef<any>(null);

  const startContinuousPing = () => {
    setIsMonitoring(true);
    setPingLog([]);
    setMinPing(null);
    setMaxPing(null);

    const runPing = async () => {
      const start = performance.now();
      try {
        const res = await fetch(`/api/speed/ping?t=${Date.now()}`, { cache: "no-store" });
        const end = performance.now();
        if (res.ok) {
          const rtt = Math.round(end - start);
          setCurrentPing(rtt);

          setMinPing((prev) => (prev === null ? rtt : Math.min(prev, rtt)));
          setMaxPing((prev) => (prev === null ? rtt : Math.max(prev, rtt)));

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-[#0f2942] text-xs font-mono font-bold uppercase tracking-wider">
          <Cpu className="h-4 w-4" />
          Technical Instrumentation
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f2942]">Network Diagnostics Dashboard</h1>
        <p className="text-xs text-slate-600">
          Structured diagnostic parameters, browser telemetry, latency stability, and server protocols.
        </p>
      </div>

      {/* Structured Telemetry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* CONNECTION CARD */}
        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#0f2942] border-b border-slate-200 pb-2 uppercase tracking-wider text-[11px]">
            <Globe className="h-4 w-4" />
            <span>CONNECTION</span>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Connection Type:</span>
              <span className="font-bold text-slate-900">4G / Cellular</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Effective Type:</span>
              <span className="font-bold text-slate-900">4G</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Estimated Downlink:</span>
              <span className="font-bold text-slate-900">25 Mbps</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Estimated RTT:</span>
              <span className="font-bold text-slate-900">42 ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data Saver:</span>
              <span className="font-bold text-emerald-700">Disabled</span>
            </div>
          </div>
        </div>

        {/* LATENCY CARD */}
        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#0f2942] border-b border-slate-200 pb-2 uppercase tracking-wider text-[11px]">
            <Activity className="h-4 w-4" />
            <span>LATENCY & JITTER</span>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Average Ping:</span>
              <span className="font-bold text-[#0f2942]">{formatPing(currentPing)} ms</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Minimum Ping:</span>
              <span className="font-bold text-slate-900">{formatPing(minPing)} ms</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Maximum Ping:</span>
              <span className="font-bold text-slate-900">{formatPing(maxPing)} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Calculated Jitter:</span>
              <span className="font-bold text-blue-800">{formatJitter(currentJitter)} ms</span>
            </div>
          </div>
        </div>

        {/* PERFORMANCE CARD */}
        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#0f2942] border-b border-slate-200 pb-2 uppercase tracking-wider text-[11px]">
            <Radio className="h-4 w-4" />
            <span>THROUGHPUT</span>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Download Target:</span>
              <span className="font-bold text-[#0f2942]">Binary Stream</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Upload Target:</span>
              <span className="font-bold text-[#0f2942]">Uint8 Array</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Sample Interval:</span>
              <span className="font-bold text-slate-900">150 ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Parallel Streams:</span>
              <span className="font-bold text-slate-900">3 Connections</span>
            </div>
          </div>
        </div>

        {/* SERVER CARD */}
        <div className="bg-white p-5 rounded-sm border border-slate-300 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#0f2942] border-b border-slate-200 pb-2 uppercase tracking-wider text-[11px]">
            <Server className="h-4 w-4" />
            <span>MEASUREMENT NODE</span>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Selected Node:</span>
              <span className="font-bold text-slate-900 truncate max-w-[110px]">Auto Edge</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Node Distance:</span>
              <span className="font-bold text-slate-900">Optimal RTT</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Transport:</span>
              <span className="font-bold text-slate-900">HTTPS / 1.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Header Caching:</span>
              <span className="font-bold text-emerald-700">no-store</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Continuous Ping Tool */}
      <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0f2942]">Continuous Ping Diagnostic Tool</h2>
            <p className="text-xs text-slate-600">Sends 1-second interval micro-requests to evaluate latency stability</p>
          </div>

          {!isMonitoring ? (
            <button
              onClick={startContinuousPing}
              className="flex items-center gap-2 px-4 py-2 rounded-sm bg-[#0f2942] hover:bg-[#1e3a8a] text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              START PING MONITOR
            </button>
          ) : (
            <button
              onClick={stopContinuousPing}
              className="flex items-center gap-2 px-4 py-2 rounded-sm bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Square className="h-3.5 w-3.5 fill-white" />
              STOP MONITOR
            </button>
          )}
        </div>

        {/* Log stream ticker */}
        {pingLog.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-700">Diagnostic Stream Log (Last 20 Packets)</span>
            <div className="h-44 overflow-y-auto rounded-sm bg-slate-900 p-4 border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
              {pingLog.slice().reverse().map((entry) => (
                <div key={entry.id} className="flex justify-between items-center border-b border-slate-800 pb-1">
                  <span>[{entry.timestamp}] Reply from Measurement Endpoint</span>
                  <span>time={entry.rtt}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
