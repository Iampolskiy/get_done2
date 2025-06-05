// app/globus/GlobusChallengesClient.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import type {
  Feature,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";
import type { GlobeMethods } from "react-globe.gl";
import type { Challenge } from "@/types/types";

// Wir importieren die große `ChallengesClient`-Komponente,
// brauchen sie hier aber nicht mehr, weil wir zur separaten Seite navigieren.
// import ChallengesClient from "@/app/challenges/ChallengesClient";

// Dynamisches Laden von react-globe.gl (nur im Browser, nicht SSR)
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const COUNTRIES_DATA_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const EARTH_DAY_TEXTURE_URL =
  "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

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

interface GlobusChallengesClientProps {
  challenges: Challenge[];
}

export default function GlobusChallengesClient({
  challenges,
}: GlobusChallengesClientProps) {
  const router = useRouter();
  const globeEl = useRef<GlobeMethods | null>(null);

  // 1) Fenstergröße tracken
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 2) GeoJSON-Daten aller Länder
  const [countries, setCountries] = useState<
    Feature<Polygon | MultiPolygon, GeoJsonProperties>[] | null
  >(null);

  // 3) Hover-State: welche Feature gerade gehighlightet ist
  const [hoveredFeature, setHoveredFeature] = useState<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>(null);
  const [hoveredCountryName, setHoveredCountryName] = useState<string>("");

  // 4) Ausgewähltes Land + Challenge-Count
  const [selectedFeature, setSelectedFeature] = useState<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>(null);
  const [challengeCount, setChallengeCount] = useState<number | null>(null);

  // 5) Drei.js-Material (Textur) für den Globus
  const [globeMaterial, setGlobeMaterial] = useState<THREE.MeshPhongMaterial>();

  // ──────────────────────────────────────────────────────────────────────────
  // A) Fenstergröße tracken
  useEffect(() => {
    function updateSize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // B) Kamera-Startposition
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0);
    }
  }, []);

  // C) Länder-GeoJSON asynchron laden
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(COUNTRIES_DATA_URL);
        const json = (await res.json()) as {
          features: Feature<Polygon | MultiPolygon, GeoJsonProperties>[];
        };
        setCountries(json.features);
      } catch (err) {
        console.error("Fehler beim Laden der Länder-GeoJSON:", err);
      }
    })();
  }, []);

  // D) Three.js-Material erzeugen (Earth Day Texture)
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
  // E) Hover-Handler (Landname anzeigen)
  const handlePolygonHover = (
    featureObject: object | null,
    _prev: object | null
  ): void => {
    if (featureObject) {
      const f = featureObject as Feature<
        Polygon | MultiPolygon,
        GeoJsonProperties
      >;
      setHoveredFeature(f);
      setHoveredCountryName(f.properties?.name ?? "");
    } else {
      setHoveredFeature(null);
      setHoveredCountryName("");
    }
  };

  // F) Klick auf Land: Zoom + Challenge-Count abrufen
  const handlePolygonClick = async (
    featureObject: object
    /*  _event: MouseEvent,
    _coords: { lat: number; lng: number; altitude: number } */
  ): Promise<void> => {
    const f = featureObject as Feature<
      Polygon | MultiPolygon,
      GeoJsonProperties
    >;
    const countryName = f.properties?.name ?? "Unbekanntes Land";

    // Deselektieren, falls dasselbe Land nochmal angeklickt wird
    if (selectedFeature === f) {
      setSelectedFeature(null);
      setChallengeCount(null);
      return;
    }

    // Neues Land auswählen
    setSelectedFeature(f);
    setChallengeCount(null);

    // Zentroid berechnen und hingehen
    const center = getCentroid(f.geometry);
    if (globeEl.current && center) {
      globeEl.current.pointOfView(
        { lat: center.lat, lng: center.lng, altitude: 0.5 },
        700
      );
    }

    // Challenge-Count für dieses Land vom API-Endpoint holen
    try {
      const res = await fetch(
        `/api/challenges/countByCountry?country=${encodeURIComponent(
          countryName
        )}`
      );
      if (!res.ok) throw new Error("API-Fehler beim Laden der Anzahl");
      const json = await res.json();
      setChallengeCount(json.count as number);
    } catch (err) {
      console.error(err);
      setChallengeCount(0);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // STYLES / LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  // 1) Hauptcontainer
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#111",
    overflow: "hidden",
  };

  // 2) Overlay oben Mitte: "Challenges in <Land>: <Anzahl> [Ansehen]"
  const overlayBoxStyle: React.CSSProperties = {
    position: "absolute",
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 5,
    background: "rgba(0, 0, 0, 0.7)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "4px",
    display: selectedFeature && challengeCount !== null ? "flex" : "none",
    alignItems: "center",
    gap: "12px",
  };

  // 3) Tooltip (Landname beim Hover)
  const tooltipStyle: React.CSSProperties = {
    position: "absolute",
    top: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    pointerEvents: "none",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "13px",
    opacity: hoveredCountryName ? 1 : 0,
    transition: "opacity 0.2s ease",
    zIndex: 4,
  };

  // 4) Globe-Wrapper: Vollbild (immer sichtbar, wir navigieren später weg)
  const globeWrapperStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transition: "all 0.7s ease",
  };

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div style={containerStyle}>
      {/* Overlay oben Mitte: "Challenges in <Land>: <Anzahl> [Ansehen]" */}
      <div style={overlayBoxStyle}>
        <span style={{ fontSize: "14px" }}>
          {`Challenges in ${selectedFeature?.properties?.name}: ${challengeCount}`}
        </span>
        <button
          onClick={() => {
            if (!selectedFeature) return;
            const countryName = selectedFeature.properties?.name ?? "";
            //  => Navigation zur neuen Seite `/challenges-by-country/[countryName]`
            router.push(
              `/challenges-by-country/${encodeURIComponent(countryName)}`
            );
          }}
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

      {/* Tooltip für Landname beim Hover */}
      <div style={tooltipStyle}>{hoveredCountryName}</div>

      {/* Globus selbst */}
      <div style={globeWrapperStyle}>
        {globeMaterial && (
          <Globe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            globeMaterial={globeMaterial}
            backgroundColor="#000000"
            pointsData={[]}
            polygonsData={countries || []}
            polygonAltitude={() => 0.005}
            polygonCapColor={(featObj: object) => {
              const f = featObj as Feature<
                Polygon | MultiPolygon,
                GeoJsonProperties
              >;
              if (selectedFeature === f) {
                return "rgba(255,200,0,0.6)";
              }
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
              if (selectedFeature === f) return "#FFD700";
              if (hoveredFeature === f) return "#00FF00";
              return "#444444";
            }}
            polygonsTransitionDuration={0}
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
}
