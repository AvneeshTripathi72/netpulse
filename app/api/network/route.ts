import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "127.0.0.1";

  let isp = "Local Edge Network";
  let country = "United States";
  let region = "Virginia";
  let city = "Ashburn";

  // Try querying public IP API if IP is public
  if (clientIp !== "127.0.0.1" && clientIp !== "::1") {
    try {
      const res = await fetch(`https://ipapi.co/${clientIp}/json/`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.org || data.isp) isp = data.org || data.isp;
        if (data.country_name) country = data.country_name;
        if (data.region) region = data.region;
        if (data.city) city = data.city;
      }
    } catch (err) {
      console.warn("IP info lookup timed out or failed:", err);
    }
  }

  return NextResponse.json({
    ip: clientIp,
    isp,
    country,
    region,
    city,
    userAgent: request.headers.get("user-agent"),
  });
}
