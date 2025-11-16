"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";

const PublicNavbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Building2 className="w-8 h-8 text-[#6FC6D1]" />
            <span className="text-2xl font-bold text-[#083C2C]">Inmobiliaria</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-[#083C2C] hover:text-[#6FC6D1] transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/propiedades"
              className="text-[#083C2C] hover:text-[#6FC6D1] transition-colors font-medium"
            >
              Propiedades
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
