import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Initial stub endpoint; replace with real provider integration in the Weed Seeker milestone.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  const radiusKm = url.searchParams.get("radiusKm") ?? "5";

  const places = [
    {
      id: "stub-1",
      name: "High Society MN (Demo Listing)",
      category: "dispensary",
      lat: Number(lat ?? "44.9537"),
      lng: Number(lng ?? "-93.0900"),
      address: "Saint Paul, MN (demo)",
      phone: "(651) 000-0000",
      website: "https://www.highsocietymn.com",
      hours: "Open today 10am-8pm",
      rating: 4.8,
      isOpenNow: true,
      distanceKm: Number(radiusKm),
    },
    {
      id: "stub-2",
      name: "Local Head Shop (Demo Listing)",
      category: "head_shop",
      lat: Number(lat ?? "44.95") + 0.01,
      lng: Number(lng ?? "-93.09") - 0.01,
      address: "Minneapolis, MN (demo)",
      phone: "(612) 000-0000",
      website: "https://example.com",
      hours: "Open today 11am-7pm",
      rating: 4.4,
      isOpenNow: false,
      distanceKm: Number(radiusKm) * 1.4,
    },
  ];

  return NextResponse.json({ places });
}
