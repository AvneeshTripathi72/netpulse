"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SpeedTestResult } from "@/types/speed-test";
import { getSpeedTestById } from "@/lib/supabase/queries";
import { ResultCard } from "@/components/speed-test/result-card";
import { Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [loading, setLoading] = useState(true);

  const testId = params?.id as string;

  useEffect(() => {
    async function loadTest() {
      if (testId) {
        const item = await getSpeedTestById(testId);
        setResult(item);
      }
      setLoading(false);
    }
    loadTest();
  }, [testId]);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs font-mono text-muted-foreground animate-pulse">
        Fetching speed test record...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit mx-auto">
          <Activity className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Speed Test Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The speed test result link might have expired or does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all"
        >
          Run New Speed Test
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        href="/history"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to History
      </Link>

      <ResultCard result={result} onReset={() => router.push("/")} />
    </div>
  );
}
