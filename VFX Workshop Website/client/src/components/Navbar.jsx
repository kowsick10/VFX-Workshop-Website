import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { scrollToSection } from "../utils/motion";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "programs", label: "Programs" },
  { id: "why-us", label: "About" },
  { id: "experience", label: "Learning Experience" },
  { id: "registration", label: "Registration" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ onRegisterClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      // Active section highlighting
      let current = "home";
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= 120) current = link.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock + Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    // Let the drawer close before scrolling
    window.setTimeout(() => scrollToSection(id), open ? 60 : 0);
  };

  const handleRegister = () => {
    setOpen(false);
    window.setTimeout(() => onRegisterClick?.(), open ? 60 : 0);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        backgroundColor: scrolled ? "rgba(8, 8, 10, 0.88)" : "transparent",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        {/* Brand */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            go("home");
          }}
          style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
          aria-label="i5 VFX Studio — back to top"
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              backgroundColor: "rgba(255, 51, 75, 0.12)",
              border: "1px solid rgba(255, 51, 75, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="https://www.i5vfxstudio.com/assets/i5logo-lTIxL0TM.png"
              alt="i5 VFX Studio logo"
              style={{ width: 30, height: 30, objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.outerHTML =
                  '<span style="font-family:var(--font-heading);font-weight:900;font-size:1.2rem;color:var(--red)">i5</span>';
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "1.12rem",
                letterSpacing: "0.03em",
                color: "#fff",
              }}
            >
              i5 VFX <span style={{ color: "var(--red)" }}>STUDIO</span>
            </span>
            <span
              style={{
                fontSize: "0.64rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Learn · Create · Elevate
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <nav className="desktop-nav" aria-label="Primary" style={{ display: "none", gap: 30 }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav-link${active === link.id ? " active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                go(link.id);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + burger */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            type="button"
            onClick={handleRegister}
            className="btn btn-primary sheen"
            style={{ padding: "10px 22px", fontSize: "0.88rem" }}
          >
            <span>Register Now</span>
            <ArrowUpRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mobile-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              width: 40,
              height: 40,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: "fixed",
          top: 72,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          backgroundColor: "rgba(8, 8, 10, 0.98)",
          display: open ? "flex" : "none",
          flexDirection: "column",
          padding: "30px 24px",
          gap: 6,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => {
              e.preventDefault();
              go(link.id);
            }}
            style={{
              color: "#fff",
              textDecoration: "none",
              fontFamily: "var(--font-heading)",
              fontSize: "1.35rem",
              fontWeight: 700,
              padding: "14px 4px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 0.45s var(--ease-out) ${0.06 + i * 0.05}s, transform 0.45s var(--ease-out) ${0.06 + i * 0.05}s`,
            }}
          >
            <span style={{ color: "var(--red)", marginRight: 12, fontSize: "0.85rem" }}>
              0{i + 1}
            </span>
            {link.label}
          </a>
        ))}
        <button
          type="button"
          onClick={handleRegister}
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 22, padding: 16 }}
        >
          Register &amp; Pay Now
        </button>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; align-items: center; }
          .mobile-burger { display: none !important; }
        }
        /* Clean underline glow under active/hovered tab */
        .nav-link::after {
          height: 2px;
          border-radius: 2px;
          background: var(--red-soft);
          box-shadow: 0 0 10px var(--red-glow);
        }
      `}</style>
    </header>
  );
}
