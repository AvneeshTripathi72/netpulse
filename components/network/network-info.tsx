"use client";

import { useEffect, useState } from "react";
import { NetworkInfo as NetworkInfoType } from "@/types/speed-test";
import { Wifi, Globe, Server, Shield, Radio } from "lucide-react";

export function NetworkInfoCard() {
  const [info, setInfo] = useState<NetworkInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNetworkData() {
      const netData: NetworkInfoType = {
        browserOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      };

      // Read Network Information API if available
      if (typeof navigator !== "undefined" && "connection" in navigator) {
        const conn = (navigator as any).connection;
        if (conn) {
          netData.connectionType = conn.type || conn.effectiveType || "Wifi/Cellular";
          netData.effectiveType = conn.effectiveType ? conn.effectiveType.toUpperCase() : "4G";
          netData.downlink = conn.downlink || undefined;
          netData.rtt = conn.rtt || undefined;
          netData.saveData = conn.saveData || false;
        }
      }

      // Fetch IP / ISP info from Next.js route
      try {
        const res = await fetch("/api/network");
        if (res.ok) {
          const apiData = await res.json();
          netData.ip = apiData.ip;
          netData.isp = apiData.isp;
          netData.country = apiData.country;
          netData.city = apiData.city;
        }
      } catch (err) {
        console.warn("Could not fetch IP info:", err);
      }

      setInfo(netData);
      setLoading(false);
    }

    loadNetworkData();
  }, []);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-border/70 space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Browser Network Specs</h3>
            <p className="text-[11px] text-muted-foreground">Local connection & ISP telemetry</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Connected
        </span>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs font-mono text-muted-foreground animate-pulse">
          Querying browser Network API...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          {/* Connection Type */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase">
              <Wifi className="h-3.5 w-3.5 text-cyan-400" />
              Connection
            </div>
            <div className="text-sm font-bold font-mono text-foreground">
              {info?.effectiveType || "4G / Wi-Fi"}
            </div>
          </div>

          {/* Downlink Estimate */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase">
              <Radio className="h-3.5 w-3.5 text-cyan-400" />
              Downlink Est.
            </div>
            <div className="text-sm font-bold font-mono text-foreground">
              {info?.downlink ? `${info.downlink} Mbps` : "Available"}
            </div>
          </div>

          {/* IP Address */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase">
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              IP Address
            </div>
            <div className="text-sm font-bold font-mono text-foreground truncate">
              {info?.ip || "Detected"}
            </div>
          </div>

          {/* ISP Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase">
              <Server className="h-3.5 w-3.5 text-cyan-400" />
              ISP / Provider
            </div>
            <div className="text-sm font-bold font-mono text-foreground truncate">
              {info?.isp || "Local Provider"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
