"use client";

import { useSpeedTest } from "@/hooks/useSpeedTest";
import { SpeedGauge } from "./speed-gauge";
import { TestProgress } from "./test-progress";
import { SpeedChart } from "./speed-chart";
import { ResultCard } from "./result-card";
import { ServerSelector } from "@/components/network/server-selector";
import { AlertCircle, Clock, Download, Upload, Activity } from "lucide-react";
import { formatSpeed, formatPing, formatJitter } from "@/lib/utils";

export function SpeedTestCard() {
  const {
    status,
    stage,
    ping,
    jitter,
    download,
    upload,
    currentSpeed,
    progressPercent,
    graphData,
    errorMessage,
    selectedServer,
    setSelectedServer,
    lastResult,
    startTest,
    cancelTest,
    resetTest,
  } = useSpeedTest();

  const isTesting = status !== "idle" && status !== "completed" && status !== "error" && status !== "cancelled";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Header Controls bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            {isTesting ? "Test in Progress" : "Network Engine Active"}
          </span>
        </div>

        <ServerSelector
          selectedServer={selectedServer}
          onSelectServer={setSelectedServer}
          disabled={isTesting}
        />
      </div>

      {/* Main Container Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl relative overflow-hidden">
        {/* If test completed, render ResultCard */}
        {status === "completed" && lastResult ? (
          <ResultCard result={lastResult} onReset={resetTest} />
        ) : (
          <div className="space-y-6">
            {/* Realtime Metrics Quick Grid Header */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 rounded-2xl bg-muted/40 border border-border/40 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-muted-foreground uppercase">
                  <Clock className="h-3 w-3 text-indigo-400" /> Ping
                </div>
                <div className="text-lg sm:text-2xl font-black font-mono text-foreground mt-0.5">
                  {formatPing(ping)} <span className="text-xs font-normal text-muted-foreground">ms</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-muted-foreground uppercase">
                  <Activity className="h-3 w-3 text-purple-400" /> Jitter
                </div>
                <div className="text-lg sm:text-2xl font-black font-mono text-foreground mt-0.5">
                  {formatJitter(jitter)} <span className="text-xs font-normal text-muted-foreground">ms</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-muted-foreground uppercase">
                  <Download className="h-3 w-3 text-cyan-400" /> Download
                </div>
                <div className="text-lg sm:text-2xl font-black font-mono text-foreground mt-0.5">
                  {formatSpeed(download).value} <span className="text-xs font-normal text-muted-foreground">{formatSpeed(download).unit}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-muted-foreground uppercase">
                  <Upload className="h-3 w-3 text-blue-400" /> Upload
                </div>
                <div className="text-lg sm:text-2xl font-black font-mono text-foreground mt-0.5">
                  {formatSpeed(upload).value} <span className="text-xs font-normal text-muted-foreground">{formatSpeed(upload).unit}</span>
                </div>
              </div>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Central Animated Speed Gauge */}
            <SpeedGauge
              status={status}
              stage={stage}
              currentSpeed={currentSpeed}
              progressPercent={progressPercent}
              onStart={startTest}
              onCancel={cancelTest}
            />

            {/* Stepper Progress */}
            {isTesting && <TestProgress stage={stage} />}

            {/* Live Chart area during testing */}
            {(isTesting || graphData.length > 0) && <SpeedChart data={graphData} />}
          </div>
        )}
      </div>
    </div>
  );
}
