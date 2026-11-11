import type { MetadataRoute } from "next";

const base = "https://mattebgremover.ashutoshswamy.in";

// ponytail: fixed dates, bump when the page content changes (new Date() would lie on every build)
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: "2026-11-12", changeFrequency: "monthly", priority: 1 },
    { url: `${base}/remove-background-for-product-photos`, lastModified: "2026-11-12", changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/transparent-png-maker`, lastModified: "2026-11-12", changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: "2026-11-12", changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: "2026-11-12", changeFrequency: "yearly", priority: 0.3 },
  ];
}
