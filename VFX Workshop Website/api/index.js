import app from "../server/app.js";

/**
 * Vercel serverless entry point. Vercel's helper converts the incoming
 * request into a Node-style req/res pair that Express understands, so the
 * same app (including raw-body webhook parsing) runs unchanged.
 */
export default app;
