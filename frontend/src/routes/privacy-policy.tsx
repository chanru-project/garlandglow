import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Lock, CreditCard, Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | DUVIX Flowers & Events" },
      {
        name: "description",
        content:
          "Privacy Policy for DUVIX Flowers & Events detailing information collection, usage, Razorpay payment security, and data protection.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header Badge & Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Legal & Policies
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Last Updated: August 2026
        </p>
      </div>

      {/* Main Content Body */}
      <div className="mt-10 space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
        {/* Intro Banner */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="text-foreground/80">
            Welcome to <strong>DUVIX Flowers & Events</strong> ("we," "our," or "us"). We operate{" "}
            <a href="https://duvix.in" target="_blank" rel="noreferrer" className="text-primary underline hover:text-accent">
              https://duvix.in
            </a>{" "}
            and are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect,
            use, disclose, and safeguard customer information when you visit our website or place orders for our fresh flower
            garlands, florals, gifts, and event management services across Dindigul, Madurai, Chennai, and surrounding areas.
          </p>
        </div>

        {/* Section 1 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            1. Information We Collect
          </h2>
          <div className="mt-4 space-y-3">
            <p>We collect personal information that you voluntarily provide to us when placing an order, contacting support, or creating an account:</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Personal Details:</strong> Full name, email address, mobile phone number.</li>
              <li><strong className="text-foreground">Delivery Information:</strong> Delivery address, recipient name, landmark details, and postal code.</li>
              <li><strong className="text-foreground">Order & Customization Details:</strong> Specific flower preferences, garland sizes, custom design requests, occasion details, and order history.</li>
              <li><strong className="text-foreground">Inquiries & Feedback:</strong> Messages, ratings, and feedback submitted via our contact forms or customer care channels.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            2. How We Use Customer Information
          </h2>
          <div className="mt-4 space-y-3">
            <p>We use your information exclusively to deliver a high-quality floral experience:</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Processing, fulfilling, and hand-crafting your fresh garland and flower orders.</li>
              <li>Coordinating timely local deliveries across Dindigul, Madurai, Chennai, and pan-India shipping.</li>
              <li>Sending order updates, SMS notifications, and delivery status communications.</li>
              <li>Responding to customer support inquiries, feedback, and special custom requests.</li>
              <li>Improving our website performance, catalog selection, and customer experience.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-2 font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            <CreditCard className="h-6 w-6 shrink-0 text-accent" />
            <h2>3. Payment Security & Razorpay Integration</h2>
          </div>
          <div className="mt-4 space-y-3">
            <p>
              Online payments on <strong>DUVIX Flowers & Events</strong> are securely processed using our trusted payment gateway partner,{" "}
              <strong>Razorpay</strong>.
            </p>
            <p className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-xs sm:text-sm text-foreground/90 font-medium">
              <Lock className="inline-block h-4 w-4 mr-1.5 text-accent" />
              <strong>Important:</strong> DUVIX Flowers & Events does NOT store, record, or retain your complete credit card numbers, debit card numbers, CVVs, net banking credentials, or UPI PINs. All payment transactions are encrypted and handled directly by Razorpay under PCI-DSS compliant standards.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            4. Information Sharing & Disclosure
          </h2>
          <div className="mt-4 space-y-3">
            <p>We respect your privacy and never sell or rent your personal information to third-party marketers. Information is shared strictly on a need-to-know basis:</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Delivery Partners & Logistics:</strong> Your delivery address and contact phone number are shared with verified couriers and local delivery riders to execute delivery.</li>
              <li><strong className="text-foreground">Payment Processors:</strong> Transaction details are shared with Razorpay for payment verification and fraud prevention.</li>
              <li><strong className="text-foreground">Legal Obligations:</strong> Information may be disclosed if required by law, regulation, or legal process under Indian jurisdiction.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            5. Data Security & Storage
          </h2>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              We implement industry-standard technical and organizational security measures to protect your personal information against unauthorized access, loss, misuse, or alteration. All web communications are transmitted via Secure Sockets Layer (SSL) encryption.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            6. Cookies & Website Analytics
          </h2>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              Our website uses essential cookies and session storage to maintain shopping cart items, remember active user sessions, and enhance site navigation. You may disable cookies in your browser settings, though certain interactive shopping features may be limited.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            7. Policy Updates
          </h2>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              DUVIX Flowers & Events reserves the right to update or modify this Privacy Policy at any time. Any changes will be posted directly on this page with an updated revision date. We encourage you to review this page periodically.
            </p>
          </div>
        </section>

        {/* Section 8: Contact */}
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-primary/20 pb-3">
            8. Contact Us
          </h2>
          <p className="mt-4 text-sm text-foreground/80">
            If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out to us:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Mail className="h-5 w-5 shrink-0 text-accent mt-0.5" />
              <div>
                <div className="text-xs uppercase font-semibold text-muted-foreground">Email</div>
                <a href="mailto:contact@duvix.in" className="text-sm font-medium text-primary hover:underline">contact@duvix.in</a>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Phone className="h-5 w-5 shrink-0 text-accent mt-0.5" />
              <div>
                <div className="text-xs uppercase font-semibold text-muted-foreground">Phone / WhatsApp</div>
                <div className="text-sm font-medium text-foreground">+91 8637686493 / +91 9342886507</div>
              </div>
            </div>
            <div className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <MapPin className="h-5 w-5 shrink-0 text-accent mt-0.5" />
              <div>
                <div className="text-xs uppercase font-semibold text-muted-foreground">Studio & Store Location</div>
                <div className="text-sm font-medium text-foreground">Flower Market, Nilakottai, Dindigul - 624208, Tamil Nadu, India</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 flex justify-center gap-4 text-sm text-muted-foreground border-t border-border pt-6">
        <Link to="/terms-and-conditions" className="hover:text-primary hover:underline">Terms & Conditions</Link>
        <span>•</span>
        <Link to="/refund-policy" className="hover:text-primary hover:underline">Refund Policy</Link>
        <span>•</span>
        <Link to="/contact" className="hover:text-primary hover:underline">Contact Support</Link>
      </div>
    </div>
  );
}
