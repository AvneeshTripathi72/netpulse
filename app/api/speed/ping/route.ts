import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { ok: true, timestamp: Date.now() },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    }
  );
}
