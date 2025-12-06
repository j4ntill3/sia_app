"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

export default function EstablecerContrasena() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // Validaciones en tiempo real
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const allRequirementsMet =
    passwordRequirements.minLength &&
    passwordRequirements.hasUppercase &&
    passwordRequirements.hasLowercase &&
    passwordRequirements.hasNumber;

  const passwordsMatch = password === confirmPassword && password.length > 0;

  useEffect(() => {
    if (!token) {
      setError("Token no proporcionado. Por favor, usa el enlace del email.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (!token) {
      setError("Token no proporcionado");
      return;
    }

    if (!allRequirementsMet) {
      setError("La contraseña no cumple con todos los requisitos");
      return;
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        if (data.detalles) {
          setValidationErrors(data.detalles);
        }
        setError(data.error || "Error al establecer la contraseña");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Contraseña Establecida!
          </h1>
          <p className="text-gray-600 mb-4">
            Tu contraseña ha sido establecida exitosamente.
          </p>
          <p className="text-gray-500 text-sm">
            Redirigiendo al inicio de sesión en 3 segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Establece tu Contraseña
          </h1>
          <p className="text-gray-600 mt-2">
            Crea una contraseña segura para tu cuenta
          </p>
        </div>

        {error && !validationErrors.password && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Contraseña */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] pr-10"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {Array.isArray(validationErrors.password)
                  ? validationErrors.password[0]
                  : validationErrors.password}
              </p>
            )}

            {/* Requisitos de contraseña */}
            {password.length > 0 && (
              <div className="mt-3 text-sm">
                <p className="text-gray-700 font-medium mb-2">
                  Requisitos de la contraseña:
                </p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center ${
                      passwordRequirements.minLength
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordRequirements.minLength ? (
                      <CheckCircle2 size={16} className="mr-2" />
                    ) : (
                      <XCircle size={16} className="mr-2" />
                    )}
                    Mínimo 8 caracteres
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordRequirements.hasUppercase
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordRequirements.hasUppercase ? (
                      <CheckCircle2 size={16} className="mr-2" />
                    ) : (
                      <XCircle size={16} className="mr-2" />
                    )}
                    Al menos una letra mayúscula
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordRequirements.hasLowercase
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordRequirements.hasLowercase ? (
                      <CheckCircle2 size={16} className="mr-2" />
                    ) : (
                      <XCircle size={16} className="mr-2" />
                    )}
                    Al menos una letra minúscula
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordRequirements.hasNumber
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {passwordRequirements.hasNumber ? (
                      <CheckCircle2 size={16} className="mr-2" />
                    ) : (
                      <XCircle size={16} className="mr-2" />
                    )}
                    Al menos un número
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6FC6D1] pr-10"
                placeholder="Confirma tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-red-500 text-xs mt-1">
                Las contraseñas no coinciden
              </p>
            )}
            {passwordsMatch && (
              <p className="text-green-600 text-xs mt-1 flex items-center">
                <CheckCircle2 size={14} className="mr-1" />
                Las contraseñas coinciden
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !allRequirementsMet || !passwordsMatch}
            className="w-full bg-[#6FC6D1] text-white py-3 px-4 rounded-md hover:bg-[#5AB5C1] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? "Estableciendo..." : "Establecer Contraseña"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-[#6FC6D1] hover:text-[#5AB5C1] text-sm font-medium"
          >
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}
