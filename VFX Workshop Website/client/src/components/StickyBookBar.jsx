import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Mobile-first sticky bottom "Book Now" bar (like Chitti's),
 * shown after the visitor scrolls past the funnel hero.
 */
export default function StickyBookBar({ show, onClick }) {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.55);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = show && pastHero;

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 950,
        display: "flex",
        gap: 10,
        padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
        background: "linear-gradient(to top, rgba(8,8,10,0.96) 60%, transparent)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(110%)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out)",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        tabIndex={visible ? 0 : -1}
        className="btn btn-primary sheen"
        style={{ flex: 1, padding: "16px 22px", fontSize: "1rem", justifyContent: "space-between" }}
      >
        <span>Book Now</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
