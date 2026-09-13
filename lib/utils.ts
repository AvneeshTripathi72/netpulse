import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSpeed(mbps: number | null | undefined): { value: string; unit: string } {
  if (mbps === null || mbps === undefined || isNaN(mbps)) {
    return { value: "--", unit: "Mbps" };
  }

  if (mbps >= 1000) {
    return {
      value: (mbps / 1000).toFixed(2),
      unit: "Gbps",
    };
  }

  return {
    value: mbps.toFixed(2),
    unit: "Mbps",
  };
}

export function formatPing(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || isNaN(ms)) return "--";
  return Math.round(ms).toString();
}

export function formatJitter(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || isNaN(ms)) return "--";
  return ms.toFixed(1);
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return isoString;
  }
}
