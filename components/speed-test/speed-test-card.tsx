"use client";

import { useSpeedTest } from "@/hooks/useSpeedTest";
import { SpeedGauge } from "./speed-gauge";
import { TestProgress } from "./test-progress";
import { SpeedChart } from "./speed-chart";
import { ResultCard } from "./result-card";
import { ServerSelector } from "@/components/network/server-selector";
import { AlertCircle, Clock, Download, Upload, Activity, Server } from "lucide-react";
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
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main Container Card */}
      <div className="bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden">
        {/* Navy Header Strip */}
        <div className="bg-[#0b2545] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
              {isTesting ? "Test Execution in Progress" : "Broadband Test Engine Ready"}
            </span>
          </div>

          <ServerSelector
            selectedServer={selectedServer}
            onSelectServer={setSelectedServer}
            disabled={isTesting}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* If test completed, render ResultCard */}
          {status === "completed" && lastResult ? (
            <ResultCard result={lastResult} onReset={resetTest} />
          ) : (
            <div className="space-y-6">
              {/* Metric Boxes Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 rounded-md bg-slate-50 border border-slate-300 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-slate-700 uppercase">
                    <Clock className="h-3 w-3 text-blue-700" /> Ping
                  </div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-[#0b2545] mt-0.5">
                    {formatPing(ping)} <span className="text-xs font-normal text-slate-500">ms</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-slate-700 uppercase">
                    <Activity className="h-3 w-3 text-blue-700" /> Jitter
                  </div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-[#0b2545] mt-0.5">
                    {formatJitter(jitter)} <span className="text-xs font-normal text-slate-500">ms</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-slate-700 uppercase">
                    <Download className="h-3 w-3 text-blue-700" /> Download
                  </div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-[#0b2545] mt-0.5">
                    {formatSpeed(download).value} <span className="text-xs font-normal text-slate-500">{formatSpeed(download).unit}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-slate-700 uppercase">
                    <Upload className="h-3 w-3 text-blue-700" /> Upload
                  </div>
                  <div className="text-lg sm:text-2xl font-black font-mono text-[#0b2545] mt-0.5">
                    {formatSpeed(upload).value} <span className="text-xs font-normal text-slate-500">{formatSpeed(upload).unit}</span>
                  </div>
                </div>
              </div>

              {/* Error banner if any */}
              {errorMessage && (
                <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
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
    </div>
  );
}
