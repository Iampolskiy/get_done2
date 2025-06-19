// components/GlobeWithSearch.tsx
"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import type {
  Feature,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";
import type { Challenge } from "@/types/types";
import ChallengesClient from "@/app/challenges/ChallengesClient";

// URL zur Länder‐GeoJSON (Polygon/MultiPolygon)
const COUNTRIES_DATA_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
// URL zur „Day“-Textur (blauer Planet)
const EARTH_DAY_TEXTURE_URL =
  "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

/**
 * Hilfsfunktion:
 * Berechnet einen groben Zentroid aus dem ersten LinearRing eines Polygons.
 */
function computeCentroidFromCoordinates(ring: number[][]): {
  lat: number;
  lng: number;
} {
  let sumX = 0,
    sumY = 0,
    count = 0;
  for (const [lng, lat] of ring) {
    sumX += lng;
    sumY += lat;
    count++;
  }
  return { lat: sumY / count, lng: sumX / count };
}

/**
 * Gibt für ein Polygon oder MultiPolygon einen Lat/Lng‐Zentroid zurück.
 * (Wir nehmen einfach das erste LinearRing‐Array.)
 */
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

interface GlobeWithSearchProps {
  challenges: Challenge[];
}

export const GlobeWithSearch: React.FC<GlobeWithSearchProps> = ({
  challenges,
}) => {
  // ──────────────────────────────────────────────────────────────────────────
  // Refs und States
  // ──────────────────────────────────────────────────────────────────────────

  // Ref auf das Globe-Objekt (für pointOfView, controls etc.)
  const globeEl = useRef<GlobeMethods | undefined>(undefined);

  // 1) Dimensions: Breite/Höhe des Viewports
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 2) GeoJSON‐Daten: Array von Ländern (Polygon | MultiPolygon)
  const [countries, setCountries] = useState<
    Feature<Polygon | MultiPolygon, GeoJsonProperties>[] | null
  >(null);

  // 3) Hover‐State: aktuell gehighlightetes Feature & dessen Name
  const [hoveredFeature, setHoveredFeature] = useState<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>(null);
  const [hoveredCountryName, setHoveredCountryName] = useState<string>("");

  // 4) Selection‐State: aktuell ausgewähltes Feature (Land)
  //    und dazugehörige Challenge‐Anzahl
  const [selectedFeature, setSelectedFeature] = useState<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>(null);
  const [challengeCount, setChallengeCount] = useState<number | null>(null);

  // 5) Tun den eigentlichen „View Challenges“-Modus an:
  //    Sobald man auf „Ansehen“ klickt, verschwindet der Globe
  const [viewChallenges, setViewChallenges] = useState(false);

  // 6) Three.js‐Material für den Globe (Earth‐Day‐Textur)
  const [globeMaterial, setGlobeMaterial] = useState<THREE.MeshPhongMaterial>();

  // ──────────────────────────────────────────────────────────────────────────
  // A) Fenstergröße tracken → Globe immer an Viewport anpassen
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const updateSize = (): void => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // B) Kamera beim ersten Render positionieren (grob Welt‐Ansicht)
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0);
    }
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // C) Länder‐GeoJSON asynchron laden
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(COUNTRIES_DATA_URL);
        const json = (await res.json()) as {
          features: Feature<Polygon | MultiPolygon, GeoJsonProperties>[];
        };
        setCountries(json.features);
      } catch (err) {
        console.error("Fehler beim Laden der Länder‐GeoJSON:", err);
      }
    })();
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // D) Three.js‐Material erzeugen (Earth‐Day‐Textur)
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const mat = new THREE.MeshPhongMaterial({
      map: loader.load(EARTH_DAY_TEXTURE_URL),
      shininess: 10,
      specular: new THREE.Color("#444444"),
    });
    setGlobeMaterial(mat);
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // E) Hover‐Handler für Länder‐Polygone:
  //    speichert das Feature in hoveredFeature und setzt den Ländernamen
  // ──────────────────────────────────────────────────────────────────────────
  const handlePolygonHover = (
    featureObject: object | null
    /*  _prev: object | null */
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

  // ──────────────────────────────────────────────────────────────────────────
  // F) Klick‐Handler für Länder‐Polygone:
  //    – Wenn dasselbe Land erneut anklicken → Deselect
  //    – Sonst: ausgewähltes Land setzen, Globe auf Centroid schwenken,
  //      Challenge‐Count vom Server holen
  // ──────────────────────────────────────────────────────────────────────────
  const handlePolygonClick = async (
    featureObject: object
    /* _event: MouseEvent,
    _coords: { lat: number; lng: number; altitude: number } */
  ): Promise<void> => {
    const feat = featureObject as Feature<
      Polygon | MultiPolygon,
      GeoJsonProperties
    >;
    const countryName = feat.properties?.name ?? "Unbekanntes Land";

    // Deselektieren, falls schon ausgewählt
    if (selectedFeature === feat) {
      setSelectedFeature(null);
      setChallengeCount(null);
      return;
    }

    // Neues Land auswählen
    setSelectedFeature(feat);
    setChallengeCount(null);

    // 1) Centroid berechnen und Globe dorthin schwenken
    const center = getCentroid(feat.geometry);
    if (globeEl.current && center) {
      globeEl.current.pointOfView(
        { lat: center.lat, lng: center.lng, altitude: 0.5 },
        700
      );
    }

    // 2) Anzahl der Challenges vom Server holen
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

  // ──────────────────────────────────────────────────────────────────────────
  // G) Klick auf den kleinen Globe-Button (oben links), um zu Reset zurückzukehren:
  //    – viewChallenges zurück auf false
  //    – selectedFeature & challengeCount zurücksetzen
  // ──────────────────────────────────────────────────────────────────────────
  const handleReset = (): void => {
    setViewChallenges(false);
    setSelectedFeature(null);
    setChallengeCount(null);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // H) Challenges nur für das ausgewählte Land filtern:
  //    – Wird benutzt, wenn später „Ansehen“ geklickt wurde
  // ──────────────────────────────────────────────────────────────────────────
  const challengesByCountry = useMemo(() => {
    if (!selectedFeature) return [];
    const countryName = selectedFeature.properties?.name ?? "";
    return challenges.filter((ch) => ch.country === countryName);
  }, [selectedFeature, challenges]);

  // ──────────────────────────────────────────────────────────────────────────
  // I) Styles für Layout & Animation
  // ──────────────────────────────────────────────────────────────────────────

  // 1) Grund‐Container: dunkler Hintergrund
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#111",
    overflow: "hidden",
  };

  // 2) Overlay‐Box oben in der Mitte (nach Klick auf Land), mit „Ansehen“-Button
  const overlayBoxStyle: React.CSSProperties = {
    position: "absolute",
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 5,
    background: "rgba(0,0,0,0.7)",
    color: "white",
    padding: "8px 12px",
    borderRadius: "4px",
    display:
      selectedFeature && challengeCount !== null && !viewChallenges
        ? "flex"
        : "none",
    alignItems: "center",
    gap: "12px",
  };

  // 3) Kleiner Globe‐Reset‐Button oben links (erscheint nur, wenn viewChallenges = true)
  const resetButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "16px",
    left: "16px",
    zIndex: 5,
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#222",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: viewChallenges ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
  };

  // 4) Globe‐Container: wenn viewChallenges=false → Vollbild, sonst → ausgeblendet
  const globeWrapperStyle: React.CSSProperties = viewChallenges
    ? {
        width: 0,
        height: 0,
        opacity: 0,
        transition: "all 0.7s ease",
      }
    : {
        width: "100%",
        height: "100%",
        transition: "all 0.7s ease",
      };

  // 5) Tooltip (Landname beim Hover)
  const tooltipStyle: React.CSSProperties = {
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
    transition: "opacity 0.2s ease",
    zIndex: 4,
  };

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div style={containerStyle}>
      {/* ─── Reset‐Button (Globe‐Icon) oben links ────────────────────────────── */}
      <button
        style={resetButtonStyle}
        onClick={handleReset}
        title="Zur Länderansicht zurück"
      >
        🌐
      </button>

      {/* ─── Overlay‐Box oben in der Mitte: „Challenges in X: Y [Ansehen]“ ────── */}
      <div style={overlayBoxStyle}>
        <span style={{ fontSize: "14px" }}>
          {`Challenges in ${selectedFeature?.properties?.name}: ${challengeCount}`}
        </span>
        <button
          onClick={() => setViewChallenges(true)}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "6px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Ansehen
        </button>
      </div>

      {/* ─── Tooltip (Landname beim Hover) ──────────────────────────────────── */}
      <div style={tooltipStyle}>{hoveredCountryName}</div>

      {/* ─── Globe selbst ──────────────────────────────────────────────────── */}
      <div style={globeWrapperStyle}>
        {globeMaterial && (
          <Globe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            globeMaterial={globeMaterial}
            backgroundColor="#000000"
            pointsData={[]} // keine Marker hier
            // ─── Länder‐Polygone ────────────────────────────────────────
            polygonsData={countries || []}
            polygonAltitude={() => 0.005}
            polygonCapColor={(featObj: object) => {
              const f = featObj as Feature<
                Polygon | MultiPolygon,
                GeoJsonProperties
              >;
              // ausgewähltes Land: halbtransparentes Gelb
              if (selectedFeature === f) {
                return "rgba(255,200,0,0.6)";
              }
              // Hover: leicht grauer Overlay
              if (hoveredFeature === f) {
                return "rgba(200,200,200,0.4)";
              }
              return "rgba(0,0,0,0)";
            }}
            polygonSideColor={() => "rgba(0,0,0,0)"}
            polygonStrokeColor={(featObj: object) => {
              const f = featObj as Feature<
                Polygon | MultiPolygon,
                GeoJsonProperties
              >;
              if (selectedFeature === f) return "#FFD700"; // goldene Kontur, wenn selektiert
              if (hoveredFeature === f) return "#00FF00"; // grüne Kontur beim Hover
              return "#444444"; // sonst dunkelgrau
            }}
            polygonsTransitionDuration={0} // kein Fade-In, damit kein Flackern
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

      {/* ─── Rechtes Panel: Challenges nach Land ────────────────────────────── */}
      {viewChallenges && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "32px", // 32px Abstand, da der Reset‐Button oben links sitzt
            right: 0,
            bottom: 0,
            overflowY: "auto",
            padding: "16px",
            backgroundColor: "#111",
          }}
        >
          <ChallengesClient
            challenges={challengesByCountry} /* showCity={true} */
          />
        </div>
      )}
    </div>
  );
};
