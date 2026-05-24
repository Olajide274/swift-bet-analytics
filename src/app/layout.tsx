import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwiftBetAnalytics",
  description: "Premium sports analytics and betting companion app",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* iOS Web App Meta tags and Apple Home Screen Icon */}
        <link rel="apple-touch-icon" href="https://flaticon.com" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
// FIXED: Forces Next.js to bypass static pre-rendering across all platform routes
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
