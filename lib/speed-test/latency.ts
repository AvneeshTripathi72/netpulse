interface LatencyResult {
  pingMs: number;
  jitterMs: number;
  samples: number[];
}

export async function measureLatency(
  pingEndpoint: string,
  requestCount = 8,
  onSample?: (currentPing: number) => void
): Promise<LatencyResult> {
  const samples: number[] = [];

  for (let i = 0; i < requestCount; i++) {
    const startTime = performance.now();
    try {
      const cacheBuster = `t=${Date.now()}_${i}`;
      const url = pingEndpoint.includes("?")
        ? `${pingEndpoint}&${cacheBuster}`
        : `${pingEndpoint}?${cacheBuster}`;

      const res = await fetch(url, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      const endTime = performance.now();

      if (res.ok) {
        const rtt = Math.max(1, endTime - startTime);
        samples.push(rtt);
        if (onSample) {
          onSample(rtt);
        }
      }
    } catch (err) {
      console.warn(`Latency ping sample ${i} failed:`, err);
    }

    // Small delay between pings to prevent congestion
    await new Promise((resolve) => setTimeout(resolve, 80));
  }

  if (samples.length === 0) {
    throw new Error("Unable to establish latency connection to server.");
  }

  // Remove highest and lowest sample to eliminate outliers if we have > 4 samples
  let filteredSamples = [...samples];
  if (filteredSamples.length > 4) {
    filteredSamples.sort((a, b) => a - b);
    filteredSamples = filteredSamples.slice(1, filteredSamples.length - 1);
  }

  const sum = filteredSamples.reduce((a, b) => a + b, 0);
  const avgPing = sum / filteredSamples.length;

  // Calculate Jitter as average variation between consecutive ping samples
  let jitterSum = 0;
  for (let i = 1; i < samples.length; i++) {
    jitterSum += Math.abs(samples[i] - samples[i - 1]);
  }
  const jitter = samples.length > 1 ? jitterSum / (samples.length - 1) : 0;

  return {
    pingMs: Math.round(avgPing * 100) / 100,
    jitterMs: Math.round(jitter * 100) / 100,
    samples,
  };
}
