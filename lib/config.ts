// Directus API URL - using environment variable with fallback
export const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://directus-1.nekozdevteam.eu";

// Datenmodelle
export const MODELS = {
  HEADER: "Header_Kaiser",
  LINKS: "Links_Kaiser",
  WELCOME: "Welcome_Kaiser",
  IMPRESSUM: "impressum_kaiser",
  BILDERGALERIE: "Bildergalerie",
} as const;

// Type für Model Keys
export type ModelKey = keyof typeof MODELS;
