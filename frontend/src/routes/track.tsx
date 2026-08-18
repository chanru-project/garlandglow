import { createFileRoute } from "@tanstack/react-router";
import { Package, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Track Order | DUVIX" }] }),
  component: Track,
});

function Track() {
  const [id, setId] = useState("");
  const [shown, setShown] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="text-xs uppercase tracking-[0.3em] text-accent">Order tracking</div>
      <h1 className="mt-2 font-display text-4xl">Track your order</h1>
      <form onSubmit={(e) => { e.preventDefault(); setShown(true); }} className="mt-6 flex gap-2">
        <input required value={id} onChange={(e) => setId(e.target.value)} placeholder="Order ID (e.g. MG-12345)" className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-sm outline-none focus:border-accent" />
        <button className="rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">Track</button>
      </form>

      {shown && (
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-accent" />
            <div>
              <div className="text-sm text-muted-foreground">Order</div>
              <div className="font-display text-xl">{id}</div>
            </div>
          </div>
          <ol className="mt-6 space-y-4">
            {[
              { t: "Order confirmed", d: "Today, 9:12 AM", done: true },
              { t: "Flowers sourced from farm", d: "Today, 11:30 AM", done: true },
              { t: "Assembled by master florist", d: "Today, 2:45 PM", done: true },
              { t: "Out for delivery", d: "Expected 5:30 PM", done: false },
              { t: "Delivered", d: "Pending", done: false },
            ].map((s, i) => (
              <li key={i} className="flex gap-3">
                <div className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full ${s.done ? "bg-accent text-accent-foreground" : "border border-border bg-background"}`}>
                  {s.done && <Check className="h-3.5 w-3.5" />}
                </div>
                <div>
                  <div className="font-medium">{s.t}</div>
                  <div className="text-xs text-muted-foreground">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
