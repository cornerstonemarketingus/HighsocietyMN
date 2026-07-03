import { NextResponse } from "next/server";
import { sendEmailCampaign } from "@/lib/store";

export function POST() {
  return NextResponse.json(sendEmailCampaign());
}
