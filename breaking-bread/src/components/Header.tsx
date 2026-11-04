"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SearchItem } from "@/lib/types";
import { Logo } from "./Logo";
import { CloseIcon, MenuIcon, SearchIcon } from "./Icons";
import { SearchDialog } from "./SearchDialog";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/journal", label: "Food Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface Props {
  index: SearchItem[];
  social: { tiktok: string; instagram: string };
}

export function Header({ index, social }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Close the menu on navigation.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // "/" or Cmd/Ctrl+K opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cream/10 bg-ink text-cream print:hidden">
        <div className="container-x flex h-16 items-center justify-between gap-4 md:h-20">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`label py-2 transition-colors hover:text-bronze ${
                      isActive(item.href) ? "text-bronze" : "text-cream"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-11 items-center gap-2.5 px-3 text-cream transition-colors hover:text-bronze"
              aria-label="Search recipes and journal"
              aria-haspopup="dialog"
            >
              <SearchIcon className="h-5 w-5" />
              <span className="label hidden md:inline">Search</span>
            </button>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center text-cream lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-ink text-cream md:top-20 lg:hidden"
      >
        <nav aria-label="Mobile" className="container-x flex min-h-full flex-col justify-between py-8">
          <ul className="divide-y divide-cream/10 border-y border-cream/10">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline justify-between py-5"
                >
                  <span className={`display text-4xl ${isActive(item.href) ? "text-bronze" : ""}`}>{item.label}</span>
                  <span className="label text-mist">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex gap-3">
            <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light flex-1">
              TikTok
            </a>
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light flex-1">
              Instagram
            </a>
          </div>
        </nav>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} index={index} />
    </>
  );
}
