import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import multer from "multer";
import { Resend } from "resend";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import flowerRoutes from "./routes/flowerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const envPath = fileURLToPath(new URL(".env", import.meta.url));
const envExamplePath = fileURLToPath(new URL(".env.example", import.meta.url));
const envResult = dotenv.config({ path: envPath });

if (envResult.error && existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath });
  console.warn("Loaded backend/.env.example because backend/.env was not found.");
}

const app = express();
const PORT = process.env.PORT || 5000;
const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY || "";
  if (!apiKey) return null;
  return new Resend(apiKey);
}

// from address — must be a domain verified in your Resend account
function getFromAddress() {
  return process.env.RESEND_FROM || "Duvix Garlands <onboarding@resend.dev>";
}

function withTimeout(promise, timeoutMs, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs),
    ),
  ]);
}

app.use(cors({ origin: corsOrigins.length ? corsOrigins : true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/flowers", flowerRoutes);
app.use("/api/orders", orderRoutes);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

app.get("/", (_req, res) => {
  res.status(200).send("GarlandGlow backend is running. Use /api/health to verify API.");
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Test endpoint: GET /api/test-email?to=you@gmail.com
app.get("/api/test-email", async (req, res) => {
  const resend = getResendClient();
  if (!resend) {
    return res.status(500).json({ ok: false, error: "RESEND_API_KEY not configured" });
  }
  const to = String(req.query.to || process.env.MAIL_FROM || "").trim();
  if (!to) {
    return res.status(400).json({ ok: false, error: "Provide ?to=email query param" });
  }
  try {
    console.log(`[test-email] Sending test email to ${to}...`);
    const { data, error } = await withTimeout(
      resend.emails.send({
        from: getFromAddress(),
        to,
        subject: "GarlandGlow email test",
        text: `This is a test email from GarlandGlow backend.\nSent at: ${new Date().toISOString()}`,
      }),
      15000,
      "test-email send",
    );
    if (error) {
      console.error("[test-email] Resend error:", error);
      return res.status(500).json({ ok: false, error });
    }
    console.log(`[test-email] Sent. id=${data.id}`);
    return res.json({ ok: true, to, id: data.id });
  } catch (err) {
    console.error("[test-email] Failed:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/custom-request", upload.single("referenceImage"), async (req, res) => {
  console.log("[custom-request] Form request received.");
  try {
    const {
      name = "",
      phone = "",
      flower = "",
      color = "",
      size = "",
      budget = "",
      occasion = "",
      notes = "",
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required." });
    }

    const resend = getResendClient();
    if (!resend) {
      console.error("[custom-request] RESEND_API_KEY not configured.");
      return res.status(500).json({ message: "Email service is not configured." });
    }

    const attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
      });
    }

    const html = `
      <h2>New custom garland request</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Flower type:</strong> ${escapeHtml(flower)}</p>
      <p><strong>Preferred color:</strong> ${escapeHtml(color)}</p>
      <p><strong>Size:</strong> ${escapeHtml(size)}</p>
      <p><strong>Budget:</strong> ${escapeHtml(String(budget))}</p>
      <p><strong>Occasion:</strong> ${escapeHtml(occasion)}</p>
      <p><strong>Special instructions:</strong> ${escapeHtml(notes || "N/A")}</p>
      <p><strong>Reference image:</strong> ${escapeHtml(req.file ? req.file.originalname : "Not provided")}</p>
    `;

    const notifyTo = process.env.CUSTOM_REQUEST_TO || "duvixgarlandss@gmail.com";
    console.log(`[custom-request] Preparing email for ${name} (${phone}) → to: ${notifyTo}`);
    try {
      console.log("[custom-request] Sending email via Resend...");
      const { data, error } = await withTimeout(
        resend.emails.send({
          from: getFromAddress(),
          to: notifyTo,
          subject: "New Custom Garland Request",
          html,
          attachments,
        }),
        15000,
        "custom-request send",
      );
      if (error) throw new Error(JSON.stringify(error));
      console.log(`[custom-request] Email sent successfully. id=${data.id}`);
      return res.status(200).json({ message: "Request sent successfully." });
    } catch (mailError) {
      console.error("[custom-request] Email sending failed:", mailError.message);
      return res.status(202).json({
        message: "Request received, but email notification failed. We will contact you soon.",
      });
    }
  } catch (error) {
    console.error("custom-request error:", error);
    return res.status(500).json({ message: "Failed to send email." });
  }
});

app.post("/api/contact", async (req, res) => {
  console.log("[contact] Form request received.");
  try {
    const { name = "", phone = "", email = "", subject = "", message = "" } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    const resend = getResendClient();
    if (!resend) {
      console.error("[contact] RESEND_API_KEY not configured.");
      return res.status(500).json({ message: "Email service is not configured." });
    }

    const supportEmail = process.env.CONTACT_TO || "duvixgarlandss@gmail.com";
    const from = getFromAddress();

    const supportHtml = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject || "General enquiry")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    const customerHtml = `
      <h2>Thanks for contacting Duvix Garlands &amp; Events, ${escapeHtml(name)}</h2>
      <p>We have received your message and will reply as soon as possible.</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject || "General enquiry")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    console.log(`[contact] Preparing email for ${name} → support: ${supportEmail}, customer: ${email}`);
    try {
      console.log(`[contact] Sending support notification to ${supportEmail}...`);
      const { data: d1, error: e1 } = await withTimeout(
        resend.emails.send({
          from,
          to: supportEmail,
          reply_to: email,
          subject: `Contact form: ${subject || "General enquiry"}`,
          html: supportHtml,
        }),
        15000,
        "contact support send",
      );
      if (e1) throw new Error(JSON.stringify(e1));
      console.log(`[contact] Support email sent. id=${d1.id}`);

      // Customer confirmation requires a verified domain — skip gracefully if no domain configured
      if (process.env.RESEND_FROM) {
        console.log(`[contact] Sending customer confirmation to ${email}...`);
        const { data: d2, error: e2 } = await withTimeout(
          resend.emails.send({
            from,
            to: email,
            subject: `Thanks for contacting Duvix Garlands & Events, ${name}`,
            html: customerHtml,
          }),
          15000,
          "contact customer send",
        );
        if (e2) console.warn(`[contact] Customer confirmation failed: ${JSON.stringify(e2)}`);
        else console.log(`[contact] Customer email sent. id=${d2.id}`);
      } else {
        console.log("[contact] Skipping customer confirmation — RESEND_FROM not set (no verified domain).");
      }

      return res.status(200).json({ message: "Message sent successfully." });
    } catch (mailError) {
      console.error("[contact] Email sending failed:", mailError.message);
      return res.status(202).json({
        message: "Message received, but email delivery failed. We will contact you soon.",
      });
    }
  } catch (error) {
    console.error("contact error:", error);
    return res.status(500).json({ message: "Failed to send contact message." });
  }
});

    const customerSummary = [
      `Thanks for contacting Duvix Garlands & Events, ${name}.`,
      "",
      "We have received your message and will reply as soon as possible.",
      "",
      `Name: ${name}`,
      `Phone: ${phone || "N/A"}`,
      `Email: ${email}`,
      `Subject: ${subject || "General enquiry"}`,
      `Message: ${message}`,
    ].join("\n");

    const supportText = [
      "New contact form submission",
      "",
      `Name: ${name}`,
      `Phone: ${phone || "N/A"}`,
      `Email: ${email}`,
      `Subject: ${subject || "General enquiry"}`,
      `Message: ${message}`,
    ].join("\n");

    const supportHtml = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject || "General enquiry")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    const customerHtml = `
      <h2>Thanks for contacting Duvix Garlands & Events, ${escapeHtml(name)}</h2>
      <p>We have received your message and will reply as soon as possible.</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject || "General enquiry")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    console.log(`[contact] Preparing email for ${name} → support: ${supportEmail}, customer: ${email}`);
    try {
      console.log(`[contact] Sending support notification to ${supportEmail}...`);
      const infoSupport = await withTimeout(
        transporter.sendMail({
          from: fromAddress,
          to: supportEmail,
          replyTo: email,
          subject: `Contact form: ${subject || "General enquiry"}`,
          text: supportText,
          html: supportHtml,
        }),
        10000,
        "contact support sendMail",
      );
      console.log(`[contact] Support email sent. messageId=${infoSupport.messageId} response=${infoSupport.response}`);

      console.log(`[contact] Sending customer confirmation to ${email}...`);
      const infoCust = await withTimeout(
        transporter.sendMail({
          from: fromAddress,
          to: email,
          subject: `Thanks for contacting Duvix Garlands & Events, ${name}`,
          text: customerSummary,
          html: customerHtml,
        }),
        10000,
        "contact customer sendMail",
      );
      console.log(`[contact] Customer email sent. messageId=${infoCust.messageId} response=${infoCust.response}`);

      console.log("[contact] Sending API response.");
      return res.status(200).json({ message: "Message sent successfully." });
    } catch (mailError) {
      console.error("[contact] Email sending failed:", mailError.message);
      console.log("[contact] Sending API response (email failed).");
      return res.status(202).json({
        message: "Message received, but email delivery failed. We will contact you soon.",
      });
    }
  } catch (error) {
    console.error("contact error:", error);
    return res.status(500).json({ message: "Failed to send contact message." });
  }
});

async function startServer() {
  try {
    const dbConnection = await connectDB();
    if (!dbConnection) {
      console.warn("MongoDB is unavailable; the server will continue in degraded mode.");
    }

    // Verify RESEND_API_KEY is present at startup
    if (process.env.RESEND_API_KEY) {
      console.log("[Resend] RESEND_API_KEY is set. Email service ready.");
    } else {
      console.warn("[Resend] RESEND_API_KEY not set — email will not work.");
    }

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Custom request server running on http://0.0.0.0:${PORT}`);
      console.log(`Health check available at http://0.0.0.0:${PORT}/api/health`);
    });

    server.on("error", (error) => {
      if (error && typeof error === "object" && "code" in error && error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the old process or run: npm run dev:restart`);
        process.exit(1);
      }
      throw error;
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
