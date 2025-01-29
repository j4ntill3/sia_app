"use client";
import { useSession } from "@/context/SessionProvider";
import LogoutButton from "@/app/components/Navbar/LogoutButton";

const Navbar = () => {
  const { session } = useSession(); // ✅ Ahora sí existe

  return (
    <nav className="relative flex justify-between bg-[#083C2C] p-4 w-full z-50">
      <div className="flex items-center justify-between w-full flex-grow">
        <div className="flex items-center">
          <a href="/" className="flex items-center text-white">
            <img
              src="/SIA-LOGO-10.svg"
              alt="SIA Logo"
              width={200}
              height={200}
              className="mr-2"
            />
          </a>
          {session ? (
            <div>
              <span className="text-[#6FC6D1] text-lg">|</span>
              <span className="text-[#6FC6D1] ml-2 text-sm">
                {session.user.email}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      {session ? <LogoutButton /> : null}
    </nav>
  );
};

export default Navbar;
