import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, Link } from "@tanstack/react-router";
import { useShop } from "@/store/shop";
import { verifyGoogleCredential } from "@/lib/auth-api";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in | DUVIX" }, { name: "robots", content: "noindex" }] }),
  component: Auth,
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          prompt: (callback?: (notification: unknown) => void) => void;
          disableAutoSelect?: () => void;
        };
      };
    };
  }
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

// Module-level singletons: Google Identity Services must only be loaded/initialized once per
// page, regardless of how many times the Auth component mounts (e.g. after navigating away and
// back, or unrelated store updates re-rendering this route). Re-running initialize()/renderButton()
// repeatedly caused the intermittent, device-dependent sign-in failures.
let googleScriptPromise: Promise<void> | null = null;
let googleInitPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Failed to load Google Sign-In script.")));
        return;
      }
      const script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Google Sign-In script."));
      document.head.appendChild(script);
    });
  }
  return googleScriptPromise;
}

function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<"loading" | "ready" | "error">("loading");
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const { signIn, signUp, signInWithGoogle, isAuthenticated, currentUser, signOut } = useShop();
  const router = useRouter();

  // Kept up to date every render, but read via .current inside the stable credential callback below
  // so the one-time initialize() call never needs to be re-run when these identities change.
  const latestRef = useRef({ signInWithGoogle, router });
  latestRef.current = { signInWithGoogle, router };

  useEffect(() => {
    if (isAuthenticated) return;

    if (!GOOGLE_CLIENT_ID) {
      console.error("[auth] VITE_GOOGLE_CLIENT_ID is not set. Google sign-in is disabled.");
      setGoogleStatus("error");
      return;
    }

    let cancelled = false;

    const handleCredentialResponse = async (response: { credential?: string }) => {
      if (!response?.credential) {
        toast.error("Google sign-in was cancelled.");
        return;
      }
      setGoogleLoading(true);
      try {
        const user = await verifyGoogleCredential(response.credential);
        const result = latestRef.current.signInWithGoogle(user);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success("Signed in with Google!");
        latestRef.current.router.history.back();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Google sign-in failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    };

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) {
          throw new Error("Google Identity Services did not load correctly.");
        }
        if (!googleInitPromise) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response: { credential?: string }) => handleCredentialResponse(response),
          });
          googleInitPromise = Promise.resolve();
        }
        if (!cancelled) setGoogleStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("[auth] Google sign-in initialization failed:", error);
        setGoogleStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // Intentionally only depends on isAuthenticated: initialize() must run at most once per page
    // load. Depending on `signInWithGoogle`/`router` here would re-run this effect (and re-init GIS)
    // whenever unrelated store state changes recreate those function identities.
  }, [isAuthenticated]);

  // Render (or re-render) the actual Google button whenever the container becomes available or the
  // mode changes, independent of the one-time initialize() above.
  useEffect(() => {
    if (googleStatus !== "ready" || !googleButtonRef.current || !window.google?.accounts?.id) return;
    const container = googleButtonRef.current;
    container.innerHTML = "";
    const width = Math.min(400, Math.max(240, Math.round(container.clientWidth || 320)));
    window.google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "pill",
      width,
      text: mode === "login" ? "signin_with" : "signup_with",
    });
  }, [googleStatus, mode]);

  const handleGoogleFallbackClick = () => {
    if (googleStatus === "error") {
      toast.error("Google sign-in is unavailable right now. Please try again later.");
      return;
    }
    toast.error("Google sign-in is still loading. Please try again in a moment.");
  };

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
      const result = signIn(email, password);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Welcome back!");
      router.history.back();
    } else {
      const result = signUp(name, email, password);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
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

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="relative w-full">
          <button
            type="button"
            onClick={googleStatus !== "ready" ? handleGoogleFallbackClick : undefined}
            disabled={googleLoading}
            aria-hidden={googleStatus === "ready"}
            tabIndex={googleStatus === "ready" ? -1 : 0}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-white py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleLogo />
            {googleLoading ? "Signing in…" : "Continue with Google"}
          </button>
          {/* Google's real (accessible, popup-based) button is overlaid invisibly on top so clicks open the official account chooser reliably. */}
          <div
            ref={googleButtonRef}
            aria-hidden={googleStatus !== "ready"}
            className={`absolute inset-0 overflow-hidden rounded-full opacity-0 [&>div]:!w-full [&_iframe]:!w-full ${
              googleStatus === "ready" ? "pointer-events-auto" : "pointer-events-none"
            }`}
          />
        </div>

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
