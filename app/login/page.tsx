const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Acceso
        </h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              CUIT
            </label>
            <input
              type="number"
              id="CUIT"
              className="mt-1 w-full p-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu numero de CUIT"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="contraseña"
              className="block text-sm font-medium text-gray-800"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full p-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
