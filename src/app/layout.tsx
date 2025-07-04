import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CivicAuthProvider } from "@civic/auth/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unity",
  description: "When Help is Needed, People Unite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CivicAuthProvider iframeMode="embedded">{children}</CivicAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
