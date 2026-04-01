import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuIcon,
  SearchIcon,
  TicketPlus,
  XIcon,
  User as UserIcon,
  ShieldAlert,
} from "lucide-react";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import logo from '../assets/bookbee-logo-transparent.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const ADMIN_EMAIL = "ak83067091@gmail.com";
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  };

  // PRO TIP: Store your links in an array to keep the code clean!
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Theaters", path: "/theaters" },
    { name: "Releases", path: "/releases" },
    { name: "Favorites", path: "/favorite" },
    { name: "My Tickets", path: "/my-tickets" },
  ];

  return (
    <>
      {/* Changed to <nav> for better accessibility, and adjusted top padding (pt-3) to fix the gap */}
      <nav className="absolute top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 pt-3 pb-5 bg-transparent">
        
        <Link
          to="/"
          className="max-md:flex-1 transition-transform active:scale-95"
          onClick={() => window.scrollTo(0, 0)}
        >
          {/* Replaced invalid h-37 and -ml-18 with valid, responsive Tailwind classes */}
          <img 
            src={logo} 
            alt="BookBee Logo" 
            className="h-70 md:h-20 w-auto -ml-2 md:-ml-8 object-contain scale-200" 
          />
        </Link>

        {/* Center Navigation Menu */}
        <div
          className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:w-full max-md:h-screen
                       max-md:bg-black/90 max-md:flex max-md:flex-col max-md:justify-center 
                       max-md:items-center max-md:text-lg max-md:font-medium max-md:gap-8 
                       transition-transform duration-300 ease-in-out ${
                         isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
                       }
                       md:static md:flex md:flex-row md:items-center md:gap-8 md:p-3
                       md:rounded-full md:backdrop-blur md:bg-white/10 md:border md:border-gray-300/20`}
        >
          <XIcon
            className="md:hidden absolute top-6 right-6 w-7 h-7 cursor-pointer text-gray-300 transition-all hover:text-white active:scale-90"
            onClick={() => setIsOpen(false)}
          />

          {/* Cleanly mapping through the array instead of repeating the <Link> tag 6 times */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="transition-all duration-200 hover:text-red-500 active:scale-95 text-white/90 hover:text-white"
              onClick={handleLinkClick}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side Icons & Login */}
        <div className="flex items-center gap-4 sm:gap-8">
          <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer text-gray-200 transition-all duration-200 hover:text-white hover:drop-shadow-md active:scale-90" />

          {!user ? (
            <button
              onClick={openSignIn}
              className="px-4 py-1 sm:px-7 sm:py-2 bg-red-600 transition-all duration-200 rounded-full font-medium cursor-pointer text-white hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] active:scale-95"
            >
              Login
            </button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Profile"
                  labelIcon={<UserIcon width={15} />}
                  onClick={() => navigate("/profile")}
                />
                <UserButton.Action
                  label="My Tickets"
                  labelIcon={<TicketPlus width={15} />}
                  onClick={() => navigate("/my-tickets")}
                />

                {isAdmin && (
                  <UserButton.Action
                    label="Admin Dashboard"
                    labelIcon={<ShieldAlert width={15} color="red" />}
                    onClick={() => navigate("/admin")}
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
          )}

          <MenuIcon
            className="md:hidden w-8 h-8 cursor-pointer text-gray-200 transition-all hover:text-white active:scale-90"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
