import { headers } from "next/headers";

export async function getUserId() {
  const value = (await headers()).get("x-user-id");
  return value || "demo-user";
}
