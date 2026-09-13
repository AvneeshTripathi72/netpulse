"use client";

import { useState } from "react";
import { TestServer } from "@/types/speed-test";
import { TEST_SERVERS } from "@/lib/speed-test/servers";
import { Server, Check, ChevronDown } from "lucide-react";

interface ServerSelectorProps {
  selectedServer: TestServer;
  onSelectServer: (server: TestServer) => void;
  disabled?: boolean;
}

export function ServerSelector({
  selectedServer,
  onSelectServer,
  disabled = false,
}: ServerSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted/50 hover:bg-muted/80 border border-border/60 text-xs font-semibold text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Server className="h-3.5 w-3.5 text-cyan-400" />
        <span className="truncate max-w-[160px]">{selectedServer.name}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 z-50 rounded-2xl bg-card border border-border shadow-2xl p-2 animate-fade-in space-y-1">
            <div className="px-3 py-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40">
              Select Speed Test Node
            </div>

            {TEST_SERVERS.map((server) => {
              const isSelected = server.id === selectedServer.id;
              return (
                <button
                  key={server.id}
                  onClick={() => {
                    onSelectServer(server);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors ${
                    isSelected
                      ? "bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20"
                      : "text-foreground hover:bg-muted/60"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{server.name}</span>
                    <span className="text-[10px] text-muted-foreground">{server.location}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
