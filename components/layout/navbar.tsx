"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Speed Test", href: "/" },
    { name: "Test History", href: "/history" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Diagnostics", href: "/diagnostics" },
    { name: "Methodology", href: "/methodology" },
    { name: "Status", href: "/status" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="w-full bg-white text-slate-900 border-b border-slate-300 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Simple Enterprise Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#0f2942] text-white font-black shadow-sm">
            <Activity className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#0f2942] uppercase font-sans">
              NetPulse
            </span>
            <span className="text-[10px] tracking-wider text-slate-500 font-semibold uppercase">
              Broadband Portal
            </span>
          </div>
        </Link>

        {/* Traditional Clean Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "py-1 text-xs font-semibold uppercase tracking-wider transition-colors",
                  isActive
                    ? "text-[#0f2942] font-bold border-b-2 border-[#0f2942]"
                    : "text-slate-700 hover:text-[#0f2942] hover:underline"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Simple Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#0f2942] hover:bg-[#1e3a8a] text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            Start Speed Test
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-sm border border-slate-300 text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 text-xs font-semibold uppercase transition-colors rounded-sm",
                  isActive
                    ? "bg-[#0f2942] text-white font-bold"
                    : "text-slate-700 hover:bg-slate-200"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
