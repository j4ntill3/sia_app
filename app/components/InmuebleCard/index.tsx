const InmuebleCard = () => {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-sm p-6 bg-white shadow-md">
          <img
            src="https://via.placeholder.com/300"
            alt="Imagen del inmueble"
            className="w-full h-48 object-cover mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Departamento en Venta
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Ubicación: Av. Siempre Viva 123, Springfield
          </p>
          <p className="text-gray-800 font-medium mb-4">Precio: USD 120,000</p>
          <button
            className="w-full bg-gray-800 text-white py-2 px-4 text-center"
          >
            Ver Más
          </button>
        </div>
      </div>
    );
  };
  
export default InmuebleCard;
  