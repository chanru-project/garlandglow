import { Order } from "../models/Order.js";

function withTimeout(promise, timeoutMs, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}

function getResendClient() {
  return process.env.RESEND_API_KEY || null;
}

function getFromAddress() {
  return process.env.RESEND_FROM || "Duvix Garlands <onboarding@resend.dev>";
}

async function sendEmail({ to, subject, html }) {
  const apiKey = getResendClient();
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: getFromAddress(), to, subject, html }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || JSON.stringify(data));
  return data;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getWhatsappConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  let whatsappFrom = process.env.WHATSAPP_FROM || "";
  let whatsappTo = process.env.WHATSAPP_TO || "";

  // Normalize values: ensure they start with "whatsapp:" and phone numbers include country code.
  function normalize(value) {
    if (!value) return "";
    let v = String(value).trim();
    // If it already starts with whatsapp:, keep it.
    if (v.toLowerCase().startsWith("whatsapp:")) return v;
    // If it looks like a plain number, ensure it has a leading + and prefix India +91 when missing.
    if (/^\+?\d+$/.test(v)) {
      if (!v.startsWith("+")) v = "+91" + v;
      return `whatsapp:${v}`;
    }
    // Otherwise, just prefix whatsapp: to the provided value.
    return `whatsapp:${v}`;
  }

  whatsappFrom = normalize(whatsappFrom);
  whatsappTo = normalize(whatsappTo);

  if (!accountSid || !authToken || !whatsappFrom || !whatsappTo) {
    return null;
  }

  return { accountSid, authToken, whatsappFrom, whatsappTo };
}

async function sendNotificationEmail(order) {
  if (!getResendClient()) {
    console.warn("[order] RESEND_API_KEY not set, skipping email.");
    return;
  }
  const html = `
    <h2>New Buy Now order</h2>
    <p><strong>Order number:</strong> ${escapeHtml(order.orderNumber)}</p>
    <p><strong>Name:</strong> ${escapeHtml(order.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
    <p><strong>Product:</strong> ${escapeHtml(order.productName)}</p>
    <p><strong>Quantity:</strong> ${order.quantity}</p>
    <p><strong>Color:</strong> ${escapeHtml(order.color)}</p>
    <p><strong>Size:</strong> ${escapeHtml(order.size)}</p>
    <p><strong>Note:</strong> ${escapeHtml(order.note || "N/A")}</p>
    <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
    <p><strong>Source:</strong> ${escapeHtml(order.source)}</p>
  `;

  const notifyTo = process.env.ORDER_NOTIFICATION_EMAIL || "duvixgarlandss@gmail.com";
  console.log(`[order] Sending notification email → to: ${notifyTo}`);
  const data = await sendEmail({
    to: notifyTo,
    subject: `New Buy Now order ${order.orderNumber}`,
    html,
  });
  console.log(`[order] Email sent. id=${data.id}`);
}

async function sendWhatsappNotification(order) {
  const config = getWhatsappConfig();
  if (!config) return null;

  const body = `New order ${order.orderNumber}%0AName: ${encodeURIComponent(order.name)}%0APhone: ${encodeURIComponent(order.phone)}%0AProduct: ${encodeURIComponent(order.productName)}%0AQty: ${order.quantity}%0ATotal: ₹${order.total.toFixed(2)}`;

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: config.whatsappFrom,
        To: config.whatsappTo,
        Body: body,
      }),
    },
  );

  return response.json();
}

function normalizeForWhatsapp(phone) {
  if (!phone) return null;
  const digits = String(phone).replace(/[^0-9+]/g, "");
  if (digits.startsWith("+")) return `whatsapp:${digits}`;
  const normalized = digits.replace(/^0+/, "");
  const defaultCode = (process.env.DEFAULT_COUNTRY_CODE || "91").replace(/^\+/, "");
  if (normalized.length === 10) return `whatsapp:+${defaultCode}${normalized}`;
  if (normalized.length > 10) return `whatsapp:+${normalized}`;
  return null;
}

async function sendWhatsappMessage(toWhatsApp, order, messageOverride) {
  const config = getWhatsappConfig();
  if (!config) return null;
  if (!toWhatsApp) return null;

  const body = messageOverride ?? `Order ${order.orderNumber} confirmed.%0AProduct: ${encodeURIComponent(order.productName)}%0AQty: ${order.quantity}%0ATotal: ₹${order.total.toFixed(2)}%0AWe will contact you shortly. Thank you!`;

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: config.whatsappFrom,
        To: toWhatsApp,
        Body: body,
      }),
    },
  );

  return response.json();
}

export async function createOrder(req, res) {
  console.log("[order] Order form request received.");
  try {
    const {
      name = "",
      phone = "",
      email = "",
      productId = "",
      productName = "",
      collection = "",
      category = "",
      quantity = 1,
      price = 0,
      size = "",
      color = "",
      note = "",
      image = "",
    } = req.body;

    if (!name || !phone || !productId || !productName || !price) {
      return res.status(400).json({ message: "Name, phone, product, and price are required." });
    }

    const parsedQty = Number(quantity) || 1;
    const parsedPrice = Number(price) || 0;
    const total = Math.max(0, parsedQty * parsedPrice);

    const order = await Order.create({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      productId: String(productId).trim(),
      productName: String(productName).trim(),
      collection: String(collection).trim(),
      category: String(category).trim(),
      quantity: parsedQty,
      price: parsedPrice,
      total,
      size: String(size).trim(),
      color: String(color).trim(),
      note: String(note).trim(),
      image: String(image).trim(),
      source: "buy now",
    });

    try {
      console.log(`[order] Preparing notification email for order ${order.orderNumber}.`);
      await withTimeout(sendNotificationEmail(order), 15000, "Order email");
    } catch (mailError) {
      console.warn("[order] Order notification email failed:", mailError.message);
    }

    // Send WhatsApp notifications: owner (configured) and customer (order phone)
    const whatsappResponses = { owner: null, customer: null };
    try {
      const ownerResp = await withTimeout(sendWhatsappNotification(order), 8000, "Owner WhatsApp notification");
      whatsappResponses.owner = ownerResp || null;
    } catch (whatsappError) {
      console.warn("WhatsApp (owner) notification failed:", whatsappError);
    }

    try {
      const customerWhats = normalizeForWhatsapp(order.phone) || null;
      if (customerWhats) {
        const customerMsg = `Hi ${encodeURIComponent(order.name)}, your order ${order.orderNumber} for ${encodeURIComponent(order.productName)} (Qty: ${order.quantity}) has been received. Total: ₹${order.total.toFixed(2)}. We'll contact you shortly.`;
        const custResp = await withTimeout(
          sendWhatsappMessage(customerWhats, order, customerMsg),
          8000,
          "Customer WhatsApp notification",
        );
        whatsappResponses.customer = custResp || null;
      }
    } catch (custErr) {
      console.warn("WhatsApp (customer) notification failed:", custErr);
    }

    if (whatsappResponses.owner || whatsappResponses.customer) {
      try {
        order.whatsappSent = true;
        order.whatsappResponse = whatsappResponses;
        await withTimeout(order.save(), 5000, "Order save");
      } catch (persistError) {
        console.warn("Failed to persist WhatsApp response metadata:", persistError);
      }
    }

    return res.status(201).json({
      message: "Order created successfully.",
      orderId: order._id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({ message: "Failed to create order." });
  }
}
