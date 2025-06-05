// components/GlobeWithSearch.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import type {
  Feature,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";

// (1) URL zur Länder‐GeoJSON
const COUNTRIES_DATA_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
// (2) Blue‐Marble “Day”‐Textur für die Erde
const EARTH_DAY_TEXTURE_URL =
  "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

// Hilfsfunktion: Centroid aus Ring‐Koordinaten berechnen
function computeCentroidFromCoordinates(ring: number[][]): {
  lat: number;
  lng: number;
} {
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (const [lng, lat] of ring) {
    sumX += lng;
    sumY += lat;
    count++;
  }
  return { lat: sumY / count, lng: sumX / count };
}

// Gibt Centroid zurück, wenn Polygon oder MultiPolygon, sonst null
function getCentroid(
  geom: Polygon | MultiPolygon
): { lat: number; lng: number } | null {
  if (geom.type === "Polygon") {
    return computeCentroidFromCoordinates(geom.coordinates[0]);
  }
  if (geom.type === "MultiPolygon") {
    return computeCentroidFromCoordinates(geom.coordinates[0][0]);
  }
  return null;
}

export const GlobeWithSearch: React.FC = () => {
  // ───> useRef ohne initialen null‐Wert, damit globeEl.current: GlobeMethods | undefined
  const globeEl = useRef<GlobeMethods | null>(null);

  // Fenster‐Dimensionen
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Länder‐GeoJSON‐Daten (Polygon oder MultiPolygon)
  const [countries, setCountries] = useState<
    Feature<Polygon | MultiPolygon, GeoJsonProperties>[] | null
  >(null);

  // Such‐Input + Marker‐Koordinaten (falls Stadt gesucht)
  const [cityInput, setCityInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null
  );

  // Hover‐State: aktuell gehighlightetes Feature & dessen Name
  const [hoveredFeature, setHoveredFeature] = useState<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>(null);
  const [hoveredCountryName, setHoveredCountryName] = useState<string>("");

  // Ausgewähltes Land + Challenge‐Count
  const [selectedFeature, setSelectedFeature] = useState<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>(null);
  const [challengeCount, setChallengeCount] = useState<number | null>(null);

  // Three.js‐Material für den Globus (Day‐Textur)
  const [globeMaterial, setGlobeMaterial] = useState<THREE.MeshPhongMaterial>();

  // ────────────────────────────────────────────────────────────────────────────
  // A) Fenstergröße tracken → Globus nutzt initial das gesamte Viewport
  useEffect(() => {
    const updateSize = (): void => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // B) Kamera‐Startposition (grob Welt‐Übersicht)
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0);
    }
  }, []);

  // C) Länder‐GeoJSON‐Daten asynchron laden
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(COUNTRIES_DATA_URL);
        const data = (await res.json()) as {
          features: Feature<Polygon | MultiPolygon, GeoJsonProperties>[];
        };
        setCountries(data.features);
      } catch (err) {
        console.error("Fehler beim Laden der Länder‐GeoJSON:", err);
      }
    })();
  }, []);

  // D) Globe‐Material mit Day‐Textur erzeugen
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const mat = new THREE.MeshPhongMaterial({
      map: loader.load(EARTH_DAY_TEXTURE_URL),
      shininess: 10,
      specular: new THREE.Color("#444444"),
    });
    setGlobeMaterial(mat);
  }, []);

  // E) Geocoding‐Funktion (Stadt → Koordinaten via Nominatim)
  const geocodeCity = async (
    city: string
  ): Promise<{ lat: number; lng: number } | null> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          city
        )}&limit=1`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (err) {
      console.error("Geocoding‐Fehler:", err);
    }
    return null;
  };

  // F) Such‐Button‐Handler: Zoom auf die eingegebene Stadt
  const handleSearch = async (): Promise<void> => {
    if (!cityInput.trim()) return;
    setIsSearching(true);
    const coords = await geocodeCity(cityInput);
    setIsSearching(false);

    if (coords && globeEl.current) {
      setMarker({ lat: coords.lat, lng: coords.lng });
      globeEl.current.pointOfView(
        { lat: coords.lat, lng: coords.lng, altitude: 0.4 },
        700
      );
      globeEl.current.controls().autoRotate = false;
    } else {
      alert("Stadt nicht gefunden. Bitte Schreibweise prüfen.");
    }
  };

  // G) Hover‐Handler für Länder‐Polygone
  const handlePolygonHover = (
    featureObject: object | null
    /* _prev: object | null */
  ): void => {
    if (featureObject) {
      const feat = featureObject as Feature<
        Polygon | MultiPolygon,
        GeoJsonProperties
      >;
      setHoveredFeature(feat);
      setHoveredCountryName(feat.properties?.name ?? "");
    } else {
      setHoveredFeature(null);
      setHoveredCountryName("");
    }
  };

  // H) Klick‐Handler für Länder‐Polygone
  const handlePolygonClick = async (
    featureObject: object
    /*  _event: MouseEvent,
    _coords: { lat: number; lng: number; altitude: number } */
  ): Promise<void> => {
    const feat = featureObject as Feature<
      Polygon | MultiPolygon,
      GeoJsonProperties
    >;
    const countryName = feat.properties?.name ?? "Unbekanntes Land";

    // Deselektieren, falls dasselbe Land erneut angeklickt wird
    if (selectedFeature === feat) {
      setSelectedFeature(null);
      setChallengeCount(null);
      return;
    }

    // Neues Land auswählen
    setSelectedFeature(feat);
    setChallengeCount(null);

    // 1) Centroid berechnen und Globus dorthin „schwenken“
    const center = getCentroid(feat.geometry);
    if (globeEl.current && center) {
      globeEl.current.pointOfView(
        { lat: center.lat, lng: center.lng, altitude: 0.5 },
        700
      );
    }

    // 2) Challenge‐Count vom Server abfragen
    try {
      const res = await fetch(
        `/api/challenges/countByCountry?country=${encodeURIComponent(
          countryName
        )}`
      );
      if (!res.ok) throw new Error("Fehler beim Laden der Challenge‐Anzahl");
      const json = await res.json();
      setChallengeCount(json.count as number);
    } catch (err) {
      console.error(err);
      setChallengeCount(0);
    }
  };

  // I) JSX‐Rückgabe: Suchfeld, Tooltip, Challenge‐Count & Globe
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* ─── (I.1) Such‐Input über dem Globe ─────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "4px",
          padding: "6px 10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Stadt eingeben…"
          style={{
            border: "none",
            outline: "none",
            fontSize: "14px",
            width: "200px",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          disabled={isSearching}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          style={{
            marginLeft: "8px",
            padding: "5px 12px",
            fontSize: "14px",
            cursor: isSearching ? "not-allowed" : "pointer",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "3px",
          }}
        >
          {isSearching ? "Suche…" : "Los"}
        </button>
      </div>

      {/* ─── (I.2) Tooltip für den Ländernamen (Fade‐In/Out) ───────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "13px",
          opacity: hoveredCountryName ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: 2,
        }}
      >
        {hoveredCountryName}
      </div>

      {/* ─── (I.3) Challenge‐Count‐Anzeige, wenn ein Land ausgewählt ist ───────── */}
      {selectedFeature && challengeCount !== null && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {`Challenges in ${selectedFeature.properties?.name}: ${challengeCount}`}
        </div>
      )}

      {/* ─── (I.4) Globe‐Komponente selbst ───────────────────────────────────── */}
      <div style={{ width: "100%", height: "100%" }}>
        {globeMaterial && (
          <Globe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            globeMaterial={globeMaterial}
            backgroundColor="#000000"
            // Marker (roter Punkt), falls Such‐Koordinaten gesetzt
            pointsData={marker ? [marker] : []}
            pointColor={() => "red"}
            pointAltitude={() => 0.02}
            pointRadius={() => 0.5}
            // Länder‐Polygone
            polygonsData={countries || []}
            polygonAltitude={() => 0.005}
            polygonCapColor={(featObj: object) => {
              const f = featObj as Feature<
                Polygon | MultiPolygon,
                GeoJsonProperties
              >;
              if (selectedFeature === f) {
                return "rgba(255,200,0,0.6)"; // halbtransparentes Gelb bei Auswahl
              }
              return hoveredFeature === f
                ? "rgba(200,200,200,0.4)" // halbtransparentes Grau beim Hover
                : "rgba(0,0,0,0)"; // ansonsten komplett transparent
            }}
            polygonSideColor={() => "rgba(0,0,0,0)"}
            polygonStrokeColor={(featObj: object) => {
              const f = featObj as Feature<
                Polygon | MultiPolygon,
                GeoJsonProperties
              >;
              if (selectedFeature === f) return "#FFD700"; // Gold‐Linie, wenn selektiert
              return hoveredFeature === f ? "#00FF00" : "#444444"; // Grün beim Hover, sonst dunkelgrau
            }}
            polygonsTransitionDuration={0} // kein Fade, um Flackern zu vermeiden
            onPolygonHover={handlePolygonHover}
            onPolygonClick={handlePolygonClick}
            onGlobeReady={() => {
              if (globeEl.current) {
                globeEl.current.controls().enableZoom = true;
                globeEl.current.controls().autoRotate = false;
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
