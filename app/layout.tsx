import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const siteUrl = "https://mattebgremover.ashutoshswamy.in";
const title = "Matte — Free Online Background Remover";
const description =
  "Remove image backgrounds instantly, free, right in your browser. No upload to any server — Matte processes photos on-device and exports transparent PNGs.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Matte",
  },
  description,
  keywords: [
    "background remover",
    "remove background from image",
    "transparent PNG",
    "free background removal",
    "online background eraser",
    "in-browser background removal",
  ],
  authors: [{ name: "Ashutosh Swamy", url: "https://ashutoshswamy.in" }],
  creator: "Ashutosh Swamy",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Matte",
    title,
    description,
    images: [{ url: "/og-image.png", width: 1730, height: 909, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
    creator: "@ashutoshswamy_",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bone text-stage">{children}</body>
    </html>
  );
}
