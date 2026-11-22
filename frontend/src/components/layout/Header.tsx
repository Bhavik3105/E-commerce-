"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks, siteConfig } from "@/lib/constants";
import { useAccount } from "@/lib/account-context";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, ready } = useCart();
  const { customer, ready: accountReady } = useAccount();
  const accountHref = accountReady && customer ? "/account" : "/login";
  const accountLabel = accountReady && customer ? "Account" : "Login";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-neutral-200 shadow-sm flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="Jummip Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-neutral-900">
            Jummip
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3.5 lg:gap-6 xl:gap-7" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs lg:text-sm font-medium text-neutral-600 transition-colors hover:text-primary whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right section: Cart + Mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href={accountHref}
            className="rounded-full px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary sm:text-sm"
          >
            {accountLabel}
          </Link>
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary"
            aria-label={
              ready
                ? `Shopping cart with ${totalItems} items`
                : "Shopping cart"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            {ready && totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-2xs font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="flex items-center justify-center rounded-md p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 z-40 bg-black/20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <nav
            id="mobile-menu"
            className={cn(
              "fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 bg-white shadow-lg md:hidden",
              "animate-slide-in-right"
            )}
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col p-6 gap-1">
              <li>
                <Link
                  href={accountHref}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {accountLabel}
                </Link>
              </li>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-neutral-200 px-6 py-4">
              <p className="text-sm text-neutral-500">
                {siteConfig.contact.email}
              </p>
              <p className="text-sm text-neutral-500">
                {siteConfig.contact.phone}
              </p>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
