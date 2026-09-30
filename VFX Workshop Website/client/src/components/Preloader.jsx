import React, { useEffect, useState } from "react";

/**
 * Cinematic first-visit intro.
 * - Brief (~1.2s), skippable (click / keypress / auto-dismiss)
 * - Respects prefers-reduced-motion (skipped entirely)
 * - Shows once per browser session
 */
export default function Preloader({ onFinish }) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      onFinish?.();
      return;
    }
    if (sessionStorage.getItem("i5-intro-seen")) {
      setGone(true);
      onFinish?.();
      return;
    }

    const finish = () => {
      sessionStorage.setItem("i5-intro-seen", "1");
      setLeaving(true);
      window.setTimeout(() => {
        setGone(true);
        onFinish?.();
      }, 650);
    };

    const skip = () => finish();
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });

    const t = window.setTimeout(finish, 1400);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      className="preloader"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        backgroundColor: "var(--bg-dark)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        opacity: leaving ? 0 : 1,
        visibility: leaving ? "hidden" : "visible",
        transition: "opacity 0.6s var(--ease-out), visibility 0.6s",
      }}
    >
      {/* Logo mark with light sweep */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "10px 18px",
          borderRadius: 12,
          animation: "ringPop 0.7s var(--ease-out) both",
        }}
      >
        <img
          src="https://www.i5vfxstudio.com/assets/i5logo-lTIxL0TM.png"
          alt=""
          style={{ width: 64, height: 64, objectFit: "contain", display: "block" }}
          onError={(e) => {
            e.currentTarget.outerHTML =
              '<span style="font-family:var(--font-heading);font-weight:900;font-size:2rem;color:var(--red)">i5</span>';
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "45%",
            background:
              "linear-gradient(100deg, transparent, rgba(255,255,255,0.14), transparent)",
            animation: "sweep 1.2s var(--ease-inout) 0.15s both",
          }}
        />
      </div>

      {/* Wordmark */}
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "1.05rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          animation: "modalFadeUp 0.6s var(--ease-out) 0.25s both",
        }}
      >
        i5 VFX <span style={{ color: "var(--red)" }}>Studio</span>
      </div>

      {/* Draw line */}
      <div
        style={{
          width: 180,
          height: 2,
          background: "linear-gradient(90deg, var(--red), transparent)",
          transformOrigin: "left",
          animation: "preloaderLine 1.1s var(--ease-inout) both",
        }}
      />
    </div>
  );
}
