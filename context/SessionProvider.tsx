"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "@/actions/auth-actions";
import { Session } from "next-auth";

const SessionContext = createContext<{
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
} | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// 🔹 Exportamos useSession para poder usarlo en otros componentes
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession debe usarse dentro de un SessionProvider");
  }
  return context;
};
