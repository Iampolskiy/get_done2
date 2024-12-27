import { Challenge } from "@/types/types";
import prisma from "@/lib/prisma"; // Importiere den Singleton Prisma Client
import ChallengesClient from "./ChallengesClient";

export default async function ChallengesPage() {
  // Direkt die Datenbank abfragen
  const challenges = (await prisma.challenge.findMany({
    include: {
      author: true, // Lade auch die Autoren-Information
    },
  })) as Challenge[];

  // HTML zurückgeben
  return <ChallengesClient challenges={challenges} />;
}
