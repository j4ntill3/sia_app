"use client";

import { useState } from "react";

export default function Login() {
  // Estado para manejar el email y la contraseña
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      alert("Por favor, ingresa ambos campos.");
      return;
    }

    try {
      // Realizar la solicitud POST al endpoint de login
      const response = await fetch("/api/tu-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si el login es exitoso
        alert("Login exitoso");
      } else {
        // Si el login falla
        alert(data.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un error al intentar hacer login");
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
