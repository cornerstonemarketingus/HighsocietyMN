import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_LAT = 44.8041;
const DEFAULT_LNG = -93.1669;
const MAX_RADIUS_METERS = 50000;

function numberParam(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const lat = numberParam(request.nextUrl.searchParams.get("lat"), DEFAULT_LAT);
  const lng = numberParam(request.nextUrl.searchParams.get("lng"), DEFAULT_LNG);
  const requestedRadius = numberParam(request.nextUrl.searchParams.get("radius"), 25000);
  const radius = Math.min(Math.max(requestedRadius, 1000), MAX_RADIUS_METERS);

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const query = `
    [out:json][timeout:20];
    (
      nwr["shop"="cannabis"](around:${radius},${lat},${lng});
      nwr["amenity"="dispensary"](around:${radius},${lat},${lng});
      nwr["healthcare"="dispensary"](around:${radius},${lat},${lng});
    );
    out center tags;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: query }),
      cache: "no-store",
      signal: AbortSignal.timeout(22000),
    });

    if (!response.ok) {
      throw new Error(`Overpass returned ${response.status}`);
    }

    const data = await response.json();
    const dispensaries = (data.elements ?? [])
      .map((element: any) => {
        const tags = element.tags ?? {};
        const itemLat = element.lat ?? element.center?.lat;
        const itemLng = element.lon ?? element.center?.lon;
        if (!Number.isFinite(itemLat) || !Number.isFinite(itemLng)) return null;

        const street = [tags["addr:housenumber"], tags["addr:street"]]
          .filter(Boolean)
          .join(" ");
        const locality = [tags["addr:city"], tags["addr:state"], tags["addr:postcode"]]
          .filter(Boolean)
          .join(", ");

        return {
          id: `${element.type}-${element.id}`,
          name: tags.name || tags.brand || "Cannabis retailer",
          latitude: itemLat,
          longitude: itemLng,
          address: [street, locality].filter(Boolean).join(", ") || null,
          phone: tags.phone || tags["contact:phone"] || null,
          website: tags.website || tags["contact:website"] || null,
          hours: tags.opening_hours || null,
          source: "OpenStreetMap contributors",
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { dispensaries, center: { lat, lng }, radius },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("BudSeeker lookup failed", error);
    return NextResponse.json(
      {
        dispensaries: [],
        center: { lat, lng },
        radius,
        warning: "Nearby listings are temporarily unavailable. Try again shortly.",
      },
      { status: 200 }
    );
  }
}
