// components/Navbar.tsx
import Link from 'next/link';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" passHref>
          <h1 className="navbar-logo">Library System</h1>
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? 'Close' : 'Menu'}
        </button>
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link href="/books" passHref>
            <a className="navbar-link">Manage Books</a>
          </Link>
          <Link href="/borrow" passHref>
            <a className="navbar-link">Borrow a Book</a>
          </Link>
          <Link href="/return" passHref>
            <a className="navbar-link">Return a Book</a>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .navbar {
          background-color: #0070f3;
          padding: 10px 20px;
          color: white;
          font-family: Arial, sans-serif;
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo {
          font-size: 1.5rem;
          cursor: pointer;
        }
        .menu-toggle {
          display: none;
          font-size: 1rem;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }
        .navbar-links {
          display: flex;
          gap: 20px;
        }
        .navbar-link {
          color: white;
          text-decoration: none;
        }
        .navbar-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }
          .navbar-links {
            display: ${isOpen ? 'block' : 'none'};
            flex-direction: column;
            gap: 10px;
            margin-top: 10px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
