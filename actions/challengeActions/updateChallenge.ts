/* actions/challengeActions/updateChallenge.ts */
"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * Legt einen Update‑Eintrag inkl. (optionaler) Bilder an.
 * Alle Bilder bekommen isMain = false ‑ sie sind keine Titelbilder!
 */
export async function createUpdate(
  challengeId: string,
  formData: FormData
): Promise<void> {
  /* ---------- 1) Auth‑Check ----------------------------------- */
  const me = await currentUser();
  if (!me) throw new Error("Benutzer ist nicht authentifiziert");

  const email = me.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("Keine E-Mail-Adresse gefunden");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Benutzer nicht in der Datenbank gefunden");

  /* ---------- 2) Challenge‑Check ------------------------------ */
  const id = parseInt(challengeId, 10);
  const challenge = await prisma.challenge.findUnique({ where: { id } });
  if (!challenge) throw new Error("Challenge nicht gefunden");
  if (challenge.authorId !== user.id)
    throw new Error("Keine Berechtigung für diese Challenge");

  /* ---------- 3) Form‑Daten ----------------------------------- */
  const updateText = formData.get("updateText") as string;
  if (!updateText) throw new Error("Update‑Text fehlt");

  const imageUrls = formData.getAll("imageUrls") as string[]; // Cloudinary‑URLs

  /* ---------- 4) Transaktion ---------------------------------- */
  await prisma.$transaction(async (tx) => {
    const upd = await tx.update.create({
      data: {
        challengeId: challenge.id,
        authorId: user.id,
        content: updateText,
        type: "UPDATED",
      },
    });

    if (imageUrls.length) {
      await tx.image.createMany({
        data: imageUrls.map((url) => ({
          url,
          isMain: false, // ✨ NIE Titelbild
          duration: 0,
          challengeId: challenge.id,
          updateId: upd.id,
          userId: user.id,
        })),
      });
    }
  });

  /* ---------- 5) Redirect ------------------------------------- */
  redirect(`/allmychallenges/${challengeId}?editSuccess=true`);
}
