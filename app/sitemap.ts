import type { MetadataRoute } from "next";
import { solutions } from "@/data/solutions";

const BASE_URL = "https://diligentkyc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const solutionRoutes: MetadataRoute.Sitemap = solutions.map(
    (solution) => ({
      url: `${BASE_URL}/solutions/${solution.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  return [...staticRoutes, ...solutionRoutes];
}