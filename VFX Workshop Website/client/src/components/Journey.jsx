import React from "react";
import { Lightbulb, Wrench, Rocket, Trophy } from "lucide-react";
import { Reveal } from "../utils/motion";

const STEPS = [
  {
    icon: Lightbulb,
    num: "01",
    title: "Explore an idea",
    desc: "Every creative project starts as a question. Students brainstorm concepts, collect references, and shape a vision worth building.",
  },
  {
    icon: Wrench,
    num: "02",
    title: "Learn the tools",
    desc: "Cameras, lighting rigs, editing suites, animation and AI software — mastered hands-on under the guidance of working mentors.",
  },
  {
    icon: Rocket,
    num: "03",
    title: "Create a project",
    desc: "Concepts become real work. Students shoot, animate, and edit original pieces on professional studio equipment.",
  },
  {
    icon: Trophy,
    num: "04",
    title: "Present the result",
    desc: "Finished projects are shared, discussed, and celebrated — building confidence, vocabulary, and a creative portfolio.",
  },
];

export default function Journey() {
  return (
    <section id="experience" className="section" style={{ backgroundColor: "var(--bg-dark)" }}>
      <div className="bg-glow" style={{ top: "20%", left: -260, opacity: 0.25 }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal className="section-header center">
          <div className="kicker">
            <Sparkle />
            <span>The Creative Journey</span>
          </div>
          <h2 className="section-title">
            From Imagination <span className="accent-text">To Creation</span>
          </h2>
          <p className="section-subtitle">
            How an idea becomes a finished piece at i5 VFX Studio — the same journey every student takes.
          </p>
        </Reveal>

        <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 0, margin: 0, padding: 0 }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const flip = i % 2 === 1;
            return (
              <li key={step.num}>
                <Reveal
                  className="journey-row"
                  delay={60}
                  style={flip ? { flexDirection: "row-reverse" } : undefined}
                >
                  <div className="journey-visual">
                    <span className="journey-num">{step.num}</span>
                    <div className="journey-icon-ring">
                      <Icon size={30} strokeWidth={1.6} />
                    </div>
                  </div>
                  <div className="journey-copy">
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 800, marginBottom: 10 }}>
                      {step.title}
                    </h3>
                    <p style={{ color: "var(--text-dim)", lineHeight: 1.65, fontSize: "0.95rem" }}>
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
                {i < STEPS.length - 1 && <div className="journey-connector" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </div>

      <style>{`
        @media (min-width: 780px) {
          .journey-row {
            display: flex;
            align-items: center;
            gap: 48px;
          }
          .journey-row > .journey-visual { flex: 0 0 180px; }
          .journey-connector {
            width: 1px;
            height: 54px;
            margin-left: 90px;
            background: linear-gradient(to bottom, rgba(255, 51, 75,0.5), transparent);
          }
        }
        @media (max-width: 779px) {
          .journey-row {
            display: flex;
            align-items: flex-start;
            gap: 20px;
          }
          .journey-row > .journey-visual { flex: 0 0 76px; }
          .journey-connector {
            width: 1px;
            height: 30px;
            margin-left: 38px;
            background: linear-gradient(to bottom, rgba(255, 51, 75,0.5), transparent);
          }
        }
      `}</style>
    </section>
  );
}

function Sparkle() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0l2.4 8.1L24 12l-9.6 3.9L12 24l-2.4-8.1L0 12l9.6-3.9L12 0z" />
    </svg>
  );
}
