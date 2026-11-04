import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Breaking Bread",
    short_name: "Breaking Bread",
    description: "Good Food. Big Flavours.",
    start_url: "/",
    display: "standalone",
    background_color: "#13110f",
    theme_color: "#13110f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
