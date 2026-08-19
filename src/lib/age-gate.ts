export const AGE_GATE_COOKIE_NAME = "hs_age_verified_v2";
export const AGE_GATE_COOKIE_VALUE = "true";

const AGE_GATE_PROTECTED_PREFIXES = [
  "/products",
  "/drops",
  "/spin",
  "/blog",
  "/forum",
  "/cart",
  "/checkout",
];

export function isAgeGateProtectedPath(pathname: string): boolean {
  return AGE_GATE_PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function safeAgeGateReturnTo(value: string | null): string | null {
  return value?.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : null;
}
