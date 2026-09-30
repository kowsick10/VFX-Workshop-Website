import React, { useEffect, useState } from "react";
import { Timer } from "lucide-react";

const DURATION_MS = 3 * 60 * 60 * 1000; // 3-hour repeating window

function getRemaining() {
  const now = Date.now();
  const end = Math.ceil(now / DURATION_MS) * DURATION_MS;
  let diff = Math.max(0, end - now);
  const h = Math.floor(diff / 3_600_000);
  diff -= h * 3_600_000;
  const m = Math.floor(diff / 60_000);
  diff -= m * 60_000;
  const s = Math.floor(diff / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Chitti-style "Limited Time Offer" ribbon with a live countdown. */
export default function OfferBanner() {
  const [left, setLeft] = useState(getRemaining);

  useEffect(() => {
    const t = window.setInterval(() => setLeft(getRemaining()), 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div
      role="status"
      style={{
        position: "relative",
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "4px 14px",
        padding: "14px 20px",
        borderRadius: "0 0 22px 22px",
        background: "linear-gradient(180deg, #ffffff 0%, #fdf2f3 100%)",
        color: "#1a1a24",
        boxShadow: "0 10px 30px -10px rgba(255, 51, 75,0.35)",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: "0.95rem" }}>
        <Timer size={17} color="var(--red)" />
        Limited Time Offer
      </span>
      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#5a5a6c" }}>
        Offer ends in{" "}
        <strong
          style={{
            fontFamily: "var(--font-heading)",
            fontVariantNumeric: "tabular-nums",
            fontSize: "1.05rem",
            color: "var(--red)",
            letterSpacing: "0.04em",
          }}
        >
          {left}
        </strong>
      </span>
    </div>
  );
}
