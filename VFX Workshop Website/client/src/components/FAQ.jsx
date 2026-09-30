import React, { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { Reveal } from "../utils/motion";

const FAQS = [
  {
    q: "Which programs are available for school students?",
    a: "i5 VFX Studio runs seven 30-day creative programs for school students: AI Video Creation, 2D & 3D Animation, Video Editing & Post-Production, Cinematography & Camera Arts, Photography & Digital Arts, Videography & YouTube Creation, and AI Digital Marketing for Creators.",
  },
  {
    q: "What are the eligibility requirements?",
    a: "Programs are designed for school students from Grade 6 to Grade 12. No prior experience is required — beginners are welcome, and students with some experience can join at their comfort level.",
  },
  {
    q: "How long are the programs?",
    a: "Each program runs for 30 days. Batches are scheduled around school hours — weekends, after-school weekdays, and school-holiday intensives.",
  },
  {
    q: "What are the fees?",
    a: "Fees vary by program, from ₹4,999 to ₹8,999, and are shown on each program card and in the registration summary before you pay. The registration fee covers the full 30-day program.",
  },
  {
    q: "Are online or offline options available?",
    a: "Yes — programs are available offline on the Chennai studio floor, online as interactive sessions, or a flexible mix of both. Choose your preferred format in the registration form.",
  },
  {
    q: "How does registration and payment work?",
    a: "Complete the three-step registration form on this page and pay the registration fee securely through Razorpay (UPI, cards, net banking, and wallets). Your registration is confirmed the moment your payment is verified — you'll receive a Registration ID instantly on screen.",
  },
  {
    q: "How can parents contact the studio?",
    a: "Call or WhatsApp +91 97910 70214, email info@i5vfxstudio.com, or visit the studio at 11/05, Rangarajulu Street, Ayyavoo Colony, Aminjikarai, Chennai – 600 029.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section id="faq" className="section" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="container" style={{ maxWidth: 860 }}>
        <Reveal className="section-header center">
          <div className="kicker">
            <HelpCircle size={13} />
            <span>Good To Know</span>
          </div>
          <h2 className="section-title">
            Questions, <span className="accent-text">Answered</span>
          </h2>
        </Reveal>

        <div className="faq-list">
          {FAQS.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <Reveal key={i} delay={i * 60}>
                <div className={`faq-item${isOpen ? " open" : ""}`}>
                  <button
                    type="button"
                    className="faq-q"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                  >
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <Plus size={18} />
                    </span>
                  </button>
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className="faq-a"
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.4s var(--ease-out)",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ padding: "2px 22px 18px", color: "var(--text-dim)", fontSize: "0.92rem", lineHeight: 1.65 }}>
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 32 }}>
            Something else on your mind? Call{" "}
            <a href="tel:+919791070214" style={{ color: "var(--red)", fontWeight: 700, textDecoration: "none" }}>
              +91 97910 70214
            </a>{" "}
            — we're happy to help.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
