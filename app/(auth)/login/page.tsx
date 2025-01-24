"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Por favor ingresa tu email.");
      setSuccessMessage("");
      return;
    }

    if (!password) {
      setErrorMessage("Por favor ingresa tu contraseña.");
      setSuccessMessage("");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false, // Desactivar redirección automática
        callbackUrl: "/home", // Redirigir al home si el login es exitoso
      });

      if (result?.error) {
        setErrorMessage(result.error);
        setSuccessMessage("");
      } else if (result?.status === 200) {
        setSuccessMessage("¡Login exitoso!");
        console.log("Login exitoso con:", { email, password });

        // Redirigir manualmente en caso de que callbackUrl no funcione
        window.location.href = "/"; // Fuerza la redirección
      }
    } catch (error: any) {
      setErrorMessage(error?.message || "Error en el inicio de sesión.");
      setSuccessMessage("");
      console.log("Error en el login:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Acceso
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full p-2 border border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-500 text-sm">{successMessage}</div>
          )}

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
}
