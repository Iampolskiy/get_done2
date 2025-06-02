// components/GlobeWithHover.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

// 1) URL zur „Blue Marble“-Textur (global)
//    → damit man wirklich die echte Erd‐Textur sieht.
const EARTH_TEXTURE_URL =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

// 2) URL der GeoJSON‐Daten für Ländergrenzen
const COUNTRIES_GEOJSON_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

export default function GlobeWithHover() {
  // Referenz auf die Globe‐Instanz (für Point-of-View o. Ä.)
  const globeEl = useRef<GlobeMethods | undefined>(undefined);

  // 3) State: Array von GeoJSON‐Features (für alle Länder)
  const [countries, setCountries] = useState<
    Feature<Geometry, GeoJsonProperties>[] | undefined
  >(undefined);

  // 4) State: Welches Feature (Land) gerade gehighlightet ist
  const [hoveredFeature, setHoveredFeature] = useState<Feature<
    Geometry,
    GeoJsonProperties
  > | null>(null);

  // 5) State: Welcher Ländername aktuell angezeigt werden soll
  const [hoveredCountryName, setHoveredCountryName] = useState<string>("");

  // 6) State: Fenstermaße, damit der Globe immer full‐screen ist
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // ────────────────────────────────────────────────────────────────────────────
  // 7) Fenster‐Resize tracken
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // 8) Länder‐GeoJSON einmalig laden
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(COUNTRIES_GEOJSON_URL);
        const worldData = await res.json();
        // worldData.features ist ein Array von GeoJSON‐Features
        setCountries(
          worldData.features as Feature<Geometry, GeoJsonProperties>[]
        );
      } catch (err) {
        console.error("Fehler beim Laden der Länder‐GeoJSON:", err);
      }
    })();
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // 9) Kamera‐Startposition (z.B. Europa)
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (globeEl.current) {
      // Positioniere Kamera direkt über Deutschland (Latitude, Longitude, Altitude)
      globeEl.current.pointOfView(
        { lat: 51.1657, lng: 10.4515, altitude: 1 },
        0
      );
    }
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // 10) Hover‐Handler: Sobald man in ein Land‐Polygon hovert, speichern wir das Feature
  // ────────────────────────────────────────────────────────────────────────────
  const handlePolygonHover = (
    featureObject: object | null,
    _prev: object | null
  ) => {
    if (featureObject) {
      // Wir erhalten hier das GeoJSON‐Feature, in das gerade gehovered wurde
      const feat = featureObject as Feature<Geometry, GeoJsonProperties>;
      setHoveredFeature(feat);
      setHoveredCountryName(feat.properties?.name ?? "");
    } else {
      // Maus ist gerade außerhalb eines Landes
      setHoveredFeature(null);
      setHoveredCountryName("");
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // 11) Klick‐Handler (optional): z.B. beliebige Aktion beim Klick auf ein Land
  // ────────────────────────────────────────────────────────────────────────────
  const handlePolygonClick = (
    featureObject: object,
    _event: MouseEvent,
    _coords: { lat: number; lng: number; altitude: number }
  ) => {
    const feat = featureObject as Feature<Geometry, GeoJsonProperties>;
    const name = feat.properties?.name ?? "Unbekanntes Land";
    alert(`Du hast auf ${name} geklickt.`);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* ─────────── Tooltip für den Ländernamen ─────────── */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "6px 12px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          borderRadius: 4,
          fontSize: 14,
          pointerEvents: "none",
          opacity: hoveredCountryName ? 1 : 0,
          transition: "opacity 0.2s ease",
          zIndex: 2,
        }}
      >
        {hoveredCountryName}
      </div>

      {/* ─────────── Der Globe selbst ─────────── */}
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        // ── Statt einer reinen Farbe binden wir hier die echte "Blue Marble"-Textur ein ──
        globeImageUrl={EARTH_TEXTURE_URL}
        backgroundColor="#000000" // Schwarzer Hintergrund, damit die Erde im Zentrum steht
        // ── Länder‐Polygone (GeoJSON) über die Textur legen ──
        polygonsData={countries || []}
        // Damit die Flächen (Caps) unsichtbar sind, aber dennoch „pickable“ bleiben:
        polygonCapColor={() => "rgba(0, 0, 0, 0)"}
        polygonSideColor={() => "rgba(0, 0, 0, 0)"}
        polygonAltitude={() => 0} // flush mit Oberfläche
        // ── Beim Zeichnen der Grenzen: Farbe und Breite abhängig vom Hoverzustand ──
        polygonStrokeColor={(featureObj: object) => {
          const feat = featureObj as Feature<Geometry, GeoJsonProperties>;
          // wenn aktuell gehighlightet, dann helleres Gelbgrün, sonst klassisches Grün
          return hoveredFeature === feat ? "yellowgreen" : "green";
        }}
        polygonStrokeWidth={(featureObj: object) => {
          const feat = featureObj as Feature<Geometry, GeoJsonProperties>;
          // beim Hover etwas breiter, sonst dünne Linie
          return hoveredFeature === feat ? 2 : 0.5;
        }}
        // ── Event‐Handler für Hover (setzt den Länder‐Namen) ──
        onPolygonHover={handlePolygonHover}
        onPolygonClick={handlePolygonClick}
        // ── Direkt nach Laden des Globus: Zoom‐ und Rotations‐Einstellungen ──
        onGlobeReady={() => {
          if (globeEl.current) {
            const controls = globeEl.current.controls();
            controls.enableZoom = true;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.3;
          }
        }}
      />
    </div>
  );
}
