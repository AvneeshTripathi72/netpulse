"use client";

import { useSpeedTest } from "@/hooks/useSpeedTest";
import { SpeedGauge } from "./speed-gauge";
import { TestProgress } from "./test-progress";
import { SpeedChart } from "./speed-chart";
import { ResultCard } from "./result-card";
import { ServerSelector } from "@/components/network/server-selector";
import { AlertCircle, Clock, Download, Upload, Activity, Info, HelpCircle } from "lucide-react";
import { formatSpeed, formatPing, formatJitter } from "@/lib/utils";
import Link from "next/link";

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
      {/* Main Container Card */}
      <div className="bg-white rounded-sm border border-slate-300 shadow-sm overflow-hidden">
        {/* Navy Header Strip */}
        <div className="bg-[#0f2942] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
              {isTesting ? "Test Execution in Progress" : "BROADBAND SPEED TEST PANEL"}
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
              <div className="grid grid-cols-4 gap-2 sm:gap-4 p-4 rounded-sm bg-slate-50 border border-slate-300 text-center font-mono">
                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-700 uppercase">
                    <Clock className="h-3 w-3 text-[#0f2942]" /> PING
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-[#0f2942] mt-0.5">
                    {formatPing(ping)} <span className="text-xs font-normal text-slate-500">ms</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-700 uppercase">
                    <Activity className="h-3 w-3 text-[#0f2942]" /> JITTER
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-[#0f2942] mt-0.5">
                    {formatJitter(jitter)} <span className="text-xs font-normal text-slate-500">ms</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-700 uppercase">
                    <Download className="h-3 w-3 text-[#0f2942]" /> DOWNLOAD
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-[#0f2942] mt-0.5">
                    {formatSpeed(download).value} <span className="text-xs font-normal text-slate-500">{formatSpeed(download).unit}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-700 uppercase">
                    <Upload className="h-3 w-3 text-[#0f2942]" /> UPLOAD
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-[#0f2942] mt-0.5">
                    {formatSpeed(upload).value} <span className="text-xs font-normal text-slate-500">{formatSpeed(upload).unit}</span>
                  </div>
                </div>
              </div>

              {/* Error banner if any */}
              {errorMessage && (
                <div className="p-4 rounded-sm bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
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

      {/* Prominent "How this measurement was performed" Section */}
      <div className="bg-white p-6 rounded-sm border border-slate-300 shadow-sm space-y-3 font-sans text-xs text-slate-700">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="font-bold text-[#0f2942] uppercase flex items-center gap-1.5 text-sm">
            <Info className="h-4 w-4 text-blue-700" />
            How this measurement was performed
          </h3>
          <Link href="/methodology" className="text-blue-700 font-bold hover:underline">
            View Methodology →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 leading-relaxed pt-1">
          <div>
            <strong className="text-slate-900 block mb-0.5">Download Speed:</strong>
            Calculated from the amount of binary data transferred from the measurement endpoint to your browser over a measured period.
          </div>
          <div>
            <strong className="text-slate-900 block mb-0.5">Upload Speed:</strong>
            Calculated from the amount of binary data transferred from your browser to the measurement server.
          </div>
          <div>
            <strong className="text-slate-900 block mb-0.5">Latency (Ping):</strong>
            Represents round-trip communication time required for a packet to reach the test endpoint and return.
          </div>
          <div>
            <strong className="text-slate-900 block mb-0.5">Jitter:</strong>
            Represents the statistical variation in latency across consecutive measurement samples.
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-[11px] text-slate-500 italic">
          Note: These measurements are browser-based and are not guaranteed to represent the maximum capability of your internet service.
        </div>
      </div>
    </div>
  );
}
