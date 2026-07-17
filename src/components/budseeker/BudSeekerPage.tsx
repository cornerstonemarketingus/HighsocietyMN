"use client";

import { useMemo, useState } from "react";
import { MapPin, Navigation, Phone, Search, Sparkles, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type BudSeekerCategory = "dispensary" | "head_shop" | "cbd" | "thca" | "accessories";

type BudSeekerPlace = {
  id: string;
  name: string;
  category: BudSeekerCategory;
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  website?: string;
  hours?: string;
  rating?: number;
  isOpenNow?: boolean;
  distanceKm?: number;
};

function categoryLabel(c: BudSeekerCategory) {
  switch (c) {
    case "dispensary":
      return "Dispensary";
    case "head_shop":
      return "Head Shop";
    case "cbd":
      return "CBD";
    case "thca":
      return "THCA";
    case "accessories":
      return "Accessories";
  }
}

export default function BudSeekerPage() {
  const [mode, setMode] = useState<"gps" | "zip" | "city">("gps");
  const [zip, setZip] = useState("55101");
  const [city, setCity] = useState("Saint Paul");
  const [radiusKm, setRadiusKm] = useState(5);

  const [gpsStatus, setGpsStatus] = useState<"idle" | "requesting" | "denied" | "ready">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [places, setPlaces] = useState<BudSeekerPlace[]>([]);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => places, [places]);

  async function fetchNearby(lat?: number, lng?: number) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeof lat === "number") params.set("lat", String(lat));
      if (typeof lng === "number") params.set("lng", String(lng));
      params.set("radiusKm", String(radiusKm));

      const res = await fetch(`/api/budseeker/nearby?${params.toString()}`);
      const data = (await res.json()) as { places: BudSeekerPlace[] };
      setPlaces(data.places ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function requestGps() {
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      return;
    }

    setGpsStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatus("ready");
        void fetchNearby(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setGpsStatus("denied");
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 10_000 }
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(130deg,rgba(105,242,255,0.12),rgba(255,255,255,0.04),rgba(8,11,17,0.9))] p-8">
        <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#69f2ff]/20 blur-3xl" />
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#9af7ff]">
            <Sparkles className="h-3.5 w-3.5" /> Weed Seeker
          </div>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Find Nearby Cannabis Businesses</h1>
          <p className="max-w-3xl text-zinc-300">
            Discover dispensaries, head shops, and specialty stores through GPS, ZIP, or city-based search. This
            milestone uses a live UI with stubbed nearby data.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-4 flex gap-2">
            {[
              { key: "gps", label: "GPS" },
              { key: "zip", label: "ZIP" },
              { key: "city", label: "City" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setMode(option.key as "gps" | "zip" | "city")}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  mode === option.key
                    ? "border-[#69f2ff]/50 bg-[#69f2ff]/15 text-[#9af7ff]"
                    : "border-white/15 bg-white/5 text-zinc-300 hover:border-white/30"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {mode === "gps" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
                <p className="font-medium text-white">Location Access</p>
                <p className="mt-1">
                  {gpsStatus === "idle"
                    ? "Click Use GPS to request location access."
                    : gpsStatus === "requesting"
                      ? "Requesting GPS..."
                      : gpsStatus === "ready"
                        ? `GPS ready${coords ? ` (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})` : ""}`
                        : "GPS denied or unavailable. Switch to ZIP or City."}
                </p>
              </div>
              <Button className="w-full" onClick={requestGps}>
                <Navigation className="mr-2 h-4 w-4" /> Use GPS
              </Button>
            </div>
          ) : mode === "zip" ? (
            <div className="space-y-4">
              <Input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="ZIP code" />
              <Input
                type="number"
                value={String(radiusKm)}
                onChange={(e) => setRadiusKm(Number(e.target.value || 5))}
                min={1}
                max={50}
                placeholder="Radius (km)"
              />
              <Button className="w-full" onClick={() => void fetchNearby()}>
                <Search className="mr-2 h-4 w-4" /> Search Nearby
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
              <Input
                type="number"
                value={String(radiusKm)}
                onChange={(e) => setRadiusKm(Number(e.target.value || 5))}
                min={1}
                max={50}
                placeholder="Radius (km)"
              />
              <Button className="w-full" onClick={() => void fetchNearby()}>
                <Search className="mr-2 h-4 w-4" /> Search Nearby
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <p className="mb-3 text-sm uppercase tracking-[0.22em] text-zinc-400">Nearby Results</p>
          {loading ? (
            <p className="text-zinc-300">Loading results...</p>
          ) : filtered.length === 0 ? (
            <p className="text-zinc-400">No results yet. Run a search to view nearby businesses.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((p) => (
                <article key={p.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-xs text-zinc-400">{categoryLabel(p.category)}</p>
                    </div>
                    <span className={`text-xs font-semibold ${p.isOpenNow ? "text-emerald-300" : "text-rose-300"}`}>
                      {p.isOpenNow ? "Open" : "Closed"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-zinc-300">
                    <p className="inline-flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#69f2ff]" /> {p.address}
                    </p>
                    <p>
                      {typeof p.distanceKm === "number" ? `${p.distanceKm.toFixed(1)} km` : ""}
                      {typeof p.rating === "number" ? ` · Rating ${p.rating.toFixed(1)}` : ""}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {p.website ? (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-[#69f2ff]/40 bg-[#69f2ff]/12 px-3 py-1.5 text-xs text-[#9af7ff]"
                      >
                        Website
                      </a>
                    ) : null}
                    {p.phone ? (
                      <a
                        href={`tel:${p.phone.replace(/[^\d+]/g, "")}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-zinc-200"
                      >
                        <Phone className="h-3 w-3" /> Call
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-zinc-400">
          <Store className="h-3.5 w-3.5" /> Roadmap Note
        </p>
        <p className="mt-2">
          Next milestone upgrades this module from stub data to real listings with persistent favorites, claimed
          profiles, and map/list synchronization.
        </p>
      </section>
    </div>
  );
}
