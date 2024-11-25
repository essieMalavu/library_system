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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleProtectedNavigation = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      router.push("/login");
    }
  };

  return (
    <nav className="bg-black text-white fixed w-full z-10 top-0 shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" passHref className="text-xl font-bold hover:opacity-80">
          Bura Library System
        </Link>

        {/* User Avatar with Dropdown */}
        <div className="flex items-center space-x-6">
          {/* Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleProtectedNavigation("/books")}
              className="text-sm hover:text-gray-200"
            >
              Manage Books
            </button>
            <button
              onClick={() => handleProtectedNavigation("/borrow")}
              className="text-sm hover:text-gray-200"
            >
              Borrow a Book
            </button>
            <button
              onClick={() => handleProtectedNavigation("/return")}
              className="text-sm hover:text-gray-200"
            >
              Return a Book
            </button>
          </div>

          {/* Avatar */}
          {user && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-blue-600 font-bold uppercase focus:outline-none"
                title={user.displayName || user.email}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  user.displayName
                    ?.charAt(0)
                    .toUpperCase() || user.email.charAt(0).toUpperCase()
                )}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    {user.displayName || user.email}
                  </div>
                  <Link
                    href="/Profiledisplay"
                    passHref
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Login Button */}
          {!user && (
            <Link
              href="/login"
              passHref
              className="block px-4 py-2 bg-white text-blue-600 font-bold rounded-md hover:bg-gray-100"
            >
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

        {/* Mobile Links */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-blue-600 z-10 flex flex-col items-center space-y-4 py-4">
            <button
              onClick={() => handleProtectedNavigation("/books")}
              className="block text-sm text-white hover:text-gray-200"
            >
              Manage Books
            </button>
            <button
              onClick={() => handleProtectedNavigation("/borrow")}
              className="block text-sm text-white hover:text-gray-200"
            >
              Borrow a Book
            </button>
            <button
              onClick={() => handleProtectedNavigation("/return")}
              className="block text-sm text-white hover:text-gray-200"
            >
              Return a Book
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
