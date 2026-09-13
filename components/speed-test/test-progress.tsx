"use client";

import { SpeedTestStage } from "@/types/speed-test";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestProgressProps {
  stage: SpeedTestStage;
}

export function TestProgress({ stage }: TestProgressProps) {
  const steps = [
    { id: "finding_server", label: "Server" },
    { id: "latency", label: "Latency" },
    { id: "download", label: "Download" },
    { id: "upload", label: "Upload" },
    { id: "finalizing", label: "Result" },
  ];

  const stageOrder = ["idle", "finding_server", "latency", "download", "upload", "finalizing", "done"];
  const currentIndex = stageOrder.indexOf(stage);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 bg-border/60 -z-0" />

        {steps.map((step, idx) => {
          const stepIndex = stageOrder.indexOf(step.id);
          const isCompleted = currentIndex > stepIndex || stage === "done";
          const isCurrent = currentIndex === stepIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                  isCompleted
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : isCurrent
                    ? "bg-background text-cyan-400 border-2 border-cyan-400 shadow-md shadow-cyan-500/30"
                    : "bg-muted text-muted-foreground border border-border/50"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isCurrent ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-mono font-medium tracking-tight transition-colors",
                  isCurrent ? "text-cyan-400 font-bold" : isCompleted ? "text-foreground" : "text-muted-foreground/70"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
