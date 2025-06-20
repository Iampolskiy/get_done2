// app/api/challenges/countByCountry/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  // 1) Parameter „country“ aus der URL auslesen
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");

  if (!country || country.trim() === "") {
    return NextResponse.json(
      { error: "Query-Parameter 'country' fehlt oder ist ungültig." },
      { status: 400 }
    );
  }

  try {
    // 2) Zähle alle Challenges, deren `country`‐Feld genau dem übergebenen Namen entspricht
    const count = await prisma.challenge.count({
      where: {
        country: country.trim(),
      },
    });
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Fehler beim Zählen der Challenges:", err);
    return NextResponse.json(
      { error: "Interner Serverfehler beim Zählen der Challenges." },
      { status: 500 }
    );
  }
}
