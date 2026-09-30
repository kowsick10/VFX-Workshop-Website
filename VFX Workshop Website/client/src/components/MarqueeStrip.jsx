import React from "react";
import { Reveal } from "../utils/motion";

const ITEMS = [
  "VFX",
  "3D ANIMATION",
  "FILMMAKING",
  "AI VIDEO",
  "MOTION GRAPHICS",
  "EDITING",
  "GRAPHIC DESIGN",
  "DRONE & MEDIA",
];

/**
 * Infinite marquee strip — pauses on hover, hidden from a11y tree (decorative).
 */
export default function MarqueeStrip() {
  const row = (ariaHidden) => (
    <div aria-hidden={ariaHidden} style={{ display: "flex", gap: 56, paddingRight: 56 }}>
      {ITEMS.map((t) => (
        <span key={t} className="marquee-item">
          <span className="star">✦</span>
          {t}
          <span className="star">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <Reveal variant="zoom">
      <div className="marquee" role="presentation">
        <div className="marquee-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </Reveal>
  );
}
