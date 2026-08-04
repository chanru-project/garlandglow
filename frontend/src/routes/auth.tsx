import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState, type FormEvent } from "react";
import { useRouter, Link } from "@tanstack/react-router";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in | Malligai" }, { name: "robots", content: "noindex" }] }),
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
      <div className="mx-auto grid max-w-md px-6 py-16 text-center">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
          <div className="text-xs uppercase tracking-[0.3em] text-accent">Account active</div>
          <h1 className="mt-1 font-display text-3xl">Welcome back, {currentUser.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">You are signed in as {currentUser.email}.</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/wishlist" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground">
              Go to wishlist
            </Link>
            <button
              onClick={() => {
                signOut();
                toast.success("Signed out successfully");
              }}
              className="inline-flex items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 px-6 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = mode === "login"
      ? signIn(email, password)
      : signUp(name, email, password);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(mode === "login" ? "Signed in" : "Account created", {
      description: mode === "login" ? "You can now save items to your wishlist." : "Your account is ready.",
    });
    router.navigate({ to: "/wishlist" });
  };

  return (
    <div className="mx-auto grid max-w-md px-6 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
        <div className="text-xs uppercase tracking-[0.3em] text-accent">Welcome</div>
        <h1 className="mt-1 font-display text-3xl">{mode === "login" ? "Sign in" : "Create account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Sign in to save items to your wishlist." : "Create an account to keep your saved items."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            />
          )}
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
          />
          <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "login" ? "New to Malligai?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-semibold text-accent hover:underline">
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
