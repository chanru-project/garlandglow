import { fetchWithTimeout } from "@/lib/http";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const ssrFallbackApiBaseUrl = import.meta.env.PROD ? "" : "http://localhost:5000";

function resolveApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (apiBaseUrl) {
    return `${apiBaseUrl}${normalizedPath}`;
  }
  if (typeof window === "undefined") {
    return `${ssrFallbackApiBaseUrl}${normalizedPath}`;
  }
  return normalizedPath;
}

export type GoogleAuthUser = {
  id: string;
  name: string;
  email: string;
  picture: string;
  authProvider: string;
};

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

export async function verifyGoogleCredential(credential: string): Promise<GoogleAuthUser> {
  const response = await fetchWithTimeout(
    resolveApiUrl("/api/auth/google"),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    },
    20000,
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new AuthApiError(payload?.message || "Google sign-in failed. Please try again.", response.status);
  }

  return payload.user as GoogleAuthUser;
}
