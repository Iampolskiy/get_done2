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

  const challenge = await prisma.challenge.findUnique({
    where: { id: numericId },
    include: {
      author: true,
      images: {
        select: {
          id: true,
          description: true,
          duration: true,
          created_at: true,
          updated_at: true,
          url: true,
          challengeId: true,
          userId: true,
        },
      },
      updates: {
        include: {
          images: true, // 👈 wichtig: Bilder bei Updates mitladen
        },
      },
    },
  });

  if (!challenge) {
    return <div>Challenge nicht gefunden</div>;
  }

  // 🔁 Mapping mit erweiterten Typen (inkl. updateText, date, etc.)
  const mappedChallenge = {
    ...challenge,
    updates: (
      challenge.updates as ((typeof challenge.updates)[0] & { images: any[] })[]
    ).map((u) => ({
      id: u.id,
      updateText: u.content ?? "",
      date: u.createdAt.toISOString(),
      createdAt: u.createdAt.toISOString(),
      type: u.type,
      challengeId: u.challengeId,
      userId: u.authorId ?? 0,
      images: u.images ?? [],
    })),
  };

  return <MyChallengeClient challenge={mappedChallenge} />;
}
