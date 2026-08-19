import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function WeedSeekerAliasPage() {
  redirect(process.env.NEXT_PUBLIC_BUDSEEKER_URL ?? "https://budseeker-mn.vercel.app");
}
