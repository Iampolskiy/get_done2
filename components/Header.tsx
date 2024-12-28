"use client";

import { useState, useEffect, useRef } from "react"; // Importiere useRef und useEffect für den Klick außerhalb des Dropdowns
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref für das Dropdown-Menü

  // Funktion zum Öffnen/Schließen des Dropdown-Menüs
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Funktion zum Schließen des Dropdowns bei Klick außerhalb
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false); // Schließe das Menü, wenn der Klick außerhalb des Dropdowns war
    }
  };

  // useEffect zum Hinzufügen/Entfernen des Event-Listeners
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Füge einen Klick-Listener hinzu
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Entferne den Listener, wenn die Komponente unmounted wird
    };
  }, []);

  // State, um zu überprüfen, ob die Komponente auf der Client-Seite gemountet ist
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true); // Setze isMounted auf true nach dem Mounten der Komponente
  }, []);

  const pathname = usePathname();

  return (
    <>
      <header className="flex justify-between items-center px-8 bg-gray-900 text-white">
        {/* Logo */}
        <Link href="/">
          <h2 className="text-3xl font-bold m-4 text-center">Get Done</h2>
        </Link>
        {/* Navigation */}
        <nav className="flex items-center space-x-12">
          <Link
            href="/create"
            className={
              isMounted && pathname === "/create" ? "text-blue-500" : ""
            }
          >
            Create New
          </Link>
          <Link
            href="/"
            className={isMounted && pathname === "/" ? "text-blue-500" : ""}
          >
            Home
          </Link>
          <Link
            href="/allmychallenges"
            className={
              isMounted && pathname === "/allmychallenges"
                ? "text-blue-500"
                : ""
            }
          >
            My Challenges
          </Link>
          <Link
            href="/challenges"
            className={
              isMounted && pathname === "/challenges" ? "text-blue-500" : ""
            }
          >
            Challenges
          </Link>
          {/* My Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown-Trigger */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <span>My Account</span>
            </div>
            {/* Dropdown-Menü */}
            {dropdownOpen && (
              <div className="absolute bg-white text-black mt-2 p-2 rounded shadow-lg">
                <Link
                  href="/account"
                  className="block p-2 hover:bg-gray-200 rounded"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block p-2 hover:bg-gray-200 rounded"
                >
                  Settings
                </Link>
                <Link
                  href="/logout"
                  className="block p-2 hover:bg-gray-200 rounded"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
          {/* Login Button (auskommentiert) */}
          {/* <Link href="/login" className="ml-4 bg-blue-500 px-4 py-2 rounded">
            Login
          </Link> */}
          {children}
        </nav>
      </header>
    </>
  );
}
