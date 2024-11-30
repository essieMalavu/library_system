import { useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseConfig"; // Adjust the path based on your project structure
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleProtectedNavigation = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="bg-black/70 backdrop-blur-md text-white  w-full z-10 top-0 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/dashboard" passHref
           className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90">
            Bura Library System
        </Link>

        {/* User Actions */}
        <div className="flex items-center space-x-6">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleProtectedNavigation("/books")}
              className="text-sm hover:text-cyan-400 transition"
            >
              Manage Books
            </button>
            <button
              onClick={() => handleProtectedNavigation("/borrow")}
              className="text-sm hover:text-cyan-400 transition"
            >
              Borrow a Book
            </button>
            <button
              onClick={() => handleProtectedNavigation("/return")}
              className="text-sm hover:text-cyan-400 transition"
            >
              Return a Book
            </button>
          </div>

          {/* User Avatar */}
          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center text-white uppercase focus:outline-none shadow-lg hover:scale-105 transition-transform"
                title={user.displayName || user.email}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  user.displayName?.charAt(0).toUpperCase() ||
                  user.email.charAt(0).toUpperCase()
                )}
              </button>
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-lg rounded-lg shadow-lg">
                  <div className="px-4 py-2 text-sm text-gray-200 border-b border-gray-700">
                    {user.displayName || user.email}
                  </div>
                  <Link href="/Profiledisplay" passHref
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-cyan-600 hover:text-white transition">
                      Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-cyan-600 hover:text-white transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" passHref
               className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-md hover:shadow-lg hover:scale-105 transition-transform">
                Login
            </Link>
          )}
        </div>

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
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-gradient-to-b from-black via-gray-900 to-gray-800 z-10 flex flex-col items-center space-y-4 py-4">
          <button
            onClick={() => handleProtectedNavigation("/books")}
            className="block text-sm text-white hover:text-cyan-400 transition"
          >
            Manage Books
          </button>
          <button
            onClick={() => handleProtectedNavigation("/borrow")}
            className="block text-sm text-white hover:text-cyan-400 transition"
          >
            Borrow a Book
          </button>
          <button
            onClick={() => handleProtectedNavigation("/return")}
            className="block text-sm text-white hover:text-cyan-400 transition"
          >
            Return a Book
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
