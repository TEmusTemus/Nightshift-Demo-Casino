"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const navigationLinks = [
  { href: "/slot", label: "Slot" },
  { href: "/baccarat", label: "Baccarat" },
  { href: "/account", label: "Account" },
];

export function Navigation() {
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => { const sync = () => setUsername(JSON.parse(localStorage.getItem("nightshift-user") || "null")?.username ?? null); sync(); window.addEventListener("nightshift-user", sync); return () => window.removeEventListener("nightshift-user", sync); }, []);
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="NIGHTSHIFT home">
        NIGHTSHIFT
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <ul>
          {navigationLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
          {username ? <li><a className="nav-action" href="/account">{username}</a></li> : <><li><a href="/login">Log in</a></li><li><a className="nav-action" href="/signup">Sign up</a></li></>}
        </ul>
      </nav>

      <details className="mobile-nav">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          <ul>
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
            {username ? <li><a href="/account">{username}</a></li> : <><li><a href="/login">Log in</a></li><li><a href="/signup">Sign up</a></li></>}
          </ul>
        </nav>
      </details>
    </header>
  );
}
