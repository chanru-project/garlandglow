import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState, type FormEvent } from "react";
import { useRouter, Link } from "@tanstack/react-router";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in | DUVIX" }, { name: "robots", content: "noindex" }] }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, isAuthenticated, currentUser, signOut } = useShop();
  const router = useRouter();

  if (isAuthenticated && currentUser) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-display text-3xl">My Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Signed in as {currentUser.email}</p>
        <p className="mt-1 text-sm font-medium">{currentUser.name}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link to="/wishlist" className="rounded-full border border-border py-2 text-sm font-semibold hover:border-accent">
            View Wishlist
          </Link>
          <button
            onClick={() => {
              signOut();
              toast("Signed out");
            }}
            className="rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (mode === "login") {
      const ok = signIn(email, password);
      if (!ok) {
        toast.error("Invalid email or password.");
        return;
      }
      toast.success("Welcome back!");
      router.history.back();
    } else {
      signUp(email, password, name);
      toast.success("Account created!");
      router.history.back();
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-3xl">{mode === "login" ? "Sign in" : "Create an account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Access your saved items & orders" : "Save your favorite garlands & faster checkout"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            />
          )}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
          <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "login" ? "New to DUVIX?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-semibold text-accent hover:underline">
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
