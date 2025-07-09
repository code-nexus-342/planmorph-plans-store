import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { AuthProvider } from "../contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "PlanMorph - Build Your Dream Home Today",
  description: "Browse ready-made architectural plans and 3D renders for instant, confident building. Transform your vision into reality with expert-designed house plans.",
  keywords: "house plans, architectural plans, 3D renders, home building, blueprints, custom homes",
  authors: [{ name: "PlanMorph Team" }],
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/planmorph-logo.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/planmorph-logo.jpg', sizes: '16x16', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/planmorph-logo.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
    shortcut: '/planmorph-logo.jpg',
  },
  openGraph: {
    title: "PlanMorph - Build Your Dream Home Today",
    description: "Browse ready-made architectural plans and 3D renders for instant, confident building.",
    type: "website",
    locale: "en_US",
    url: "https://planmorph.com",
    siteName: "PlanMorph",
    images: [
      {
        url: "/planmorph-logo.jpg",
        width: 1200,
        height: 630,
        alt: "PlanMorph - House Plans Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanMorph - Build Your Dream Home Today",
    description: "Browse ready-made architectural plans and 3D renders for instant, confident building.",
    images: ["/planmorph-logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
