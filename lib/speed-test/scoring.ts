import { ConnectionQuality, ScoreRating } from "@/types/speed-test";

export interface SpeedMetrics {
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
}

export function calculateConnectionScore({
  downloadMbps,
  uploadMbps,
  pingMs,
  jitterMs,
}: SpeedMetrics): ConnectionQuality {
  // 1. Download Score (max 40)
  // 100+ Mbps gives max score. 10 Mbps = 20 pts.
  let downloadScore = 0;
  if (downloadMbps >= 100) {
    downloadScore = 40;
  } else if (downloadMbps >= 50) {
    downloadScore = 32 + ((downloadMbps - 50) / 50) * 8;
  } else if (downloadMbps >= 25) {
    downloadScore = 24 + ((downloadMbps - 25) / 25) * 8;
  } else if (downloadMbps >= 10) {
    downloadScore = 15 + ((downloadMbps - 10) / 15) * 9;
  } else {
    downloadScore = Math.min(15, (downloadMbps / 10) * 15);
  }

  // 2. Upload Score (max 25)
  // 30+ Mbps gives max score. 10 Mbps = 15 pts.
  let uploadScore = 0;
  if (uploadMbps >= 30) {
    uploadScore = 25;
  } else if (uploadMbps >= 15) {
    uploadScore = 18 + ((uploadMbps - 15) / 15) * 7;
  } else if (uploadMbps >= 5) {
    uploadScore = 10 + ((uploadMbps - 5) / 10) * 8;
  } else {
    uploadScore = Math.min(10, (uploadMbps / 5) * 10);
  }

  // 3. Ping Score (max 20)
  // <15ms = 20 pts, 15-30ms = 15 pts, 30-60ms = 10 pts, >100ms = <5 pts
  let pingScore = 0;
  if (pingMs <= 15) {
    pingScore = 20;
  } else if (pingMs <= 35) {
    pingScore = 20 - ((pingMs - 15) / 20) * 5;
  } else if (pingMs <= 70) {
    pingScore = 15 - ((pingMs - 35) / 35) * 6;
  } else if (pingMs <= 150) {
    pingScore = 9 - ((pingMs - 70) / 80) * 6;
  } else {
    pingScore = Math.max(1, 3 - ((pingMs - 150) / 100) * 2);
  }

  // 4. Jitter Score (max 15)
  // <3ms = 15 pts, 3-10ms = 10 pts, >25ms = <4 pts
  let jitterScore = 0;
  if (jitterMs <= 3) {
    jitterScore = 15;
  } else if (jitterMs <= 10) {
    jitterScore = 15 - ((jitterMs - 3) / 7) * 5;
  } else if (jitterMs <= 25) {
    jitterScore = 10 - ((jitterMs - 10) / 15) * 6;
  } else {
    jitterScore = Math.max(1, 4 - ((jitterMs - 25) / 25) * 3);
  }

  const rawScore = downloadScore + uploadScore + pingScore + jitterScore;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let rating: ScoreRating = "Poor";
  let color = "#ef4444"; // Red
  let badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
  let description = "Your connection exhibits high latency or low bandwidth. Suitable for basic browsing.";
  const recommendations: string[] = [];

  if (score >= 80) {
    rating = "Excellent";
    color = "#06b6d4"; // Cyan
    badgeClass = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    description = "Ultra-fast response time & bandwidth. Ideal for 4K streaming, online gaming, and large data transfers.";
    recommendations.push("Seamless 4K/8K Video Streaming", "Low-latency Competitive Gaming", "High-capacity Video Calls");
  } else if (score >= 60) {
    rating = "Good";
    color = "#10b981"; // Emerald
    badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    description = "Solid internet connection suitable for HD streaming, smooth browsing, and standard multi-device usage.";
    recommendations.push("Full HD 1080p Streaming", "Reliable Remote Work & Zoom Calls", "Fast Web Browsing");
  } else if (score >= 40) {
    rating = "Fair";
    color = "#f59e0b"; // Amber
    badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    description = "Moderate speeds and response time. May experience slight buffering during peak network usage.";
    recommendations.push("Standard Definition Streaming", "General Browsing & Social Media", "Single-device Video Calls");
  } else {
    recommendations.push("Basic Email & Text Messaging", "Optimize Wi-Fi Router position or use Ethernet");
  }

  return {
    score,
    rating,
    color,
    badgeClass,
    description,
    recommendations,
  };
}
