// actions/challengeActions/editChallenge.ts
"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function editChallenge(
  formData: FormData,
  imageUrls: string[]
): Promise<void> {
  // 1) Auth-Check
  const me = await currentUser();
  if (!me) throw new Error("Benutzer ist nicht authentifiziert");
  const email = me.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("Keine E-Mail-Adresse gefunden");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Benutzer nicht gefunden");

  // 2) IDs & Challenge-Lookup
  const id = parseInt(formData.get("id") as string, 10);
  if (Number.isNaN(id)) throw new Error("Ungültige Challenge-ID");
  const challenge = await prisma.challenge.findUnique({ where: { id } });
  if (!challenge) throw new Error("Challenge nicht gefunden");
  if (challenge.authorId !== user.id)
    throw new Error("Keine Berechtigung für diese Challenge");

  // 3) Daten aus dem Formular
  const title = (formData.get("title") as string) || undefined;
  const description = (formData.get("description") as string) || undefined;
  const category = (formData.get("category") as string) || undefined;
  const difficulty = (formData.get("difficulty") as string) || undefined;
  const goal = (formData.get("goal") as string) || undefined;
  const city_address = (formData.get("city_address") as string) || undefined;

  // --- Dauer: parseInt, aber 0 → 0 (unendlich), NaN → undefined
  const rawDur = formData.get("duration") as string | null;
  let duration: number | undefined;
  if (rawDur !== null) {
    const parsed = parseInt(rawDur, 10);
    if (!isNaN(parsed)) {
      duration = parsed; // speichert auch 0!
    }
  }

  const progress = formData.has("progress")
    ? parseFloat(formData.get("progress") as string)
    : undefined;
  const completed = formData.has("completed")
    ? (formData.get("completed") as string) === "true"
    : undefined;
  const ageRaw = formData.get("age") as string | null;
  const age =
    ageRaw !== null && ageRaw !== "" ? parseInt(ageRaw, 10) : undefined;
  const gender = (formData.get("gender") as string) || undefined;

  const data = {
    title,
    description,
    category,
    difficulty,
    goal,
    city_address,
    duration, // jetzt auch 0 möglich
    progress,
    completed,
    age,
    gender,
  };

  // 4) Transaktion: Update + Bilder neu anlegen
  await prisma.$transaction(async (tx) => {
    await tx.challenge.update({ where: { id }, data });
    await tx.image.deleteMany({ where: { challengeId: id, isMain: true } });
    const covers = imageUrls.slice(0, 10);
    if (covers.length) {
      await tx.image.createMany({
        data: covers.map((url) => ({
          url,
          isMain: true,
          duration: 0,
          challengeId: id,
          userId: user.id,
        })),
      });
    }
  });

  // 5) Redirect zurück zur Detail-Seite (mit ?editSuccess)
  redirect(`/allmychallenges/${id}?editSuccess=true`);
}
