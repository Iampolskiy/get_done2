"use client";

import { useState, useEffect, useRef } from "react"; // useState & useEffect for NavLink/MobileLink
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import SearchSortFilterSplitBar from "@/components/SearchSortFilterSplitBar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY.current && currentY > 50);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Toolbar only on challenges routes
  const showToolbar =
    pathname === "/challenges" || pathname === "/allmychallenges";

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 bg-transparent backdrop-blur-md transform transition-transform duration-300 ease-out " +
        (hidden ? "-translate-y-full" : "translate-y-0")
      }
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          Get Done
        </Link>

        {showToolbar && <SearchSortFilterSplitBar />}

        {/* Mobile Toggle: visible below md */}
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

        {/* Desktop Navigation: visible from md */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="/allmychallenges" label="My Challenges" />
          <NavLink href="/challenges" label="Challenges" />
          <NavLink href="/create" label="Create" />
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
        <div className="md:hidden bg-black/50 backdrop-blur-md px-4 pb-4 space-y-2">
          <MobileLink href="/" label="Home" />
          <MobileLink href="/create" label="Create" />
          <MobileLink href="/allmychallenges" label="My Challenges" />
          <MobileLink href="/challenges" label="Challenges" />
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

// NavLink & MobileLink determine active via usePathname
const NavLink = ({ href, label }: { href: string; label: string }) => {
  const path = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const isActive = mounted && path === href;
  return (
    <Link
      href={href}
      className={`text-white hover:text-blue-300 transition ${
        isActive ? "text-blue-300 font-semibold" : ""
      }`}
    >
      {label}
    </Link>
  );
};

const MobileLink = ({ href, label }: { href: string; label: string }) => {
  const path = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const isActive = mounted && path === href;
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded ${
        isActive ? "bg-blue-600 text-white" : "text-gray-100 hover:bg-gray-700"
      }`}
    >
      {label}
    </Link>
  );
};
