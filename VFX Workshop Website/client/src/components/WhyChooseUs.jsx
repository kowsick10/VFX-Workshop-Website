import React from "react";
import { Sparkles } from "lucide-react";
import { Reveal } from "../utils/motion";

const PRINCIPLES = [
  {
    num: "01",
    title: "Practical, hands-on learning",
    desc: "Students learn by doing — operating real cameras, lights, and editing workstations from day one, not watching slides.",
  },
  {
    num: "02",
    title: "Creative exploration",
    desc: "Room to experiment with VFX, animation, film, and AI tools until each student finds their own creative voice.",
  },
  {
    num: "03",
    title: "Industry-relevant tools",
    desc: "Workflows mirror professional post-production and content studios, so skills translate directly to real projects.",
  },
  {
    num: "04",
    title: "Guided projects",
    desc: "Mentors guide each student from concept to a finished piece — storytelling, problem-solving, and craft along the way.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="section" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="container">
        <div className="why-grid">
          {/* Feature image column — image + animated orbit/stack fills the space below */}
          <div className="why-media-col">
            <Reveal variant="mask" className="why-media">
              <img
                src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1000&q=80"
                alt="Student practicing cinematography with a camera rig in the studio"
                loading="lazy"
              />
              <div className="why-media-shade" />
              <div className="why-media-caption">
                <span className="why-media-caption-title">Inside the studio</span>
                <span>Hands-on sessions on the Chennai studio floor</span>
              </div>
            </Reveal>

            {/* Animated orbit ring + floating tool chips fill the previously empty space */}
            <Reveal delay={150}>
              <div className="why-orbit" aria-hidden="true">
                <div className="why-orbit-ring r1" />
                <div className="why-orbit-ring r2" />
                <div className="why-orbit-ring r3" />
                <div className="why-orbit-core">
                  <span className="why-orbit-core-num">360°</span>
                  <span className="why-orbit-core-label">creative skill circle</span>
                </div>
                {[
                  { label: "VFX", angle: 0 },
                  { label: "3D", angle: 51.4 },
                  { label: "AI", angle: 102.8 },
                  { label: "FILM", angle: 154.2 },
                  { label: "EDIT", angle: 205.6 },
                  { label: "SOUND", angle: 257 },
                  { label: "DRONE", angle: 308.4 },
                ].map(({ label, angle }) => (
                  <span
                    key={label}
                    className="why-orbit-chip"
                    style={{
                      "--orbit-x": `${Math.cos((angle * Math.PI) / 180) * 108}px`,
                      "--orbit-y": `${Math.sin((angle * Math.PI) / 180) * 108}px`,
                      "--orbit-i": angle / 51.4,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Copy column */}
          <div>
            <Reveal>
              <div className="kicker">
                <Sparkles size={13} />
                <span>Why Learn With Us</span>
              </div>
              <h2 className="section-title" style={{ textAlign: "left" }}>
                Learning That Feels Like <span className="accent-text">The Real Thing</span>
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 34 }}>
                i5 VFX Studio bridges the gap between classroom theory and real-world media
                production — with structured programs built for school students.
              </p>
            </Reveal>

            <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.num} delay={i * 90}>
                  <div className="why-principle" style={{ padding: "24px 22px" }}>
                    <span className="why-principle-num">{p.num}</span>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", fontWeight: 800, marginBottom: 4 }}>
                        {p.title}
                      </h3>
                      <p style={{ fontSize: "0.88rem", color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 920px) {
          .why-grid {
            display: grid;
            grid-template-columns: 0.92fr 1.08fr;
            gap: 64px;
            align-items: start;
          }
          .why-media-col { position: sticky; top: 110px; }
        }
        .why-media-col { display: flex; flex-direction: column; gap: 26px; }
        .why-media {
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid var(--border);
        }

        /* ---- Orbit ring visual ---- */
        .why-orbit {
          position: relative;
          height: 300px;
          border-radius: 22px;
          border: 1px solid var(--border);
          background:
            radial-gradient(circle at 50% 50%, rgba(255, 51, 75,0.09), transparent 62%),
            var(--bg-card);
          overflow: hidden;
        }
        .why-orbit-ring {
          position: absolute;
          top: 50%; left: 50%;
          border: 1px dashed rgba(255, 51, 75,0.4);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        .why-orbit-ring.r1 { width: 150px; height: 150px; animation: orbitSpin 26s linear infinite; }
        .why-orbit-ring.r2 { width: 220px; height: 220px; animation: orbitSpin 38s linear infinite reverse; }
        .why-orbit-ring.r3 { width: 290px; height: 290px; border-color: rgba(255, 51, 75,0.22); animation: orbitSpin 52s linear infinite; }
        @keyframes orbitSpin { to { transform: translate(-50%, -50%) rotate(360deg); } }
        .why-orbit-core {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 2;
        }
        .why-orbit-core-num {
          display: block;
          font-family: var(--font-display);
          font-size: 2.6rem;
          line-height: 1;
          color: #fff;
          text-shadow: 0 0 24px var(--red-glow);
        }
        .why-orbit-core-label {
          font-size: 0.66rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .why-orbit-chip {
          position: absolute;
          top: 50%; left: 50%;
          /* Cartesian placement computed in JSX: equal radial spacing, upright text */
          transform: translate(calc(-50% + var(--orbit-x)), calc(-50% + var(--orbit-y)));
          padding: 6px 14px;
          border-radius: 100px;
          background: rgba(16,16,22,0.85);
          border: 1px solid rgba(255, 51, 75,0.45);
          color: #ffb3b5;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          animation: chipPulse 3.2s ease-in-out infinite;
          animation-delay: calc(var(--orbit-i) * 0.35s);
          white-space: nowrap;
        }
        @keyframes chipPulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; box-shadow: 0 0 18px rgba(255, 51, 75,0.35); }
        }
        @media (max-width: 919px) {
          .why-orbit { height: 240px; }
          .why-orbit-chip {
            transform: translate(calc(-50% + var(--orbit-x) * 0.78), calc(-50% + var(--orbit-y) * 0.78));
            font-size: 0.62rem;
            padding: 5px 11px;
          }
        }
      `}</style>
    </section>
  );
}
