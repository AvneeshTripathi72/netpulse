import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FeedbackWidget } from "@/components/feedback-widget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NetPulse — Free Internet Speed Test & Network Diagnostics",
  description: "Test your internet download speed, upload speed, ping, jitter, and connection quality with NetPulse precision network test.",
  keywords: ["speed test", "internet speed test", "bandwidth test", "ping test", "latency monitor", "jitter", "network diagnostics"],
  authors: [{ name: "NetPulse" }],
  openGraph: {
    title: "NetPulse — Free Internet Speed Test",
    description: "Measure your download speed, upload speed, ping, jitter, and connection quality.",
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
          <main className="flex-1">{children}</main>
          <Footer />
          <FeedbackWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
