export type SpeedTestStatus =
  | "idle"
  | "initializing"
  | "testing_latency"
  | "testing_download"
  | "testing_upload"
  | "completed"
  | "error"
  | "cancelled";

export type SpeedTestStage =
  | "idle"
  | "finding_server"
  | "latency"
  | "download"
  | "upload"
  | "finalizing"
  | "done";

export type ScoreRating = "Poor" | "Fair" | "Good" | "Excellent";

export interface SpeedTestResult {
  id?: string;
  user_id?: string | null;
  download_mbps: number;
  upload_mbps: number;
  ping_ms: number;
  jitter_ms: number;
  score: number;
  score_rating: ScoreRating;
  connection_type?: string | null;
  effective_type?: string | null;
  downlink?: number | null;
  rtt?: number | null;
  server_id: string;
  server_name: string;
  is_public?: boolean;
  created_at: string;
}

export interface SpeedTestProgress {
  status: SpeedTestStatus;
  stage: SpeedTestStage;
  pingMs: number | null;
  jitterMs: number | null;
  downloadMbps: number | null;
  uploadMbps: number | null;
  currentSpeed: number; // Current active speed for live gauge display
  progressPercent: number; // 0 to 100
  selectedServer: TestServer | null;
  graphData: { timestamp: number; download?: number; upload?: number }[];
  errorMessage?: string | null;
}

export interface SpeedTestConfig {
  latencyRequests: number;
  downloadDurationSeconds: number;
  uploadDurationSeconds: number;
  downloadPayloadMB: number;
  uploadPayloadMB: number;
  timeoutMs: number;
  concurrentConnections: number;
}

export interface TestServer {
  id: string;
  name: string;
  location: string;
  endpoint: string;
  pingEndpoint: string;
  downloadEndpoint: string;
  uploadEndpoint: string;
  latency?: number;
  isDefault?: boolean;
}

export interface NetworkInfo {
  ip?: string;
  isp?: string;
  country?: string;
  region?: string;
  city?: string;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  browserOnline?: boolean;
}

export interface ConnectionQuality {
  score: number;
  rating: ScoreRating;
  color: string;
  badgeClass: string;
  description: string;
  recommendations: string[];
}
