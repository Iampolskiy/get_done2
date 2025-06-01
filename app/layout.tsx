// app/layout.tsx

// 1) Verhindere den Default-Cache: jede Anfrage liest frische Daten,
//    aber behält explizit gecachte Fetches bei.
//    (Nutze das, wenn du Standard-Fetches neu laden willst,
//     aber Ausnahmen mit eigenem Cache beibehalten möchtest.)
export const revalidate = 0; // :contentReference[oaicite:0]{index=0}

// 2) Optional: Komplett aus dem Cache aussteigen, keine Ausnahme.
//    (Nutze das, wenn wirklich *nichts* im Cache sein darf,
//     z. B. für hochdynamische oder sicherheitskritische Pages.)
/* export const dynamic = "force-dynamic";  */ // :contentReference[oaicite:1]{index=1}

import "./globals.css";
import Header from "../components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { FilterProvider } from "@/app/context/FilterContext";
import FooterWrapper from "../components/FooterWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body>
          <FilterProvider>
            <Header />{" "}
            <main className="gb-gray-900 min-h-screen">{children}</main>
            <FooterWrapper />
          </FilterProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
