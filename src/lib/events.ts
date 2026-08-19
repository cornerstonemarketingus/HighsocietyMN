export type SiteEvent = "product.added" | "checkout.started";

export function trackEvent(event: SiteEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ event, properties });
  if (navigator.sendBeacon) navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
  else void fetch("/api/events", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
}
