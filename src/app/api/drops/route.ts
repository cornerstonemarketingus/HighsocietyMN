import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Return upcoming drops: all active DropEvents in the future, plus next computed drop dates
    const now = new Date();
    const dbDrops = await db.dropEvent.findMany({
      where: { active: true, dropDate: { gte: now } },
      orderBy: { dropDate: "asc" },
      take: 10,
    });

    // Compute next 3 drop dates (Tue=2, Thu=4, Sat=6) at 10:00 AM local (store uses CT)
    const dropDays = [2, 4, 6]; // Tue, Thu, Sat
    const upcoming: Array<{ date: string; label: string }> = [];
    const cursor = new Date(now);
    while (upcoming.length < 3) {
      cursor.setDate(cursor.getDate() + 1);
      if (dropDays.includes(cursor.getDay())) {
        const dropDate = new Date(cursor);
        dropDate.setHours(10, 0, 0, 0);
        const dayName = dropDate.toLocaleDateString("en-US", { weekday: "long" });
        const dateStr = dropDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        upcoming.push({ date: dropDate.toISOString(), label: `${dayName}, ${dateStr} @ 10am` });
      }
    }

    return NextResponse.json({ drops: dbDrops, upcoming });
  } catch (err) {
    console.error("Drops API error:", err);
    return NextResponse.json({ error: "Failed to load drops" }, { status: 500 });
  }
}
