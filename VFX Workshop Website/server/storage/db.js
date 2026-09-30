import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "registrations.json");

// Serializes every read-modify-write cycle. Without this, two concurrent
// registrations both read the same array and the second write discards the
// first, silently losing a paid student's record.
let queue = Promise.resolve();

function withLock(fn) {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

async function initDb() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

async function readAll() {
  await initDb();
  const data = await fs.readFile(DB_FILE, "utf-8");
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(all) {
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(all, null, 2), "utf-8");
  await fs.rename(tmp, DB_FILE);
}

export async function getAllRegistrations() {
  return withLock(readAll);
}

export async function getRegistrationById(id) {
  const all = await readAll();
  return all.find((r) => r.id === id || r.razorpayOrderId === id) || null;
}

/**
 * Builds a collision-resistant registration ID and confirms it is unused
 * before returning. A 5-digit Math.random() suffix collided under load and
 * silently overwrote existing records.
 */
export async function generateRegistrationId() {
  const year = new Date().getFullYear();
  const prefix = `I5-${year}-`;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const suffix = crypto.randomInt(10000, 1000000);
    const id = `${prefix}${suffix}`;
    const all = await readAll();
    if (!all.some((r) => r.id === id)) return id;
  }

  return `${prefix}${Date.now()}${crypto.randomInt(100, 999)}`;
}

export async function saveRegistration(record) {
  return withLock(async () => {
    const all = await readAll();
    const existingIdx = all.findIndex((r) => r.id === record.id);
    const now = new Date().toISOString();

    if (existingIdx >= 0) {
      all[existingIdx] = { ...all[existingIdx], ...record, updatedAt: now };
    } else {
      all.push({ ...record, createdAt: now, updatedAt: now });
    }

    await writeAll(all);
    return record;
  });
}

export async function updateRegistrationStatus(id, status, paymentDetails = {}) {
  return withLock(async () => {
    const all = await readAll();
    const record = all.find((r) => r.id === id || r.razorpayOrderId === id);
    if (!record) return null;

    record.status = status;
    if (paymentDetails.razorpayPaymentId) {
      record.razorpayPaymentId = paymentDetails.razorpayPaymentId;
    }
    if (paymentDetails.razorpaySignature) {
      record.razorpaySignature = paymentDetails.razorpaySignature;
    }
    if (paymentDetails.failureReason) {
      record.failureReason = paymentDetails.failureReason;
    }
    record.updatedAt = new Date().toISOString();

    await writeAll(all);
    return record;
  });
}
