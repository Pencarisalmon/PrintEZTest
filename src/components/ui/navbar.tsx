// import { Button } from "@/components/ui/button";
// import { buttonVariants } from "@/components/ui/button";

import Image from "next/image";
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-16 shadow-md fixed top-0 left-0 right-0 bg-white">
      <div className="flex items-center gap-3">
        <Image src="/PrintEz.svg" alt="logo" width={89} height={45} />
      </div>
      <div className="flex gap-8">
        <a href="#" className="text-gray-600 hover:text-black">
          Tentang Kami
        </a>
        <a href="#" className="text-gray-600 hover:text-black">
          Layanan
        </a>
        <a href="#" className="text-gray-600 hover:text-black">
          Contact
        </a>
      </div>
      {/* <div className="flex items-center gap-4">
        <a
          href="#"
          className="bg-blue-950 text-white px-4 py-2 rounded-sm font-semibold"
        >
          Login
        </a>
      </div> */}
    </nav>
  );
};

export default Navbar;
