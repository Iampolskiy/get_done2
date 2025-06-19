// app/challengesByCountry/[countryName]/page.tsx
import prisma from "@/lib/prisma";
import type { Challenge } from "@/types/types";
import ChallengesByCountryClient from "./ChallengesByCountryClient";

type PageProps = {
  params: {
    countryName: string;
  };
};

export default async function CountryChallengesPage({ params }: PageProps) {
  const countryName = decodeURIComponent(params.countryName || "").trim();

  if (!countryName) {
    return <div className="p-4 text-center text-red-500">Ungültiges Land</div>;
  }

  // ─── Prisma Query ─────────────────────────────────────────────
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

  // ─── Formatierung für das Frontend ─────────────────────────────
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

  // ─── Rendering ─────────────────────────────────────────────────
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        Challenges in {countryName.toUpperCase()}
      </h1>
      <ChallengesByCountryClient
        challenges={challenges}
        countryCode={countryName}
      />
    </div>
  );
}
