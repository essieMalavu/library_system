import Link from "next/link";
import { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 text-white fixed w-full z-10 top-0 shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          passHref
          className="text-xl font-bold hover:opacity-80"
        >
          Library System
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="text-white md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>

        {/* Navbar Links */}
        <div
          className={`flex-col md:flex-row md:flex md:items-center md:space-x-6 absolute md:static top-16 md:top-auto left-0 w-full md:w-auto bg-blue-600 md:bg-transparent ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          <Link
            href="/books"
            passHref
            className="block px-4 py-2 md:p-0 hover:bg-blue-500 md:hover:bg-transparent"
          >
            Manage Books
          </Link>
          <Link
            href="/borrow"
            passHref
            className="block px-4 py-2 md:p-0 hover:bg-blue-500 md:hover:bg-transparent"
          >
            Borrow a Book
          </Link>
          <Link
            href="/return"
            passHref
            className="block px-4 py-2 md:p-0 hover:bg-blue-500 md:hover:bg-transparent"
          >
            Return a Book
          </Link>
          {/* Login Button */}
          <Link
            href="/login"
            passHref
            className="block px-4 py-2 md:p-0 bg-white text-blue-600 font-bold rounded-md hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
