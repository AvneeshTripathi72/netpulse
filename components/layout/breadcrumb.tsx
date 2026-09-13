"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const pathParts = pathname.split("/").filter(Boolean);

  const getLabel = (part: string) => {
    switch (part) {
      case "history":
        return "Test History";
      case "dashboard":
        return "Performance Dashboard";
      case "diagnostics":
        return "Network Diagnostics";
      case "methodology":
        return "Measurement Methodology";
      case "status":
        return "Service Status";
      case "about":
        return "About NetPulse";
      case "privacy":
        return "Privacy Policy";
      case "terms":
        return "Terms of Service";
      case "result":
        return "Measurement Result";
      case "login":
        return "Portal Login";
      case "signup":
        return "Account Registration";
      default:
        return part;
    }
  };

  return (
    <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
        <li>
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Home
          </Link>
        </li>
        {pathParts.map((part, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className={idx === pathParts.length - 1 ? "font-semibold text-slate-800 dark:text-slate-200" : "hover:text-slate-900 transition-colors"}>
              {getLabel(part)}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
