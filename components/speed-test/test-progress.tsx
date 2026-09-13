"use client";

import { SpeedTestStage } from "@/types/speed-test";

interface TestProgressProps {
  stage: SpeedTestStage;
}

export function TestProgress({ stage }: TestProgressProps) {
  const steps = [
    { id: "finding_server", label: "Server Selection" },
    { id: "latency", label: "Latency Measurement" },
    { id: "download", label: "Download Measurement" },
    { id: "upload", label: "Upload Measurement" },
    { id: "finalizing", label: "Result Validation" },
  ];

  const stageOrder = ["idle", "finding_server", "latency", "download", "upload", "finalizing", "done"];
  const currentIndex = stageOrder.indexOf(stage);

  return (
    <div className="w-full bg-slate-50 border border-slate-300 p-4 rounded-sm space-y-2">
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
        Diagnostic Workflow Progress:
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
        {steps.map((step, idx) => {
          const stepIndex = stageOrder.indexOf(step.id);
          const isCompleted = currentIndex > stepIndex || stage === "done";
          const isCurrent = currentIndex === stepIndex;

          return (
            <div
              key={step.id}
              className={`p-2 rounded-sm border flex items-center gap-1.5 transition-colors ${
                isCompleted
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                  : isCurrent
                  ? "bg-blue-50 border-blue-400 text-blue-900 font-bold animate-pulse"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <span>{isCompleted ? "[✓]" : isCurrent ? "[→]" : "[ ]"}</span>
              <span className="truncate text-[11px]">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
