import { Challenge } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import MyChallengeClient from "./MyChallengeClient";
import { currentUser } from "@clerk/nextjs/server";

export default async function ChallengesPage({
  params,
}: {
  params: { id: string };
}) {
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

  // HTML zurückgeben
  return <MyChallengeClient challenge={challenge} />;
}
