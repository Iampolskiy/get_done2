"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
} from "@clerk/nextjs"; // 🔧 Clerk importiert

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          Get Done
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop Menu */}
        <nav className="hidden sm:flex space-x-6 items-center">
          <NavLink href="/" label="Home" active={pathname === "/"} />
          <NavLink
            href="/create"
            label="Create New"
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

          {/* 🔧 Clerk Integration */}
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-white bg-blue-600 px-4 py-2 rounded">
                Anmelden
              </button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 bg-gray-800">
          <MobileLink href="/" label="Home" active={pathname === "/"} />
          <MobileLink
            href="/create"
            label="Create New"
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

          {/* 🔧 Clerk Mobile Buttons */}
          <div className="pt-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-white bg-blue-600 px-4 py-2 rounded w-full">
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

// NavLink component (desktop)
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
    className={`hover:text-blue-500 ${
      active ? "text-blue-500 font-semibold" : ""
    }`}
  >
    {label}
  </Link>
);

// MobileLink component
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
