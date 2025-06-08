// app/create/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import CreateClient from "./CreateClient";
import countryList from "@/lib/data/countries.json";

export default function CreatePage() {
  // Diese Seite rendert nur die Client‐Komponente. Die Authentifizierung
  // (via Clerk) findet direkt in der Server‐Action createChallenge() statt.
  return <CreateClient countryList={countryList as string[]} />;
}
