import { Challenge } from "@/types/types";
import prisma from "@/lib/prisma"; // Prisma Client
import ChallengeClient from "./ChallengeClient";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ChallengePage({ params }: PageProps) {
  const numericId = await parseInt(params.id, 10);

  const challenge = await prisma.challenge.findUnique({
    where: { id: numericId },
    include: {
      author: true,
      images: true,
      updates: {
        include: {
          images: true,
        },
      },
    },
  });

  if (!challenge) {
    return (
      <div className="p-4 text-center text-red-500">Challenge not found</div>
    );
  }

  return <ChallengeClient challenge={challenge as Challenge} />;
}
