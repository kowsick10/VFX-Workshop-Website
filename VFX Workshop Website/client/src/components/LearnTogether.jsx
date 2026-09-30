import React from "react";
import { Star } from "lucide-react";
import { Reveal } from "../utils/motion";

const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=640&h=420&q=80",
    alt: "Student framing a shot in the studio",
    align: "left",
    w: 640,
    h: 420,
  },
  {
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=640&h=420&q=80",
    alt: "Student building an animation scene",
    align: "right",
    w: 640,
    h: 420,
  },
  {
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=640&h=420&q=80",
    alt: "Student filming on the studio floor",
    align: "left",
    w: 640,
    h: 420,
  },
  {
    src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=640&h=420&q=80",
    alt: "Students collaborating at editing workstations",
    align: "right",
    w: 640,
    h: 420,
  },
];

/**
 * "Learn & Enjoy Together" social-proof collage — floating polaroid-style
 * photos that tilt on scroll, with a centered headline between them.
 */
export default function LearnTogether({ onBookNow }) {
  return (
    <section
      className="learn-together section"
      style={{ backgroundColor: "var(--bg-dark)", overflow: "hidden" }}
      aria-label="Students learning together at i5 VFX Studio"
    >
      <div className="container" style={{ position: "relative", maxWidth: 860 }}>
        {PHOTOS.slice(0, 2).map((p, i) => (
          <Reveal
            key={p.src}
            delay={i * 140}
            variant={p.align === "left" ? "left" : "right"}
            className={`collage-photo ${p.align} ${i === 0 ? "first" : ""}`}
            as="figure"
            style={{ margin: 0 }}
          >
            <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" />
          </Reveal>
        ))}

        <Reveal className="learn-title-wrap" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5.4vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "48px 0 8px",
            }}
          >
            Learn &amp; Enjoy <span className="shimmer-text">Together!</span>
          </h2>
          <p style={{ color: "var(--text-dim)", maxWidth: 480, margin: "0 auto" }}>
            Small-batch sessions on a real studio floor — every student creates, presents, and celebrates their work.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 16,
              padding: "8px 18px",
              borderRadius: 100,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              fontSize: "0.86rem",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            <Star size={15} fill="#fbbf24" color="#fbbf24" />
            Trusted by students &amp; parents across Chennai
          </div>
        </Reveal>

        {PHOTOS.slice(2).map((p, i) => (
          <Reveal
            key={p.src}
            delay={i * 140}
            variant={p.align === "left" ? "left" : "right"}
            className={`collage-photo ${p.align}`}
            as="figure"
            style={{ margin: 0 }}
          >
            <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
