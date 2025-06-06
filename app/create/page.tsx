// app/create/page.tsx
"use server";

import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import CreateClient from "./CreateClient";

const COUNTRIES_DATA_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

export default async function createPage() {
  // 1) Prüfen, ob der Benutzer angemeldet ist
  const userNow = await currentUser();
  const userNowEmail = userNow?.emailAddresses?.[0]?.emailAddress;
  if (!userNow || !userNowEmail) {
    return (
      <div className="p-8 text-center text-white">
        <p>Benutzer ist nicht authentifiziert oder E-Mail-Adresse fehlt.</p>
      </div>
    );
  }

  // 2) Länderliste serverseitig aus GeoJSON holen
  let countryList: string[] = [];
  try {
    const res = await fetch(COUNTRIES_DATA_URL);
    const json = (await res.json()) as {
      features: { properties: { name: string } }[];
    };
    countryList = json.features
      .map((f) => f.properties.name)
      .filter((n): n is string => typeof n === "string")
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("Fehler beim Laden der Länder-GeoJSON:", error);
  }

  // 3) CreateClient mit countryList als Prop rendern
  return <CreateClient countryList={countryList} />;
}
