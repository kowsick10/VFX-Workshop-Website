import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, X, ZoomIn } from "lucide-react";
import { Reveal } from "../utils/motion";

/**
 * Creative Experience Gallery — masonry flow ordered by image size.
 * Each entry has a deliberate aspect ratio (w×h crop) so the column
 * layout forms a varied, editorial mosaic. Replace entries in
 * GALLERY_ITEMS with approved studio/student photography when available.
 */
const GALLERY_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&h=560&q=80",
    w: 900, h: 560,
    category: "VFX & Post-Production",
    caption: "Compositing and post-production workstations",
  },
  {
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=700&h=920&q=80",
    w: 700, h: 920,
    category: "Digital Filmmaking",
    caption: "Location shoot with gimbal and lighting kit",
  },
  {
    src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=700&h=480&q=80",
    w: 700, h: 480,
    category: "Editing Suites",
    caption: "Timeline editing and color grading bay",
  },
  {
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=700&h=680&q=80",
    w: 700, h: 680,
    category: "Animation",
    caption: "Character design and animation fundamentals",
  },
  {
    src: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&h=620&q=80",
    w: 900, h: 620,
    category: "Studio Floor",
    caption: "Practical lighting and camera sessions",
  },
  {
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&h=860&q=80",
    w: 700, h: 860,
    category: "Photography",
    caption: "Exposure, framing, and retouching practice",
  },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null); // index | null

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % GALLERY_ITEMS.length)),
    []
  );
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? null : (i - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)),
    []
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, next, prev]);

  return (
    <section id="gallery" className="section" style={{ backgroundColor: "var(--bg-dark)" }}>
      <div className="container">
        <Reveal className="section-header center">
          <div className="kicker">
            <Sparkles size={13} />
            <span>Creative Experience</span>
          </div>
          <h2 className="section-title">
            Inside The <span className="accent-text">Studio</span>
          </h2>
          <p className="section-subtitle">
            A glimpse of the environments, tools, and craft our students get hands-on with.
          </p>
        </Reveal>

        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item, i) => (
            <Reveal
              key={item.src}
              delay={(i % 3) * 110}
              className="gallery-item"
              as="figure"
            >
              <button
                type="button"
                className="gallery-open"
                onClick={() => setLightbox(i)}
                aria-label={`View larger: ${item.caption}`}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  width={item.w}
                  height={item.h}
                  loading="lazy"
                />
                <span className="gallery-zoom" aria-hidden="true">
                  <ZoomIn size={20} />
                </span>
                <figcaption className="gallery-caption">
                  <span className="gallery-cat">{item.category}</span>
                  <span className="gallery-cap-text">{item.caption}</span>
                </figcaption>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3500,
            backgroundColor: "rgba(4,4,6,0.94)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            animation: "modalFadeUp 0.3s var(--ease-out)",
          }}
          onClick={close}
        >
          <figure style={{ maxWidth: 960, width: "100%", margin: 0 }} onClick={(e) => e.stopPropagation()}>
            <img
              src={GALLERY_ITEMS[lightbox].src}
              alt={GALLERY_ITEMS[lightbox].caption}
              style={{ width: "100%", maxHeight: "76vh", objectFit: "contain", borderRadius: 12 }}
            />
            <figcaption style={{ textAlign: "center", marginTop: 14, color: "var(--text-dim)", fontSize: "0.9rem" }}>
              <strong style={{ color: "var(--red)" }}>{GALLERY_ITEMS[lightbox].category}</strong>
              {" — "}
              {GALLERY_ITEMS[lightbox].caption}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={close}
            aria-label="Close image viewer"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
