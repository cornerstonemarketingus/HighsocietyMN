"use client";

import { useMemo, useState } from "react";

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
    <div style={{ padding: 24, maxWidth: 1024, margin: "0 auto" }}>
      <h1 style={{ margin: "10px 0 6px", fontSize: 36 }}>BudSeeker</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        Weed Seeker discovery module. GPS/ZIP integration is currently a server-side stub while UI and flow are in
        place.
      </p>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16,
          padding: 16,
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <button
            onClick={() => setMode("gps")}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: mode === "gps" ? "rgba(139,213,255,0.25)" : "rgba(0,0,0,0.2)",
              color: "white",
              cursor: "pointer",
            }}
          >
            GPS
          </button>
          <button
            onClick={() => setMode("zip")}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: mode === "zip" ? "rgba(139,213,255,0.25)" : "rgba(0,0,0,0.2)",
              color: "white",
              cursor: "pointer",
            }}
          >
            ZIP
          </button>
          <button
            onClick={() => setMode("city")}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: mode === "city" ? "rgba(139,213,255,0.25)" : "rgba(0,0,0,0.2)",
              color: "white",
              cursor: "pointer",
            }}
          >
            City + State
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {mode === "gps" ? (
            <div style={{ gridColumn: "span 2" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background:
                      gpsStatus === "ready" ? "#35d07f" : gpsStatus === "denied" ? "#ff5a77" : "rgba(255,255,255,0.35)",
                    boxShadow: "0 0 0 6px rgba(53,208,127,0.12)",
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>Location consent</div>
                  <div style={{ opacity: 0.8, fontSize: 13 }}>
                    {gpsStatus === "idle"
                      ? "Click \"Use GPS\" to allow geolocation (opt-in)."
                      : gpsStatus === "requesting"
                        ? "Requesting GPS..."
                        : gpsStatus === "ready"
                          ? `GPS ready${coords ? ` (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})` : ""}`
                          : "GPS denied/unavailable. Use ZIP or City."}
                  </div>
                </div>
              </div>

              <button
                onClick={requestGps}
                style={{
                  width: "100%",
                  padding: "12px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(139,213,255,0.28)",
                  background: "linear-gradient(180deg, rgba(139, 213, 255, 0.26), rgba(139, 213, 255, 0.1))",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Use GPS
              </button>
            </div>
          ) : mode === "zip" ? (
            <>
              <div>
                <label style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>ZIP code</label>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.14)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>Radius (km)</label>
                <input
                  type="number"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value || 5))}
                  min={1}
                  max={50}
                  style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.14)" }}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <button
                  onClick={() => void fetchNearby()}
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(139,213,255,0.28)",
                    background: "linear-gradient(180deg, rgba(139, 213, 255, 0.26), rgba(139, 213, 255, 0.1))",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Search (stub)
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.14)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>Radius (km)</label>
                <input
                  type="number"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value || 5))}
                  min={1}
                  max={50}
                  style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.14)" }}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <button
                  onClick={() => void fetchNearby()}
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(139,213,255,0.28)",
                    background: "linear-gradient(180deg, rgba(139, 213, 255, 0.26), rgba(139, 213, 255, 0.1))",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Search (stub)
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <h2 style={{ margin: "0 0 10px", fontSize: 20 }}>Nearby places</h2>
        {loading ? (
          <div style={{ opacity: 0.8 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No results.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {filtered.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 16,
                  padding: 14,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 800 }}>{p.name}</div>
                  <div style={{ opacity: 0.75, fontSize: 13 }}>{categoryLabel(p.category)}</div>
                </div>
                <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>{p.address}</div>
                <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>
                  {typeof p.distanceKm === "number" ? `${p.distanceKm.toFixed(1)} km` : ""}
                  {typeof p.rating === "number" ? ` · ★ ${p.rating.toFixed(1)}` : ""}
                </div>
                <div style={{ marginTop: 10, opacity: 0.9, fontSize: 13 }}>
                  Status: <span style={{ color: p.isOpenNow ? "#35d07f" : "#ff5a77", fontWeight: 800 }}>{p.isOpenNow ? "Open now" : "Closed"}</span>
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {p.website ? (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "8px 10px",
                        borderRadius: 12,
                        border: "1px solid rgba(139,213,255,0.28)",
                        background: "rgba(139,213,255,0.10)",
                      }}
                    >
                      Website
                    </a>
                  ) : null}
                  {p.phone ? (
                    <a
                      href={`tel:${p.phone.replace(/[^\d+]/g, "")}`}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      Call
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
