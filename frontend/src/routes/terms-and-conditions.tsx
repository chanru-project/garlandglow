import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ShieldCheck, CreditCard, Truck, RefreshCw, Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | DUVIX Flowers & Events" },
      {
        name: "description",
        content:
          "Terms & Conditions for DUVIX Flowers & Events covering product orders, fresh flower variations, Razorpay payments, delivery terms, and event services.",
      },
    ],
  }),
  component: TermsAndConditions,
});

function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header Badge & Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          <FileText className="h-3.5 w-3.5" />
          Legal & Policies
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Terms & Conditions
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
            Welcome to <strong>DUVIX Flowers & Events</strong> ("DUVIX," "we," "our," or "us"). These Terms & Conditions govern your use of our website{" "}
            <a href="https://duvix.in" target="_blank" rel="noreferrer" className="text-primary underline hover:text-accent">
              https://duvix.in
            </a>{" "}
            and all purchases of fresh garlands, loose flowers, gifts, custom floral arrangements, and event management services. By placing an order or using our website, you agree to be bound by these terms.
          </p>
        </div>

        {/* Section 1 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            1. Acceptance of Terms
          </h2>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              By accessing, browsing, or placing orders on https://duvix.in, you acknowledge that you have read, understood, and agreed to comply with these Terms & Conditions. If you do not agree to these terms, please do not use our website or services.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            2. Products & Services Offered
          </h2>
          <div className="mt-4 space-y-3">
            <p>DUVIX Flowers & Events provides a wide range of floral and event solutions across Dindigul, Madurai, Chennai, and pan-India shipping:</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Hand-crafted ceremonial garlands (wedding malas, temple malas, engagement garlands).</li>
              <li>Fresh loose flowers (Jasmine/Malligai, Rose, Marigold, Lotus, Sampangi).</li>
              <li>Floral bouquets, customized gift hampers, and special occasion items.</li>
              <li>Event decor and management services (stage decoration, DJ/sound systems, lighting, balloon decor, and complete event management).</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            3. Product Pricing & Fresh Flower Availability
          </h2>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              All prices displayed on our website are listed in Indian Rupees (INR). Fresh flowers are agricultural and seasonal products; prices and availability may fluctuate based on daily flower market conditions.
            </p>
            <p>
              DUVIX Flowers & Events reserves the right to modify prices, update product descriptions, or substitute out-of-season flower stems with fresh flowers of equal or higher value upon consulting the customer.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-2 font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            <RefreshCw className="h-6 w-6 shrink-0 text-accent" />
            <h2>4. Natural Variations in Fresh Flowers & Custom Garlands</h2>
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-foreground/90">
              Fresh flowers are natural products handcrafted by our skilled floral artisans:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Product photographs on https://duvix.in serve as representative visual previews.</li>
              <li>Because fresh flowers vary naturally in shade, size, bloom state, and fragrance, handcrafted garlands may have minor natural variations from product images.</li>
              <li>Such natural variations are a mark of authentic, hand-woven fresh florals and do not constitute a product defect.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-2 font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            <CreditCard className="h-6 w-6 shrink-0 text-accent" />
            <h2>5. Order Placement & Payment Terms</h2>
          </div>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              Orders are confirmed once successfully processed through our payment gateway, <strong>Razorpay</strong>. We support Credit/Debit Cards, Net Banking, UPI (GPay, PhonePe, Paytm), and major digital wallets.
            </p>
            <p>
              DUVIX Flowers & Events reserves the right to cancel or decline any order if raw material is unavailable, delivery location is unserviceable, or payment verification fails. In such cases, any paid amount will be fully refunded.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-2 font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            <Truck className="h-6 w-6 shrink-0 text-accent" />
            <h2>6. Delivery Terms & Customer Responsibility</h2>
          </div>
          <div className="mt-4 space-y-3">
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Accurate Details:</strong> Providing accurate delivery address, landmark, recipient name, and active mobile phone number is the customer's responsibility.</li>
              <li><strong className="text-foreground">Recipient Unavailability:</strong> Because fresh flowers are highly perishable, if the recipient is unavailable or the address is incorrect, redelivery attempts or rerouting may incur additional charges.</li>
              <li><strong className="text-foreground">Delays Beyond Control:</strong> DUVIX is not liable for delivery delays resulting from severe weather conditions, traffic disruptions, natural disasters, strikes, or unexpected road blockades. Our team will communicate actively to complete delivery at the earliest.</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            7. Cancellations & Modifications
          </h2>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              Cancellation requests must be submitted before flower preparation, custom garland weaving, or dispatch begins. Once fresh flowers are cut, woven, or packed, orders cannot be cancelled. For complete details, please refer to our <Link to="/refund-policy" className="text-primary underline hover:text-accent font-medium">Refund Policy</Link>.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            8. Event Management Services Terms
          </h2>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              For event decor, stage design, sound system, and lighting services, venue access timings and electrical setups must be provided by the customer or venue management as agreed during event booking.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-border/60 pb-3">
            9. Changes to Terms & Governing Law
          </h2>
          <div className="mt-4 space-y-3 text-muted-foreground">
            <p>
              These Terms & Conditions are governed by and construed in accordance with the laws of India. DUVIX Flowers & Events reserves the right to revise these terms at any time. Updated terms become effective immediately upon being published on https://duvix.in.
            </p>
          </div>
        </section>

        {/* Section 10: Contact */}
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 shadow-soft">
          <h2 className="font-display text-xl sm:text-2xl text-primary font-semibold border-b border-primary/20 pb-3">
            10. Contact Information
          </h2>
          <p className="mt-4 text-sm text-foreground/80">
            For questions regarding these Terms & Conditions or order agreements, please contact our team:
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
        <Link to="/privacy-policy" className="hover:text-primary hover:underline">Privacy Policy</Link>
        <span>•</span>
        <Link to="/refund-policy" className="hover:text-primary hover:underline">Refund Policy</Link>
        <span>•</span>
        <Link to="/contact" className="hover:text-primary hover:underline">Contact Support</Link>
      </div>
    </div>
  );
}
