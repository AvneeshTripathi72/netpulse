"use client";

import { useMemo } from "react";
import { SpeedTestStatus, SpeedTestStage } from "@/types/speed-test";
import { formatSpeed } from "@/lib/utils";

interface SpeedGaugeProps {
  status: SpeedTestStatus;
  stage: SpeedTestStage;
  currentSpeed: number;
  progressPercent: number;
  onStart: () => void;
  onCancel: () => void;
}

export function SpeedGauge({
  status,
  stage,
  currentSpeed,
  progressPercent,
  onStart,
  onCancel,
}: SpeedGaugeProps) {
  const angle = useMemo(() => {
    if (status === "idle" || status === "completed" || status === "cancelled") return -120;
    const maxSpeed = 1000;
    const clamped = Math.min(maxSpeed, Math.max(0, currentSpeed));
    const fraction = Math.pow(clamped / maxSpeed, 0.6);
    return -120 + fraction * 240;
  }, [currentSpeed, status]);

  const { value, unit } = formatSpeed(status === "idle" ? 0 : currentSpeed);

  const radius = 120;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (240 / 360) * circumference;
  const dashOffset = arcLength - (progressPercent / 100) * arcLength;

  const stageLabel = useMemo(() => {
    switch (stage) {
      case "finding_server":
        return "SELECTING TEST SERVER...";
      case "latency":
        return "MEASURING LATENCY & JITTER...";
      case "download":
        return "MEASURING DOWNLOAD THROUGHPUT...";
      case "upload":
        return "MEASURING UPLOAD THROUGHPUT...";
      case "finalizing":
        return "VALIDATING MEASUREMENT...";
      case "done":
        return "MEASUREMENT COMPLETE";
      default:
        return "READY TO START TEST";
    }
  }, [stage]);

  return (
    <div className="relative flex flex-col items-center justify-center py-4 font-sans">
      {/* SVG Gauge Container */}
      <div className="relative h-72 w-72 sm:h-80 sm:w-80 flex items-center justify-center">
        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 300 300">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f2942" />
              <stop offset="50%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Background Arc Track */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(150 150 150)"
          />

          {/* Active Progress Arc */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(150 150 150)"
            className="transition-all duration-300 ease-out"
          />

          {/* Ticks around the arc */}
          {[0, 100, 250, 500, 750, 1000].map((val, idx) => {
            const tickAngle = -120 + (idx / 5) * 240;
            const rad = (tickAngle * Math.PI) / 180;
            const innerR = radius - 16;
            const outerR = radius - 6;
            const x1 = 150 + innerR * Math.cos(rad);
            const y1 = 150 + innerR * Math.sin(rad);
            const x2 = 150 + outerR * Math.cos(rad);
            const y2 = 150 + outerR * Math.sin(rad);
            return (
              <line
                key={val}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                className="text-slate-400"
                strokeWidth="1.5"
                transform="rotate(90 150 150)"
              />
            );
          })}
        </svg>

        {/* Center Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          {status === "idle" ? (
            /* Restrained Navy START TEST / GO Button */
            <button
              onClick={onStart}
              className="group relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#0f2942] hover:bg-[#1e3a8a] text-white font-black tracking-wider shadow-sm border-4 border-slate-200 hover:scale-105 active:scale-95 transition-all duration-150"
              aria-label="Start speed test"
            >
              <span className="text-2xl uppercase tracking-widest font-sans">START</span>
              <span className="text-[10px] font-mono text-cyan-300 uppercase mt-0.5">TEST</span>
            </button>
          ) : (
            /* Live Dynamic Readout */
            <div className="flex flex-col items-center justify-center font-mono">
              <div className="text-xs font-bold uppercase tracking-widest text-[#0f2942] mb-1">
                {stage === "download"
                  ? "Download"
                  : stage === "upload"
                  ? "Upload"
                  : stage === "latency"
                  ? "Ping / Jitter"
                  : "Testing"}
              </div>
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-[#0f2942]">
                {value}
              </div>
              <div className="text-xs font-bold text-slate-500 tracking-wider uppercase mt-0.5">
                {unit}
              </div>

              {/* Cancel Button during test */}
              {status !== "completed" && status !== "error" && (
                <button
                  onClick={onCancel}
                  className="mt-3 px-3 py-1 text-xs font-mono font-bold rounded-sm bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-300 transition-colors uppercase"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stage Status Text */}
      <div className="mt-4 flex items-center gap-2 text-xs font-mono tracking-wider font-bold text-slate-700">
        {status !== "idle" && status !== "completed" && (
          <span className="inline-block h-2 w-2 rounded-full bg-[#0f2942] animate-ping" />
        )}
        {stageLabel}
      </div>
    </div>
  );
}
