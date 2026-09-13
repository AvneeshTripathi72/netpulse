import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let bytesReceived = 0;

  if (request.body) {
    const reader = request.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        bytesReceived += value.byteLength;
      }
    }
  }

  const durationMs = Date.now() - startTime;

  return NextResponse.json(
    {
      ok: true,
      bytesReceived,
      durationMs,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
