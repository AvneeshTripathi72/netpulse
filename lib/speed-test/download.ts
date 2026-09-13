interface DownloadProgress {
  currentMbps: number;
  progressPercent: number;
  totalBytes: number;
  elapsedSeconds: number;
}

export async function measureDownloadSpeed(
  downloadEndpoint: string,
  durationSeconds = 8,
  concurrentStreams = 3,
  onProgress?: (progress: DownloadProgress) => void
): Promise<number> {
  const startTime = performance.now();
  const endTimeTarget = startTime + durationSeconds * 1000;
  let totalBytesTransferred = 0;
  let isActive = true;

  const samples: { timestamp: number; bytes: number; mbps: number }[] = [];
  let lastSampleTime = startTime;
  let lastSampleBytes = 0;

  // Single worker stream standard function
  const fetchStream = async (streamIndex: number) => {
    while (isActive && performance.now() < endTimeTarget) {
      try {
        const cacheBuster = `t=${Date.now()}_${streamIndex}_${Math.random()}`;
        const url = downloadEndpoint.includes("?")
          ? `${downloadEndpoint}&${cacheBuster}&size=5`
          : `${downloadEndpoint}?${cacheBuster}&size=5`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok || !res.body) break;

        const reader = res.body.getReader();
        while (isActive && performance.now() < endTimeTarget) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            totalBytesTransferred += value.byteLength;
          }
        }
      } catch (err) {
        console.warn(`Download stream ${streamIndex} error:`, err);
        break;
      }
    }
  };

  // Setup periodic sampler interval every 150ms
  const sampleInterval = setInterval(() => {
    const now = performance.now();
    const elapsedTotal = (now - startTime) / 1000;
    const elapsedDelta = (now - lastSampleTime) / 1000;
    const bytesDelta = totalBytesTransferred - lastSampleBytes;

    if (elapsedDelta > 0) {
      // Calculate current instantaneous Mbps (Bytes * 8 / 1,000,000 / seconds)
      const currentMbps = (bytesDelta * 8) / (elapsedDelta * 1_000_000);
      const progressPercent = Math.min(100, (elapsedTotal / durationSeconds) * 100);

      samples.push({ timestamp: now, bytes: totalBytesTransferred, mbps: currentMbps });

      if (onProgress) {
        onProgress({
          currentMbps: Math.round(currentMbps * 100) / 100,
          progressPercent: Math.round(progressPercent),
          totalBytes: totalBytesTransferred,
          elapsedSeconds: elapsedTotal,
        });
      }
    }

    lastSampleTime = now;
    lastSampleBytes = totalBytesTransferred;

    if (now >= endTimeTarget) {
      isActive = false;
      clearInterval(sampleInterval);
    }
  }, 150);

  // Start concurrent streams
  const workers = Array.from({ length: concurrentStreams }, (_, i) => fetchStream(i));
  
  // Wait until duration expires or workers complete
  await Promise.race([
    Promise.all(workers),
    new Promise((resolve) => setTimeout(resolve, durationSeconds * 1000 + 500)),
  ]);

  isActive = false;
  clearInterval(sampleInterval);

  const totalElapsed = (performance.now() - startTime) / 1000;
  if (totalElapsed <= 0 || totalBytesTransferred === 0) {
    throw new Error("Download speed measurement failed: zero bytes received.");
  }

  // Filter out warmup samples (first 1.5 seconds) to avoid TCP slow start bias
  const stableSamples = samples.filter(
    (s) => s.timestamp - startTime > 1500 && s.mbps > 0
  );

  let finalMbps = 0;
  if (stableSamples.length > 0) {
    const sumMbps = stableSamples.reduce((acc, curr) => acc + curr.mbps, 0);
    finalMbps = sumMbps / stableSamples.length;
  } else {
    finalMbps = (totalBytesTransferred * 8) / (totalElapsed * 1_000_000);
  }

  return Math.round(finalMbps * 100) / 100;
}
