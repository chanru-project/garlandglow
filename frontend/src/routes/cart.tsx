import { createFileRoute, Link } from "@tanstack/react-router";
import { useShop } from "@/store/shop";
import { formatINR } from "@/data/products";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createOrder } from "@/lib/order-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart | Malligai" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Email is required.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return "Please enter a valid email address.";
  }
  return null;
}

function CartPage() {
  const { cartItems, cartTotal, setQty, removeFromCart, clearCart } = useShop();
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const shipping = cartTotal > 999 || cartTotal === 0 ? 0 : 99;
  const total = Math.max(0, cartTotal + shipping);

  function openWhatsappOrder() {
    const ownerNumber = "919342886507";
    const namePart = orderName.trim() ? `Name: ${orderName.trim()}\n` : "";
    const phonePart = orderPhone.trim() ? `Phone: ${orderPhone.trim()}\n` : "";
    const emailPart = orderEmail.trim() ? `Email: ${orderEmail.trim()}\n` : "";
    const notePart = orderNote.trim() ? `Notes: ${orderNote.trim()}\n` : "";
    const itemsList = cartItems
      .map((item) => `- ${item.product.name} (Qty: ${item.qty}) - ${formatINR(item.product.price * item.qty)}`)
      .join("\n");
    const msg = `Hello, I would like to place an order for my cart:\n\n${itemsList}\n\nTotal: ${formatINR(total)}\n${namePart}${phonePart}${emailPart}${notePart}Please confirm availability and delivery.`;
    const url = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto grid max-w-2xl place-items-center px-6 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Start exploring our fresh garland collections.</p>
        <Link to="/garlands" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          Shop Garlands <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-3xl md:text-4xl">Shopping cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {cartItems.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
              <Link to="/product/$id" params={{ id: product.id }} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{product.collection}</div>
                    <Link to="/product/$id" params={{ id: product.id }} className="font-medium hover:text-accent">{product.name}</Link>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-destructive" aria-label="remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => setQty(product.id, qty - 1)} className="px-3 py-1.5"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="px-3 py-1.5"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="font-semibold text-primary">{formatINR(product.price * qty)}</div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive">Clear cart</button>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(cartTotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{shipping === 0 ? "FREE" : formatINR(shipping)}</dd></div>
          </dl>
          <div className="my-5 h-px bg-border" />
          <div className="flex items-baseline justify-between font-display text-xl">
            <span>Total</span><span className="text-primary">{formatINR(total)}</span>
          </div>

          <Dialog
            open={orderOpen}
            onOpenChange={(open) => {
              setOrderOpen(open);
              if (!open) {
                setEmailError("");
                setEmailTouched(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <button className="mt-5 w-full rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground hover:brightness-110">
                Proceed to checkout
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Proceed to checkout</DialogTitle>
                <DialogDescription>Complete your order and receive a confirmation by WhatsApp.</DialogDescription>
              </DialogHeader>
              <form
                id="cart-checkout-form"
                className="grid gap-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!orderName.trim() || !orderPhone.trim()) {
                    toast.error("Please enter your name and phone.");
                    return;
                  }

                  const emailErr = validateEmail(orderEmail);
                  if (emailErr) {
                    setEmailTouched(true);
                    setEmailError(emailErr);
                    toast.error(emailErr);
                    return;
                  }

                  setIsSubmittingOrder(true);
                  try {
                    const orders = await Promise.all(
                      cartItems.map((item) =>
                        createOrder({
                          name: orderName.trim(),
                          phone: orderPhone.trim(),
                          email: orderEmail.trim(),
                          productId: item.product.id,
                          productName: item.product.name,
                          collection: item.product.collection,
                          category: item.product.category,
                          quantity: item.qty,
                          price: item.product.price,
                          size: item.product.size ?? "Medium",
                          color: item.product.colors?.[0] ?? "Standard",
                          note: orderNote,
                          image: item.product.image,
                        })
                      )
                    );
                    const firstOrderNum = orders[0]?.orderNumber;
                    toast.success(`Order placed successfully! ${firstOrderNum ? `Order #: ${firstOrderNum}` : ""}`);
                    clearCart();
                    setOrderOpen(false);
                    setOrderName("");
                    setOrderPhone("");
                    setOrderEmail("");
                    setOrderNote("");
                    setEmailError("");
                    setEmailTouched(false);
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Failed to place order.");
                  } finally {
                    setIsSubmittingOrder(false);
                  }
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="checkout-name">Name</Label>
                  <Input
                    id="checkout-name"
                    value={orderName}
                    onChange={(event) => setOrderName(event.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-phone">Phone</Label>
                  <Input
                    id="checkout-phone"
                    value={orderPhone}
                    onChange={(event) => setOrderPhone(event.target.value)}
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-email">Email</Label>
                  <Input
                    id="checkout-email"
                    value={orderEmail}
                    onChange={(event) => {
                      const val = event.target.value;
                      setOrderEmail(val);
                      if (emailTouched) {
                        setEmailError(validateEmail(val) || "");
                      }
                    }}
                    onBlur={() => {
                      setEmailTouched(true);
                      setEmailError(validateEmail(orderEmail) || "");
                    }}
                    placeholder="Email address"
                    type="email"
                    required
                    aria-invalid={!!emailError}
                    className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {emailError && (
                    <p className="text-xs text-destructive">{emailError}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-note">Notes</Label>
                  <Textarea
                    id="checkout-note"
                    value={orderNote}
                    onChange={(event) => setOrderNote(event.target.value)}
                    placeholder="Any delivery or personalization notes"
                    className="min-h-[96px]"
                  />
                </div>
              </form>
              <DialogFooter className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOrderOpen(false)}
                  disabled={isSubmittingOrder}
                >
                  Cancel
                </Button>
                <Button type="button" variant="outline" onClick={openWhatsappOrder} disabled={isSubmittingOrder}>
                  Order on WhatsApp
                </Button>
                <Button type="submit" form="cart-checkout-form" disabled={isSubmittingOrder}>
                  {isSubmittingOrder ? "Placing order..." : "Place order"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">Secure payments · Razorpay · UPI · Cards · COD</p>
        </aside>
      </div>
    </div>
  );
}

