"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import type {
  Feature,
  Polygon,
  MultiPolygon,
  GeoJsonProperties,
} from "geojson";
import type { GlobeMethods } from "react-globe.gl";
import type { Challenge } from "@/types/types";
import { useRouter } from "next/navigation";

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

export default function GlobusChallengesClient({}: /* challenges, */
GlobusChallengesClientProps) {
  const router = useRouter();
  const globeEl = useRef<GlobeMethods>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [countries, setCountries] = useState<
    Feature<Polygon | MultiPolygon, GeoJsonProperties>[] | null
  >(null);
  const [hoveredFeature, setHoveredFeature] = useState<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>(null);
  const [hoveredCountryName, setHoveredCountryName] = useState<string>("");
  const [selectedFeature, setSelectedFeature] = useState<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>(null);
  const [challengeCount, setChallengeCount] = useState<number | null>(null);
  const [globeMaterial, setGlobeMaterial] = useState<THREE.MeshPhongMaterial>();

  useEffect(() => {
    function updateSize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0);
    }
  }, []);

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

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const mat = new THREE.MeshPhongMaterial({
      map: loader.load(EARTH_DAY_TEXTURE_URL),
      shininess: 10,
      specular: new THREE.Color("#444444"),
    });
    setGlobeMaterial(mat);
  }, []);

  const handlePolygonHover = (
    featureObject: object | null
    /* _prev: object | null */
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

  let clickTimer: NodeJS.Timeout | null = null;

  const handlePolygonClick = async (featureObject: object): Promise<void> => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;

      // Doppel-Klick erkannt → Weiterleitung
      const f = featureObject as Feature<
        Polygon | MultiPolygon,
        GeoJsonProperties
      >;
      const countryName = f.properties?.name ?? "";
      router.push(`/challenges-by-country/${encodeURIComponent(countryName)}`);
      return;
    }

    clickTimer = setTimeout(async () => {
      clickTimer = null;

      const f = featureObject as Feature<
        Polygon | MultiPolygon,
        GeoJsonProperties
      >;
      const countryName = f.properties?.name ?? "Unbekanntes Land";
      const center = getCentroid(f.geometry);

      if (selectedFeature === f) {
        setSelectedFeature(null);
        setChallengeCount(null);
        if (globeEl.current && center) {
          globeEl.current.pointOfView(
            { lat: center.lat, lng: center.lng, altitude: 2 },
            700
          );
        }
        return;
      }

      setSelectedFeature(f);
      setChallengeCount(null);

      if (globeEl.current && center) {
        globeEl.current.pointOfView(
          { lat: center.lat, lng: center.lng, altitude: 1 },
          700
        );
      }

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
    }, 280);
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#111",
    overflow: "hidden",
  };

  const overlayBoxStyle: React.CSSProperties = {
    position: "absolute",
    top: "50px",
    left: "75%",
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

  const globeWrapperStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transition: "all 0.7s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={overlayBoxStyle}>
        <span style={{ fontSize: "14px" }}>
          {`Challenges in ${selectedFeature?.properties?.name}: ${challengeCount}`}
        </span>
        <button
          onClick={() => {
            if (!selectedFeature) return;
            const countryName = selectedFeature.properties?.name ?? "";
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

      <div style={tooltipStyle}>{hoveredCountryName}</div>

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
