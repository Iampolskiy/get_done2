import { Challenge } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import MyChallengeClient from "./MyChallengeClient";

export default async function ChallengesPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const prisma = new PrismaClient();
  const numericId = parseInt(id, 10);
  const challenge = (await prisma.challenge.findUnique({
    where: {
      id: numericId,
    },
    include: {
      author: true, // Lade auch die Autoren-Information
    },
  })) as Challenge;

  if (!challenge) {
    return <div>Challenge not found</div>;
  }

  console.log("Gefundene Challenge:", challenge);
  console.log("123", params);

  if (!challenge) {
    return <div>Challenge not found</div>;
  }

  // HTML zurückgeben
  return <MyChallengeClient challenge={challenge} />;
}
