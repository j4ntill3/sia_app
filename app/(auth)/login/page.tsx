"use client";
import { useState, useEffect } from "react";
import { z } from "zod";
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

  const loginSchema = z.object({
    email: z.string().min(1, "Por favor ingresa tu email.").email("Email inválido."),
    password: z.string().min(1, "Por favor ingresa tu contraseña.")
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar si hay campos vacíos
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Por favor complete todos los campos");
      setSuccessMessage("");
      return;
    }

    const resultValidation = loginSchema.safeParse({ email, password });
    if (!resultValidation.success) {
      const firstError = resultValidation.error.errors[0]?.message || "Datos inválidos.";
      setErrorMessage(firstError);
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
        callbackUrl: "/home",
      });
      if (result?.error) {
        // Si el error es 'CredentialsSignin', mostrar mensaje personalizado
        if (result.error === "CredentialsSignin") {
          setErrorMessage("Datos incorrectos. Verifica tu email y contraseña.");
        } else {
          setErrorMessage(result.error);
        }
        setSuccessMessage("");
      } else if (result?.status === 200) {
        setSuccessMessage("¡Acceso exitoso!");
        console.log("Login exitoso con:", { email, password });
        if (isMounted) {
          window.location.href = "/home";
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
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#083C2C]">
          Bienvenido a SIA
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1]"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#6FC6D1] text-white py-3 px-4 rounded-md hover:bg-[#5AB5C1] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
