import { Link, useLocation } from "@tanstack/react-router";
import { Home, Grid2x2, Search, User, ShoppingBag, Mail, MapPin } from "lucide-react";

const MOBILE_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/collections", label: "Categories", icon: Grid2x2 },
  { to: "/search", label: "Search", icon: Search },
  { to: "/auth", label: "Account", icon: User },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
];

export function Footer() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (to: string) => {
    if (pathname === to) return true;
    if (to === "/collections" && pathname.startsWith("/collections")) return true;
    if (to === "/search" && pathname.startsWith("/search")) return true;
    if (to === "/flowers" && pathname.startsWith("/flowers")) return true;
    return false;
  };

  return (
    <footer className="mt-16 border-t border-border bg-primary text-primary-foreground sm:mt-20 md:mt-20">
      <div className="hidden md:block">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-4 md:gap-10">
          <div>
            <div className="font-display text-2xl sm:text-3xl">DUVIX <br /> "Flowers & Events"</div>
            <p className="mt-2 text-sm opacity-80">
              Fresh, hand-crafted garlands & flowers for every sacred moment & event management.
              Delivered across DINDIGUL, MADURAI, CHENNAI and shipped PAN-INDIA.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-display text-lg">Shop</h4>
            <ul className="space-y-2 text-sm opacity-85">
              <li><Link to="/garlands">All Garlands</Link></li>
              <li><Link to="/flowers">All Flowers</Link></li>
              <li><Link to="/collections/$slug" params={{ slug: "wedding" }}>Events</Link></li>
              <li><Link to="/gifts">Gift</Link></li>
              <li><Link to="/custom">Custom Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-lg">Support</h4>
            <ul className="space-y-2 text-sm opacity-85">
              <li><Link to="/track">Track your order</Link></li>
              <li><Link to="/contact">Shipping & Returns</Link></li>
              <li><Link to="/about">About DUVIX</Link></li>
              <li><a href="#">Contact US</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-lg">Visit us</h4>
            <p className="flex gap-2 text-sm opacity-85"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />Flower Market, Nlakottai, Dindigul 624208</p>
            <p className="mt-2 flex gap-2 text-sm opacity-85"><Mail className="mt-0.5 h-4 w-4 shrink-0" />duvixgarlandss@gmail.com</p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-4 text-center text-xs opacity-70">
          © {new Date().getFullYear()}  Garlands, Flowers & Events – Crafted with Love by DUVIX
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 px-2 pb-3 pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] md:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-1">
          {MOBILE_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-1 flex-col items-center justify-center rounded-xl px-1 py-2 text-[11px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="mt-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </footer>
  );
}
