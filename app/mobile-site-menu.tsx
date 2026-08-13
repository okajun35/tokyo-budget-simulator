"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SiteMenuItem = {
  href: string;
  label: string;
};

type MobileSiteMenuProps = {
  items: readonly SiteMenuItem[];
};

export function MobileSiteMenu({ items }: MobileSiteMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRootRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeFromOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRootRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [menuOpen]);

  return <div className="mobileMenu" ref={menuRootRef}>
    <button
      ref={menuButtonRef}
      type="button"
      className="mobileMenuButton"
      aria-controls="mobile-site-menu"
      aria-expanded={menuOpen}
      onClick={() => setMenuOpen(open => !open)}
    >
      <span className="mobileMenuIcon" aria-hidden="true"><i /><i /><i /></span>
      <span>メニュー</span>
    </button>
    <nav
      id="mobile-site-menu"
      className="mobileSiteMenu"
      aria-label="モバイル主要メニュー"
      hidden={!menuOpen}
    >
      {items.map(item => <Link
        key={item.href}
        href={item.href}
        onClick={() => setMenuOpen(false)}
      >{item.label}</Link>)}
    </nav>
  </div>;
}
