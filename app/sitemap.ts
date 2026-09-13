import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://netpulse.app";
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/history`, lastModified: new Date() },
    { url: `${baseUrl}/dashboard`, lastModified: new Date() },
    { url: `${baseUrl}/diagnostics`, lastModified: new Date() },
    { url: `${baseUrl}/methodology`, lastModified: new Date() },
    { url: `${baseUrl}/status`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
  ];
}
