import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Vercel serverless catch-all for SPA routes (anything that is not /api/*).
 * Static assets are served directly from the CDN via vercel.json; this only
 * receives navigation requests, and returns the built index.html.
 */
export default function handler(req, res) {
  res
    .status(200)
    .sendFile(path.join(__dirname, "../dist/index.html"), (err) => {
      if (err) {
        res.status(404).send("Client build not found. Run `npm run build` first.");
      }
    });
}
