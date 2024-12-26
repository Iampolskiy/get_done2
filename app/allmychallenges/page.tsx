// app/myChallengesPage.tsx

import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import React from "react";
import MyChallengesClient from "./MyChallengesClient";

// Singleton PrismaClient zur Vermeidung von Verbindungslecks
/* const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma; */

export default async function myChallengesPage() {
  const userNow = await currentUser();
  const userNowEmail = userNow?.emailAddresses?.[0]?.emailAddress;
  const prisma = new PrismaClient();

  // Überprüfe, ob der Benutzer authentifiziert ist und eine E-Mail-Adresse hat
  if (!userNow || !userNowEmail) {
    return (
      <div>
        <p>Benutzer ist nicht authentifiziert oder E-Mail-Adresse fehlt.</p>
      </div>
    );
  }

  // Finde alle Challenges, bei denen der Autor die aktuelle E-Mail-Adresse hat
  const challengesRaw = await prisma.challenge.findMany({
    where: {
      author: {
        email: userNowEmail,
      },
    },
    include: {
      author: true, // Optional: Um zusätzliche Daten des Autors zu erhalten
    },
  });

  console.log("Gefundene Challenges:", challengesRaw);

  const challenges = challengesRaw.map((challenge) => ({
    ...challenge,
    created_at: challenge.created_at
      ? challenge.created_at.toISOString()
      : null,
    updated_at: challenge.updated_at
      ? challenge.updated_at.toISOString()
      : null,
  }));

  console.log("Serialisierte Challenges:", challenges);

  return <MyChallengesClient challenges={challenges} />;
}
