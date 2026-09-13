import { SpeedTestConfig } from "@/types/speed-test";

export const DEFAULT_SPEED_TEST_CONFIG: SpeedTestConfig = {
  latencyRequests: 8,
  downloadDurationSeconds: 8,
  uploadDurationSeconds: 6,
  downloadPayloadMB: 10,
  uploadPayloadMB: 5,
  timeoutMs: 15000,
  concurrentConnections: 3,
};
