"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleClick = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <button
      onClick={handleClick}
      className="text-[#6FC6D1] text-sm px-4 py-2 rounded-md hover:underline focus:outline-none focus:ring focus:ring-[#6FC6D1] h-auto whitespace-nowrap"
    >
      CERRAR SESIÓN
    </button>
  );
};

export default LogoutButton;
