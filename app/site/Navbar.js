"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.removeItem("userToken");
      setIsSignedIn(false);
      router.push("/auth/signin");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsSignedIn(!!token);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    if (isTransparentPage) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (isTransparentPage) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [pathname]);

  const isTransparentPage =
    pathname === "/site/home" ||
    pathname.startsWith("/auth") ||
    pathname === "/site/otherPage1" ||
    pathname === "/site/otherPage2";

  const navbarStyles = isTransparentPage
    ? isScrolled
      ? "bg-white text-gray-800 shadow-md"
      : "bg-transparent text-white"
    : "bg-white text-gray-800 shadow-md";

  const dropdownStyles =
    isTransparentPage && !isScrolled
      ? "bg-white/90 backdrop-blur-sm text-gray-800"
      : "bg-white text-gray-800";

  if (isLoading) {
    return (
      <nav className="fixed w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-2 h-16 flex items-center justify-between">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="hidden md:flex space-x-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navbarStyles}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/arkan-logo.PNG"
                alt="Logo"
                width={90}
                className="mr-8"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-center items-center space-x-8">
            {[
              { href: "/site/home", label: "Home" },
              { href: "/site/RentPage", label: "Search" },
              { href: "/site/servicePage", label: "Services" },
              { href: "/site/contactPage", label: "Contact us" },
              { href: "/site/blog", label: "Blog" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.button
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                    pathname === item.href
                      ? "bg-purple-100 text-purple-700"
                      : "hover:text-purple-600 hover:bg-purple-50"
                  }`}
                  whileHover={{ y: -1 }}
                >
                  {item.label}
                </motion.button>
              </Link>
            ))}

            {/* Properties Dropdown */}
            <div className="relative">
              <motion.button 
                onClick={() => setPropertiesOpen(!propertiesOpen)}
                className="flex items-center text-sm font-medium px-3 py-2 rounded-md hover:text-purple-600 hover:bg-purple-50"
                whileHover={{ y: -1 }}
              >
                Shares <i className={`fa-solid fa-chevron-down ml-1 transition-transform ${propertiesOpen ? "rotate-180" : ""}`}></i>
              </motion.button>
              <AnimatePresence>
                {propertiesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute left-0 mt-2 w-48 shadow-lg rounded-md py-1 ${dropdownStyles} border border-gray-100`}
                  >
                    {[
                      { href: "/site/properties", label: "Properties" },
                      { href: "/site/wallet", label: "Wallet" },
                      { href: "/site/portofolio", label: "Portfolio" },
                      { href: "/site/refer", label: "Refer" },
                    ].map((item) => (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          className="block px-4 py-2 text-sm hover:bg-purple-50 cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          {item.label}
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Platform Dropdown */}
            <div className="relative">
              <motion.button 
                onClick={() => setPlatformOpen(!platformOpen)}
                className="flex items-center text-sm font-medium px-3 py-2 rounded-md hover:text-purple-600 hover:bg-purple-50"
                whileHover={{ y: -1 }}
              >
                Platform <i className={`fa-solid fa-chevron-down ml-1 transition-transform ${platformOpen ? "rotate-180" : ""}`}></i>
              </motion.button>
              <AnimatePresence>
                {platformOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute left-0 mt-2 w-48 shadow-lg rounded-md py-1 ${dropdownStyles} border border-gray-100`}
                  >
                    {[
                      { href: "/site/platform", label: "Main" },
                      { href: "/site/sales", label: "Sales" },
                    ].map((item) => (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          className="block px-4 py-2 text-sm hover:bg-purple-50 cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          {item.label}
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Auth Buttons - Now properly conditionally rendered */}
          <div className="hidden md:flex items-center">
            {isSignedIn ? (
              <div className="relative">
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fa-solid fa-user text-purple-700"></i>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 shadow-lg rounded-md bg-white border border-gray-100 z-50"
                    >
                      <Link href="/site/wallet">
                        <motion.div 
                          className="block px-4 py-2 text-sm hover:bg-purple-50 cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          Financial
                        </motion.div>
                      </Link>
                      <Link href="/site/profile">
                        <motion.div 
                          className="block px-4 py-2 text-sm hover:bg-purple-50 cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          Dashboard
                        </motion.div>
                      </Link>
                      <motion.div
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        {isLoggingOut ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging out...
                          </>
                        ) : "Logout"}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/auth/signin">
                  <motion.button
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/auth/register">
                  <motion.button
                    className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-purple-700 hover:to-indigo-700 shadow-md"
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {menuOpen ? (
                <i className="fa-solid fa-times text-xl"></i>
              ) : (
                <i className="fa-solid fa-bars text-xl"></i>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden overflow-hidden ${dropdownStyles} shadow-lg rounded-b-lg`}
            >
              <div className="px-2 pt-2 pb-4 space-y-1">
                {[
                  { href: "/site/home", label: "Home" },
                  { href: "/site/RentPage", label: "Search" },
                  { href: "/site/servicePage", label: "Services" },
                  { href: "/site/contactPage", label: "Contact us" },
                  { href: "/site/blog", label: "Blog" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <motion.div 
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-50"
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.label}
                    </motion.div>
                  </Link>
                ))}

                {/* Mobile Dropdown - Properties */}
                <div>
                  <motion.button
                    onClick={() => setPropertiesOpen(!propertiesOpen)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium hover:bg-purple-50"
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Shares</span>
                    <i className={`fa-solid fa-chevron-down transition-transform ${propertiesOpen ? "rotate-180" : ""}`}></i>
                  </motion.button>
                  {propertiesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4"
                    >
                      {[
                        { href: "/site/properties", label: "Properties" },
                        { href: "/site/wallet", label: "Wallet" },
                        { href: "/site/portofolio", label: "Portfolio" },
                        { href: "/site/refer", label: "Refer" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href}>
                          <motion.div
                            className="block px-3 py-2 rounded-md text-sm hover:bg-purple-50"
                            whileTap={{ scale: 0.98 }}
                          >
                            {item.label}
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Mobile Dropdown - Platform */}
                <div>
                  <motion.button
                    onClick={() => setPlatformOpen(!platformOpen)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium hover:bg-purple-50"
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Platform</span>
                    <i className={`fa-solid fa-chevron-down transition-transform ${platformOpen ? "rotate-180" : ""}`}></i>
                  </motion.button>
                  {platformOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4"
                    >
                      {[
                        { href: "/site/platform", label: "Main" },
                        { href: "/site/sales", label: "Sales" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href}>
                          <motion.div
                            className="block px-3 py-2 rounded-md text-sm hover:bg-purple-50"
                            whileTap={{ scale: 0.98 }}
                          >
                            {item.label}
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Mobile Auth Buttons - Now properly conditionally rendered */}
                <div className="pt-2 border-t border-gray-200">
                  {isSignedIn ? (
                    <>
                      <Link href="/site/profile">
                        <motion.button
                          className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-purple-50"
                          whileTap={{ scale: 0.98 }}
                        >
                          Dashboard
                        </motion.button>
                      </Link>
                      <motion.button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center"
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoggingOut ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging out...
                          </>
                        ) : "Logout"}
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/signin">
                        <motion.button
                          className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-purple-50"
                          whileTap={{ scale: 0.98 }}
                        >
                          Sign In
                        </motion.button>
                      </Link>
                      <Link href="/auth/register">
                        <motion.button
                          className="w-full mt-2 bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-3 py-2 rounded-md text-base font-medium text-center"
                          whileTap={{ scale: 0.98 }}
                        >
                          Sign Up
                        </motion.button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}