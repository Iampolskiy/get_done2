import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} Get Done. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
};

export default Footer;
