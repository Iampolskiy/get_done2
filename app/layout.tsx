// app/layout.tsx
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { FilterProvider } from "@/app/context/FilterContext";

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
            <Header />
            <main className="pt-16 min-h-screen">{children}</main>
            <Footer />
          </FilterProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
