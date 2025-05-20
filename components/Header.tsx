// components/Header.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 bg-transparent backdrop-blur-md transform transition-transform duration-300 ease-out " +
        (hidden ? "-translate-y-full" : "translate-y-0")
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 h-full flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          Get Done
        </Link>

        {/* Mobile Toggle */}
        <button
          className="sm:hidden text-white"
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center space-x-6">
          <NavLink href="/" label="Home" active={pathname === "/"} />
          <NavLink
            href="/create"
            label="Create"
            active={pathname === "/create"}
          />
          <NavLink
            href="/allmychallenges"
            label="My Challenges"
            active={pathname === "/allmychallenges"}
          />
          <NavLink
            href="/challenges"
            label="Challenges"
            active={pathname === "/challenges"}
          />

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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-black/50 backdrop-blur-md px-4 pb-4 space-y-2">
          <MobileLink href="/" label="Home" active={pathname === "/"} />
          <MobileLink
            href="/create"
            label="Create"
            active={pathname === "/create"}
          />
          <MobileLink
            href="/allmychallenges"
            label="My Challenges"
            active={pathname === "/allmychallenges"}
          />
          <MobileLink
            href="/challenges"
            label="Challenges"
            active={pathname === "/challenges"}
          />

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
  );
}

const NavLink = ({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) => (
  <Link
    href={href}
    className={`text-white hover:text-blue-300 transition ${
      active ? "text-blue-300 font-semibold" : ""
    }`}
  >
    {label}
  </Link>
);

const MobileLink = ({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={`block px-4 py-2 rounded ${
      active ? "bg-blue-600 text-white" : "text-gray-100 hover:bg-gray-700"
    }`}
  >
    {label}
  </Link>
);
