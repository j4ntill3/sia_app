"use client";

import { useSession } from "@/context/SessionProvider";
import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  ChevronLeft,
  Home,
  Building2,
  Users,
  UserPlus,
  MessageSquare,
  PlusCircle,
  LogOut,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const { session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <nav className="relative flex justify-between items-center bg-[#083C2C] h-[80px] w-full z-30 shadow-lg">
        {/* Botón hamburguesa */}
        <div className="flex items-center">
          {session && (
            <button
              onClick={toggleSidebar}
              className="text-[#6FC6D1] hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-[#0a4a37] group"
              aria-label="Abrir menú"
            >
              <Menu
                size={24}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </button>
          )}
        </div>

        {/* Logo */}
        <div className="flex items-center">
          <a
            href="/"
            className="flex items-center text-white hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src="/SIA-LOGO-10.svg"
              alt="SIA Logo"
              width={200}
              height={200}
              className="mr-2"
            />
          </a>
        </div>
      </nav>

      {/* Sidebar */}
      {session && (
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-all duration-300 ease-out z-50 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header del sidebar con información del usuario */}
          <div className="h-20 flex items-center px-4 bg-gradient-to-r from-[#083C2C] to-[#0a4a37] border-b border-[#6FC6D1]/20">
            {/* Información del usuario */}
            <div className="flex items-center flex-1 min-w-0">
              <div className="w-10 h-10 bg-[#6FC6D1] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <User size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  {session.user.role === "administrador" && (
                    <span className="text-base font-bold text-white mr-1">
                      ADM
                    </span>
                  )}
                  {session.user.role === "agente" && (
                    <span className="text-base font-bold text-white mr-1">
                      AGENTE
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6FC6D1] truncate">
                  {session.user.email}
                </p>
              </div>
            </div>

            {/* Botón de cerrar - Fijo en el lado derecho */}
            <div className="flex-shrink-0 ml-3">
              <button
                onClick={closeSidebar}
                className="text-[#6FC6D1] hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-white/10 group"
                aria-label="Cerrar menú"
              >
                <ChevronLeft
                  size={24}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
              </button>
            </div>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 px-6 py-4 overflow-y-auto">
            <div className="space-y-2">
              {/* Inmuebles - Para administrador y agente */}
              {(session.user.role === "administrador" ||
                session.user.role === "agente") && (
                <Link href="/inmuebles" onClick={closeSidebar}>
                  <button className="mb-2 w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left group bg-white text-[#6FC6D1] border-2 border-[#6FC6D1] hover:bg-[#6FC6D1] hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    <Building2
                      size={20}
                      className="mr-3 group-hover:scale-110 transition-transform duration-200"
                    />
                    <span className="font-medium">Inmuebles</span>
                  </button>
                </Link>
              )}

              {/* Opciones para agente */}
              {session.user.role === "agente" && (
                <>
                  <Link href="/misInmuebles" onClick={closeSidebar}>
                    <button className="mb-2 w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left group bg-white text-[#6FC6D1] border-2 border-[#6FC6D1] hover:bg-[#6FC6D1] hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                      <Home
                        size={20}
                        className="mr-3 group-hover:scale-110 transition-transform duration-200"
                      />
                      <span className="font-medium">Mis Inmuebles</span>
                    </button>
                  </Link>

                  <Link href="/misConsultasClientes" onClick={closeSidebar}>
                    <button className="mb-2 w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left group bg-white text-[#6FC6D1] border-2 border-[#6FC6D1] hover:bg-[#6FC6D1] hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                      <MessageSquare
                        size={20}
                        className="mr-3 group-hover:scale-110 transition-transform duration-200"
                      />
                      <span className="font-medium">
                        Mis Clientes/Consultas
                      </span>
                    </button>
                  </Link>

                  <Link href="/registrarConsultaCliente" onClick={closeSidebar}>
                    <button className="mb-2 w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left group bg-white text-[#6FC6D1] border-2 border-[#6FC6D1] hover:bg-[#6FC6D1] hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                      <PlusCircle
                        size={20}
                        className="mr-3 group-hover:scale-110 transition-transform duration-200"
                      />
                      <span className="font-medium">
                        Registrar Cliente/Consulta
                      </span>
                    </button>
                  </Link>
                </>
              )}

              {/* Opciones para administrador */}
              {session.user.role === "administrador" && (
                <>
                  <Link href="/altaInmueble" onClick={closeSidebar}>
                    <button className="mb-3 w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left group bg-white text-[#6FC6D1] border-2 border-[#6FC6D1] hover:bg-[#6FC6D1] hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                      <PlusCircle
                        size={20}
                        className="mr-3 group-hover:scale-110 transition-transform duration-200"
                      />
                      <span className="font-medium">Alta Inmuebles</span>
                    </button>
                  </Link>

                  <Link href="/agentes" onClick={closeSidebar}>
                    <button className="mb-3 w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left group bg-white text-[#6FC6D1] border-2 border-[#6FC6D1] hover:bg-[#6FC6D1] hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                      <Users
                        size={20}
                        className="mr-3 group-hover:scale-110 transition-transform duration-200"
                      />
                      <span className="font-medium">Agentes</span>
                    </button>
                  </Link>

                  <Link href="/altaAgente" onClick={closeSidebar}>
                    <button className="mb-3 w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left group bg-white text-[#6FC6D1] border-2 border-[#6FC6D1] hover:bg-[#6FC6D1] hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                      <UserPlus
                        size={20}
                        className="mr-3 group-hover:scale-110 transition-transform duration-200"
                      />
                      <span className="font-medium">Alta Agente</span>
                    </button>
                  </Link>

                  <Link href="/consultasClientes" onClick={closeSidebar}>
                    <button className="mb-3 w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left group bg-white text-[#6FC6D1] border-2 border-[#6FC6D1] hover:bg-[#6FC6D1] hover:text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                      <MessageSquare
                        size={20}
                        className="mr-3 group-hover:scale-110 transition-transform duration-200"
                      />
                      <span className="font-medium">Consultas Clientes</span>
                    </button>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Botón de logout */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group"
            >
              <LogOut
                size={20}
                className="mr-3 group-hover:scale-110 transition-transform duration-200"
              />
              <span className="font-medium">CERRAR SESIÓN</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
