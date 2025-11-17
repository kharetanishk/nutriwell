"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About", scroll: true },
  { href: "/services", label: "Services" },
  { href: "#faq", label: "FAQ", scroll: true },
];

const userLinks = [
  { href: "/login", label: "Login" },
  {
    href: "/register",
    label: "Register",
  },
];

const userDropdownVariant: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 300 },
  }),
  hover: {
    scale: 1.05,
    color: "#166534",
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
};

const navLinkVariant: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 300 },
  }),
  hover: {
    scale: 1.05,
    color: "#166534",
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) setUserMenuOpen(false);
  }, [menuOpen]);
  useEffect(() => {
    if (userMenuOpen) setMenuOpen(false);
  }, [userMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  if (!mounted) return null;

  const handleScrollOrRedirect = (sectionId: string) => {
    if (window.location.pathname === "/") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className={`fixed top-0 left-0 w-full z-[500] transition-all duration-300
          ${
            scrolled
              ? "bg-white/95 shadow-md backdrop-blur-md"
              : "bg-white/70 backdrop-blur-xl"
          }
          border-b border-[#dfe7dd]
        `}
      >
        <div className="flex items-center justify-between px-4 py-3 md:py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/eatrightlogo.jpg"
              alt="logo"
              className="w-12 h-12 md:w-14 md:h-14 rounded-md bg-white"
              draggable={false}
            />
            <span className="font-semibold text-md md:text-lg text-emerald-800">
              Dt. Anubha's Nutrition
            </span>
          </Link>

          {/* Desktop Nav + User Icon */}
          <div className="hidden md:flex items-center gap-6">
            {/* Desktop Nav Links */}
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={navLinkVariant}
                whileHover="hover"
              >
                {link.scroll ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollOrRedirect(link.label.toLowerCase());
                    }}
                    className="text-slate-600 hover:text-emerald-700 transition-colors font-medium cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-emerald-700 transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                )}
              </motion.div>
            ))}

            {/* User Icon (Desktop) */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="p-2 rounded-full bg-white/80 border border-[#dfe7dd] hover:bg-white transition flex items-center justify-center cursor-pointer gap-2"
              >
                <User className="text-emerald-700" size={25} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    key="desktopUserMenu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-[#367228] py-4 z-[460]"
                  >
                    {userLinks.map((link, i) => (
                      <motion.div
                        key={link.href}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={userDropdownVariant}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 
                       transition text-[15px] font-medium "
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* MOBILE ICONS */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Mobile User Icon */}
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="p-2 rounded-full bg-white/80 border border-[#dfe7dd] hover:bg-white transition flex items-center justify-center"
            >
              <User className="text-emerald-700" size={20} />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-md p-2 bg-white/80 border border-[#dfe7dd] hover:bg-white transition"
            >
              {menuOpen ? (
                <X size={20} className="text-emerald-700" />
              ) : (
                <Menu size={20} className="text-emerald-700" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Overlay for User Dropdown */}
      {userMenuOpen && (
        <div
          onClick={() => setUserMenuOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[450]"
        />
      )}

      {/* User Dropdown (Mobile View) */}
      <AnimatePresence>
        {userMenuOpen && (
          <>
            {/* Dim Background */}
            <motion.div
              key="userOverlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-emerald-900/30 z-[400]"
              onClick={() => setUserMenuOpen(false)}
            />

            {/* User Dropdown Menu (animated same as mobile menu) */}
            <motion.div
              key="userMenu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="fixed top-[64px] left-0 right-0 md:hidden flex flex-col w-full items-center gap-4 py-6 
                   border-t border-[#dfe7dd] bg-white/95 backdrop-blur-md z-[450] rounded-b-2xl shadow-xl"
            >
              {userLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={userDropdownVariant}
                >
                  <Link
                    href={link.href}
                    onClick={() => setUserMenuOpen(false)}
                    className="block text-slate-700 hover:text-emerald-700 text-lg font-medium border-b cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE MENU OVERLAY + MENU */}
      {/* MOBILE MENU OVERLAY + MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dim Background (same as user overlay) */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[450]"
              onClick={() => setMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              key="mobileMenu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="fixed top-[64px] left-0 right-0 md:hidden flex flex-col items-center gap-4 py-6 border-t border-[#dfe7dd] bg-white/95 backdrop-blur-md z-[460] rounded-b-2xl shadow-xl"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={navLinkVariant}
                >
                  {link.scroll ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleScrollOrRedirect(link.label.toLowerCase());
                        setMenuOpen(false);
                      }}
                      className="block text-slate-700 hover:text-emerald-700 text-lg font-medium border-b"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-slate-700 hover:text-emerald-700 text-lg font-medium border-b"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
