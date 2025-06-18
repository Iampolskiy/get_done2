// app/create/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import CreateClient from "./CreateClient";
import countryList from "@/lib/data/countries.json";
import { currentUser } from "@clerk/nextjs/server";

export default async function CreatePage() {
  /* -------- Auth --------------------------------------------- */
  const me = await currentUser();
  const email = me?.emailAddresses?.[0]?.emailAddress;
  if (!me || !email)
    return <p>Benutzer ist nicht authentifiziert oder E-Mail fehlt.</p>;

  // Diese Seite rendert nur die Client-Komponente.
  return <CreateClient countryList={countryList as string[]} />;
}
