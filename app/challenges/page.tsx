import { Challenge } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import ChallengesClient from "./ChallengesClient";

export default async function ChallengesPage() {
  const prisma = new PrismaClient();

  // Direkt die Datenbank abfragen
  const challenges = (await prisma.challenge.findMany({
    include: {
      author: true, // Lade auch die Autoren-Information
    },
  })) as Challenge[];

  // HTML zurückgeben
  return <ChallengesClient challenges={challenges} />;
}
