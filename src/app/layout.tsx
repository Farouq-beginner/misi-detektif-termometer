import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ClearLegacyCache from "@/components/pwa/clear-legacy-cache";

export const metadata: Metadata = {
  title: "Misi Detektif Termometer",
  description:
    "Petualangan keliling kota dunia untuk mengamati suhu dan belajar bilangan bulat. Aplikasi pembelajaran matematika untuk SMP.",
  keywords: ["bilangan bulat", "termometer", "matematika", "SMP", "suhu"],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Detektif Termo",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E6FD9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
        <ClearLegacyCache />
      </body>
    </html>
  );
}
