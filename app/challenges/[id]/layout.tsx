import Header from "@/components/Header";

// app/challenges/[id]/layout.tsx
export default function ChallengeDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header bleibt in dieser Ansicht erhalten */}
      <Header />
      {children}
      {/* Footer wird hier bewusst weggelassen */}
    </>
  );
}
