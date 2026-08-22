import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, AlertTriangle, CheckCircle2, Clock, Mail, MapPin, Phone, CreditCard } from "lucide-react";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy | DUVIX Flowers & Events" },
      {
        name: "description",
        content:
          "Refund Policy for DUVIX Flowers & Events detailing cancellation rules, fresh flower product eligibility, damage claims, and Razorpay refund timelines.",
      },
    ],
  }),
  component: RefundPolicy,
});

function RefundPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header Badge & Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          <RotateCcw className="h-3.5 w-3.5" />
          Legal & Policies
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Refund & Cancellation Policy
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
            At <strong>DUVIX Flowers & Events</strong>, customer satisfaction and fresh floral quality are at the core of everything we do. We take pride in hand-crafting beautiful garlands, fresh bouquets, and event decor. This policy outlines customer-friendly guidelines regarding order cancellations, refund eligibility, damage claims, and processing timelines.
          </p>
        </div>

        {/* Section 1 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-2 font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-accent" />
            <h2>1. Order Cancellation Requests & Eligibility</h2>
          </div>
          <div className="mt-4 space-y-3">
            <p>We understand plans can change. Order cancellation requests are eligible under the following conditions:</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Prior to Preparation/Dispatch:</strong> Cancellations are accepted if submitted before fresh flower cutting, garland weaving, custom packaging, or courier dispatch has commenced.</li>
              <li><strong className="text-foreground">Event Bookings:</strong> Event decor cancellations must be communicated at least 48 hours prior to the scheduled setup date for partial or full deposit refund consideration.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-2 font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-accent" />
            <h2>2. Perishable Products & Non-Refundable Items</h2>
          </div>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              Fresh flowers, ceremonial garlands, and handcrafted floral products are highly perishable agricultural items prepared specifically for each customer order.
            </p>
            <p className="rounded-xl border border-border bg-muted/40 p-4 text-xs sm:text-sm text-foreground/90 font-medium">
              <strong>Notice:</strong> Once fresh flowers have been woven into custom garlands, personalized items prepared, or orders dispatched with our delivery riders/couriers, orders cannot be cancelled, returned, or refunded due to change of mind.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            3. Reporting Damaged, Defective, or Incorrect Products
          </h2>
          <div className="mt-4 space-y-3">
            <p>If your order arrives damaged during transit, defective, or significantly different from what you ordered, we are committed to making it right:</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Timeframe:</strong> Please report the issue within <strong>4 hours</strong> of delivery receipt.</li>
              <li><strong className="text-foreground">Required Information:</strong> Provide your Order Number, delivery address, phone number, and clear photos/videos showing the damaged or incorrect item.</li>
              <li><strong className="text-foreground">Submission Channels:</strong> Send damage claims to <a href="mailto:contact@duvix.in" className="text-primary underline hover:text-accent font-medium">contact@duvix.in</a> or WhatsApp us directly at <strong>+91 9342886507</strong>.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            4. Claim Review & Refund Resolution
          </h2>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              Upon receiving your damage report, our customer support team will inspect the details immediately. Eligible claims will be resolved through one of the following:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Replacement Delivery:</strong> Immediate re-delivery of fresh flowers or replacement garland (subject to local delivery coverage and flower availability).</li>
              <li><strong className="text-foreground">Full or Partial Refund:</strong> Approved monetary refund issued back to your original payment method.</li>
              <li><strong className="text-foreground">Store Credit / Coupon:</strong> DUVIX store voucher for immediate use on future orders.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-2 font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            <CreditCard className="h-6 w-6 shrink-0 text-accent" />
            <h2>5. Refund Processing & Razorpay Payment Timelines</h2>
          </div>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              Approved refunds are initiated automatically back to the original payment source through our secure payment gateway, <strong>Razorpay</strong>.
            </p>
            <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 text-xs sm:text-sm text-foreground/90 font-medium">
              <Clock className="h-5 w-5 shrink-0 text-accent mt-0.5" />
              <div>
                <strong>Standard Processing Timeline:</strong> Refunds typically reflect in your bank account, card statement, or UPI app within <strong>5 to 7 business days</strong> following approval, depending on Razorpay processing schedules and your issuing bank's policies.
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            6. Delivery & Completed Service Charges
          </h2>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              Shipping and local courier charges incurred for completed delivery attempts, as well as completed event setup services, are non-refundable unless the non-delivery was caused directly by DUVIX Flowers & Events error.
            </p>
          </div>
        </section>

        {/* Section 7: Contact */}
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-primary/20 pb-3">
            7. Contact Refund Support
          </h2>
          <p className="mt-4 text-sm text-foreground/80">
            Have questions about a refund request or order cancellation? Contact our dedicated support team:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Mail className="h-5 w-5 shrink-0 text-accent mt-0.5" />
              <div>
                <div className="text-xs uppercase font-semibold text-muted-foreground">Email Refund Support</div>
                <a href="mailto:contact@duvix.in" className="text-sm font-medium text-primary hover:underline">contact@duvix.in</a>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Phone className="h-5 w-5 shrink-0 text-accent mt-0.5" />
              <div>
                <div className="text-xs uppercase font-semibold text-muted-foreground">Phone / WhatsApp Support</div>
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
        <Link to="/privacy-policy" className="hover:text-primary hover:underline">Privacy Policy</Link>
        <span>•</span>
        <Link to="/terms-and-conditions" className="hover:text-primary hover:underline">Terms & Conditions</Link>
        <span>•</span>
        <Link to="/contact" className="hover:text-primary hover:underline">Contact Support</Link>
      </div>
    </div>
  );
}
