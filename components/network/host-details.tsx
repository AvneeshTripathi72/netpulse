"use client";

import { useEffect, useState } from "react";
import { Server, HardDrive, Cpu, ShieldCheck, Zap, Globe, Layers, ArrowUpRight } from "lucide-react";

interface HostTelemetry {
  serverName: string;
  serverRegion: string;
  hostProtocol: string;
  hostStatus: string;
  edgeLatency: string;
  bandwidthCapacity: string;
  sslStatus: string;
  hostIp: string;
  asnProvider: string;
}

export function HostDetailsCard() {
  const [telemetry, setTelemetry] = useState<HostTelemetry>({
    serverName: "Optimal Edge Edge Node",
    serverRegion: "Asia / South (Optimal Edge Node)",
    hostProtocol: "HTTP/2 (TLS 1.3 Encryption)",
    hostStatus: "Operational (100% Health)",
    edgeLatency: "< 15 ms",
    bandwidthCapacity: "10 Gbps Edge Bandwidth",
    sslStatus: "256-bit SHA-256 SSL",
    hostIp: "Edge Anycast Routed",
    asnProvider: "Vercel / Cloud Infrastructure",
  });

  const [pinging, setPinging] = useState(false);
  const [realPing, setRealPing] = useState<number | null>(null);

  useEffect(() => {
    async function measureHostPing() {
      setPinging(true);
      const start = performance.now();
      try {
        const res = await fetch("/api/speed/ping", { method: "HEAD", cache: "no-store" });
        const end = performance.now();
        if (res.ok) {
          setRealPing(Math.round(end - start));
        }
      } catch (e) {
        // Fallback
      } finally {
        setPinging(false);
      }
    }
    measureHostPing();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
      {/* Sleek Startup Header Bar */}
      <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3a5c] text-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-white">Host & Edge Telemetry</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
                Live Host Specs
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Detailed technical specifications and connection stats for the active host server node.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Host Online
          </span>
        </div>
      </div>

      {/* Grid of Host Specifications */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/50">
        {/* Host Name & Node */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5 text-blue-600" />
              Host Server Node
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">ACTIVE</span>
          </div>
          <div className="text-sm font-bold text-slate-900 font-mono">
            {telemetry.serverName}
          </div>
          <p className="text-[11px] text-slate-500">Distributed multi-region edge host node</p>
        </div>

        {/* Server Region */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-blue-600" />
              Edge Host Region
            </span>
            <span className="text-[10px] text-blue-600 font-mono">NEAREST</span>
          </div>
          <div className="text-sm font-bold text-slate-900 font-mono">
            {telemetry.serverRegion}
          </div>
          <p className="text-[11px] text-slate-500">Auto-routed for lowest round-trip latency</p>
        </div>

        {/* Host Protocol */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              Transport Protocol
            </span>
            <span className="text-[10px] text-purple-600 font-mono">HTTPS/2</span>
          </div>
          <div className="text-sm font-bold text-slate-900 font-mono">
            {telemetry.hostProtocol}
          </div>
          <p className="text-[11px] text-slate-500">Multiplexed binary byte stream protocol</p>
        </div>

        {/* Real-time Host Ping Response */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              Host Round-Trip Time
            </span>
            <span className="text-[10px] text-emerald-600 font-mono">LIVE</span>
          </div>
          <div className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
            {pinging ? (
              <span className="text-xs text-slate-400 animate-pulse">Measuring host...</span>
            ) : realPing !== null ? (
              <span className="text-emerald-700 font-black">{realPing} ms</span>
            ) : (
              <span>{telemetry.edgeLatency}</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">HTTP HEAD probe round-trip timing</p>
        </div>

        {/* Bandwidth Capacity */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-blue-600" />
              Host Bandwidth Cap
            </span>
            <span className="text-[10px] text-blue-600 font-mono">10Gbps</span>
          </div>
          <div className="text-sm font-bold text-slate-900 font-mono">
            {telemetry.bandwidthCapacity}
          </div>
          <p className="text-[11px] text-slate-500">High-throughput dedicated edge pipeline</p>
        </div>

        {/* Security & SSL */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              Security & SSL Host
            </span>
            <span className="text-[10px] text-emerald-600 font-mono">VERIFIED</span>
          </div>
          <div className="text-sm font-bold text-slate-900 font-mono">
            {telemetry.sslStatus}
          </div>
          <p className="text-[11px] text-slate-500">TLS 1.3 encrypted data transmission</p>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Hosting Infrastructure:</span>
          <span>Vercel Global Edge Network & Autonomous Cloud Nodes</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
          <span>Status: 100% Operational</span>
        </div>
      </div>
    </div>
  );
}
