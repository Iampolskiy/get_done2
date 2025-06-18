// app/create/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import CreateClient from "./CreateClient";
import countryList from "@/lib/data/countries.json";

export default function CreatePage() {
  // Diese Seite rendert nur die Client-Komponente.
  return <CreateClient countryList={countryList as string[]} />;
}
