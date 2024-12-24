"use client";

import { useState, useEffect, useRef } from "react"; // Importiere useRef und useEffect für den Klick außerhalb des Dropdowns
import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.png";
import { usePathname } from "next/navigation";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Funktion zum Öffnen/Schließen des Dropdown-Menüs
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

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white">
      {/* Logo */}
      <h2 className="text-2xl font-bold m-4 text-center">Get Done</h2>
      <Link href="/">
        <Image src={logo} alt="Logo" width={50} height={50} />
      </Link>

      {/* <h2 className="text-2xl font-bold m-4 text-center">Get Done</h2> */}

      {/* Navigation */}
      <nav className="flex items-center space-x-4">
        <Link
          href="/create"
          className={usePathname() === "/create" ? "text-blue-500" : ""}
        >
          Create New
        </Link>
        <Link href="/" className={usePathname() === "/" ? "text-blue-500" : ""}>
          Home
        </Link>
        <Link
          href="/challenges"
          className={usePathname() === "/challenges" ? "text-blue-500" : ""}
        >
          Challenges
        </Link>
        {/* My Account Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {/* Ref für das Dropdown-Menü */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <span>My Account</span>
          </div>
          {/* Dropdown-Menü */}
          {dropdownOpen && (
            <div className="absolute bg-white text-black mt-2 p-2 rounded shadow-lg">
              <Link href="/account" className="block p-2">
                Profile
              </Link>
              <Link href="/settings" className="block p-2">
                Settings
              </Link>
              <Link href="/logout" className="block p-2">
                Logout
              </Link>
            </div>
          )}
        </div>
        {/* Login Button */}
        {/* <Link href="/login" className="ml-4 bg-blue-500 px-4 py-2 rounded">
          Login
        </Link> */}
      </nav>
    </header>
  );
}
