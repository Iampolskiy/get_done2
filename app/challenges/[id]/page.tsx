/* import React from "react";
import { Challenge } from "@/types/types";
import ChallengeClient from "./ChallengeClient";
import prisma from "@/lib/prisma"; // Importiere den Singleton Prisma Client
import { log } from "console";

export default async function ChallengePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const challenge = (await prisma.challenge.findUnique({
    where: {
      id: numericId,
    },
    include: {
      author: true, // Lade auch die Autoren-Information
      images: true,
    },
  })) as Challenge;

  if (!challenge) {
    return <div>Challenge not found</div>;
  }

  console.log(challenge);

  return <ChallengeClient challenge={challenge} />;
}
 */

import { Challenge } from "@/types/types";

import prisma from "@/lib/prisma"; // Importiere den Singleton Prisma Client
import ChallengeClient from "./ChallengeClient";

export default async function ChallengePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  // Direkt die Datenbank abfragen
  const challenge = await prisma.challenge.findUnique({
    where: {
      id: numericId,
    },
    include: {
      author: true, // Lade auch die Autoren-Information
      images: true,
      updates: { include: { images: true } },
    },
  });

  return <ChallengeClient challenge={challenge as Challenge} />;
}
