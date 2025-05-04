/* actions/challengeActions/editChallenge.ts */
"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * Aktualisiert Challenge‑Felder und ersetzt die Titelbilder.
 * @param formData   Formulardaten (enthält Challenge‑ID & Felder)
 * @param imageUrls  Array von URLs (max. 10) für neue Titelbilder
 */
export async function editChallenge(
  formData: FormData,
  imageUrls: string[]
): Promise<void> {
  /* ---------- 1) Auth‑Check ---------------------------------- */
  const me = await currentUser();
  if (!me) throw new Error("Benutzer ist nicht authentifiziert");

  const email = me.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("Keine E‑Mail‑Adresse gefunden");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Benutzer nicht gefunden");

  /* ---------- 2) IDs & Challenge‑Lookup ---------------------- */
  const id = parseInt(formData.get("id") as string, 10);
  if (Number.isNaN(id)) throw new Error("Ungültige Challenge‑ID");

  const challenge = await prisma.challenge.findUnique({ where: { id } });
  if (!challenge) throw new Error("Challenge nicht gefunden");
  if (challenge.authorId !== user.id)
    throw new Error("Keine Berechtigung für diese Challenge");

  /* ---------- 3) Daten aus dem Formular ---------------------- */
  const data = {
    title: (formData.get("title") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    category: (formData.get("category") as string) || undefined,
    difficulty: (formData.get("difficulty") as string) || undefined,
    progress: formData.has("progress")
      ? parseFloat(formData.get("progress") as string)
      : undefined,
    completed: formData.has("completed")
      ? (formData.get("completed") as string) === "true"
      : undefined,
    goal: (formData.get("goal") as string) || undefined,
    age: parseInt(formData.get("age") as string, 10) || undefined,
    gender: (formData.get("gender") as string) || undefined,
    city_address: (formData.get("city_address") as string) || undefined,
    duration: parseInt(formData.get("duration") as string, 10) || undefined,
  };

  /* ---------- 4) Transaktion --------------------------------- */
  await prisma.$transaction(async (tx) => {
    // 4a) Challenge‑Felder updaten
    await tx.challenge.update({ where: { id }, data });

    // 4b) Vorherige Titelbilder entfernen
    await tx.image.deleteMany({
      where: { challengeId: id, isMain: true },
    });

    // 4c) Neue Titelbilder anlegen (max 10)
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

  /* ---------- 5) Redirect ------------------------------------ */
  redirect(`/allmychallenges/${id}?editSuccess=true`);
}
