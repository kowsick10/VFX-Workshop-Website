import http from "http";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

http.createServer(app).listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`i5 VFX Studio server running on http://localhost:${PORT}`);
  console.log(`Razorpay: ${Boolean(process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes("YOUR_KEY_ID_HERE")) ? "configured (live/test keys active)" : "NOT configured (sandbox/demo mode)"}`);
  console.log(`Microsoft Form webhook: ${Boolean(process.env.MICROSOFT_FORM_WEBHOOK_URL && !process.env.MICROSOFT_FORM_WEBHOOK_URL.includes("YOUR_WEBHOOK_URL_HERE")) ? "configured" : "pending (paste URL in .env)"}`);
  console.log(`====================================================`);
});
