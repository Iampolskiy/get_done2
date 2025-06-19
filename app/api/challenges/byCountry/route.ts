// app/api/challenges/byCountry/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");

  if (!country || country.trim() === "") {
    return NextResponse.json(
      { error: "Query-Parameter 'country' fehlt oder ist ungültig." },
      { status: 400 }
    );
  }

  try {
    // 1) Hole alle Challenges, deren `country`-Feld genau dem übergebenen Namen entspricht.
    //    Wir wählen nur die Felder aus, die wir in der Detail-Ansicht brauchen (id, title, city_address).
    const challenges = await prisma.challenge.findMany({
      where: {
        country: country.trim(),
      },
      select: {
        id: true,
        title: true,
        city_address: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return NextResponse.json({ challenges });
  } catch (err) {
    console.error("Fehler beim Lesen der Challenges für das Land:", err);
    return NextResponse.json(
      { error: "Interner Serverfehler beim Abrufen der Challenges." },
      { status: 500 }
    );
  }
}
