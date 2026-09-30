import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  X,
  ArrowRight,
} from "lucide-react";
import { Reveal, scrollToSection } from "../utils/motion";

export default function Footer({ onRegisterClick }) {
  const [legal, setLegal] = useState(null); // "privacy" | "terms" | null

  const openLegal = (type) => {
    if (type === "privacy") {
      setLegal({
        title: "Privacy Policy",
        content: `At i5 VFX Studio, we are dedicated to protecting the privacy of our students and their guardians. Information collected during program registration (names, grades, contact numbers, email addresses) is used exclusively for enrollment processing, course scheduling, batch allocations, mentor communication, and receipt delivery. We do not sell, rent, or share personal details with third-party marketers. For questions regarding your stored information, contact privacy@i5vfxstudio.com.`,
      });
    } else {
      setLegal({
        title: "Terms & Conditions",
        content: `1. Enrollment is confirmed upon successful receipt of the registration fee via Razorpay.
2. Batch schedules (weekends, weekdays, holidays) are coordinated directly with guardians based on studio lab availability.
3. Students are expected to adhere to studio safety and workstation guidelines during practical sessions.
4. i5 VFX Studio reserves the right to reschedule workshop sessions in the event of unforeseen studio maintenance or public emergencies, with advance notice to parents.`,
      });
    }
  };

  return (
    <>
      {/* Contact CTA band */}
      <section
        id="contact"
        className="section"
        style={{
          backgroundColor: "var(--bg-dark)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="bg-glow" style={{ bottom: -220, left: "50%", marginLeft: -250, opacity: 0.3 }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Reveal>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
                lineHeight: 1.05,
                letterSpacing: "0.02em",
                marginBottom: 16,
              }}
            >
              LET'S BEGIN <span className="accent-text">SOMETHING CREATIVE</span>
            </h2>
            <p style={{ color: "var(--text-dim)", fontSize: "1.02rem", maxWidth: 520, margin: "0 auto 30px" }}>
              Have questions about our student programs? Contact our team to learn more.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" onClick={onRegisterClick} className="btn btn-primary" style={{ padding: "15px 30px" }}>
                <span>Register Now</span>
                <ArrowRight size={17} />
              </button>
              <a href="tel:+919791070214" className="btn btn-secondary" style={{ padding: "15px 28px" }}>
                <Phone size={16} />
                <span>+91 97910 70214</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#060608",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "70px 0 30px",
          color: "var(--text-dim)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 44,
              marginBottom: 54,
            }}
          >
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 9,
                    backgroundColor: "rgba(255, 51, 75,0.12)",
                    border: "1px solid rgba(255, 51, 75,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://www.i5vfxstudio.com/assets/i5logo-lTIxL0TM.png"
                    alt="i5 VFX Studio logo"
                    style={{ width: 28, height: 28, objectFit: "contain" }}
                    onError={(e) => {
                      e.currentTarget.outerHTML =
                        '<span style="font-family:var(--font-heading);font-weight:900;color:var(--red)">i5</span>';
                    }}
                  />
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 800,
                      fontSize: "1.08rem",
                      color: "#fff",
                      letterSpacing: "0.02em",
                      display: "block",
                    }}
                  >
                    i5 VFX <span style={{ color: "var(--red)" }}>STUDIO</span>
                  </span>
                  <span
                    style={{
                      fontSize: "0.64rem",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Learn · Create · Elevate
                  </span>
                </div>
              </div>

              <p style={{ fontSize: "0.88rem", lineHeight: 1.65, marginBottom: 20 }}>
                Empowering school students and young creators with industry-level visual effects,
                3D animation, AI video tools, and digital media production in Chennai.
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <Social href="https://www.instagram.com/i5_vfx_studio" label="Instagram" icon={<Instagram size={17} />} />
                <Social href="https://www.youtube.com/@i5VfxStudio" label="YouTube" icon={<Youtube size={17} />} />
                <Social href="https://www.facebook.com/people/i5-Vfx-Studio/61566596788211/" label="Facebook" icon={<Facebook size={17} />} />
                <Social href="https://www.linkedin.com/showcase/i5vfx-studio/" label="LinkedIn" icon={<Linkedin size={17} />} />
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 style={footerHeadingStyle}>Explore</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Home", "home"],
                  ["Programs & Fees", "programs"],
                  ["Why i5 VFX", "why-us"],
                  ["Learning Experience", "experience"],
                  ["Gallery", "gallery"],
                  ["FAQ", "faq"],
                  ["Registration", "registration"],
                ].map(([label, id]) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(id);
                      }}
                      style={footerLinkStyle}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={footerHeadingStyle}>Studio Contact</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 13, fontSize: "0.88rem" }}>
                <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <MapPin size={17} color="var(--red)" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span>
                    11/05, Rangarajulu Street, Ayyavoo Colony, Aminjikarai, Chennai – 600 029
                  </span>
                </div>
                <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                  <Phone size={17} color="var(--red)" style={{ flexShrink: 0 }} />
                  <a href="tel:+919791070214" style={{ color: "#fff", textDecoration: "none" }}>
                    +91 97910 70214
                  </a>
                </div>
                <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                  <Mail size={17} color="var(--red)" style={{ flexShrink: 0 }} />
                  <a href="mailto:info@i5vfxstudio.com" style={{ color: "#fff", textDecoration: "none" }}>
                    info@i5vfxstudio.com
                  </a>
                </div>
                <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                  <Globe size={17} color="var(--red)" style={{ flexShrink: 0 }} />
                  <a
                    href="https://www.i5vfxstudio.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    www.i5vfxstudio.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Legal bar */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            <div>© 2026 i5 VFX Studio. All Rights Reserved.</div>
            <div style={{ display: "flex", gap: 20 }}>
              <button type="button" onClick={() => openLegal("privacy")} style={legalBtnStyle}>
                Privacy Policy
              </button>
              <button type="button" onClick={() => openLegal("terms")} style={legalBtnStyle}>
                Terms &amp; Conditions
              </button>
            </div>
          </div>
        </div>

        {/* Legal modal */}
        {legal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={legal.title}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 3600,
              backgroundColor: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onClick={() => setLegal(null)}
          >
            <div
              style={{
                backgroundColor: "#16161e",
                color: "#fff",
                padding: 32,
                borderRadius: 16,
                maxWidth: 540,
                width: "100%",
                border: "1px solid rgba(255,255,255,0.12)",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{legal.title}</h3>
                <button
                  type="button"
                  onClick={() => setLegal(null)}
                  aria-label="Close"
                  style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-dim)", lineHeight: 1.65, whiteSpace: "pre-line" }}>
                {legal.content}
              </p>
            </div>
          </div>
        )}
      </footer>
    </>
  );
}

function Social({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: "rgba(255, 51, 75,0.12)",
        border: "1px solid rgba(255, 51, 75,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--red)",
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--red)";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255, 51, 75,0.12)";
        e.currentTarget.style.color = "var(--red)";
      }}
    >
      {icon}
    </a>
  );
}

const footerHeadingStyle = {
  fontFamily: "var(--font-heading)",
  fontSize: "0.95rem",
  fontWeight: 700,
  color: "#fff",
  marginBottom: 16,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const footerLinkStyle = {
  color: "var(--text-dim)",
  textDecoration: "none",
  fontSize: "0.88rem",
  transition: "color 0.2s ease",
};

const legalBtnStyle = {
  background: "none",
  border: "none",
  color: "var(--text-muted)",
  cursor: "pointer",
  fontSize: "0.8rem",
  padding: 0,
};
