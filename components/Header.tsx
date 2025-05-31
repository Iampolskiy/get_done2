// components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import SearchSortFilterSplitBar from "@/components/SearchSortFilterSplitBar";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Nur auf diesen Routen die Filter-Leiste einblenden:
  const showToolbar =
    pathname === "/challenges" || pathname === "/allmychallenges";

  // Flag, um Client-seitiges Einblenden der Hover-Zone zu verhindern
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* ─── UNSICHTBARE ZONE oben: Maus-Hover zeigt Header ────────────── */}
      {mounted && (
        <div
          className="fixed top-0 left-0 right-0 h-2 z-50"
          onMouseEnter={() => setShowHeader(true)}
        />
      )}

      {/* ─── HEADER: erscheint/verschwindet per Slide-Effekt ───────────── */}
      <header
        className={`
          fixed inset-x-0 top-0 z-50 
          bg-transparent backdrop-blur-md
          transform transition-transform duration-300 ease-out
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
        `}
        onMouseLeave={() => setShowHeader(false)}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Get Done
          </Link>

          {showToolbar && <SearchSortFilterSplitBar />}

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Menü öffnen"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <nav className="hidden md:flex items-center space-x-6 text-white">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/create">Create</NavLink>
            <NavLink href="/allmychallenges">My Challenges</NavLink>
            <NavLink href="/challenges">Challenges</NavLink>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
                  Anmelden
                </button>
              </SignInButton>
            </SignedOut>
          </nav>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black/50 backdrop-blur-md px-4 pb-4 space-y-2">
            <MobileLink href="/">Home</MobileLink>
            <MobileLink href="/create">Create</MobileLink>
            <MobileLink href="/allmychallenges">My Challenges</MobileLink>
            <MobileLink href="/challenges">Challenges</MobileLink>
            <div className="pt-2">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
                    Anmelden
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-white hover:text-blue-300 transition">
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={
        typeof window !== "undefined" && window.location.pathname === href
          ? "page"
          : undefined
      }
      className="block px-4 py-2 rounded text-gray-100 hover:bg-gray-700"
    >
      {children}
    </Link>
  );
}
