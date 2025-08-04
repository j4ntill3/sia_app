"use client";
import React, { useState } from "react";

interface InmuebleSearchProps {
  onSearch: (query: string) => void;
}

const InmuebleSearch: React.FC<InmuebleSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="w-full max-w-md mb-6 flex items-center">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Buscar inmuebles por título, barrio, dirección..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
      />
      <span className="px-4 py-2 bg-[#6FC6D1] text-white rounded-r-full font-semibold">
        🔍
      </span>
    </div>
  );
};

export default InmuebleSearch;
