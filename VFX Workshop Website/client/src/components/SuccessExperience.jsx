import React, { useState, useMemo } from "react";
import { Home, PhoneCall, Check } from "lucide-react";

const CONFETTI_COLORS = ["#e01e26", "#ffb199", "#ffd166", "#8ecae6", "#f4a7c3"];

/**
 * Inline payment confirmation — replaces the registration view content.
 * Rendered inside the registration section, on the same landing page.
 */
export default function SuccessExperience({ registration }) {
  const [confettiOn, setConfettiOn] = useState(true);

  // Hooks must run before any early return.
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: 8 + Math.random() * 84,
        delay: Math.random() * 0.9,
        duration: 1.6 + Math.random() * 1.2,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 6,
      })),
    []
  );

  if (!registration) return null;

  const pending = registration.status && registration.status !== "PAID";

  return (
    <section id="registration" className="section" style={{ backgroundColor: "var(--bg-dark)" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            backgroundColor: "#ffffff",
            color: "#1a1a24",
            borderRadius: 22,
            padding: "clamp(28px, 5vw, 52px)",
            boxShadow: "0 25px 70px -15px rgba(0,0,0,0.7)",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          {/* Restrained confetti */}
          {confettiOn && !pending && (
            <div aria-hidden="true" style={{ position: "absolute", top: 40, left: 0, right: 0, height: 0, pointerEvents: "none" }}>
              {pieces.map((p) => (
                <span
                  key={p.id}
                  className="confetti-piece"
                  style={{
                    position: "absolute",
                    left: `${p.left}%`,
                    width: p.size,
                    height: p.size * 0.6,
                    borderRadius: 2,
                    backgroundColor: p.color,
                    animation: `confettiFall ${p.duration}s var(--ease-out) ${p.delay}s both`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Animated checkmark */}
          <div
            style={{
              width: 92,
              height: 92,
              margin: "0 auto 22px",
              borderRadius: "50%",
              background: pending ? "#fff7e6" : "#e8f9ee",
              border: `2.5px solid ${pending ? "#f59e0b" : "#22c55e"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "ringPop 0.55s var(--ease-out) both",
            }}
          >
            {pending ? (
              <span style={{ fontSize: "2rem", color: "#d97706", fontWeight: 900 }}>…</span>
            ) : (
              <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
                <path
                  d="M10 23 L19 32 L34 13"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="42"
                  strokeDashoffset="42"
                  style={{ animation: "drawCheck 0.55s var(--ease-out) 0.3s forwards" }}
                />
              </svg>
            )}
          </div>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.5rem, 3.4vw, 2rem)",
              fontWeight: 900,
              color: "#111827",
              marginBottom: 10,
            }}
          >
            {pending ? "PAYMENT PROCESSING" : "YOU'RE OFFICIALLY REGISTERED!"}
          </h2>

          <p style={{ color: "#4b5563", fontSize: "0.96rem", lineHeight: 1.6, maxWidth: 460, margin: "0 auto 30px" }}>
            {pending
              ? "Your payment is being verified. This page will show your confirmation shortly — you can also contact the studio with your Registration ID below."
              : "Thank you for choosing i5 VFX Studio. Your child's registration has been successfully completed."}
          </p>

          {/* Receipt card */}
          <div
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              padding: 24,
              textAlign: "left",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: 14,
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: "0.72rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.1em" }}>
                  Registration ID
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--red)" }}>
                  {registration.id}
                </div>
              </div>
              <span
                style={{
                  backgroundColor: pending ? "#fef3c7" : "#dcfce7",
                  color: pending ? "#92400e" : "#15803d",
                  padding: "6px 14px",
                  borderRadius: 100,
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Check size={13} /> {pending ? "PAYMENT PENDING" : "PAID & VERIFIED"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, fontSize: "0.88rem" }}>
              <Row k="Student Name" v={registration.studentName} />
              <Row k="Grade / School" v={`${registration.grade || ""}${registration.schoolName ? ` (${registration.schoolName})` : ""}`} />
              <Row k="Selected Program" v={registration.courseTitle} />
              <Row k="Learning Format" v={registration.learningFormat} />
              <Row k="Amount" v={`₹${Number(registration.amount || 0).toLocaleString("en-IN")}`} />
              <Row
                k="Transaction ID"
                v={registration.razorpayPaymentId || "Verified Razorpay reference"}
                mono
              />
            </div>
          </div>

          {/* Next steps — only verified information */}
          <div
            style={{
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 12,
              padding: "16px 18px",
              marginBottom: 28,
              textAlign: "left",
            }}
          >
            <div style={{ color: "#1e40af", fontWeight: 800, fontSize: "0.86rem", marginBottom: 6 }}>
              What happens next
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#1e3a8a", fontSize: "0.84rem", lineHeight: 1.7 }}>
              {registration.parentMobile && (
                <li>
                  Our studio coordinator will contact <strong>{registration.parentMobile}</strong> to
                  confirm batch timing and orientation.
                </li>
              )}
              <li>
                Questions? Reach us at <strong>info@i5vfxstudio.com</strong> or{" "}
                <strong>+91 97910 70214</strong>.
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => {
                setConfettiOn(false);
                window.location.hash = "";
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.location.reload();
              }}
              className="btn btn-primary"
              style={{ padding: "12px 26px" }}
            >
              <Home size={16} />
              <span>Return to Home</span>
            </button>
            <a
              href="tel:+919791070214"
              className="btn btn-secondary"
              style={{ borderColor: "#cfcfdd", color: "#1a1a24", padding: "12px 26px" }}
            >
              <PhoneCall size={16} />
              <span>Contact the Studio</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, mono }) {
  return (
    <div>
      <span style={{ color: "#6b7280", display: "block", fontSize: "0.76rem" }}>{k}:</span>
      <strong
        style={{
          color: "#111827",
          fontFamily: mono ? "monospace" : undefined,
          fontSize: mono ? "0.8rem" : undefined,
          wordBreak: mono ? "break-all" : undefined,
        }}
      >
        {v || "—"}
      </strong>
    </div>
  );
}
