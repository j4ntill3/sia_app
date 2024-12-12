"use client";

import { useState } from "react";

const HamburguerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="md:hidden">
      {/* Botón del menú hamburguesa */}
      <button
        className="text-white"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Menú desplegable */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute top-full left-0 w-full bg-gray-800 z-40`}
      >
        <nav className="flex flex-col py-4">
          <a
            href="/"
            className="text-white py-2 px-4 hover:bg-gray-700 border-b border-gray-700"
          >
            Home
          </a>
          <a
            href="/about"
            className="text-white py-2 px-4 hover:bg-gray-700 border-b border-gray-700"
          >
            About
          </a>
          <a
            href="/services"
            className="text-white py-2 px-4 hover:bg-gray-700 border-b border-gray-700"
          >
            Services
          </a>
          <a href="/contact" className="text-white py-2 px-4 hover:bg-gray-700">
            Contact
          </a>
        </nav>
      </div>
    </div>
  );
};

export default HamburguerMenu;
