import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { formatINR, getProductPriceSuffix, isFlowerString, isLooseFlower, type Product } from "@/data/products";
import { useShop } from "@/store/shop";
import { Heart, ShoppingBag, Star, Truck, Shield, Award, Check } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { fetchFlowerById, fetchFlowersByCategory, FlowerApiError } from "@/lib/flower-api";
import { createOrder } from "../lib/order-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const product = await fetchFlowerById(params.id);
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.product.name} | DUVIX` },
        { name: "description", content: loaderData.product.description.slice(0, 155) },
        { property: "og:title", content: loaderData.product.name },
        { property: "og:image", content: loaderData.product.image },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl p-16 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/garlands" className="mt-4 inline-block text-accent hover:underline">Browse garlands</Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-2xl p-16 text-center">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <button onClick={reset} className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">Try again</button>
    </div>
  ),
  component: ProductPage,
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

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const isLoose = isLooseFlower(product);
  const isString = isFlowerString(product);
  const isGiftProduct =
    product.collection?.toLowerCase().includes("gift") ||
    // product.category === "gifts" ||
    String(product.sourceCategory || "").toLowerCase().includes("gift") ||
    product.name?.toLowerCase().includes("gift");
  const unitSuffix = getProductPriceSuffix(product);

  const sizeOptions = isLoose
    ? ["1 kg", "2 kg", "3 kg", "5 kg", "10 kg"]
    : isString
    ? ["1 feet", "2 feet", "3 feet", "4 feet", "5 feet", "6 feet", "8 feet", "10 feet"]
    : ["Small", "Medium", "Large", "XL"];

  const defaultSize = product.size ?? (isLoose ? "1 kg" : isString ? "1 feet" : "Medium");
  const hasColors = !isString && Boolean(product.colors && product.colors.length > 0);
  const [size, setSize] = useState(defaultSize);
  const [color, setColor] = useState(hasColors ? product.colors?.[0] ?? "Red" : "");
  const [qty, setQty] = useState(1);
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);
  const wished = inWishlist(product.id);

  const totalPrice = qty * product.price;

  function openWhatsappOrder() {
    const ownerNumber = "918637686493"; // merchant WhatsApp (no +)
    const namePart = orderName.trim() ? `Name: ${orderName.trim()}\n` : "";
    const phonePart = orderPhone.trim() ? `Phone: ${orderPhone.trim()}\n` : "";
    const emailPart = orderEmail.trim() ? `Email: ${orderEmail.trim()}\n` : "";
    const notePart = orderNote.trim() ? `Notes: ${orderNote.trim()}\n` : "";
    const colorPart = hasColors && color ? `Color: ${color}\n` : "";
    const pricePart = isGiftProduct ? "Price: Contact for pricing / Custom Gift Quote\n" : `Price: ${formatINR(totalPrice)}\n`;
    const msg = `Hello, I would like to place an order:\nProduct: ${product.name}\nQty: ${qty}\nSize: ${size}\n${colorPart}${pricePart}${namePart}${phonePart}${emailPart}${notePart}Please confirm availability and delivery.`;
    const url = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    let isMounted = true;

    const loadRelatedProducts = async () => {
      if (!product.sourceCategory) {
        if (isMounted) setRelated([]);
        return;
      }

      try {
        const byCategory = await fetchFlowersByCategory(product.sourceCategory);
        if (!isMounted) return;
        setRelated(byCategory.filter((item) => item.id !== product.id).slice(0, 4));
      } catch {
        if (isMounted) setRelated([]);
      }
    };

    void loadRelatedProducts();

    return () => {
      isMounted = false;
    };
  }, [product.id, product.sourceCategory]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-accent">Home</Link> ·{" "}
        <Link to={product.category === "garlands" ? "/garlands" : "/flowers"} className="hover:text-accent">
          {product.category === "garlands" ? "Garlands" : "Flowers"}
        </Link> ·{" "}
        <span className="text-foreground">{product.collection}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-secondary/30 shadow-elegant">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[product.image, product.image, product.image, product.image].map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg border border-border">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          {product.badge && (
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
              {product.badge}
            </span>
          )}
          <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{product.collection}</div>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">{product.name}</h1>
          {!isGiftProduct ? (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-primary-foreground">
                <Star className="h-3 w-3 fill-gold text-gold" />
                <span className="font-semibold">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">{product.reviews} reviews</span>
              <span className="text-muted-foreground">·</span>
              <span className={product.inStock ? "text-primary" : "text-destructive"}>
                {product.inStock ? "In stock" : "Out of stock"}
              </span>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className={product.inStock ? "text-primary" : "text-destructive"}>
                {product.inStock ? "In stock" : "Out of stock"}
              </span>
            </div>
          )}

          {!isGiftProduct && (
            <>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-4xl font-semibold text-primary">
                  {formatINR(product.price)}{unitSuffix}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatINR(product.mrp)}{unitSuffix}
                    </span>
                  </>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</div>
            </>
          )}

          <p className="mt-6 text-sm leading-relaxed text-foreground/80">{product.description}</p>

          {hasColors && product.colors && (
            <div className="mt-6">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider">Color</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c: string) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full border px-4 py-1.5 text-sm ${color === c ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"}`}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider">
              {isLoose ? "Weight" : isString ? "Length" : "Size"}
            </div>
            {/* Desktop/tablet size selector */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${size === s ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"}`}
                >{s}</button>
              ))}
            </div>

            {/* Mobile: show a sticky bottom bar that opens a sheet for size/actions */}
            <div className="sm:hidden">
              <div className="fixed inset-x-4 bottom-4 z-50">
                <Sheet>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">{product.collection}</div>
                      <div className="font-medium">{product.name}</div>
                      {!isGiftProduct && (
                        <div className="text-sm text-muted-foreground">
                          {formatINR(product.price)}{unitSuffix}
                        </div>
                      )}
                    </div>
                    <SheetTrigger asChild>
                      <button className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
                        {isLoose ? "Choose weight" : isString ? "Choose length" : "Choose size"}
                      </button>
                    </SheetTrigger>
                  </div>

                  <SheetContent side="bottom">
                    <SheetHeader>
                      <SheetTitle>{isLoose ? "Select weight" : isString ? "Select length" : "Select size"}</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-3">
                      <div className="flex flex-wrap gap-2">
                        {sizeOptions.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSize(s)}
                            className={`rounded-full border px-4 py-2 text-sm ${size === s ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"}`}
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                    <SheetFooter />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className="mt-4">
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
                <button className="block w-full rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground hover:brightness-110">
                  Buy now
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Buy now</DialogTitle>
                  <DialogDescription>Complete your order and receive a confirmation by WhatsApp.</DialogDescription>
                </DialogHeader>
                <form
                  id="buy-now-form"
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
                      const response = await createOrder({
                        name: orderName.trim(),
                        phone: orderPhone.trim(),
                        email: orderEmail.trim(),
                        productId: product.id,
                        productName: product.name,
                        collection: product.collection,
                        category: product.category,
                        quantity: qty,
                        price: product.price,
                        size,
                        color: hasColors ? color : "",
                        note: orderNote,
                        image: product.image,
                      });
                      toast.success(`Order placed! ${response.orderNumber}`);
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
                      <Label htmlFor="buy-name">Name</Label>
                      <Input
                        id="buy-name"
                        value={orderName}
                        onChange={(event) => setOrderName(event.target.value)}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="buy-phone">Phone</Label>
                      <Input
                        id="buy-phone"
                        value={orderPhone}
                        onChange={(event) => setOrderPhone(event.target.value)}
                        placeholder="Phone number"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="buy-email">Email</Label>
                      <Input
                        id="buy-email"
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
                      <Label htmlFor="buy-note">Notes</Label>
                      <Textarea
                        id="buy-note"
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
                  <Button type="submit" form="buy-now-form" disabled={isSubmittingOrder}>
                    {isSubmittingOrder ? "Placing order..." : "Place order"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-5 text-sm">
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> Garlands are delivered on order confirmation</div>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-accent" /> Freshness guarantee — 100% refund on quality issues</div>
            <div className="flex items-center gap-2"><Award className="h-4 w-4 text-accent" /> Assembled by master florists using premium blooms</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> Custom sizing, colors and personalized message cards</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl md:text-3xl">You may also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
