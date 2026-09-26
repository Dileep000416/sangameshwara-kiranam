"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Categories", href: "#categories" },
  { label: "Offers", href: "#offers" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-green-100/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a
          href="#home"
          className="group flex items-center gap-3"
          aria-label="Sangameshwara Kiranam and General Store home"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-700 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <span className="text-xl font-bold">S</span>
          </div>

          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight text-green-900 sm:text-lg">
              Sangameshwara
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700 sm:text-xs">
              Kiranam & General Store
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-green-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="Search products"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-green-50 hover:text-green-700"
          >
            <Search size={19} strokeWidth={1.9} />
          </button>

          <button
            type="button"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-green-50 hover:text-green-700"
          >
            <ShoppingCart size={19} strokeWidth={1.9} />

            <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-700 px-1 text-[9px] font-bold text-white">
              0
            </span>
          </button>

          <button
            type="button"
            aria-label="Customer account"
            className="ml-1 flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 transition-all duration-200 hover:border-green-200 hover:bg-green-100"
          >
            <UserRound size={17} strokeWidth={1.9} />
            <span>Account</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((previous) => !previous)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-green-50 hover:text-green-700 sm:hidden"
        >
          {isMenuOpen ? (
            <X size={23} strokeWidth={2} />
          ) : (
            <Menu size={23} strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-green-50 bg-white sm:hidden"
          >
            <nav
              className="mx-auto flex max-w-7xl flex-col px-4 py-4"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-green-50 hover:text-green-700"
                >
                  {link.label}
                </a>
              ))}

              <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-800"
                >
                  <Search size={17} />
                  Search
                </button>

                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white"
                >
                  <ShoppingCart size={17} />
                  Cart
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}