import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck, Users, Film } from "lucide-react";
import { useReducedMotion } from "../utils/motion";

const WORDS = [
  { text: "IMAGINE.", accent: false },
  { text: "CREATE.", accent: false },
  { text: "TRANSFORM.", accent: true },
];

export default function Hero({ onExplorePrograms, onRegisterNow }) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const heroRef = useRef(null);
  const visualRef = useRef(null);

  // Stage the entrance after the preloader window (or immediately when skipped)
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 100);
    return () => window.clearTimeout(t);
  }, []);

  // Gentle scroll parallax on the hero visual (desktop, motion allowed)
  useEffect(() => {
    if (reduced) return;
    const el = visualRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, 1 - rect.top / window.innerHeight));
        el.style.transform = `translateY(${progress * -34}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const wordAnim = (i) =>
    reduced
      ? {}
      : {
          display: "inline-block",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(40px)",
          transition: `opacity 0.7s var(--ease-out) ${0.15 + i * 0.14}s, transform 0.7s var(--ease-out) ${0.15 + i * 0.14}s`,
        };

  const fadeAnim = (delay) =>
    reduced
      ? {}
      : {
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(22px)",
          transition: `opacity 0.7s var(--ease-out) ${delay}s, transform 0.7s var(--ease-out) ${delay}s`,
        };

  return (
    <section
      id="discover"
      ref={heroRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        padding: "130px 0 90px",
        overflow: "hidden",
        backgroundColor: "var(--bg-dark)",
      }}
    >
      {/* Ambient glows */}
      <div className="bg-glow" style={{ top: -160, left: "50%", marginLeft: -250, opacity: 0.55 }} />
      <div className="bg-glow" style={{ bottom: -140, right: -140, width: 420, height: 420, opacity: 0.3 }} />

      {/* Cinematic aurora */}
      {!reduced && <div className="aurora" style={{ top: "-6%", left: "-14%" }} aria-hidden="true" />}

      {/* Fine grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-grid">
          {/* Copy column */}
          <div style={{ maxWidth: 660 }}>
            <div className="section-tag pulse-glow" style={fadeAnim(0.05)}>
              <Sparkle />
              <span>Official Student Programs · i5 VFX Studio Chennai</span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.6rem, 6.2vw, 4.4rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: "18px 0 20px",
              }}
            >
              {WORDS.map((w, i) => (
                <span key={w.text} style={wordAnim(i)}>
                  {w.text}
                  {i < WORDS.length - 1 ? " " : ""}
                </span>
              ))}
              <br />
              <span
                className="shimmer-text"
                style={{
                  ...fadeAnim(0.6),
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.3rem, 2.6vw, 1.9rem)",
                  letterSpacing: "0.06em",
                }}
              >
                A world of creativity begins here.
              </span>
            </h1>

            <p style={{ ...fadeAnim(0.75), fontSize: "clamp(1.02rem, 1.6vw, 1.18rem)", color: "var(--text-dim)", lineHeight: 1.65, marginBottom: 34, maxWidth: 560 }}>
              Discover the art and technology behind VFX, animation, digital filmmaking, and creative
              innovation. Explore hands-on learning experiences at{" "}
              <strong style={{ color: "#fff" }}>i5 VFX Studio</strong>.
            </p>

            {/* CTAs + inline capability badge */}
            <div style={{ ...fadeAnim(0.9), display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14, marginBottom: 46 }}>
              <button type="button" onClick={onExplorePrograms} className="btn btn-primary" style={{ padding: "16px 30px", fontSize: "1rem" }}>
                <span>Explore Programs</span>
                <ArrowRight size={18} />
              </button>
              <button type="button" onClick={onRegisterNow} className="btn btn-secondary" style={{ padding: "16px 28px", fontSize: "1rem" }}>
                <span>Register Your Child</span>
              </button>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 100,
                  backgroundColor: "rgba(255, 51, 75, 0.1)",
                  border: "1px solid rgba(255, 51, 75, 0.35)",
                  color: "var(--red-hover)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                <Sparkle />
                AI Video Lab — Now Open
              </span>
            </div>

            {/* Trust strip — unified glassmorphic bar */}
            <div
              style={{
                ...fadeAnim(1.05),
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                padding: "16px 22px",
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <TrustItem icon={<Users size={18} />} value="Grades 6–12" label="School student programs" />
              <TrustDivider />
              <TrustItem icon={<Film size={18} />} value="100% Hands-on" label="Real studio workflows" />
              <TrustDivider />
              <TrustItem icon={<ShieldCheck size={18} />} value="Razorpay Secure" label="Verified instant confirmation" />
            </div>
          </div>

          {/* Visual column */}
          <div ref={visualRef} style={{ position: "relative", willChange: "transform" }}>
            <div
              style={{
                position: "relative",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <img
                className={reduced ? "" : "ken-burns"}
                src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80"
                alt="Cinematic film set with professional lighting — the i5 VFX Studio learning environment"
                fetchpriority="high"
                style={{ width: "100%", height: "min(58vh, 480px)", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.2) 55%, transparent 100%)",
                }}
              />

              {/* Floating studio promise */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  right: 20,
                  padding: "16px 20px",
                  backgroundColor: "rgba(16,16,22,0.88)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 14,
                  border: "1px solid rgba(255, 51, 75,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--red)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    Chennai · Aminjikarai Studio
                  </div>
                  <div style={{ fontSize: "0.98rem", fontWeight: 700, color: "#fff" }}>
                    Practical training · Real mentors · Real equipment
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "rgba(255, 51, 75,0.15)",
                    color: "var(--red)",
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  Grades 6–12
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        className="scroll-indicator"
        onClick={onExplorePrograms}
        aria-label="Scroll to programs"
        style={{
          ...fadeAnim(1.3),
          position: "absolute",
          bottom: 22,
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
          fontSize: "0.68rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        <span>Scroll</span>
        <span
          style={{
            width: 22,
            height: 36,
            borderRadius: 12,
            border: "1.5px solid rgba(255,255,255,0.25)",
            display: "flex",
            justifyContent: "center",
            paddingTop: 6,
          }}
        >
          <span
            style={{
              width: 3,
              height: 7,
              borderRadius: 2,
              backgroundColor: "var(--red)",
              animation: "scrollDot 1.8s var(--ease-inout) infinite",
            }}
          />
        </span>
      </button>

      <style>{`
        @media (min-width: 980px) {
          .hero-grid {
            display: grid;
            grid-template-columns: 1.12fr 0.88fr;
            gap: 56px;
            align-items: center;
          }
        }
        @media (max-width: 979px) {
          .hero-grid { display: flex; flex-direction: column; gap: 44px; }
        }
      `}</style>
    </section>
  );
}function TrustItem({ icon, value, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: "var(--red-faint)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--red-hover)",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: "1.02rem", color: "#fff", lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{label}</div>
      </div>
    </div>
  );
}

function TrustDivider() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 1,
        height: 30,
        alignSelf: "stretch",
        maxHeight: 34,
        backgroundColor: "rgba(255,255,255,0.1)",
        flexShrink: 0,
      }}
    />
  );
}

function Sparkle() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0l2.4 8.1L24 12l-9.6 3.9L12 24l-2.4-8.1L0 12l9.6-3.9L12 0z" />
    </svg>
  );
}
