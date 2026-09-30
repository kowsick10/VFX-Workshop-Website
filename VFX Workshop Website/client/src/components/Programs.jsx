import React from "react";
import { Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { COURSES } from "../data/courses";
import { Reveal, useTilt } from "../utils/motion";

export default function Programs({ onSelectCourse }) {
  const [featured, ...rest] = COURSES;
  const featuredTilt = useTilt({ max: 3 });
  const tileTilt = useTilt({ max: 5 });

  return (
    <section id="programs" className="section" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="container">
        {/* Header — asymmetric editorial split */}
        <div className="programs-header">
          <div>
            <Reveal>
              <div className="kicker">
                <Sparkles size={13} />
                <span>Curriculum &amp; Workshops</span>
              </div>
              <h2 className="section-title">
                Explore What You <span className="accent-text">Can Create</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="section-subtitle" style={{ margin: 0 }}>
              Discover creative learning opportunities and explore the possibilities of digital media
              and technology — guided by working creative professionals.
            </p>
          </Reveal>
        </div>

        {/* Featured program panel */}
        <Reveal className="featured-panel spotlight-card sheen" variant="zoom">
          <div ref={featuredTilt.ref} style={{ display: "grid", gridTemplateColumns: "inherit", height: "100%" }}>
          <div className="featured-media">
            <img src={featured.image} alt={featured.title} />
            <div className="featured-media-shade" />
            <span className="featured-badge">{featured.category}</span>
          </div>
          <div className="featured-body">
            <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--red)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
              Featured Program
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
              {featured.title}
            </h3>
            <p style={{ color: "var(--text-dim)", lineHeight: 1.65, marginBottom: 20 }}>
              {featured.description}
            </p>
            <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 26 }}>
              {featured.highlights.map((h) => (
                <li key={h} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "#e2e2ec" }}>
                  <CheckCircle2 size={15} color="var(--red)" style={{ flexShrink: 0 }} />
                  {h}
                </li>
              ))}
            </ul>
            <div className="program-meta-row">
              <Meta icon={<Clock size={14} />} text={featured.duration} />
              <Meta icon={<CalendarIcon />} text={featured.schedule} />
              <Fee fee={featured.fee} originalFee={featured.originalFee} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button type="button" onClick={() => onSelectCourse(featured.id)} className="btn btn-primary">
                <span>Select This Program</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          </div>
        </Reveal>

        {/* Supporting tiles — varied editorial rhythm */}
        <div className="tiles">
          {rest.map((course, i) => (
            <Reveal key={course.id} delay={i * 90}>
              <article
                className="program-tile spotlight-card"
                ref={tileTilt.ref}
                onClick={() => onSelectCourse(course.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectCourse(course.id);
                  }
                }}
                aria-label={`Select the ${course.title} program`}
              >
                <div className="tile-media">
                  <img src={course.image} alt={course.title} loading="lazy" />
                  <div className="tile-shade" />
                  {course.badge && <span className="tile-badge">{course.badge}</span>}
                  <span className="tile-arrow" aria-hidden="true">→</span>
                </div>
                <div className="tile-body">
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--red)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
                    {course.category}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.18rem", fontWeight: 800, lineHeight: 1.25, marginBottom: 8 }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: "0.87rem", color: "var(--text-dim)", lineHeight: 1.55, marginBottom: 16 }}>
                    {course.tagline}
                  </p>
                  <div className="program-meta-row" style={{ marginTop: "auto" }}>
                    <Meta icon={<Clock size={13} />} text={course.duration} />
                    <Fee fee={course.fee} originalFee={course.originalFee} compact />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Select-to-form hint */}
        <Reveal delay={100}>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 36 }}>
            Selecting a program pre-fills it in the registration form and takes you straight to the payment step.
          </p>
        </Reveal>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .programs-header {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 40px;
            align-items: end;
            margin-bottom: 44px;
          }
          .featured-panel {
            display: grid;
            grid-template-columns: 1.05fr 0.95fr;
          }
          .tiles {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 26px;
            margin-top: 30px;
          }
        }
        @media (max-width: 899px) {
          .programs-header { margin-bottom: 34px; }
          .tiles { display: grid; grid-template-columns: 1fr; gap: 22px; margin-top: 26px; }
        }
        @media (min-width: 620px) and (max-width: 899px) {
          .tiles { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}

function Meta({ icon, text }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.78rem", fontWeight: 600, color: "var(--text-dim)", whiteSpace: "nowrap" }}>
      <span style={{ color: "var(--red)", display: "inline-flex" }}>{icon}</span>
      {text}
    </span>
  );
}

function Fee({ fee, originalFee, compact }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6, marginLeft: "auto" }}>
      <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: compact ? "1.05rem" : "1.5rem", color: "#fff" }}>
        ₹{fee.toLocaleString("en-IN")}
      </span>
      {originalFee ? (
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
          ₹{originalFee.toLocaleString("en-IN")}
        </span>
      ) : null}
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
