"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "Offers", href: "/offers" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const { cartCount } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchValue.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top information bar */}
      <div className="bg-green-950 text-white">
        <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
          <p className="truncate font-medium">
            Quality essentials for every home
          </p>

          <div className="hidden items-center gap-5 sm:flex">
            <Link
              href="/offers"
              className="font-semibold transition hover:text-green-300"
            >
              Offers
            </Link>

            <Link
              href="/contact"
              className="font-semibold transition hover:text-green-300"
            >
              Store Information
            </Link>
          </div>
        </div>
      </div>

      {/* Main desktop/mobile header */}
      <div className="border-b border-green-100 bg-green-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[72px] items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition hover:bg-green-800 lg:hidden"
              aria-label={
                mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={23} aria-hidden="true" />
              ) : (
                <Menu size={23} aria-hidden="true" />
              )}
            </button>

            {/* Brand */}
            <Link
              href="/"
              className="group flex shrink-0 items-center"
              aria-label="Sangameshwara Kiranam & General Store home"
            >
              <div>
                <p className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  SANGAMESHWARA
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-200">
                  Kiranam & General Store
                </p>
              </div>
            </Link>

            {/* Desktop categories link */}
            <Link
              href="/categories"
              className="ml-4 hidden h-11 shrink-0 items-center gap-2 rounded-xl bg-green-700 px-4 text-sm font-semibold text-white transition hover:bg-green-600 lg:flex"
            >
              <Menu size={18} aria-hidden="true" />
              <span>Browse Categories</span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="ml-auto hidden min-w-0 flex-1 max-w-2xl lg:block">
              <label htmlFor="desktop-product-search" className="sr-only">
                Search products
              </label>

              <div className="relative">
                <Search
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />

                <input
                  id="desktop-product-search"
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search for rice, atta, tea and more..."
                  className="h-11 w-full rounded-xl border border-green-100 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-300/20"
                />
              </div>
            </form>

            {/* Desktop admin link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800 lg:flex"
              >
                <LayoutDashboard size={19} aria-hidden="true" />
                <span>Admin</span>
              </Link>
            )}

            {/* Desktop account */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="hidden shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800 lg:flex"
              >
                <LogOut size={19} aria-hidden="true" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800 lg:flex"
              >
                <UserRound size={19} aria-hidden="true" />
                <span>Login</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-10 shrink-0 items-center gap-2 rounded-xl px-2 text-white transition hover:bg-green-800 sm:px-3"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={21} aria-hidden="true" />

              <span className="hidden text-sm font-semibold sm:inline">
                Cart
              </span>

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-green-900">
                {cartCount}
              </span>
            </Link>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="pb-3 lg:hidden">
            <label htmlFor="mobile-product-search" className="sr-only">
              Search products
            </label>

            <div className="relative">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />

              <input
                id="mobile-product-search"
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search products..."
                className="h-11 w-full rounded-xl border border-green-100 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-300/20"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-green-100 bg-white shadow-lg lg:hidden">
          <nav
            className="mx-auto max-w-7xl px-4 py-3 sm:px-6"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-green-950 transition hover:bg-green-50 hover:text-green-700"
                >
                  {link.name}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-green-950 transition hover:bg-green-50 hover:text-green-700"
                >
                  <LayoutDashboard size={18} aria-hidden="true" />
                  Admin dashboard
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 flex min-h-11 w-full items-center gap-2 rounded-xl bg-green-800 px-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex min-h-11 items-center gap-2 rounded-xl bg-green-800 px-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <UserRound size={18} aria-hidden="true" />
                  Login / Register
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
