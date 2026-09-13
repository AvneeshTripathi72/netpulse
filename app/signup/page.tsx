"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();
    if (!supabase) {
      setErrorMsg("Supabase is not configured. Local storage mode is currently active.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/history");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 space-y-6 font-sans">
      <div className="text-center space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#0f2942] text-white mx-auto shadow-sm">
          <Activity className="h-6 w-6 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-black text-[#0f2942]">Account Registration</h1>
        <p className="text-xs text-slate-600">Register to sync your measurement history across devices</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-sm border border-slate-300 shadow-sm space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-sm bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-sm bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0f2942]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-sm bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0f2942]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm bg-[#0f2942] hover:bg-[#1e3a8a] text-white font-bold text-xs uppercase tracking-wider shadow-sm disabled:opacity-50"
          >
            {loading ? "Registering..." : "CREATE ACCOUNT"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-200">
          Already registered?{" "}
          <Link href="/login" className="text-blue-800 font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
