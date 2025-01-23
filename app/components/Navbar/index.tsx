import LogoutButton from "@/app/components/Navbar/LogoutButton";

const Navbar = () => {
  return (
    <nav className="relative flex justify-between bg-gray-800 p-4 w-full z-50">
      <div className="flex items-center justify-between w-full">
        <div className="text-white text-2xl font-bold">
          <a href="/">SIA</a>
        </div>
      </div>
      <div>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;
