import { redirect } from "next/navigation";

export default function Page() {
  redirect(process.env.NEXT_PUBLIC_BUDSEEKER_URL ?? "https://budseeker-mn.vercel.app");
}
