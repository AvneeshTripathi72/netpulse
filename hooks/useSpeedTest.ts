"use client";

import { useState, useCallback, useRef } from "react";
import {
  SpeedTestProgress,
  SpeedTestResult,
  TestServer,
} from "@/types/speed-test";
import { TEST_SERVERS } from "@/lib/speed-test/servers";
import { SpeedTestEngine } from "@/lib/speed-test/engine";
import { DEFAULT_SPEED_TEST_CONFIG } from "@/lib/speed-test/config";
import { saveSpeedTest } from "@/lib/supabase/queries";

export function useSpeedTest() {
  const [selectedServer, setSelectedServer] = useState<TestServer>(TEST_SERVERS[0]);
  const [progress, setProgress] = useState<SpeedTestProgress>({
    status: "idle",
    stage: "idle",
    pingMs: null,
    jitterMs: null,
    downloadMbps: null,
    uploadMbps: null,
    currentSpeed: 0,
    progressPercent: 0,
    selectedServer: TEST_SERVERS[0],
    graphData: [],
    errorMessage: null,
  });

  const [lastResult, setLastResult] = useState<SpeedTestResult | null>(null);
  const engineRef = useRef<SpeedTestEngine | null>(null);

  const startTest = useCallback(async () => {
    setLastResult(null);
    const engine = new SpeedTestEngine(selectedServer, DEFAULT_SPEED_TEST_CONFIG);
    engineRef.current = engine;

    engine.onProgress((state) => {
      setProgress({ ...state });
    });

    try {
      const res = await engine.run();
      setLastResult(res);
      // Auto save result locally / supabase
      await saveSpeedTest(res);
    } catch (err: any) {
      console.error("Speed test execution error:", err);
    }
  }, [selectedServer]);

  const cancelTest = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.cancel();
    }
  }, []);

  const resetTest = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.cancel();
    }
    setLastResult(null);
    setProgress({
      status: "idle",
      stage: "idle",
      pingMs: null,
      jitterMs: null,
      downloadMbps: null,
      uploadMbps: null,
      currentSpeed: 0,
      progressPercent: 0,
      selectedServer,
      graphData: [],
      errorMessage: null,
    });
  }, [selectedServer]);

  return {
    status: progress.status,
    stage: progress.stage,
    ping: progress.pingMs,
    jitter: progress.jitterMs,
    download: progress.downloadMbps,
    upload: progress.uploadMbps,
    currentSpeed: progress.currentSpeed,
    progressPercent: progress.progressPercent,
    graphData: progress.graphData,
    errorMessage: progress.errorMessage,
    selectedServer,
    setSelectedServer,
    lastResult,
    startTest,
    cancelTest,
    resetTest,
  };
}
