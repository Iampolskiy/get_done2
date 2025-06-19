// app/challenges-by-country/[countryName]/ChallengesByCountryClient.tsx
"use client";

import React from "react";
import type { Challenge } from "@/types/types";
import ChallengesClient from "@/app/challenges/ChallengesClient";

interface Props {
  challenges: Challenge[];
  countryCode: string;
}

const ChallengesByCountryClient: React.FC<Props> = ({
  challenges,
  countryCode,
}) => {
  // Da wir serverseitig bereits nach country gefiltert haben,
  // können wir hier direkt mit dem übergebenen Array arbeiten.
  // Falls du dennoch eine lokale Sortier-/Suchfunktion von ChallengesClient nutzen
  // möchtest, gib challenges unverändert an ChallengesClient weiter.
  if (!challenges) {
    // Vorsichtshalber: falls der Server einmal kein Array liefert (z.B. ohne countryParam)
    return <p>Lade Challenges …</p>;
  }

  if (challenges.length === 0) {
    return (
      <p className="text-center mt-8">
        Es gibt keine Challenges für {countryCode.toUpperCase()}.
      </p>
    );
  }

  return (
    <div className="px-4">
      {/* 
        Wenn dein ChallengesClient intern eine Such‐ oder Sortier‐Logik per useMemo(filter)
        hat, dann stell sicher, dass er **immer** ein Array vorfindet (auch leeres Array).
        Hier übergeben wir also garantiert ein Array (auch wenn es 0 Elemente enthält).
      */}
      <ChallengesClient
        challenges={challenges} // <–– das ist niemals undefined
        /* showCity={true} */ // falls du dieses Prop brauchst
      />
    </div>
  );
};

export default ChallengesByCountryClient;
