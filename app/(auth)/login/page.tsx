"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setErrorMessage(result.error);
        setSuccessMessage("");
      } else if (result?.status === 200) {
        setSuccessMessage("¡Login exitoso!");
        console.log("Login exitoso con:", { email, password });

        // Redirigir a "/" y recargar la página
        if (isMounted) {
          window.location.href = "/"; // Redirige a "/" antes de recargar
        }
      }
    } catch (error: any) {
      setErrorMessage(error?.message || "Error en el inicio de sesión.");
      setSuccessMessage("");
      console.log("Error en el login:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null; // No renderiza nada hasta que esté montado
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#083C2C]">
          Bienvenido a SIA
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-sans font-medium text-[#083C2C]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-10">
            <label
              htmlFor="password"
              className="block font-sans text-sm font-medium text-[#083C2C]"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="rounded-full mt-1 w-full p-2 bg-[#EDEDED] text-sm text-gray-800 focus:ring-[#083C2C] focus:border-[#083C2C]"
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
            className="w-full font-sans bg-[#6FC6D1] text-white py-2 px-4 rounded-full text-xs"
            disabled={loading}
          >
            {loading ? "Cargando..." : "INGRESAR"}
          </button>
        </form>
      </div>
    </div>
  );
}
