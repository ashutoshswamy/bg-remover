import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { Toaster } from "sileo";
import { FAQ } from "./faq";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl = "https://mattebgremover.ashutoshswamy.in";
const title = "Matte: Free Online Background Remover, No Upload";
const description =
  "Remove image backgrounds free in your browser. Photos never upload to a server: Matte cuts out subjects on your device and exports transparent PNGs.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f4" },
    { media: "(prefers-color-scheme: dark)", color: "#101215" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#app`,
      name: "Matte",
      url: siteUrl,
      description,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires a modern browser with WebAssembly",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: "Ashutosh Swamy", url: "https://ashutoshswamy.in" },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Matte",
  },
  description,
  authors: [{ name: "Ashutosh Swamy", url: "https://ashutoshswamy.in" }],
  creator: "Ashutosh Swamy",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Matte",
    title,
    description,
    images: [{ url: "/og-image.jpg", width: 1731, height: 909, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
    creator: "@ashutoshswamy_",
  },
  icons: {
    icon: [
      { url: "/icon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
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
      suppressHydrationWarning
      className={`${bricolage.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('matte-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}"}}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Toaster position="top-center" theme="system" />
        {children}
      </body>
    </html>
  );
}
