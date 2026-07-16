export const AGE_GATE_COOKIE_NAME = "hs_age_verified";
export const AGE_GATE_COOKIE_VALUE = "true";
export const AGE_GATE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const AGE_GATE_PROTECTED_PREFIXES = [
  "/products",
  "/budseeker",
  "/weed-seeker",
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
