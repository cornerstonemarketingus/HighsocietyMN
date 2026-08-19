type RuntimeEnvironment = Record<string, string | undefined>;

function present(env: RuntimeEnvironment, key: string) {
  return Boolean(env[key]?.trim());
}

export function getRuntimeReadiness(env: RuntimeEnvironment = process.env) {
  const googleClientId = present(env, "GOOGLE_CLIENT_ID");
  const googleClientSecret = present(env, "GOOGLE_CLIENT_SECRET");
  const stripeSecret = present(env, "STRIPE_SECRET_KEY");
  const stripePublishable = present(env, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  const stripeWebhook = present(env, "STRIPE_WEBHOOK_SECRET");

  return {
    required: {
      database: present(env, "DATABASE_URL"),
      authSecret: present(env, "AUTH_SECRET") || present(env, "NEXTAUTH_SECRET"),
      canonicalUrl: present(env, "AUTH_URL") || present(env, "NEXTAUTH_URL"),
    },
    capabilities: {
      stripeCheckout: stripeSecret && stripePublishable && stripeWebhook,
      googleSignIn: googleClientId && googleClientSecret,
      ollama: present(env, "LLM_BASE_URL"),
      errorAlerts: present(env, "ERROR_WEBHOOK_URL"),
      scheduledCatalogSync: present(env, "CRON_SECRET"),
    },
    partial: {
      googleSignIn: googleClientId !== googleClientSecret,
      stripe: new Set([stripeSecret, stripePublishable, stripeWebhook]).size > 1,
    },
  };
}

export function hasGoogleCredentials(env: RuntimeEnvironment = process.env) {
  return getRuntimeReadiness(env).capabilities.googleSignIn;
}
