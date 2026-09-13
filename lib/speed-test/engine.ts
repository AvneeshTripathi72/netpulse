import {
  SpeedTestConfig,
  SpeedTestProgress,
  SpeedTestResult,
  TestServer,
} from "@/types/speed-test";
import { DEFAULT_SPEED_TEST_CONFIG } from "./config";
import { measureLatency } from "./latency";
import { measureDownloadSpeed } from "./download";
import { measureUploadSpeed } from "./upload";
import { calculateConnectionScore } from "./scoring";
import { selectBestServer } from "./servers";

export type SpeedTestListener = (state: SpeedTestProgress) => void;

export class SpeedTestEngine {
  private config: SpeedTestConfig;
  private server: TestServer;
  private listener: SpeedTestListener | null = null;
  private isCancelled = false;

  private state: SpeedTestProgress = {
    status: "idle",
    stage: "idle",
    pingMs: null,
    jitterMs: null,
    downloadMbps: null,
    uploadMbps: null,
    currentSpeed: 0,
    progressPercent: 0,
    selectedServer: null,
    graphData: [],
    errorMessage: null,
  };

  constructor(server: TestServer, config: SpeedTestConfig = DEFAULT_SPEED_TEST_CONFIG) {
    this.server = server;
    this.config = config;
    this.state.selectedServer = server;
  }

  public onProgress(listener: SpeedTestListener) {
    this.listener = listener;
  }

  private updateState(partial: Partial<SpeedTestProgress>) {
    this.state = { ...this.state, ...partial };
    if (this.listener) {
      this.listener(this.state);
    }
  }

  public cancel() {
    this.isCancelled = true;
    this.updateState({
      status: "cancelled",
      stage: "idle",
      currentSpeed: 0,
      errorMessage: "Test cancelled by user.",
    });
  }

  public async run(): Promise<SpeedTestResult> {
    this.isCancelled = false;

    try {
      // 1. Initializing & Finding Server
      this.updateState({
        status: "initializing",
        stage: "finding_server",
        progressPercent: 5,
        errorMessage: null,
        graphData: [],
      });

      const activeServer = await selectBestServer([this.server]);
      if (this.isCancelled) throw new Error("Cancelled");

      this.updateState({
        selectedServer: activeServer,
        progressPercent: 10,
      });

      // 2. Testing Latency & Jitter
      this.updateState({
        status: "testing_latency",
        stage: "latency",
        progressPercent: 15,
      });

      const latencyRes = await measureLatency(
        activeServer.pingEndpoint,
        this.config.latencyRequests,
        (ping) => {
          if (!this.isCancelled) {
            this.updateState({ pingMs: Math.round(ping) });
          }
        }
      );

      if (this.isCancelled) throw new Error("Cancelled");

      this.updateState({
        pingMs: latencyRes.pingMs,
        jitterMs: latencyRes.jitterMs,
        progressPercent: 30,
      });

      // 3. Testing Download Speed
      this.updateState({
        status: "testing_download",
        stage: "download",
        progressPercent: 35,
      });

      const graphData: { timestamp: number; download?: number; upload?: number }[] = [];

      const downloadMbps = await measureDownloadSpeed(
        activeServer.downloadEndpoint,
        this.config.downloadDurationSeconds,
        this.config.concurrentConnections,
        (prog) => {
          if (this.isCancelled) return;
          const currentPercent = 30 + Math.round((prog.progressPercent * 35) / 100);
          graphData.push({
            timestamp: prog.elapsedSeconds,
            download: prog.currentMbps,
          });

          this.updateState({
            currentSpeed: prog.currentMbps,
            downloadMbps: prog.currentMbps,
            progressPercent: currentPercent,
            graphData: [...graphData],
          });
        }
      );

      if (this.isCancelled) throw new Error("Cancelled");

      this.updateState({
        downloadMbps,
        currentSpeed: 0,
        progressPercent: 65,
      });

      // 4. Testing Upload Speed
      this.updateState({
        status: "testing_upload",
        stage: "upload",
        progressPercent: 70,
      });

      const uploadMbps = await measureUploadSpeed(
        activeServer.uploadEndpoint,
        this.config.uploadDurationSeconds,
        this.config.concurrentConnections,
        (prog) => {
          if (this.isCancelled) return;
          const currentPercent = 65 + Math.round((prog.progressPercent * 30) / 100);
          graphData.push({
            timestamp: prog.elapsedSeconds + this.config.downloadDurationSeconds,
            upload: prog.currentMbps,
          });

          this.updateState({
            currentSpeed: prog.currentMbps,
            uploadMbps: prog.currentMbps,
            progressPercent: currentPercent,
            graphData: [...graphData],
          });
        }
      );

      if (this.isCancelled) throw new Error("Cancelled");

      // 5. Finalizing Results
      this.updateState({
        status: "completed",
        stage: "finalizing",
        progressPercent: 95,
        currentSpeed: 0,
        uploadMbps,
      });

      const scoreQuality = calculateConnectionScore({
        downloadMbps,
        uploadMbps,
        pingMs: latencyRes.pingMs,
        jitterMs: latencyRes.jitterMs,
      });

      const result: SpeedTestResult = {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `test_${Date.now()}`,
        download_mbps: downloadMbps,
        upload_mbps: uploadMbps,
        ping_ms: latencyRes.pingMs,
        jitter_ms: latencyRes.jitterMs,
        score: scoreQuality.score,
        score_rating: scoreQuality.rating,
        server_id: activeServer.id,
        server_name: activeServer.name,
        created_at: new Date().toISOString(),
      };

      this.updateState({
        status: "completed",
        stage: "done",
        progressPercent: 100,
      });

      return result;
    } catch (err: any) {
      if (!this.isCancelled) {
        this.updateState({
          status: "error",
          stage: "idle",
          errorMessage: err.message || "Speed test failed. Please check your internet connection.",
        });
      }
      throw err;
    }
  }
}
