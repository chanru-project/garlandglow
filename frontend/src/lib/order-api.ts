const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const ssrFallbackApiBaseUrl = import.meta.env.PROD ? "" : "http://localhost:5000";
import { fetchWithTimeout } from "@/lib/http";

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithTimeout(resolveApiUrl(path), init, 20000);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export type CreateOrderPayload = {
  name: string;
  phone: string;
  email: string;
  productId: string;
  productName: string;
  collection: string;
  category: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  note?: string;
  image: string;
};

export type CreateOrderResponse = {
  message: string;
  orderId: string;
  orderNumber: string;
};

export async function createOrder(payload: CreateOrderPayload) {
  return request<CreateOrderResponse>("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
