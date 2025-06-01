// components/FooterWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  // Wenn die Route mit "/challenges/" beginnt, keinen Footer anzeigen
  if (pathname.startsWith("/challenges/")) {
    return null;
  }
  return <Footer />;
}
