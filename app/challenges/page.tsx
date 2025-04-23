import { Challenge } from "@/types/types";
import prisma from "@/lib/prisma"; // Importiere den Singleton Prisma Client
import ChallengesClient from "./ChallengesClient";

export default async function ChallengesPage() {
  // Direkt die Datenbank abfragen
  const challenges = (
    await prisma.challenge.findMany({
      include: {
        author: true, // Lade auch die Autoren-Information
        images: true,
      },
    })
  ).map((challenge) => ({
    ...challenge,
    images: challenge.images.map((image) => image.url), // Extrahiere nur die URLs
  })) as Challenge[];

  return <ChallengesClient challenges={challenges} />;
}
