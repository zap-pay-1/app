import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import ClientProvider from "@/components/providers/client-provider";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "munaPay – Accept Bitcoin Payments Seamlessly",
  description:
    "Set up your business in minutes and start accepting Bitcoin payments globally. Secure, fast, and built for modern businesses.",
  keywords: [
    "Bitcoin payments",
    "crypto payments",
    "BTC checkout",
    "merchant crypto",
    "business payments",
    "XTS Pay",
    "accept bitcoin online",
  ],
  openGraph: {
    title: "munaPay – Accept Bitcoin Payments Seamlessly",
    description:
      "Onboard quickly and start accepting Bitcoin with secure and modern payment tools for businesses.",
    url: "https://munapay.xyz", // replace with your domain
    siteName: "munaPay",
    images: [
      {
        url: "https://xts-pay.com/og-image.png", // add your OG image
        width: 1200,
        height: 630,
        alt: "munapay Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "munaPay – Accept Bitcoin Payments Seamlessly",
    description:
      "Set up your business in minutes and start accepting Bitcoin payments globally. Secure, fast, and built for modern businesses.",
    images: ["https://xts-pay.com/og-image.png"], // same OG image
    creator: "@xtspay", // replace with your Twitter/X handle
  },
  metadataBase: new URL("https://xts-pay.com"),
  alternates: {
    canonical: "https://xts-pay.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        
          <ClientProvider>
        
        {children}
   
        </ClientProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
