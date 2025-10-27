import { useState } from "react";

interface ImageCarouselProps {
  images: { id: string; imagen: string; es_principal?: boolean }[];
  onDelete?: (imageId: string) => void;
  onSetPrincipal?: (imageId: string) => void;
  readOnly?: boolean;
}

export default function ImageCarousel({ images, onDelete, onSetPrincipal, readOnly = false }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const isDefaultImage = (imagen: string) => {
    return imagen === '/img/no-image.webp';
  };

  const handleDelete = () => {
    if (onDelete && images[currentIndex] && !isDefaultImage(images[currentIndex].imagen)) {
      onDelete(images[currentIndex].id);
      // Ajustar el índice si es necesario después de eliminar
      if (currentIndex >= images.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleSetPrincipal = () => {
    if (onSetPrincipal && images[currentIndex] && !isDefaultImage(images[currentIndex].imagen)) {
      onSetPrincipal(images[currentIndex].id);
    }
  };

  return (
    <div className="relative w-full">
      {/* Imagen principal */}
      <div className="relative w-full h-80 bg-gray-900 rounded-lg overflow-hidden">
        <img
          src={images[currentIndex].imagen || '/img/no-image.webp'}
          alt={`Imagen ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {/* Botones de acción */}
        {!readOnly && !isDefaultImage(images[currentIndex].imagen) && (
          <div className="absolute top-3 right-3 flex gap-2">
            {/* Checkbox marcar como principal */}
            {onSetPrincipal && (
              <label className="bg-white/90 hover:bg-white rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer shadow-lg transition-all">
                <input
                  type="checkbox"
                  checked={images[currentIndex].es_principal || false}
                  onChange={handleSetPrincipal}
                  className="w-4 h-4 text-yellow-500 focus:ring-yellow-500 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">Principal</span>
              </label>
            )}

            {/* Botón de eliminar */}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 text-lg font-bold shadow-lg transition-all"
                title="Eliminar imagen"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Botones de navegación - Solo mostrar si hay más de una imagen */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          </>
        )}

        {/* Contador de imágenes - Solo mostrar si hay más de una imagen */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniaturas - Solo mostrar si hay más de una imagen */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-[#083C2C] scale-105"
                  : "border-gray-300 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={image.imagen || '/img/no-image.webp'}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
