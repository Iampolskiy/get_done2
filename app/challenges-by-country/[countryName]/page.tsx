// app/challengesByCountry/[countryName]/page.tsx
import prisma from "@/lib/prisma";
import type { Challenge } from "@/types/types";
import ChallengesByCountryClient from "./ChallengesByCountryClient";

type Params = {
  countryName: string; // → entspricht dem Ordner-Namen [countryName]
};

export default async function CountryChallengesPage({
  params,
}: {
  params: Params;
}) {
  // 1) Den Param korrekt auslesen:
  const { countryName } = params;

  // 2) Prisma-Query: wir filtern nach "country = countryName"
  const rawChallenges = await prisma.challenge.findMany({
    where: { country: countryName },
    orderBy: { created_at: "desc" },
    include: {
      author: {
        select: { id: true, email: true, clerkId: true, name: true },
      },
      images: true,
      updates: { include: { images: true } },
    },
  });

  // 3) Weil dein Update-Interface ein Feld `date: string` erwartet, fügen wir es hier hinzu:
  const challenges: Challenge[] = rawChallenges.map((ch) => ({
    ...ch,
    updates: ch.updates.map((upd) => ({
      ...upd,
      date:
        upd.createdAt instanceof Date
          ? upd.createdAt.toISOString()
          : upd.createdAt,
    })),
  }));

  return (
    <div className="container mx-auto py-8">
      {/* Hier war vorher `countryCode.toUpperCase()` → wir benutzen jetzt `countryName` */}
      <h1 className="text-3xl font-bold mb-6">
        Challenges in {countryName.toUpperCase()}
      </h1>
      <ChallengesByCountryClient
        challenges={challenges}
        countryCode={
          countryName
        } /* Du kannst es auch `countryName` nennen; Client-Prop muss passen */
      />
    </div>
  );
}
