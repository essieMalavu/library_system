import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set login status based on user authentication state
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleProtectedNavigation = (path: string) => {
    if (isLoggedIn) {
      router.push(path); // Navigate to the target path if logged in
    } else {
      alert("Please log in to access this page.");
      router.push("/login"); // Redirect to login page if not logged in
    }
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
          <button
            onClick={() => handleProtectedNavigation("/books")}
            className="block px-4 py-2 md:p-0 hover:bg-blue-500 md:hover:bg-transparent"
          >
            Manage Books
          </button>
          <button
            onClick={() => handleProtectedNavigation("/borrow")}
            className="block px-4 py-2 md:p-0 hover:bg-blue-500 md:hover:bg-transparent"
          >
            Borrow a Book
          </button>
          <button
            onClick={() => handleProtectedNavigation("/return")}
            className="block px-4 py-2 md:p-0 hover:bg-blue-500 md:hover:bg-transparent"
          >
            Return a Book
          </button>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="block px-4 py-2 bg-white text-blue-600 font-bold rounded-md hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white"
            >
              Account
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    passHref
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
