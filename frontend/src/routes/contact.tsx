import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RequestTimeoutError, fetchWithTimeout } from "@/lib/http";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const contactEndpoint = apiBaseUrl ? `${apiBaseUrl}/api/contact` : "/api/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Malligai Garlands & Flowers" },
      { name: "description", content: "Call, message or visit our Chennai store. We reply within 30 minutes." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    setIsSubmitting(true);
    try {
      const response = await fetchWithTimeout(contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          subject: String(formData.get("subject") || "").trim(),
          message: String(formData.get("message") || "").trim(),
        }),
      }, 15000);

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to send your message right now.");
      }

      toast.success("Message sent", {
        description: "We emailed a confirmation to you and alerted our team.",
      });
      formElement.reset();
    } catch (error) {
      const description = error instanceof RequestTimeoutError
        ? "Server is taking too long to respond. Please try again in a moment."
        : error instanceof TypeError
          ? "Could not reach the backend. Start the backend or set VITE_API_BASE_URL in frontend/.env."
        : error instanceof Error
          ? error.message
          : "Please try again in a moment."
      ;
      toast.error("Submission failed", { description });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="text-xs uppercase tracking-[0.3em] text-accent">Talk to us</div>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">We'd love to help</h1>

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            { I: Phone, t: "Phone", v: "+91 8637686493" },
            { I: MessageCircle, t: "WhatsApp", v: "+91 9342886507" },
            { I: Mail, t: "Email", v: "duvixgarlandss@gmail.com" },
            { I: MapPin, t: "Store", v: "Flower Market,Nilakottai,Dindigul-624208" },
          ].map(({ I, t, v }) => (
            <div key={t} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/10 text-accent"><I className="h-5 w-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{t}</div>
                <div className="font-medium">{v}</div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <p className="mb-4 text-sm text-muted-foreground">
            Fill out the form below and we’ll send you a confirmation email right away.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required name="name" placeholder="Your name" className="h-11 rounded-md border border-border bg-background px-3 text-sm" />
            <input required name="phone" type="tel" placeholder="Phone" className="h-11 rounded-md border border-border bg-background px-3 text-sm" />
          </div>
          <input required name="email" type="email" placeholder="Email" className="mt-4 h-11 w-full rounded-md border border-border bg-background px-3 text-sm" />
          <input name="subject" placeholder="Subject" className="mt-4 h-11 w-full rounded-md border border-border bg-background px-3 text-sm" />
          <textarea required name="message" rows={5} placeholder="How can we help?" className="mt-4 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          <button
            disabled={isSubmitting}
            className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Submit contact form"}
          </button>
        </form>
      </div>
    </div>
  );
}
