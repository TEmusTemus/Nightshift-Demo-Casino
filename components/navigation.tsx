import Link from "next/link";

const navigationLinks = [
  { href: "/slot", label: "Slot" },
  { href: "/baccarat", label: "Baccarat" },
];

export function Navigation() {
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
          <li>
            <a href="/login">Log in</a>
          </li>
          <li>
            <a className="nav-action" href="/signup">
              Sign up
            </a>
          </li>
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
            <li>
              <a href="/login">Log in</a>
            </li>
            <li>
              <a href="/signup">Sign up</a>
            </li>
          </ul>
        </nav>
      </details>
    </header>
  );
}
