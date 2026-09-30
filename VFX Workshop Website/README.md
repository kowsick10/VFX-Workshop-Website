<<<<<<< HEAD
# i5 VFX Studio - Single-Page Student Registration & Razorpay Landing Page

A complete, modern, responsive, single-page student registration landing page for **i5 VFX Studio (Chennai)**, built with verified branding from [https://www.i5vfxstudio.com](https://www.i5vfxstudio.com).

---

## ? Features

- **Studio Visual Identity & Branding**:
  - Official i5 VFX Studio logo, Chennai address, and contact numbers.
  - Studio color palette: Deep black (`#08080a`), signature red (`#e01e26`), and soft ambient lighting.
  - Sticky navigation header with smooth scrolling to sections (`#home`, `#courses`, `#why-us`, `#steps`, `#registration`, `#contact`).
  
- **Hero Section**:
  - **"UNLOCK YOUR CHILD'S CREATIVE POTENTIAL"**
  - "Explore Courses" and "Register Now" dual CTAs.
  - Real studio metrics: 1,000+ Students Trained, 100% Hands-on, Razorpay Encrypted.

- **Verified Course Programs & Auto-Selection**:
  - 7 verified programs from the studio:
    1. *AI Video Creation* (30 Days)
    2. *2D & 3D Animation* (30 Days)
    3. *Video Editing & Post-Production* (30 Days)
    4. *Cinematography & Camera Arts* (30 Days)
    5. *Photography & Digital Arts* (30 Days)
    6. *Videography & YouTube Creation* (30 Days)
    7. *AI Digital Marketing for Creators* (30 Days)
  - Clicking **Select This Course** automatically pre-selects that course in the form and smoothly scrolls directly to the registration section.

- **16-Field Student Registration Form (Modern White Card)**:
  - High-contrast, mobile-optimized white card with comfortable padding.
  - **Student Info**: Full Name, Email (optional), Mobile with Country Code (+91 default), Grade (6 to 12, Other), School Name, School Board (CBSE, ICSE, TN State Board, etc.).
  - **Parent Info**: Full Name, Mobile, Email, Relationship (Father, Mother, Guardian, Other).
  - **Course Info**: Course dropdown, Learning Format (Offline / Online), Preferred Schedule (Weekends / Weekdays / Holidays), Start Date.
  - **Experience & Additional**: Experience Level, Questions / Notes.
  - **Consent & Privacy**: Mandatory Guardian Consent checkbox, separate optional Marketing Consent checkbox, and privacy statement.

- **Razorpay Direct Checkout Integration**:
  - Secure backend order creation (`POST /api/create-order`) with server-side trusted course fee lookup.
  - Direct Razorpay popup (`checkout.js`) with studio theme branding.
  - Cryptographic HMAC-SHA256 signature verification (`POST /api/verify-payment`).
  - Webhook endpoint (`POST /api/webhook/razorpay`) with idempotency.
  - Cancellation handling preserves form data so parents can retry without losing their entries.

- **Microsoft Form / Power Automate Webhook Integration**:
  - Automatic background forwarding of paid student registrations to an MS Form, Power Automate workflow, Excel table, or MS Teams notification.

- **In-Page Registration Confirmation Screen**:
  - Instant confirmation without page reloads.
  - Unique Registration ID (e.g. `I5-2026-36508`), verified `PAID` status, student details, course name, and next steps.
  - One-click "Print / Save Receipt" and "Back to Home" buttons.

---

## ?? Quick Start Guide

### 1. Installation

```bash
# Clone or navigate to the project directory
cd "VFX Workshop Website"

# Install backend dependencies
npm install

# Install frontend dependencies
npm --prefix client install
```

### 2. Configure Environment Variables (`.env`)

Open `.env` (or copy from `.env.example`):

```env
PORT=5000

# ==============================================================================
# RAZORPAY PAYMENT GATEWAY CREDENTIALS
# Paste your Razorpay Key ID and Secret Key below:
# ==============================================================================
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET_KEY_HERE
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE

# ==============================================================================
# MICROSOFT FORM / POWER AUTOMATE INTEGRATION
# Paste your Microsoft Form / Power Automate Webhook URL below:
# ==============================================================================
MICROSOFT_FORM_WEBHOOK_URL=https://prod-xx.southeastasia.logic.azure.com:443/workflows/YOUR_WEBHOOK_URL_HERE
```

> **Note on Sandbox / Demo Mode**: If Razorpay keys are not yet pasted or left with placeholder values, the app will run in **Sandbox / Test Mode**, allowing you to test the complete registration and payment confirmation flow interactively. Once you paste your real keys, it immediately switches to live Razorpay Checkout!

### 3. Run in Development Mode

```bash
# Runs backend server on port 5000 and Vite frontend on port 5173 concurrently:
npm run dev
```

Visit: `http://localhost:5173`

### 4. Build & Run in Production Mode

```bash
# Build the frontend client
npm run build

# Start the full-stack server
npm start
```

Visit: `http://localhost:5000`

---

## ?? Project Structure

```
+-- client/                     # Frontend Vite + React application
¦   +-- src/
¦   ¦   +-- components/
¦   ¦   ¦   +-- Navbar.jsx      # Sticky navbar with logo and smooth scroll
¦   ¦   ¦   +-- Hero.jsx        # Hero banner with "UNLOCK YOUR CHILD'S CREATIVE POTENTIAL"
¦   ¦   ¦   +-- Courses.jsx     # Course cards with "Select This Course"
¦   ¦   ¦   +-- WhyChooseUs.jsx # 5 verified studio pillars
¦   ¦   ¦   +-- Steps.jsx       # 4-step registration indicator
¦   ¦   ¦   +-- RegistrationForm.jsx # 16-field modern white form card
¦   ¦   ¦   +-- SuccessModal.jsx # In-page confirmation modal with printable receipt
¦   ¦   ¦   +-- Footer.jsx      # Official contact, social media, and legal info
¦   ¦   +-- data/
¦   ¦   ¦   +-- courses.js      # Client course list & features
¦   ¦   +-- utils/
¦   ¦   ¦   +-- razorpay.js     # Razorpay checkout script loader
¦   ¦   +-- index.css           # Premium studio dark theme styling
+-- server/                     # Backend Node.js + Express API
¦   +-- data/
¦   ¦   +-- courses.json        # Trusted server-side source of truth for course fees
¦   +-- storage/
¦   ¦   +-- db.js               # Thread-safe JSON file store
¦   ¦   +-- registrations.json  # Saved student registrations
¦   +-- integrations/
¦   ¦   +-- microsoftForm.js    # MS Form / Power Automate webhook integration
¦   +-- routes/
¦   ¦   +-- api.js              # REST endpoints for orders, verification, and webhooks
¦   +-- index.js                # Express app entry point
+-- .env.example                # Configuration template
+-- package.json                # Project scripts
+-- README.md                   # Documentation
```

---

## ?? Studio Information

- **Studio Name**: i5 VFX Studio
- **Address**: 11/05, Rangarajulu Street, Ayyavoo Colony, Aminjikarai, Chennai - 600 029.
- **Phone**: +91 97910 70214
- **Email**: info@i5vfxstudio.com
- **Website**: [https://www.i5vfxstudio.com](https://www.i5vfxstudio.com)
=======
# VFX-Workshop-Website
VFX Workshop
>>>>>>> 9367e127f428e625a38af75d2e07cf79cc35cd41
