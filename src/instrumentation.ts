import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const message = error instanceof Error ? error.message : String(error);
  const digest = typeof error === "object" && error !== null && "digest" in error ? String(error.digest) : undefined;
  const event = { event: "server.request.error", message, digest, path: request.path, method: request.method, route: context.routePath, routeType: context.routeType, at: new Date().toISOString() };
  console.error(JSON.stringify(event));

  if (process.env.ERROR_WEBHOOK_URL) {
    await fetch(process.env.ERROR_WEBHOOK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(event) }).catch(() => undefined);
  }
};
