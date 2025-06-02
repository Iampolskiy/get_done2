// components/GlobeLoader.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamischer Import in einer echten Client Component mit ssr: false
const GlobeWithSearch = dynamic(
  () =>
    import("@/components/GlobeWithSearch").then((mod) => mod.GlobeWithSearch),
  { ssr: false }
);

export default function GlobeLoader() {
  // Einfach die dynamisch geladene Komponente rendern
  return <GlobeWithSearch />;
}
