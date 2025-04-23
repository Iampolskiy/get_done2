// app/myChallengesPage.tsx

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import React from "react";
import MyChallengesClient from "./MyChallengesClient";
import Feedback from "@/components/Feedback";

export default async function myChallengesPage() {
  const userNow = await currentUser();
  const userNowEmail = userNow?.emailAddresses?.[0]?.emailAddress;

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
      images: true,
    },
  });
  console.log("Challenges:", challengesRaw);
  const challenges = challengesRaw.map((challenge) => ({
    ...challenge,
  }));

  return (
    <>
      <Feedback />
      <MyChallengesClient challenges={challenges} />;
    </>
  );
}
