import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sizeMBParam = searchParams.get("size");
  const sizeMB = Math.min(25, Math.max(1, parseInt(sizeMBParam || "5", 10)));
  const totalBytes = sizeMB * 1024 * 1024;

  // Create a stream yielding 64KB binary chunks
  const chunkSize = 64 * 1024;
  const chunkBuffer = new Uint8Array(chunkSize);
  for (let i = 0; i < chunkSize; i += 1024) {
    chunkBuffer[i] = (i % 256);
  }

  let sentBytes = 0;
  const stream = new ReadableStream({
    pull(controller) {
      if (sentBytes >= totalBytes) {
        controller.close();
        return;
      }
      const remaining = totalBytes - sentBytes;
      const currentChunkSize = Math.min(remaining, chunkSize);
      const dataToSend = chunkBuffer.subarray(0, currentChunkSize);
      controller.enqueue(dataToSend);
      sentBytes += currentChunkSize;
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": totalBytes.toString(),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
