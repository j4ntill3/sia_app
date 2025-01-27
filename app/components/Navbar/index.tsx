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
    <nav className="relative flex justify-between bg-gray-800 p-4 w-full z-50">
      <div className="flex items-center justify-between w-full">
        <div className="text-white text-2xl font-bold">
          <a href="/">SIA</a>
        </div>
      </div>

      {/* Mostrar el botón de logout solo si hay sesión */}
      {session ? (
        <div>
          <LogoutButton />
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
