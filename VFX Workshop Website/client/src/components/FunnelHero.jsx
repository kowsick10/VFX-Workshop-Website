import React, { useState } from "react";
import { Play, ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal } from "../utils/motion";

const CHIPS = [
  { label: "Mode", value: "Studio + Online" },
  { label: "Grade", value: "6 to 12" },
  { label: "Language", value: "Tamil / English" },
];

/** Set a specific upload ID here to embed it; falls back to the studio channel. */
const YOUTUBE_VIDEO_ID = "";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@i5vfxstudio";

/**
 * Chitti-style funnel hero: giant benefit headline, video thumbnail card,
 * quick-fact chips and a strong Book Now CTA.
 */
export default function FunnelHero({ onBookNow }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (YOUTUBE_VIDEO_ID) {
      setPlaying(true);
    } else {
      window.open(YOUTUBE_CHANNEL_URL, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      id="home"
      className="funnel-hero"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--bg-dark)",
        padding: "72px 0 90px",
      }}
    >
      {/* Ambient aurora */}
      <div className="aurora" style={{ top: "-12%", left: "50%", marginLeft: -410 }} aria-hidden="true" />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Reveal>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              maxWidth: 860,
              margin: "0 auto 40px",
            }}
          >
            In Just 30 Days, Watch Your Child Create{" "}
            <span className="shimmer-text">Cinema-Grade VFX</span> With Their Own Hands!
          </h1>
        </Reveal>

        {/* Video thumbnail card */}
        <Reveal delay={120} variant="zoom">
          <div
            className="sheen"
            style={{
              position: "relative",
              maxWidth: 640,
              margin: "0 auto 40px",
              borderRadius: 22,
              padding: 3,
              background: "linear-gradient(135deg, var(--red), rgba(255, 51, 75,0.25))",
              boxShadow: "0 24px 60px -18px rgba(255, 51, 75,0.55)",
            }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 19,
                overflow: "hidden",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1280&q=80"
                alt="i5 VFX Studio workshop preview"
                style={{ width: "100%", height: "min(52vw, 340px)", objectFit: "cover", display: "block", opacity: playing ? 0 : 1 }}
              />
              {playing ? (
                <iframe
                  src="https://www.youtube.com/embed?listType=user_uploads&list=i5vfxstudio"
                  title="i5 VFX Studio workshop video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              ) : null}
              {!playing && (
                <button
                  type="button"
                  onClick={handlePlay}
                  aria-label="Play workshop video"
                  className="play-btn"
                  style={{
                    position: "absolute",
                    inset: 0,
                    margin: "auto",
                    width: 78,
                    height: 78,
                    borderRadius: "50%",
                    border: "none",
                    background: "var(--red)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 0 0 10px rgba(255, 51, 75,0.25), 0 14px 34px rgba(255, 51, 75,0.5)",
                    animation: "pulseSubtle 2.2s ease-in-out infinite",
                  }}
                >
                  <Play size={32} fill="#fff" />
                </button>
              )}
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  bottom: 14,
                  textAlign: "left",
                  textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#ffd9db", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  i5 VFX Studio · Chennai
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.15rem", color: "#fff" }}>
                  Student Workshop Preview
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Quick-fact chips */}
        <Reveal delay={200}>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, marginBottom: 40 }}>
            {CHIPS.map((c) => (
              <div
                key={c.label}
                style={{
                  padding: "12px 26px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  backdropFilter: "blur(8px)",
                  minWidth: 130,
                }}
              >
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.02rem", color: "#fff" }}>
                  {c.value}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Book Now CTA */}
        <Reveal delay={260}>
          <button type="button" onClick={onBookNow} className="btn btn-primary funnel-cta sheen">
            <span>Reserve Your Child's Seat</span>
            <ArrowRight size={18} />
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 16,
              fontSize: "0.82rem",
              color: "var(--text-muted)",
            }}
          >
            <ShieldCheck size={15} color="var(--red)" />
            Secure Razorpay enrollment · Limited seats per batch
          </div>
        </Reveal>
      </div>
    </section>
  );
}
