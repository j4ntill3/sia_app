import HamburguerMenu from "./HamburguerMenu";

const Navbar = () => {
  return (
    <nav className="relative flex justify-between bg-gray-800 p-4 w-full z-50">
      <div className="flex items-center justify-between w-full">
        {/* Logo Navbar */}
        <div className="text-white text-2xl font-bold">
          <a href="/">SIA</a>
        </div>

        {/* Links list for xl screen */}
        <div className="hidden md:flex space-x-4 ">
          <a href="/" className="text-white hover:text-gray-400">
            Home
          </a>
          <a href="/about" className="text-white hover:text-gray-400">
            About
          </a>
          <a href="/services" className="text-white hover:text-gray-400">
            Services
          </a>
          <a href="/contact" className="text-white hover:text-gray-400">
            Contact
          </a>
        </div>
      </div>

      {/* Hambuguer menu for m screen*/}
      <div className="w-auto">
        <HamburguerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
