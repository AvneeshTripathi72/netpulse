import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Footer } from "@/components/layout/footer";
import { FeedbackWidget } from "@/components/feedback-widget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NetPulse — Public Broadband Measurement Portal",
  description: "Official independent internet broadband measurement utility for download speed, upload speed, latency, and jitter.",
  keywords: ["broadband measurement", "speed test", "network diagnostics", "ping", "latency", "jitter", "bandwidth measurement"],
  authors: [{ name: "NetPulse" }],
  openGraph: {
    title: "NetPulse — Public Broadband Measurement Portal",
    description: "Measure your download speed, upload speed, latency, and jitter with an independent broadband measurement utility.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col bg-radial-gradient">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <Breadcrumb />
          <main className="flex-1">{children}</main>
          <Footer />
          <FeedbackWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
