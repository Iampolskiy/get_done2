"use server";
// app/edit/[id]/page.tsx

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import EditClient from "./EditClient";
import { Challenge } from "@/types/types";

export default async function EditPage({ params }: { params: { id: string } }) {
  /* ── Auth ─────────────────────────────────────────────── */
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!user || !email) {
    return (
      <p className="mx-auto mt-10 max-w-md rounded bg-red-100 p-6 text-center text-red-700">
        Du bist nicht angemeldet / E-Mail fehlt.
      </p>
    );
  }

  /* ── Challenge laden ──────────────────────────────────── */
  const id = Number(params.id);
  const challenge = (await prisma.challenge.findUnique({
    where: { id },
    include: { author: true, images: true },
  })) as Challenge | null;

  if (!challenge || challenge.author.email !== email) {
    return (
      <p className="mx-auto mt-10 max-w-md rounded bg-red-100 p-6 text-center text-red-700">
        Challenge wurde nicht gefunden oder gehört dir nicht.
      </p>
    );
  }

  /* ── Client-Component ─────────────────────────────────── */
  return <EditClient challenge={challenge} />;
}
