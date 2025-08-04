import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

const getPageNumbers = (page: number, totalPages: number, maxPages = 5) => {
  let start = Math.max(1, page - Math.floor(maxPages / 2));
  let end = start + maxPages - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxPages + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
  totalItems,
  pageSize = 5,
}) => {
  const isSmall = typeof window !== "undefined" && window.innerWidth < 640;
  const pageNumbers = getPageNumbers(page, totalPages, isSmall ? 1 : 3);
  const from = totalItems ? (page - 1) * pageSize + 1 : null;
  const to = totalItems ? Math.min(page * pageSize, totalItems) : null;

  return (
    <nav className="flex flex-col items-center gap-2 select-none">
      <div className="flex items-center gap-1">
        {/* Primera página */}
        {!isSmall && (
          <button
            onClick={() => onChange(1)}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[#1976d2] text-[#1976d2] bg-white hover:bg-[#1976d2] hover:text-white transition-colors duration-150 disabled:text-gray-400 disabled:border-gray-300 disabled:bg-gray-100"
            aria-label="Primera página"
          >
            «
          </button>
        )}
        {/* Anterior */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[#1976d2] text-[#1976d2] bg-white hover:bg-[#1976d2] hover:text-white transition-colors duration-150 disabled:text-gray-400 disabled:border-gray-300 disabled:bg-gray-100"
          aria-label="Anterior"
        >
          ‹
        </button>
        {/* Números de página */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`px-3 py-1 rounded-full border-2 text-sm font-semibold transition-colors duration-150 ${
              num === page
                ? "bg-[#1976d2] text-white border-[#1976d2]"
                : "bg-white text-[#1976d2] border-[#1976d2] hover:bg-[#1976d2] hover:text-white"
            }`}
            disabled={num === page}
            aria-current={num === page ? "page" : undefined}
          >
            {num}
          </button>
        ))}
        {/* Siguiente */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[#1976d2] text-[#1976d2] bg-white hover:bg-[#1976d2] hover:text-white transition-colors duration-150 disabled:text-gray-400 disabled:border-gray-300 disabled:bg-gray-100"
          aria-label="Siguiente"
        >
          ›
        </button>
        {/* Última página */}
        {!isSmall && (
          <button
            onClick={() => onChange(totalPages)}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-[#1976d2] text-[#1976d2] bg-white hover:bg-[#1976d2] hover:text-white transition-colors duration-150 disabled:text-gray-400 disabled:border-gray-300 disabled:bg-gray-100"
            aria-label="Última página"
          >
            »
          </button>
        )}
      </div>
      {/* Rango de ítems */}
      {!isSmall && totalItems && (
        <span className="text-xs text-gray-500">
          {from}-{to} de {totalItems} items
        </span>
      )}
    </nav>
  );
};

export default Pagination;
