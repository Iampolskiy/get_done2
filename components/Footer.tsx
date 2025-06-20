import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-4">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} Get Done. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
};

export default Footer;
