import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Only allow the configured origins (plus same-origin/proxied dev requests).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Middleware
// NOTE: Razorpay webhooks must be verified against the RAW request body,
// so we parse that route before express.json() touches it.
app.use("/api/webhook/razorpay", express.raw({ type: "*/*" }));
app.use(
  cors({
    origin(origin, callback) {
      // Same-origin, curl, and server-to-server calls have no Origin header.
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.length === 0) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "100kb" }));

// Lightweight in-memory throttle to keep the order endpoint from being
// spammed and the webhook from being flooded.
const hits = new Map();
function rateLimit({ windowMs, max }) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= max) {
      return res.status(429).json({ success: false, error: "Too many requests. Please try again shortly." });
    }
    entry.count += 1;
    return next();
  };
}

const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key);
  }
}, 60_000);
cleanup.unref();

// Limits are configurable so a busy launch day or a different proxy setup can
// be tuned without a code change.
const ORDER_LIMIT_MAX = Number(process.env.ORDER_RATE_LIMIT_MAX || 10);
const WEBHOOK_LIMIT_MAX = Number(process.env.WEBHOOK_RATE_LIMIT_MAX || 120);

app.use("/api/create-order", rateLimit({ windowMs: 60_000, max: ORDER_LIMIT_MAX }));
app.use("/api/webhook/razorpay", rateLimit({ windowMs: 60_000, max: WEBHOOK_LIMIT_MAX }));

// API Routes
app.use("/api", apiRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    studio: "i5 VFX Studio",
    time: new Date().toISOString(),
  });
});

// Serve frontend static assets in production.
// On Vercel the static client is served from the CDN instead, and
// server/static.js exports a catch-all handler used as the SPA fallback.
if (process.env.VERCEL !== "1") {
  const clientDistPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDistPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
      if (err) {
        res
          .status(200)
          .send("i5 VFX Studio API is running. Build the frontend client to view the full landing page.");
      }
    });
  });
}

// Unknown API routes must return JSON, not the SPA shell.
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

export default app;
