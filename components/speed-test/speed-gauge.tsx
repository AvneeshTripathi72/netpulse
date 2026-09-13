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
  // Convert current speed (0 - 1000 Mbps) to gauge angle (-120deg to +120deg)
  const angle = useMemo(() => {
    if (status === "idle" || status === "completed" || status === "cancelled") return -120;
    // Logarithmic-like mapping for smooth needle feel across 0-1000 Mbps
    const maxSpeed = 1000;
    const clamped = Math.min(maxSpeed, Math.max(0, currentSpeed));
    // Scale 0 to 1000 -> -120 to 120 (span = 240 deg)
    const fraction = Math.pow(clamped / maxSpeed, 0.6); // slight non-linear curve for low speeds
    return -120 + fraction * 240;
  }, [currentSpeed, status]);

  const { value, unit } = formatSpeed(status === "idle" ? 0 : currentSpeed);

  // SVG Gauge calculations
  const radius = 120;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // 240 degrees arc = (240 / 360) * circumference
  const arcLength = (240 / 360) * circumference;
  const dashOffset = arcLength - (progressPercent / 100) * arcLength;

  const stageLabel = useMemo(() => {
    switch (stage) {
      case "finding_server":
        return "CONNECTING TO EDGE SERVER...";
      case "latency":
        return "MEASURING LATENCY & JITTER...";
      case "download":
        return "TESTING DOWNLOAD SPEED...";
      case "upload":
        return "TESTING UPLOAD SPEED...";
      case "finalizing":
        return "FINALIZING METRICS...";
      case "done":
        return "TEST COMPLETE";
      default:
        return "READY TO TEST";
    }
  }, [stage]);

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      {/* Radial Backlight Ambient Glow */}
      <div
        className={`absolute h-72 w-72 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
          status === "testing_download" || status === "testing_upload"
            ? "bg-cyan-500/25 opacity-100"
            : status === "testing_latency"
            ? "bg-indigo-500/20 opacity-80"
            : "bg-cyan-500/10 opacity-40"
        }`}
      />

      {/* SVG Gauge Container */}
      <div className="relative h-72 w-72 sm:h-80 sm:w-80 flex items-center justify-center">
        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 300 300">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Arc Track */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-border/40"
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
            filter="url(#glow)"
          />

          {/* Ticks around the arc */}
          {[0, 100, 250, 500, 750, 1000].map((val, idx) => {
            const tickAngle = -120 + (idx / 5) * 240;
            const rad = (tickAngle * Math.PI) / 180;
            const innerR = radius - 18;
            const outerR = radius - 8;
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
                className="text-muted-foreground/60"
                strokeWidth="2"
                transform="rotate(90 150 150)"
              />
            );
          })}
        </svg>

        {/* Center Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          {status === "idle" ? (
            /* GO Interactive Button */
            <button
              onClick={onStart}
              className="group relative flex h-36 w-36 items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-4xl tracking-wider shadow-2xl shadow-cyan-500/30 border-4 border-cyan-300/30 hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Start speed test"
            >
              <span className="relative z-10 drop-shadow-md">GO</span>
              <span className="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping opacity-75 group-hover:opacity-100" />
            </button>
          ) : (
            /* Live Dynamic Readout */
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400 mb-1">
                {stage === "download"
                  ? "Download"
                  : stage === "upload"
                  ? "Upload"
                  : stage === "latency"
                  ? "Ping / Jitter"
                  : "Testing"}
              </div>
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-foreground font-mono">
                {value}
              </div>
              <div className="text-sm font-bold text-muted-foreground tracking-wider uppercase mt-0.5">
                {unit}
              </div>

              {/* Cancel Button during test */}
              {status !== "completed" && status !== "error" && (
                <button
                  onClick={onCancel}
                  className="mt-4 px-3 py-1 text-xs font-semibold rounded-full bg-muted/60 hover:bg-destructive/20 hover:text-destructive text-muted-foreground transition-colors border border-border/40"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stage Status Text */}
      <div className="mt-4 flex items-center gap-2 text-xs font-mono tracking-wider font-semibold text-muted-foreground">
        {status !== "idle" && status !== "completed" && (
          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
        )}
        {stageLabel}
      </div>
    </div>
  );
}
