// components/GlobeWithSearch.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";

// (1) URL zur Länder-GeoJSON
const COUNTRIES_DATA_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

// (2) Blue-Marble “Day”-Textur für die Erde
const EARTH_DAY_TEXTURE_URL =
  "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

export const GlobeWithSearch: React.FC = () => {
  // ── Refs und States ───────────────────────────────────────────────────────
  const globeEl = useRef<GlobeMethods>(); // Referenz auf das Globe-Objekt

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [countries, setCountries] = useState<
    Feature<Geometry, GeoJsonProperties>[] | null
  >(null);

  // Für die Suchfunktion (Input + Marker-Position)
  const [cityInput, setCityInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null
  );

  // Für das Hover-Highlight
  const [hoveredFeature, setHoveredFeature] = useState<Feature<
    Geometry,
    GeoJsonProperties
  > | null>(null);
  const [hoveredCountryName, setHoveredCountryName] = useState<string>("");

  // Globe-Material (Day-Textur)
  const [globeMaterial, setGlobeMaterial] = useState<THREE.MeshPhongMaterial>();

  // --------------------------------------------------------------------------
  // (A) Fenstergröße tracken → Globe soll sich automatisch an Viewport anpassen
  useEffect(() => {
    const updateSize = (): void => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // --------------------------------------------------------------------------
  // (B) Kamera-Initialposition (z. B. Weltansicht)
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0);
    }
  }, []);

  // --------------------------------------------------------------------------
  // (C) Länder-GeoJSON asynchron laden
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(COUNTRIES_DATA_URL);
        const data = await res.json();
        setCountries(data.features as Feature<Geometry, GeoJsonProperties>[]);
      } catch (err) {
        console.error("Fehler beim Laden der Länder-GeoJSON:", err);
      }
    })();
  }, []);

  // --------------------------------------------------------------------------
  // (D) Globe-Material erstellen (Day-Textur, kein Displacement)
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const mat = new THREE.MeshPhongMaterial({
      map: loader.load(EARTH_DAY_TEXTURE_URL),
      shininess: 10,
      specular: new THREE.Color("#444444"),
    });
    setGlobeMaterial(mat);
  }, []);

  // --------------------------------------------------------------------------
  // (E) Geocoding: Stadt → {lat, lng} via Nominatim
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
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch (err) {
      console.error("Geocoding-Fehler:", err);
    }
    return null;
  };

  // --------------------------------------------------------------------------
  // (F) Such-Button: Zoom auf Stadt
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

  // --------------------------------------------------------------------------
  // (G) Hover-Handler für Länder-Polygone
  //     speichert das aktuell gehighlightete GeoJSON-Feature
  const handlePolygonHover = (
    featureObject: object | null,
    _prev: object | null
  ): void => {
    if (featureObject) {
      const feat = featureObject as Feature<Geometry, GeoJsonProperties>;
      setHoveredFeature(feat);
      setHoveredCountryName(feat.properties?.name ?? "");
    } else {
      setHoveredFeature(null);
      setHoveredCountryName("");
    }
  };

  // --------------------------------------------------------------------------
  // (H) Klick-Handler für Länder-Polygone (nur ein Alert mit Ländernamen)
  const handlePolygonClick = (
    featureObject: object,
    _event: MouseEvent,
    _coords: { lat: number; lng: number; altitude: number }
  ): void => {
    const feat = featureObject as Feature<Geometry, GeoJsonProperties>;
    const countryName = feat.properties?.name ?? "Unbekanntes Land";
    alert(`Du hast geklickt auf: ${countryName}`);
  };

  // --------------------------------------------------------------------------
  // (I) JSX-Rückgabe: Suchfeld, Tooltip, Globe
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* ─── (I.1) Such-Input über dem Globe ─────────────────────────────────── */}
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

      {/* ─── (I.2) Tooltip für den Ländernamen (Fade-In/Out) ───────────────────── */}
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

      {/* ─── (I.3) Globe selbst ─────────────────────────────────────────────────── */}
      <div style={{ width: "100%", height: "100%" }}>
        {globeMaterial && (
          <Globe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            globeMaterial={globeMaterial}
            backgroundColor="#000000" // schwarzer Hintergrund
            // ── Punkte (Marker) für die Suche ────────────────────────
            pointsData={marker ? [marker] : []}
            pointColor={() => "red"}
            pointAltitude={() => 0.02}
            pointRadius={() => 0.5}
            // ── Länder-Polygone ───────────────────────────────────────
            polygonsData={countries || []}
            // Minimal über der Oberfläche anheben, um Flackern zu vermeiden
            polygonAltitude={() => 0.005}
            // Fläche: transparent (kein Hover) bzw. halbtransparent (Hover)
            polygonCapColor={(feat: object) => {
              const f = feat as Feature<Geometry, GeoJsonProperties>;
              return hoveredFeature === f
                ? "rgba(200,200,200,0.4)" // halbtransparente Füllung beim Hover
                : "rgba(0,0,0,0)"; // unsichtbar, wenn kein Hover
            }}
            polygonSideColor={() => "rgba(0,0,0,0)"} // Seiten komplett transparent
            // Konturlinie: immer VIOLETT
            polygonStrokeColor={() => "black"}
            // Konturstärke: dünn normal, dicker beim Hover
            polygonStrokeWidth={(feat: object) => {
              const f = feat as Feature<Geometry, GeoJsonProperties>;
              return hoveredFeature === f ? 1.2 : 0.4;
            }}
            // Kein Fade-In/Out, damit kein Flackern
            polygonsTransitionDuration={0}
            onPolygonHover={handlePolygonHover}
            onPolygonClick={handlePolygonClick}
            onGlobeReady={() => {
              if (globeEl.current) {
                // Zoom & Pan erlauben, aber keine Auto-Rotation
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
