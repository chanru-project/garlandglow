import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
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

function getSmtpConfig() {
  const smtpUser = String(process.env.SMTP_USER || "").trim();
  const smtpPassRaw = String(process.env.SMTP_PASS || "").trim();
  const smtpPass = smtpPassRaw.replace(/\s+/g, "");
  const smtpService = String(process.env.SMTP_SERVICE || "gmail").trim() || "gmail";

  return { smtpUser, smtpPass, smtpService };
}

function withTimeout(promise, timeoutMs, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs),
    ),
  ]);
}

// Uses explicit host/port so cloud hosts (Render) don't get blocked by SMTP service shortcuts
function createTransporter(smtpUser, smtpPass) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
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

    const { smtpUser, smtpPass, smtpService } = getSmtpConfig();
    const missingSmtp = [];
    if (!smtpUser) missingSmtp.push("SMTP_USER");
    if (!smtpPass) missingSmtp.push("SMTP_PASS");

    if (missingSmtp.length) {
      console.error(`Missing SMTP env values: ${missingSmtp.join(", ")}`);
      return res.status(500).json({
        message: "Email service is not configured. Set SMTP_USER and SMTP_PASS in backend/.env and restart backend.",
      });
    }

    const transporter = createTransporter(smtpUser, smtpPass);

    const attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
        contentType: req.file.mimetype,
      });
    }

    const text = [
      "New custom garland request",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Flower type: ${flower}`,
      `Preferred color: ${color}`,
      `Size: ${size}`,
      `Budget: ${budget}`,
      `Occasion: ${occasion}`,
      `Special instructions: ${notes || "N/A"}`,
      `Reference image: ${req.file ? req.file.originalname : "Not provided"}`,
    ].join("\n");

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
    const fromAddress = `"Duvix Garlands" <${process.env.MAIL_FROM || smtpUser}>`;
    console.log(`[custom-request] Preparing email for ${name} (${phone}) → to: ${notifyTo}`);
    try {
      console.log("[custom-request] Sending email...");
      await withTimeout(
        transporter.sendMail({
          from: fromAddress,
          to: notifyTo,
          subject: "New Custom Garland Request",
          text,
          html,
          attachments,
        }),
        10000,
        "custom-request sendMail",
      );
      console.log("[custom-request] Email sent successfully.");
      console.log("[custom-request] Sending API response.");
      return res.status(200).json({ message: "Request sent successfully." });
    } catch (mailError) {
      console.error("[custom-request] Email sending failed:", mailError.message);
      console.log("[custom-request] Sending API response (email failed).");
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

    const { smtpUser, smtpPass, smtpService } = getSmtpConfig();
    const missingSmtp = [];
    if (!smtpUser) missingSmtp.push("SMTP_USER");
    if (!smtpPass) missingSmtp.push("SMTP_PASS");

    if (missingSmtp.length) {
      console.error(`Missing SMTP env values: ${missingSmtp.join(", ")}`);
      return res.status(500).json({
        message: "Email service is not configured. Set SMTP_USER and SMTP_PASS in backend/.env and restart backend.",
      });
    }

    const transporter = createTransporter(smtpUser, smtpPass);

    const supportEmail = process.env.CONTACT_TO || "duvixgarlandss@gmail.com";
    const fromAddress = `"Duvix Garlands" <${process.env.MAIL_FROM || smtpUser}>`;

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
      await withTimeout(
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
      console.log("[contact] Support email sent successfully.");

      console.log(`[contact] Sending customer confirmation to ${email}...`);
      await withTimeout(
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
      console.log("[contact] Customer email sent successfully.");

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

    // Verify SMTP connection at startup so misconfiguration is caught early in logs
    const { smtpUser, smtpPass } = getSmtpConfig();
    if (smtpUser && smtpPass) {
      const verifyTransporter = createTransporter(smtpUser, smtpPass);
      withTimeout(verifyTransporter.verify(), 10000, "SMTP verify")
        .then(() => console.log("[SMTP] Connection verified successfully."))
        .catch((err) => console.error("[SMTP] Connection verification failed:", err.message));
    } else {
      console.warn("[SMTP] SMTP_USER or SMTP_PASS not set — email will not work.");
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
