import { createFileRoute } from "@tanstack/react-router";
import { Upload, Sparkles } from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import { toast } from "sonner";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const customRequestEndpoint = apiBaseUrl ? `${apiBaseUrl}/api/custom-request` : "/api/custom-request";
let swalThemeInjected = false;

function ensureSwalTheme() {
  if (swalThemeInjected || typeof document === "undefined") return;

  const style = document.createElement("style");
  style.id = "duvix-swal-theme";
  style.textContent = `
    .duvix-swal-popup {
      border-radius: 20px !important;
      box-shadow: 0 25px 60px rgba(8, 84, 42, 0.24) !important;
      padding: 1.5rem 1.25rem 1.25rem !important;
    }

    .duvix-swal-confirm {
      border: 0 !important;
      border-radius: 999px !important;
      padding: 0.75rem 1.75rem !important;
      font-weight: 700 !important;
      background: linear-gradient(135deg, #15803d, #22c55e) !important;
      box-shadow: 0 10px 20px rgba(21, 128, 61, 0.28) !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }

    .duvix-swal-confirm:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 24px rgba(21, 128, 61, 0.35) !important;
    }

    .duvix-swal-close {
      color: #14532d !important;
      transition: transform 0.2s ease !important;
    }

    .duvix-swal-close:hover {
      transform: scale(1.08);
    }

    .duvix-zoom-in {
      animation: duvixZoomIn 0.28s ease-out;
    }

    .duvix-zoom-out {
      animation: duvixZoomOut 0.2s ease-in;
    }

    @keyframes duvixZoomIn {
      0% {
        transform: scale(0.92);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes duvixZoomOut {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(0.96);
        opacity: 0;
      }
    }
  `;

  document.head.appendChild(style);
  swalThemeInjected = true;
}

function fireSuccessConfetti() {
  if (typeof window === "undefined") return;

  const durationMs = 1400;
  const end = Date.now() + durationMs;
  const colors = ["#16a34a", "#22c55e", "#86efac", "#dcfce7"];

  const frame = () => {
    confetti({
      particleCount: 3,
      startVelocity: 28,
      spread: 360,
      ticks: 65,
      gravity: 0.95,
      colors,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
    });

    if (Date.now() < end) {
      window.requestAnimationFrame(frame);
    }
  };

  window.requestAnimationFrame(frame);
}

async function showSuccessPopup() {
  ensureSwalTheme();

  await Swal.fire({
    icon: "success",
    iconColor: "#16a34a",
    title: "🎉 Request Submitted Successfully!",
    html: `
      <div style="text-align:left;line-height:1.65;color:#14532d;max-width:34rem;margin:0 auto;">
        <p style="margin:0 0 0.65rem;"><strong>Thank you for choosing DUVIX Flowers & Events.</strong></p>
        <p style="margin:0 0 0.65rem;">🌸 Your custom flower request has been received successfully.</p>
        <p style="margin:0 0 0.65rem;">📞 Our event specialist will contact you shortly.</p>
        <p style="margin:0 0 0.65rem;">💐 We are excited to make your celebration beautiful and unforgettable.</p>
        <p style="margin:0;">Thank you for trusting DUVIX Flowers & Events ❤️</p>
      </div>
    `,
    timer: 6000,
    timerProgressBar: true,
    showCloseButton: true,
    showConfirmButton: true,
    confirmButtonText: "Perfect",
    buttonsStyling: true,
    backdrop: "rgba(8, 84, 42, 0.28)",
    customClass: {
      popup: "duvix-swal-popup",
      confirmButton: "duvix-swal-confirm",
      closeButton: "duvix-swal-close",
    },
    showClass: {
      popup: "duvix-zoom-in",
    },
    hideClass: {
      popup: "duvix-zoom-out",
    },
    didOpen: fireSuccessConfetti,
  });
}

export const Route = createFileRoute("/custom")({
  head: () => ({
    meta: [
      { title: "Custom Garland Orders | Malligai" },
      { name: "description", content: "Design your own bespoke garland — pick flowers, colors, size, budget and share reference images." },
    ],
  }),
  component: CustomOrder,
});

function CustomOrder() {
  const [form, setForm] = useState({ name: "", phone: "", flower: "Rose", color: "Red", size: "Medium", budget: 3000, occasion: "Wedding", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFileName("");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Please choose an image up to 2MB.",
      });
      e.target.value = "";
      setSelectedFileName("");
      return;
    }

    setSelectedFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    setIsSubmitting(true);
    try {
      const payload = new FormData(formElement);

      const response = await fetch(customRequestEndpoint, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const apiMessage = errorPayload?.errors?.[0]?.message || "Unable to submit your request right now.";
        throw new Error(apiMessage);
      }

      await showSuccessPopup();

      setForm({ name: "", phone: "", flower: "Rose", color: "Red", size: "Medium", budget: 3000, occasion: "Wedding", notes: "" });
      setSelectedFileName("");
      formElement.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const description = error instanceof TypeError
        ? "Could not reach the request server. Start the backend or set VITE_API_BASE_URL in frontend/.env."
        : error instanceof Error
          ? error.message
          : "Please try again in a moment.";
      toast.error("Submission failed", {
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/80 px-3 py-1 text-xs uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-gold" /> Bespoke
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">Design your own garland</h1>
          <p className="mt-3 text-muted-foreground">Share your vision and our master florists will hand-craft it for you.</p>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-4xl gap-5 px-6 py-12 md:grid-cols-2"
      >
        <Field label="Your name"><input required name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
        <Field label="Phone"><input required type="tel" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></Field>
        <Field label="Flower type">
          <select name="flower" value={form.flower} onChange={(e) => setForm({ ...form, flower: e.target.value })} className={inputCls}>
            {["Rose", "Jasmine", "Marigold", "Orchid", "Kanakambaram", "Mixed"].map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Preferred color">
          <select name="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputCls}>
            {["Red", "White", "Pink", "Yellow", "Orange", "Mixed"].map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Size">
          <select name="size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className={inputCls}>
            {["Small", "Medium", "Large", "XL", "Custom"].map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Occasion">
          <select name="occasion" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} className={inputCls}>
            {["Wedding", "Engagement", "Reception", "Temple", "Corporate", "Birthday", "Other"].map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label={`Budget: ₹${form.budget.toLocaleString("en-IN")}`}>
          <p className="mb-2 text-xs text-muted-foreground">Minimum budget: ₹500</p>
          <input type="range" name="budget" min={500} max={20000} step={500} value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} className="w-full accent-accent" />
        </Field>
        <Field label="Reference image">
          <label className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 text-sm text-muted-foreground hover:border-accent">
            <Upload className="h-4 w-4" /> {selectedFileName || "Upload photo"}
            <input type="file" name="referenceImage" className="hidden" accept="image/*" onChange={handleImageSelect} />
          </label>
        </Field>
        <Field label="Special instructions" className="md:col-span-2">
          <textarea rows={4} name="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputCls + " h-auto py-2"} />
        </Field>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit custom request"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = "h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-accent";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={"block " + className}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
