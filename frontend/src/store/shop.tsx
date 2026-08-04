import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Product } from "@/data/products";

type CartItem = { id: string; qty: number };
type Account = { name: string; email: string; password: string; wishlist: string[] };
type Session = { email: string } | null;

type AuthResult = { ok: true } | { ok: false; error: string };

type ShopCtx = {
  cart: CartItem[];
  wishlist: string[];
  currentUser: { name: string; email: string } | null;
  isAuthenticated: boolean;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => boolean;
  inWishlist: (id: string) => boolean;
  signIn: (email: string, password: string) => AuthResult;
  signUp: (name: string, email: string, password: string) => AuthResult;
  signOut: () => void;
  cartCount: number;
  cartTotal: number;
  cartItems: (CartItem & { product: Product })[];
};

const Ctx = createContext<ShopCtx | null>(null);

function useLocal<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setIsHydrated(true);
  }, [key]);

  useEffect(() => {
    if (isHydrated) {
      try { window.localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore */ }
    }
  }, [key, state, isHydrated]);

  return [state, setState] as const;
}

function normalizeEmail(email?: string) {
  return String(email || "").trim().toLowerCase();
}

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids));
}

function normalizeWishlist(ids: string[]) {
  return uniqueIds(ids).filter((id) => Boolean(getProduct(id)));
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocal<CartItem[]>("malligai_cart", []);
  const [accounts, setAccounts] = useLocal<Account[]>("malligai_accounts", []);
  const [session, setSession] = useLocal<Session>("malligai_session", null);

  const currentUser = useMemo(() => {
    if (!session) return null;
    const account = accounts.find((item) => item.email === session.email);
    return account ? { name: account.name, email: account.email } : null;
  }, [accounts, session]);

  useEffect(() => {
    if (session && !currentUser) setSession(null);
  }, [currentUser, session, setSession]);

  useEffect(() => {
    setAccounts((prev) => {
      let changed = false;
      const next = prev.map((account) => {
        const wishlist = normalizeWishlist(account.wishlist);
        if (wishlist.length === account.wishlist.length) return account;
        changed = true;
        return { ...account, wishlist };
      });
      return changed ? next : prev;
    });
  }, [setAccounts]);

  const value = useMemo<ShopCtx>(() => {
    const cartItems = cart
      .map((c) => ({ ...c, product: getProduct(c.id)! }))
      .filter((c) => c.product);
    const currentWishlist = session
      ? normalizeWishlist(accounts.find((item) => item.email === session.email)?.wishlist ?? [])
      : [];
    return {
      cart,
      wishlist: currentWishlist,
      currentUser,
      isAuthenticated: Boolean(currentUser),
      cartItems,
      cartCount: cart.reduce((n, i) => n + i.qty, 0),
      cartTotal: cartItems.reduce((n, i) => n + i.product.price * i.qty, 0),
      addToCart: (id, qty = 1) =>
        setCart((prev) => {
          const existing = prev.find((x) => x.id === id);
          if (existing) return prev.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x));
          return [...prev, { id, qty }];
        }),
      removeFromCart: (id) => setCart((prev) => prev.filter((x) => x.id !== id)),
      setQty: (id, qty) =>
        setCart((prev) =>
          qty <= 0 ? prev.filter((x) => x.id !== id) : prev.map((x) => (x.id === id ? { ...x, qty } : x)),
        ),
      clearCart: () => setCart([]),
      toggleWishlist: (id) => {
        if (!session) return false;
        let updated = false;
        setAccounts((prev) =>
          prev.map((account) => {
            if (account.email !== session.email) return account;
            updated = true;
            const wishlist = normalizeWishlist(account.wishlist);
            return wishlist.includes(id)
              ? { ...account, wishlist: wishlist.filter((itemId) => itemId !== id) }
              : getProduct(id)
                ? { ...account, wishlist: [...wishlist, id] }
                : account;
          }),
        );
        if (!updated) return false;
        return true;
      },
      inWishlist: (id) => Boolean(session && normalizeWishlist(accounts.find((item) => item.email === session.email)?.wishlist ?? []).includes(id)),
      signIn: (email, password) => {
        const normalizedEmail = normalizeEmail(email);
        const account = accounts.find((item) => item.email === normalizedEmail);
        if (!account) return { ok: false, error: "No account found with this email. Please create one first." };
        if (account.password !== password) return { ok: false, error: "Email or password is incorrect." };
        setSession({ email: normalizedEmail });
        return { ok: true };
      },
      signUp: (name, email, password) => {
        const normalizedEmail = normalizeEmail(email);
        if (!name.trim()) return { ok: false, error: "Please enter your name." };
        if (!normalizedEmail) return { ok: false, error: "Please enter your email." };
        if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
        if (accounts.some((item) => item.email === normalizedEmail)) {
          return { ok: false, error: "An account already exists with this email." };
        }
        setAccounts((prev) => [...prev, { name: name.trim(), email: normalizedEmail, password, wishlist: [] }]);
        setSession({ email: normalizedEmail });
        return { ok: true };
      },
      signOut: () => setSession(null),
    };
  }, [accounts, cart, currentUser, session, setAccounts, setCart, setSession]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
