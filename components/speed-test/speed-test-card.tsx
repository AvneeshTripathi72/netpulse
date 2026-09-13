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
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Top Header Controls bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isTesting ? "Test in Progress" : "Network Engine Ready"}
          </span>
        </div>

        <ServerSelector
          selectedServer={selectedServer}
          onSelectServer={setSelectedServer}
          disabled={isTesting}
        />
      </div>

      {/* Main Container Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* If test completed, render ResultCard */}
        {status === "completed" && lastResult ? (
          <ResultCard result={lastResult} onReset={resetTest} />
        ) : (
          <div className="space-y-6">
            {/* Realtime Metrics Quick Grid Header */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  <Clock className="h-3 w-3 text-indigo-500" /> Ping
                </div>
                <div className="text-lg sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatPing(ping)} <span className="text-xs font-normal text-slate-500">ms</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  <Activity className="h-3 w-3 text-purple-500" /> Jitter
                </div>
                <div className="text-lg sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatJitter(jitter)} <span className="text-xs font-normal text-slate-500">ms</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  <Download className="h-3 w-3 text-cyan-600 dark:text-cyan-400" /> Download
                </div>
                <div className="text-lg sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatSpeed(download).value} <span className="text-xs font-normal text-slate-500">{formatSpeed(download).unit}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  <Upload className="h-3 w-3 text-blue-600 dark:text-blue-400" /> Upload
                </div>
                <div className="text-lg sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatSpeed(upload).value} <span className="text-xs font-normal text-slate-500">{formatSpeed(upload).unit}</span>
                </div>
              </div>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-3">
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
