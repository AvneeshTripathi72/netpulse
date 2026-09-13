interface UploadProgress {
  currentMbps: number;
  progressPercent: number;
  totalBytes: number;
  elapsedSeconds: number;
}

export async function measureUploadSpeed(
  uploadEndpoint: string,
  durationSeconds = 6,
  concurrentStreams = 2,
  onProgress?: (progress: UploadProgress) => void
): Promise<number> {
  const startTime = performance.now();
  const endTimeTarget = startTime + durationSeconds * 1000;
  let totalBytesUploaded = 0;
  let isActive = true;

  // Generate a random payload buffer (e.g. 2MB chunks) to upload repeatedly
  const payloadSize = 2 * 1024 * 1024; // 2MB
  const payloadBuffer = new Uint8Array(payloadSize);
  for (let i = 0; i < payloadSize; i += 4096) {
    payloadBuffer[i] = Math.floor(Math.random() * 256);
  }

  const samples: { timestamp: number; mbps: number }[] = [];
  let lastSampleTime = startTime;
  let lastSampleBytes = 0;

  // Single upload worker using XMLHttpRequest for accurate upload progress events
  const uploadWorker = (workerId: number): Promise<void> => {
    return new Promise((resolve) => {
      const sendNextChunk = () => {
        if (!isActive || performance.now() >= endTimeTarget) {
          resolve();
          return;
        }

        const xhr = new XMLHttpRequest();
        let lastLoaded = 0;

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && isActive) {
            const delta = event.loaded - lastLoaded;
            if (delta > 0) {
              totalBytesUploaded += delta;
              lastLoaded = event.loaded;
            }
          }
        };

        xhr.onload = () => {
          if (isActive && performance.now() < endTimeTarget) {
            sendNextChunk();
          } else {
            resolve();
          }
        };

        xhr.onerror = () => {
          // If error occurs, retry after short pause
          if (isActive && performance.now() < endTimeTarget) {
            setTimeout(sendNextChunk, 200);
          } else {
            resolve();
          }
        };

        const cacheBuster = `t=${Date.now()}_${workerId}_${Math.random()}`;
        const url = uploadEndpoint.includes("?")
          ? `${uploadEndpoint}&${cacheBuster}`
          : `${uploadEndpoint}?${cacheBuster}`;

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(payloadBuffer);
      };

      sendNextChunk();
    });
  };

  // Setup periodic sampler interval every 150ms
  const sampleInterval = setInterval(() => {
    const now = performance.now();
    const elapsedTotal = (now - startTime) / 1000;
    const elapsedDelta = (now - lastSampleTime) / 1000;
    const bytesDelta = totalBytesUploaded - lastSampleBytes;

    if (elapsedDelta > 0) {
      const currentMbps = (bytesDelta * 8) / (elapsedDelta * 1_000_000);
      const progressPercent = Math.min(100, (elapsedTotal / durationSeconds) * 100);

      samples.push({ timestamp: now, mbps: currentMbps });

      if (onProgress) {
        onProgress({
          currentMbps: Math.round(currentMbps * 100) / 100,
          progressPercent: Math.round(progressPercent),
          totalBytes: totalBytesUploaded,
          elapsedSeconds: elapsedTotal,
        });
      }
    }

    lastSampleTime = now;
    lastSampleBytes = totalBytesUploaded;

    if (now >= endTimeTarget) {
      isActive = false;
      clearInterval(sampleInterval);
    }
  }, 150);

  // Run upload workers concurrently
  const workers = Array.from({ length: concurrentStreams }, (_, i) => uploadWorker(i));

  await Promise.race([
    Promise.all(workers),
    new Promise((resolve) => setTimeout(resolve, durationSeconds * 1000 + 500)),
  ]);

  isActive = false;
  clearInterval(sampleInterval);

  const totalElapsed = (performance.now() - startTime) / 1000;
  if (totalElapsed <= 0 || totalBytesUploaded === 0) {
    throw new Error("Upload speed measurement failed: zero bytes sent.");
  }

  // Filter out warmup samples (first 1 second)
  const stableSamples = samples.filter(
    (s) => s.timestamp - startTime > 1000 && s.mbps > 0
  );

  let finalMbps = 0;
  if (stableSamples.length > 0) {
    const sumMbps = stableSamples.reduce((acc, curr) => acc + curr.mbps, 0);
    finalMbps = sumMbps / stableSamples.length;
  } else {
    finalMbps = (totalBytesUploaded * 8) / (totalElapsed * 1_000_000);
  }

  return Math.round(finalMbps * 100) / 100;
}
