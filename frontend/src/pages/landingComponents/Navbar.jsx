import { useState } from "react";
import { Link } from "react-router";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className=" border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={"/"}>
            <h1 className="text-3xl font-bold">UniMate</h1>
          </Link>

          {/* Desktop Navigation (hidden on mobile) */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              <li>
                <Link to={"/"} className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to={"/services"} className="hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to={"/about"} className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to={"/contact"} className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Login Button (hidden on mobile) */}
          <Link to={"/login"} className="hidden md:block">
            <button className="btn btn-primary w-40">Login</button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden btn btn-ghost"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Dropdown mwnu*/}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  to={"/"}
                  className="block hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={"/about"}
                  className="block hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to={"/contact"}
                  className="block hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
            <Link to={"/login"} className="block w-full" onClick={() => setIsOpen(false)}>
              <button className="btn btn-primary w-full">Login</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;