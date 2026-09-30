import React, { useState, useEffect, useRef } from "react";
import {
  User,
  GraduationCap,
  BookOpen,
  CreditCard,
  Lock,
  AlertCircle,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { COURSES } from "../data/courses";
import { openRazorpayCheckout } from "../utils/razorpay";
import { Reveal } from "../utils/motion";

const STEP_LABELS = ["Student", "Parent / Guardian", "Program & Pay"];

const initialForm = {
  studentName: "",
  studentEmail: "",
  countryCode: "+91",
  studentMobile: "",
  grade: "",
  schoolName: "",
  schoolBoard: "",
  parentName: "",
  parentMobile: "",
  parentEmail: "",
  relationship: "Parent",
  courseId: COURSES[0]?.id || "",
  learningFormat: "Offline / In-person",
  preferredSchedule: "Weekends",
  preferredStartDate: "",
  previousExperience: "Beginner",
  additionalQuestions: "",
  guardianConsent: false,
  marketingConsent: false,
};

export default function RegistrationForm({ selectedCourseId, onRegistrationSuccess }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState(""); // "" | "creating" | "paying"
  const [serverError, setServerError] = useState("");
  const [demoOrderData, setDemoOrderData] = useState(null);
  const [pendingRetry, setPendingRetry] = useState(null); // { registrationId, orderData }
  const cardRef = useRef(null);

  // External program selection syncs into the form
  useEffect(() => {
    if (selectedCourseId) {
      setFormData((prev) => ({ ...prev, courseId: selectedCourseId }));
    }
  }, [selectedCourseId]);

  const selectedCourse = COURSES.find((c) => c.id === formData.courseId) || COURSES[0];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validateStep = (idx) => {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digits = (s) => s.replace(/\D/g, "");

    if (idx === 0) {
      if (!formData.studentName.trim()) e.studentName = "Student's full name is required";
      if (formData.studentEmail && !emailRe.test(formData.studentEmail))
        e.studentEmail = "Please enter a valid email address";
      if (!formData.studentMobile.trim()) e.studentMobile = "Student's contact number is required";
      else if (!/^\d{10}$/.test(digits(formData.studentMobile)))
        e.studentMobile = "Enter a valid 10-digit mobile number";
      if (!formData.grade) e.grade = "Please select the current grade / class";
      if (!formData.schoolName.trim()) e.schoolName = "School name is required";
      if (!formData.schoolBoard) e.schoolBoard = "Please select the school board";
    }

    if (idx === 1) {
      if (!formData.parentName.trim()) e.parentName = "Parent / guardian full name is required";
      if (!formData.parentMobile.trim()) e.parentMobile = "Parent's contact number is required";
      else if (!/^\d{10}$/.test(digits(formData.parentMobile)))
        e.parentMobile = "Enter a valid 10-digit mobile number";
      if (!formData.parentEmail.trim()) e.parentEmail = "Parent's email address is required";
      else if (!emailRe.test(formData.parentEmail)) e.parentEmail = "Enter a valid email address";
      if (!formData.relationship) e.relationship = "Please select relationship";
    }

    if (idx === 2) {
      if (!formData.courseId) e.courseId = "Please select a program";
      if (!formData.guardianConsent)
        e.guardianConsent = "Parent/guardian consent is required to register";
    }

    return e;
  };

  const focusFirstError = (errs) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    window.setTimeout(() => {
      const el = cardRef.current?.querySelector(`[name="${first}"]`);
      if (el) {
        el.focus({ preventScroll: true });
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 80);
  };

  const goNext = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const goBackTo = (i) => {
    setErrors({});
    setStep(i);
  };

  const buildPayload = () => ({
    ...formData,
    studentMobile: `${formData.countryCode} ${formData.studentMobile}`,
    parentMobile: `${formData.countryCode} ${formData.parentMobile}`,
  });

  const startPayment = async (retryOrder = null) => {
    setServerError("");
    setIsSubmitting(true);
    setSubmitPhase("creating");

    try {
      let orderData = retryOrder;

      if (!orderData) {
        const response = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        });
        orderData = await response.json();
        if (!response.ok || !orderData.success) {
          throw new Error(orderData.error || "Failed to initialize registration order.");
        }
      }

      setPendingRetry({ registrationId: orderData.registrationId, orderData });

      // Sandbox mode — no real Razorpay keys configured yet
      if (orderData.isDemoMode) {
        setDemoOrderData(orderData);
        setIsSubmitting(false);
        setSubmitPhase("");
        return;
      }

      setSubmitPhase("paying");
      await openRazorpayCheckout({
        orderData,
        formData,
        onSuccess: (reg) => {
          setIsSubmitting(false);
          setSubmitPhase("");
          setPendingRetry(null);
          onRegistrationSuccess(reg);
        },
        onDismiss: () => {
          // Registration is preserved; user can retry without a new record
          setIsSubmitting(false);
          setSubmitPhase("");
          setServerError(
            "Payment window was closed. Your registration details are safe — use “Complete Payment” below whenever you're ready."
          );
        },
        onError: (errMsg) => {
          setIsSubmitting(false);
          setSubmitPhase("");
          setServerError(errMsg);
        },
      });
    } catch (err) {
      setIsSubmitting(false);
      setSubmitPhase("");
      setServerError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleSimulatePayment = async () => {
    if (!demoOrderData) return;
    setIsSubmitting(true);
    setSubmitPhase("creating");
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: demoOrderData.registrationId,
          razorpay_order_id: demoOrderData.orderId,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: "sandbox_verified",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDemoOrderData(null);
        setPendingRetry(null);
        onRegistrationSuccess(data.registration);
      } else {
        setServerError(data.error || "Simulation failed");
      }
    } catch {
      setServerError("Failed to complete test payment verification");
    } finally {
      setIsSubmitting(false);
      setSubmitPhase("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateStep(2);
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }
    startPayment();
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <section id="registration" className="section" style={{ backgroundColor: "var(--bg-dark)" }}>
      <div className="bg-glow" style={{ top: "10%", right: -260, opacity: 0.22 }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal className="section-header center">
          <div className="kicker">
            <CreditCard size={13} />
            <span>Direct Razorpay Enrollment</span>
          </div>
          <h2 className="section-title">
            Your Child's Creative Journey <span className="accent-text">Starts Here</span>
          </h2>
          <p className="section-subtitle">
            Take the first step. Complete the registration details below and choose a program that
            matches your child's interests.
          </p>
        </Reveal>

        <Reveal delay={100}>
        <div className="gradient-ring" style={{ maxWidth: 886, margin: "0 auto" }}>
          <div className="form-card" ref={cardRef} style={{ maxWidth: "none", margin: 0, borderRadius: 22 }}>
            {/* Secure banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
                padding: "12px 18px",
                backgroundColor: "#f7f7fc",
                borderRadius: 12,
                border: "1px solid #ebebf5",
                marginBottom: 28,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShieldCheck size={18} color="var(--red)" />
                <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "#2d2d3a" }}>
                  100% Encrypted &amp; Secure Razorpay Checkout
                </span>
              </div>
              <div style={{ fontSize: "0.76rem", color: "#6e6e82", fontWeight: 500 }}>
                UPI · Cards · NetBanking · Wallets
              </div>
            </div>

            {serverError && (
              <div
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "14px 18px",
                  backgroundColor: "#fff0f1",
                  border: "1px solid #ffccd0",
                  borderRadius: 10,
                  color: "#c4151c",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  marginBottom: 24,
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>{serverError}</div>
              </div>
            )}

            {/* Sandbox panel */}
            {demoOrderData && (
              <div
                style={{
                  padding: 22,
                  backgroundColor: "#fdf8e2",
                  border: "2px dashed #d97706",
                  borderRadius: 14,
                  marginBottom: 26,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#92400e",
                    fontWeight: 800,
                    fontSize: "1rem",
                    marginBottom: 8,
                  }}
                >
                  <AlertCircle size={18} />
                  <span>Sandbox / Test Mode Active</span>
                </div>
                <p style={{ color: "#78350f", fontSize: "0.86rem", lineHeight: 1.55, marginBottom: 16 }}>
                  Razorpay keys aren't configured yet, so registration runs in simulation mode. Paste your
                  official keys into <code>.env</code> to go live. Test the confirmation flow below:
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ padding: "10px 20px", fontSize: "0.88rem" }}
                  >
                    {isSubmitting ? "Verifying…" : `Simulate Successful Payment (₹${demoOrderData.amount.toLocaleString("en-IN")})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoOrderData(null)}
                    className="btn btn-ghost-dark"
                    style={{ padding: "10px 18px", fontSize: "0.88rem" }}
                  >
                    Cancel / Edit Form
                  </button>
                </div>
              </div>
            )}

            {/* Retry payment banner */}
            {pendingRetry && !demoOrderData && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  padding: "14px 18px",
                  backgroundColor: "#f0f6ff",
                  border: "1px solid #c7dcff",
                  borderRadius: 12,
                  marginBottom: 24,
                }}
              >
                <span style={{ fontSize: "0.86rem", color: "#1e40af", fontWeight: 600 }}>
                  Registration <strong>{pendingRetry.registrationId}</strong> is saved — payment pending.
                </span>
                <button
                  type="button"
                  onClick={() => startPayment(pendingRetry.orderData)}
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ padding: "9px 18px", fontSize: "0.85rem" }}
                >
                  Complete Payment
                </button>
              </div>
            )}

            {/* Progress header */}
            <div className="wizard-progress" role="group" aria-label={`Step ${step + 1} of 3`}>
              {STEP_LABELS.map((label, i) => (
                <React.Fragment key={label}>
                  {i > 0 && (
                    <div className="wizard-bar" aria-hidden="true">
                      <div
                        className="wizard-bar-fill"
                        style={{ width: i <= step ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    className={`wizard-step-dot${i === step ? " current" : ""}${i < step ? " done" : ""}`}
                    onClick={() => {
                      if (i < step) goBackTo(i);
                    }}
                    disabled={i > step}
                    aria-current={i === step ? "step" : undefined}
                    style={{ cursor: i < step ? "pointer" : "default" }}
                  >
                    <span className="dot">
                      {i < step ? <Check size={13} /> : i + 1}
                    </span>
                    <span className="step-name">{label}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="wizard-viewport">
                {/* STEP 1 — Student */}
                <div
                  key="wizard-step-0"
                  className="wizard-slide"
                  style={{ display: step === 0 ? "block" : "none" }}
                  role="group"
                  aria-label="Step 1: Student details"
                >
                  <StepHeading icon={<User size={17} color="var(--red)" />} title="Student Details" />
                  <div className="field-grid">
                    <Field label="Student's Full Name" required error={errors.studentName}>
                      <input
                        className={inputClass(errors.studentName)}
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="Enter student's full name"
                        autoComplete="name"
                      />
                    </Field>

                    <Field label="Student's Email Address" optional error={errors.studentEmail}>
                      <input
                        className={inputClass(errors.studentEmail)}
                        type="email"
                        name="studentEmail"
                        value={formData.studentEmail}
                        onChange={handleInputChange}
                        placeholder="student@gmail.com"
                        autoComplete="email"
                      />
                    </Field>

                    <Field label="Student's Mobile Number" required error={errors.studentMobile}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          className="form-input"
                          style={{ width: 96, padding: "12px 8px", fontWeight: 600 }}
                          aria-label="Country code"
                        >
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+971">🇦🇪 +971</option>
                          <option value="+65">🇸🇬 +65</option>
                        </select>
                        <input
                          className={inputClass(errors.studentMobile)}
                          style={{ flex: 1 }}
                          type="tel"
                          name="studentMobile"
                          value={formData.studentMobile}
                          onChange={handleInputChange}
                          placeholder="98765 43210"
                          autoComplete="tel-national"
                          inputMode="numeric"
                        />
                      </div>
                    </Field>

                    <Field label="Current Grade / Class" required error={errors.grade}>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className={inputClass(errors.grade)}
                      >
                        <option value="">Select Grade / Class</option>
                        {["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                        <option value="Other">Other / College Beginner</option>
                      </select>
                    </Field>

                    <Field label="School Name" required error={errors.schoolName}>
                      <input
                        className={inputClass(errors.schoolName)}
                        type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        placeholder="Enter school name"
                        autoComplete="organization"
                      />
                    </Field>

                    <Field label="School Board" required error={errors.schoolBoard}>
                      <select
                        name="schoolBoard"
                        value={formData.schoolBoard}
                        onChange={handleInputChange}
                        className={inputClass(errors.schoolBoard)}
                      >
                        <option value="">Select School Board</option>
                        {["CBSE", "ICSE", "Tamil Nadu State Board", "Other State Board", "IB / IGCSE", "Other"].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>

                {/* STEP 2 — Parent */}
                <div
                  key="wizard-step-1"
                  className="wizard-slide"
                  style={{ display: step === 1 ? "block" : "none" }}
                  role="group"
                  aria-label="Step 2: Parent / guardian details"
                >
                  <StepHeading icon={<GraduationCap size={17} color="var(--red)" />} title="Parent / Guardian" />
                  <div className="field-grid">
                    <Field label="Parent / Guardian Full Name" required error={errors.parentName}>
                      <input
                        className={inputClass(errors.parentName)}
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        placeholder="Enter parent / guardian full name"
                        autoComplete="name"
                      />
                    </Field>

                    <Field label="Parent / Guardian Mobile" required error={errors.parentMobile}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          className="form-input"
                          style={{ width: 96, padding: "12px 8px", fontWeight: 600 }}
                          aria-label="Country code"
                        >
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+971">🇦🇪 +971</option>
                          <option value="+65">🇸🇬 +65</option>
                        </select>
                        <input
                          className={inputClass(errors.parentMobile)}
                          style={{ flex: 1 }}
                          type="tel"
                          name="parentMobile"
                          value={formData.parentMobile}
                          onChange={handleInputChange}
                          placeholder="98765 43210 (updates & receipt)"
                          autoComplete="tel-national"
                          inputMode="numeric"
                        />
                      </div>
                    </Field>

                    <Field label="Parent / Guardian Email" required error={errors.parentEmail}>
                      <input
                        className={inputClass(errors.parentEmail)}
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        placeholder="parent@company.com"
                        autoComplete="email"
                      />
                    </Field>

                    <Field label="Relationship to Student" required error={errors.relationship}>
                      <select
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleInputChange}
                        className={inputClass(errors.relationship)}
                      >
                        {["Father", "Mother", "Guardian", "Other"].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Preferred Learning Format">
                      <select
                        name="learningFormat"
                        value={formData.learningFormat}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="Offline / In-person">Offline / Studio Floor (Chennai)</option>
                        <option value="Online">Online Interactive Sessions</option>
                        <option value="Either is fine">Either is fine</option>
                      </select>
                    </Field>

                    <Field label="Preferred Schedule">
                      <select
                        name="preferredSchedule"
                        value={formData.preferredSchedule}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="Weekends">Weekends (Saturday &amp; Sunday)</option>
                        <option value="Weekdays">Weekdays (After-school hours)</option>
                        <option value="School holidays">School Holidays / Intensive Camp</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </Field>
                  </div>
                </div>

                {/* STEP 3 — Program & confirmation */}
                <div
                  key="wizard-step-2"
                  className="wizard-slide"
                  style={{ display: step === 2 ? "block" : "none" }}
                  role="group"
                  aria-label="Step 3: Program and confirmation"
                >
                  <StepHeading icon={<BookOpen size={17} color="var(--red)" />} title="Program &amp; Confirmation" />
                  <div className="field-grid">
                    <div style={{ gridColumn: "1 / -1" }}>
                      <Field label="Selected Program" required error={errors.courseId}>
                        <select
                          name="courseId"
                          value={formData.courseId}
                          onChange={handleInputChange}
                          className={inputClass(errors.courseId)}
                          style={{ fontWeight: 700, backgroundColor: "#fcfcff" }}
                        >
                          {COURSES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title} · {c.duration} (₹{c.fee.toLocaleString("en-IN")})
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field label="Previous Experience">
                      <select
                        name="previousExperience"
                        value={formData.previousExperience}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="Beginner">Beginner (No prior media experience)</option>
                        <option value="Some prior experience">Some prior experience (Hobbyist)</option>
                        <option value="Experienced">Experienced (Created videos / art)</option>
                      </select>
                    </Field>

                    <Field label="Preferred Start Date" optional>
                      <input
                        type="date"
                        name="preferredStartDate"
                        value={formData.preferredStartDate}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </Field>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <Field label="Additional Questions or Requirements" optional>
                        <textarea
                          name="additionalQuestions"
                          rows={3}
                          value={formData.additionalQuestions}
                          onChange={handleInputChange}
                          placeholder="Software interests, scheduling requests, anything else?"
                          className="form-input"
                          style={{ resize: "vertical" }}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Consent */}
                  <div
                    style={{
                      backgroundColor: "#f9f9fc",
                      borderRadius: 14,
                      padding: 22,
                      border: "1px solid #e8e8f2",
                      marginTop: 22,
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", fontSize: "0.86rem", color: "#2a2a38", lineHeight: 1.55 }}>
                      <input
                        type="checkbox"
                        name="guardianConsent"
                        checked={formData.guardianConsent}
                        onChange={handleInputChange}
                        style={{ marginTop: 3, width: 18, height: 18, accentColor: "var(--red)", flexShrink: 0 }}
                      />
                      <span>
                        <strong>Mandatory consent:</strong> I confirm I am the student's parent/legal guardian
                        (or have their permission) and agree that i5 VFX Studio may contact me about this
                        registration. <span style={{ color: "var(--red)" }}>*</span>
                      </span>
                    </label>
                    {errors.guardianConsent && (
                      <span className="form-error" style={{ marginLeft: 30, marginTop: 6 }}>
                        {errors.guardianConsent}
                      </span>
                    )}

                    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", fontSize: "0.83rem", color: "#5a5a6c", lineHeight: 1.55, marginTop: 14 }}>
                      <input
                        type="checkbox"
                        name="marketingConsent"
                        checked={formData.marketingConsent}
                        onChange={handleInputChange}
                        style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--red)", flexShrink: 0 }}
                      />
                      <span>
                        (Optional) Send me future workshop announcements and creative-technology news.
                      </span>
                    </label>

                    <p style={{ fontSize: "0.76rem", color: "#7e7e92", borderTop: "1px solid #ebebf5", paddingTop: 12, margin: "14px 0 0" }}>
                      <strong>Privacy:</strong> Your details are used only to process this enrollment,
                      communicate batch details, and deliver receipts. We never sell or share your data
                      with unauthorized third parties.
                    </p>
                  </div>

                  {/* Order summary */}
                  <div
                    style={{
                      marginTop: 22,
                      padding: 20,
                      borderRadius: 14,
                      border: "1.5px solid #ffd9db",
                      background: "linear-gradient(135deg, #fff8f8 0%, #ffffff 70%)",
                    }}
                  >
                    <div style={{ fontSize: "0.74rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>
                      Order Summary
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.88rem", color: "#3a3a4a" }}>
                      <SummaryRow k="Student" v={formData.studentName || "—"} />
                      <SummaryRow k="Program" v={selectedCourse ? selectedCourse.title : "—"} />
                      <SummaryRow k="Duration" v={selectedCourse ? selectedCourse.duration : "—"} />
                      <SummaryRow k="Contact" v={formData.parentMobile ? `${formData.countryCode} ${formData.parentMobile}` : "—"} />
                      <SummaryRow k="Registration fee" v={selectedCourse ? `₹${selectedCourse.fee.toLocaleString("en-IN")}` : "—"} />
                      <SummaryRow k="Platform charges" v="₹0 (included)" />
                      <div style={{ borderTop: "1px solid #f0dfe1", paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontWeight: 800, color: "#1a1a24" }}>Total payable</span>
                        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "1.5rem", color: "#1a1a24" }}>
                          ₹{selectedCourse ? selectedCourse.fee.toLocaleString("en-IN") : "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wizard controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  marginTop: 30,
                  paddingTop: 22,
                  borderTop: "1px solid #f0f0f5",
                }}
              >
                <button
                  type="button"
                  onClick={goBack}
                  className="btn btn-ghost-dark"
                  style={{ visibility: step === 0 ? "hidden" : "visible", padding: "13px 22px" }}
                  disabled={isSubmitting}
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>

                {step < 2 ? (
                  <button type="button" onClick={goNext} className="btn btn-primary" style={{ padding: "13px 26px" }}>
                    <span>Continue</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ padding: "15px 30px", fontSize: "1rem" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                        <span>{submitPhase === "creating" ? "Creating Registration…" : "Opening Secure Checkout…"}</span>
                      </>
                    ) : (
                      <>
                        <Lock size={17} />
                        <span>Register &amp; Pay ₹{selectedCourse ? selectedCourse.fee.toLocaleString("en-IN") : "0"}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        </Reveal>
      </div>

      <style>{`
        .field-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 18px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

function StepHeading({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          backgroundColor: "var(--red-faint)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.12rem", fontWeight: 800, color: "#181822" }}>
        {title}
      </h3>
    </div>
  );
}

function Field({ label, required, optional, error, children }) {
  return (
    <div>
      <span className="form-label" style={{ display: "block" }}>
        {label}{" "}
        {required && <span style={{ color: "var(--red)" }}>*</span>}
        {optional && <span className="form-hint">(Optional)</span>}
      </span>
      {children}
      {error && (
        <span className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

function SummaryRow({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
      <span style={{ color: "#6a6a7c" }}>{k}</span>
      <span style={{ fontWeight: 600, color: "#1a1a24", textAlign: "right" }}>{v}</span>
    </div>
  );
}

function inputClass(hasError) {
  return `form-input${hasError ? " invalid" : ""}`;
}
