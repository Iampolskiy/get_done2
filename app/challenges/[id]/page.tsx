// app/challenges/[id]/page.tsx
import { Challenge } from "@/types/types";
import prisma from "@/lib/prisma"; // Prisma Client
import ChallengeClient from "./ChallengeClient";
/* import GlobeLoader from "@/components/GlobeLoader"; // <— neu */

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ChallengePage({ params }: PageProps) {
  const numericId = parseInt(params.id, 10);

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

  return (
    <>
      {/* Bestehendes Rendering der Challenge */}
      <ChallengeClient challenge={challenge as Challenge} />

      {/* Hier wird der GlobeLoader gerendert, 
          der per dynamic(...) den Globe erst im Browser lädt */}
      {/* <div style={{ width: "100vw", height: "100vh", marginTop: "2rem" }}>
        <GlobeLoader />
      </div> */}
    </>
  );
}
