import { MetadataRoute } from "next";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/api/",
        "/login/",
        "/forgot-password/",
        "/reset-password/",
      ],
    },
    sitemap: "https://oneto-one.com/sitemap.xml",
  };
}