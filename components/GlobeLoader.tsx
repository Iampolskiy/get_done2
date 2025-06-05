// components/GlobeLoader.tsx
"use client";

import dynamic from "next/dynamic";
import type { Challenge as ChallengeType } from "@/types/types";

// Dynamischer Import, damit „react-globe.gl“ nur clientseitig gerendert wird:
const GlobeWithSearch = dynamic(
  () =>
    import("@/components/GlobeWithSearch").then((mod) => mod.GlobeWithSearch),
  { ssr: false }
);

interface GlobeLoaderProps {
  challenges: ChallengeType[];
}

export default function GlobeLoader({ challenges }: GlobeLoaderProps) {
  return <GlobeWithSearch challenges={challenges} />;
}
