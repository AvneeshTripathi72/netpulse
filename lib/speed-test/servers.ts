import { TestServer } from "@/types/speed-test";

export const TEST_SERVERS: TestServer[] = [
  {
    id: "auto",
    name: "Auto (Optimal Local Edge)",
    location: "Closest Edge Network Node",
    endpoint: "/api/speed",
    pingEndpoint: "/api/speed/ping",
    downloadEndpoint: "/api/speed/download",
    uploadEndpoint: "/api/speed/upload",
    isDefault: true,
  },
  {
    id: "us-east",
    name: "NetPulse US East (Virginia)",
    location: "Ashburn, VA, United States",
    endpoint: "/api/speed",
    pingEndpoint: "/api/speed/ping?server=us-east",
    downloadEndpoint: "/api/speed/download?server=us-east",
    uploadEndpoint: "/api/speed/upload?server=us-east",
  },
  {
    id: "us-west",
    name: "NetPulse US West (Oregon)",
    location: "Portland, OR, United States",
    endpoint: "/api/speed",
    pingEndpoint: "/api/speed/ping?server=us-west",
    downloadEndpoint: "/api/speed/download?server=us-west",
    uploadEndpoint: "/api/speed/upload?server=us-west",
  },
  {
    id: "eu-central",
    name: "NetPulse EU Central (Frankfurt)",
    location: "Frankfurt, Germany",
    endpoint: "/api/speed",
    pingEndpoint: "/api/speed/ping?server=eu-central",
    downloadEndpoint: "/api/speed/download?server=eu-central",
    uploadEndpoint: "/api/speed/upload?server=eu-central",
  },
  {
    id: "ap-southeast",
    name: "NetPulse Asia Pacific (Singapore)",
    location: "Singapore",
    endpoint: "/api/speed",
    pingEndpoint: "/api/speed/ping?server=ap-southeast",
    downloadEndpoint: "/api/speed/download?server=ap-southeast",
    uploadEndpoint: "/api/speed/upload?server=ap-southeast",
  },
];

export async function selectBestServer(servers: TestServer[]): Promise<TestServer> {
  // If only one server or auto selected, ping test endpoints to measure ping
  const defaultServer = servers.find((s) => s.id === "auto") || servers[0];
  try {
    const start = performance.now();
    const res = await fetch(`${defaultServer.pingEndpoint}?t=${Date.now()}`, { cache: "no-store" });
    const end = performance.now();
    if (res.ok) {
      return {
        ...defaultServer,
        latency: Math.round(end - start),
      };
    }
  } catch (err) {
    console.warn("Failed pinging server for auto selection:", err);
  }
  return defaultServer;
}
