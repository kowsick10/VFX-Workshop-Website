import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  saveRegistration,
  getRegistrationById,
  updateRegistrationStatus,
  generateRegistrationId,
} from "../storage/db.js";
import { forwardToMicrosoftForm } from "../integrations/microsoftForm.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Helper to load courses
async function getCourses() {
  const filePath = path.join(__dirname, "../data/courses.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

// Check if Razorpay keys are configured
function isRazorpayConfigured() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(
    keyId &&
    keySecret &&
    !keyId.includes("YOUR_KEY_ID_HERE") &&
    !keySecret.includes("YOUR_RAZORPAY_SECRET_KEY_HERE")
  );
}

// Helper to initialize Razorpay instance if configured
function getRazorpayInstance() {
  if (!isRazorpayConfigured()) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Constant-time string comparison so signature checks cannot be timed out.
function safeCompareEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value, maxLength = 200) {
  if (value === undefined || value === null) return "";
  return String(value).trim().slice(0, maxLength);
}

function isValidMobile(value) {
  // Accepts "+91 9840123456" and similar; requires 10-15 total digits.
  return /^\+?[\d\s-]{10,20}$/.test(value) && (value.replace(/\D/g, "").length >= 10);
}

// 1. GET /api/courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await getCourses();
    res.json({
      success: true,
      courses,
      razorpayConfigured: isRazorpayConfigured(),
      razorpayKeyId: isRazorpayConfigured() ? process.env.RAZORPAY_KEY_ID : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to load courses" });
  }
});

// 2. POST /api/create-order
router.post("/create-order", async (req, res) => {
  try {
    const body = req.body ?? {};

    const studentName = cleanString(body.studentName);
    const studentEmail = cleanString(body.studentEmail);
    const studentMobile = cleanString(body.studentMobile);
    const grade = cleanString(body.grade, 40);
    const schoolName = cleanString(body.schoolName);
    const schoolBoard = cleanString(body.schoolBoard, 60);
    const parentName = cleanString(body.parentName);
    const parentMobile = cleanString(body.parentMobile);
    const parentEmail = cleanString(body.parentEmail);
    const relationship = cleanString(body.relationship, 40);
    const courseId = cleanString(body.courseId, 60);
    const learningFormat = cleanString(body.learningFormat, 60);
    const preferredSchedule = cleanString(body.preferredSchedule, 60);
    const preferredStartDate = cleanString(body.preferredStartDate, 20);
    const previousExperience = cleanString(body.previousExperience, 60);
    const additionalQuestions = cleanString(body.additionalQuestions, 1000);
    const guardianConsent = body.guardianConsent === true;
    const marketingConsent = body.marketingConsent === true;

    // Field Validations
    if (!studentName || !studentMobile || !grade || !schoolName || !schoolBoard) {
      return res.status(400).json({ success: false, error: "Missing required student information." });
    }
    if (!isValidMobile(studentMobile)) {
      return res.status(400).json({ success: false, error: "Please provide a valid student mobile number." });
    }
    if (studentEmail && !EMAIL_RE.test(studentEmail)) {
      return res.status(400).json({ success: false, error: "Please provide a valid student email address." });
    }
    if (!parentName || !parentMobile || !parentEmail || !relationship) {
      return res.status(400).json({ success: false, error: "Missing required parent/guardian information." });
    }
    if (!isValidMobile(parentMobile)) {
      return res.status(400).json({ success: false, error: "Please provide a valid parent mobile number." });
    }
    if (!EMAIL_RE.test(parentEmail)) {
      return res.status(400).json({ success: false, error: "Please provide a valid parent email address." });
    }
    if (!guardianConsent) {
      return res.status(400).json({ success: false, error: "Parent or guardian consent is mandatory." });
    }

    const courses = await getCourses();
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      return res.status(400).json({ success: false, error: "Invalid course selected." });
    }

    // Generate Unique Registration ID (e.g. I5-2026-948123)
    const registrationId = await generateRegistrationId();
    const amountInPaise = course.fee * 100;
    const razorpay = getRazorpayInstance();

    let razorpayOrderId = "";
    let isDemoMode = false;

    if (razorpay) {
      // Create actual Razorpay Order
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: registrationId,
        notes: {
          registrationId,
          studentName,
          parentMobile,
          courseTitle: course.title,
        },
      });
      razorpayOrderId = rzpOrder.id;
    } else {
      // Sandbox / Test Mode fallback when keys are waiting to be configured
      isDemoMode = true;
      razorpayOrderId = `order_demo_${Date.now()}`;
    }

    const registrationRecord = {
      id: registrationId,
      studentName,
      studentEmail,
      studentMobile,
      grade,
      schoolName,
      schoolBoard,
      parentName,
      parentMobile,
      parentEmail,
      relationship,
      courseId: course.id,
      courseTitle: course.title,
      amount: course.fee,
      currency: "INR",
      learningFormat: learningFormat || "Offline / In-person",
      preferredSchedule: preferredSchedule || "Weekend Batches",
      preferredStartDate,
      previousExperience: previousExperience || "Beginner",
      additionalQuestions,
      guardianConsent: true,
      marketingConsent,
      razorpayOrderId,
      razorpayPaymentId: "",
      status: "PENDING_PAYMENT",
      isDemoMode,
    };

    await saveRegistration(registrationRecord);

    res.json({
      success: true,
      registrationId,
      orderId: razorpayOrderId,
      amount: course.fee,
      amountPaise: amountInPaise,
      currency: "INR",
      courseTitle: course.title,
      keyId: isRazorpayConfigured() ? process.env.RAZORPAY_KEY_ID : "rzp_test_placeholder",
      isDemoMode,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to create registration order." });
  }
});

// 3. POST /api/verify-payment
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      registrationId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body ?? {};

    if (!registrationId) {
      return res.status(400).json({ success: false, error: "Registration ID is required." });
    }

    const record = await getRegistrationById(registrationId);
    if (!record) {
      return res.status(404).json({ success: false, error: "Registration not found." });
    }

    // Idempotent: a webhook may already have settled this order.
    if (record.status === "PAID") {
      return res.json({
        success: true,
        message: "Payment already verified and registration confirmed.",
        registration: record,
      });
    }

    // Demo mode is read from the STORED record, never from the request body.
    // Trusting the client here let anyone mark an arbitrary paid registration
    // as confirmed without ever paying.
    if (!record.isDemoMode) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, error: "Incomplete payment verification payload." });
      }

      // The order must be the one we issued for THIS registration, otherwise a
      // valid payment for a cheap/different order could confirm a costly one.
      if (!safeCompareEqual(razorpay_order_id, record.razorpayOrderId)) {
        await updateRegistrationStatus(record.id, "PAYMENT_FAILED", {
          failureReason: "Order ID does not match the stored registration",
        });
        return res.status(400).json({ success: false, error: "Payment does not match this registration." });
      }

      // Real cryptographic verification
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        return res.status(500).json({ success: false, error: "Payment verification is not configured." });
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex");

      if (!safeCompareEqual(expectedSignature, razorpay_signature)) {
        await updateRegistrationStatus(record.id, "PAYMENT_FAILED", {
          failureReason: "Signature verification failed",
        });
        return res.status(400).json({ success: false, error: "Payment verification failed. Invalid signature." });
      }
    }

    // Mark as PAID
    const paymentId = razorpay_payment_id || `pay_sim_${Date.now()}`;
    const updatedRecord = await updateRegistrationStatus(record.id, "PAID", {
      razorpayPaymentId: paymentId,
      razorpaySignature: razorpay_signature || "verified",
    });

    // Forward to Microsoft Form / Power Automate in background
    if (updatedRecord) {
      forwardToMicrosoftForm(updatedRecord).catch((err) =>
        console.error("[MS Form Integration Error]", err)
      );
    }

    res.json({
      success: true,
      message: "Payment successfully verified and registration confirmed.",
      registration: updatedRecord,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, error: "Payment verification failed." });
  }
});

// 4. POST /api/payment-cancelled
router.post("/payment-cancelled", async (req, res) => {
  try {
    const { registrationId, reason } = req.body;
    if (registrationId) {
      await updateRegistrationStatus(registrationId, "PAYMENT_CANCELLED", {
        failureReason: reason || "User dismissed Razorpay checkout window",
      });
    }
    res.json({ success: true, message: "Registration kept in cancelled/retryable state." });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to record payment cancellation." });
  }
});

// 5. POST /api/webhook/razorpay
router.post("/webhook/razorpay", async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // This route is mounted with express.raw(), so req.body is a Buffer and
    // req.body.event is always undefined. Parse it explicitly; fall back to a
    // re-serialized object only if a proxy already consumed the stream.
    let rawBody;
    let event;
    if (Buffer.isBuffer(req.body)) {
      rawBody = req.body;
      try {
        event = JSON.parse(rawBody.toString("utf-8"));
      } catch {
        return res.status(400).json({ error: "Malformed webhook payload" });
      }
    } else {
      event = req.body ?? {};
      rawBody = Buffer.from(JSON.stringify(event));
    }

    if (webhookSecret && !webhookSecret.includes("YOUR_WEBHOOK_SECRET_HERE")) {
      if (!signature) {
        return res.status(400).json({ error: "Missing webhook signature" });
      }
      const shasum = crypto.createHmac("sha256", webhookSecret);
      shasum.update(rawBody);
      const digest = shasum.digest("hex");

      if (!safeCompareEqual(digest, signature)) {
        return res.status(400).json({ error: "Invalid webhook signature" });
      }
    }

    const eventName = event?.event;
    if (eventName === "payment.captured" || eventName === "order.paid") {
      const paymentEntity = event?.payload?.payment?.entity;
      if (!paymentEntity) {
        return res.status(400).json({ error: "Webhook payload missing payment entity" });
      }
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      const record = await getRegistrationById(orderId);
      if (record && record.status !== "PAID") {
        const updated = await updateRegistrationStatus(record.id, "PAID", {
          razorpayPaymentId: paymentId,
        });
        if (updated) {
          forwardToMicrosoftForm(updated).catch((err) =>
            console.error("[MS Form Integration Error]", err)
          );
        }
      }
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Webhook error" });
  }
});

// 6. GET /api/registration/:id
// Returns only what the receipt screen needs. This endpoint is public, so it
// must never expose a minor's or parent's contact details to anyone who can
// guess or enumerate an ID.
router.get("/registration/:id", async (req, res) => {
  try {
    const record = await getRegistrationById(cleanString(req.params.id, 60));
    if (!record) {
      return res.status(404).json({ success: false, error: "Registration not found." });
    }

    const {
      studentEmail,
      studentMobile,
      parentMobile,
      parentEmail,
      parentName,
      schoolName,
      schoolBoard,
      additionalQuestions,
      razorpaySignature,
      marketingConsent,
      ...safeData
    } = record;

    res.json({ success: true, registration: safeData });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to retrieve registration." });
  }
});

export default router;
