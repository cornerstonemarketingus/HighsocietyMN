import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function distanceMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radius = 3958.8;
  const toRadians = (value: number) => value * Math.PI / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get("lat"));
  const lon = Number(req.nextUrl.searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: "Valid coordinates are required." }, { status: 400 });
  }

  const query = `[out:json][timeout:20];
    (
      node["shop"="cannabis"](around:80000,${lat},${lon});
      way["shop"="cannabis"](around:80000,${lat},${lon});
      relation["shop"="cannabis"](around:80000,${lat},${lon});
    );
    out center tags;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: query }),
      signal: AbortSignal.timeout(25000),
      next: { revalidate: 1800 },
    });
    if (!response.ok) throw new Error(`Overpass returned ${response.status}`);
    const data = await response.json() as { elements?: OverpassElement[] };
    const places = (data.elements ?? []).flatMap((element) => {
      const placeLat = element.lat ?? element.center?.lat;
      const placeLon = element.lon ?? element.center?.lon;
      if (placeLat == null || placeLon == null) return [];
      const tags = element.tags ?? {};
      const address = [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:city"],
        tags["addr:state"],
      ].filter(Boolean).join(" ");
      return [{
        id: String(element.id),
        name: tags.name || tags.brand || "Cannabis dispensary",
        address: address || "Address available in directions",
        distanceMiles: Number(distanceMiles(lat, lon, placeLat, placeLon).toFixed(1)),
        openingHours: tags.opening_hours || null,
        website: tags.website || tags["contact:website"] || null,
        phone: tags.phone || tags["contact:phone"] || null,
        latitude: placeLat,
        longitude: placeLon,
      }];
    }).sort((a, b) => a.distanceMiles - b.distanceMiles).slice(0, 20);
    return NextResponse.json({ places, source: "OpenStreetMap contributors" });
  } catch (error) {
    console.error("Dispensary lookup failed:", error);
    return NextResponse.json({ error: "Nearby dispensaries are temporarily unavailable." }, { status: 502 });
  }
}
