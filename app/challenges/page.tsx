import { Challenge } from "@/types/types";
import prisma from "@/lib/prisma";
import ChallengesClient from "./ChallengesClient";

export default async function ChallengesPage() {
  const challenges = await prisma.challenge.findMany({
    include: {
      author: true,
      images: true,
      updates: {
        include: { images: true }, // optional, aber gut falls du es brauchst
      },
    },
  });

  return <ChallengesClient challenges={challenges as Challenge[]} />;
}
