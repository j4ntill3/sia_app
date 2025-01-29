"use client";
import { useEffect, useState } from "react";
import LogoutButton from "@/app/components/Navbar/LogoutButton";
import { getSession } from "@/actions/auth-actions";

const Navbar = () => {
  const [session, setSession] = useState<any>(null); // Estado para la sesión

  // Función asincrónica que obtiene la sesión
  const authenticateUser = async () => {
    const sessionData = await getSession(); // Obtiene la sesión actual
    setSession(sessionData); // Actualiza el estado con la sesión
  };

  // Ejecutamos la función una vez que el componente se haya montado
  useEffect(() => {
    authenticateUser();
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <nav className="relative flex justify-between bg-[#083C2C] p-4 w-full z-50">
      <div className="flex items-center justify-between w-full flex-grow">
        {/* Usamos el logo SVG guardado en public */}
        <a href="/" className="flex items-center text-white">
          <img
            src="/SIA-LOGO-10.svg" // Cambia esto con el nombre de tu archivo SVG en public
            alt="SIA Logo"
            width={200} // Ajusta el tamaño según sea necesario
            height={200} // Ajusta el tamaño según sea necesario
            className="mr-2" // Espacio entre el logo y el texto, si es necesario
          />
        </a>
      </div>

      {/* Mostrar el botón de logout solo si hay sesión */}
      {session ? <LogoutButton /> : null}
    </nav>
  );
};

export default Navbar;
