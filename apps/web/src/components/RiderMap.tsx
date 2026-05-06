"use client";

import { useEffect, useRef } from "react";
import type { MapCoordinates, ResolvedMapPlace } from "@/lib/map-services";

type LeafletModule = typeof import("leaflet");

type RiderMapProps = {
  pickup: ResolvedMapPlace | null;
  destination: ResolvedMapPlace | null;
  routeGeometry: MapCoordinates[];
  vehiclePosition?: MapCoordinates | null;
  tileUrl: string;
  tileAttribution: string;
  isLoading?: boolean;
};

const defaultCenter: [number, number] = [9.0579, 7.4951];

export function RiderMap({
  pickup,
  destination,
  routeGeometry,
  vehiclePosition = null,
  tileUrl,
  tileAttribution,
  isLoading = false
}: RiderMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const routeLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const tileLayerRef = useRef<import("leaflet").TileLayer | null>(null);

  useEffect(() => {
    let disposed = false;
    let frameId: number | null = null;

    async function drawMap() {
      const L = leafletRef.current ?? (await import("leaflet"));
      leafletRef.current = L;

      if (!containerRef.current || disposed) {
        return;
      }

      if (!mapRef.current) {
        const map = L.map(containerRef.current, {
          attributionControl: false,
          zoomControl: false
        }).setView(defaultCenter, 12);

        L.control.zoom({ position: "bottomright" }).addTo(map);
        L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

        mapRef.current = map;
        routeLayerRef.current = L.layerGroup().addTo(map);
      }

      const map = mapRef.current;
      const routeLayer = routeLayerRef.current;

      if (!map || !routeLayer) {
        return;
      }

      if (!tileLayerRef.current) {
        tileLayerRef.current = L.tileLayer(tileUrl, {
          attribution: tileAttribution,
          maxZoom: 19
        }).addTo(map);
      } else {
        tileLayerRef.current.setUrl(tileUrl);
        tileLayerRef.current.options.attribution = tileAttribution;
      }

      routeLayer.clearLayers();

      const bounds = L.latLngBounds([]);
      const routePoints = routeGeometry.map((point) => [point.lat, point.lng] as [number, number]);

      if (routePoints.length > 1) {
        L.polyline(routePoints, {
          color: "#0b1020",
          opacity: 0.25,
          weight: 8
        }).addTo(routeLayer);

        L.polyline(routePoints, {
          color: "#f4b400",
          opacity: 0.96,
          weight: 5
        }).addTo(routeLayer);

        routePoints.forEach((point) => bounds.extend(point));
      }

      if (pickup) {
        L.marker([pickup.lat, pickup.lng], {
          icon: createMarkerIcon(L, "pickup"),
          title: pickup.label
        }).addTo(routeLayer);
        bounds.extend([pickup.lat, pickup.lng]);
      }

      if (destination) {
        L.marker([destination.lat, destination.lng], {
          icon: createMarkerIcon(L, "destination"),
          title: destination.label
        }).addTo(routeLayer);
        bounds.extend([destination.lat, destination.lng]);
      }

      if (vehiclePosition) {
        L.marker([vehiclePosition.lat, vehiclePosition.lng], {
          icon: createMarkerIcon(L, "vehicle"),
          title: "Trip in progress"
        }).addTo(routeLayer);
        bounds.extend([vehiclePosition.lat, vehiclePosition.lng]);
      }

      frameId = window.requestAnimationFrame(() => {
        if (disposed || mapRef.current !== map || !containerRef.current?.isConnected) {
          return;
        }

        try {
          map.invalidateSize();

          if (bounds.isValid()) {
            map.fitBounds(bounds.pad(0.24), {
              animate: false,
              maxZoom: 15
            });
          } else {
            map.setView(defaultCenter, 12, { animate: false });
          }
        } catch {
          // Leaflet can still be mid-teardown while React swaps map layouts.
        }
      });
    }

    void drawMap();

    return () => {
      disposed = true;
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [destination, pickup, routeGeometry, tileAttribution, tileUrl, vehiclePosition]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  return (
    <div className="rider-map-shell">
      <div className="rider-map" ref={containerRef} aria-label="Pickup and destination map" />
      {isLoading ? (
        <div className="rider-map-loading" role="status">
          Mapping route
        </div>
      ) : null}
    </div>
  );
}

function createMarkerIcon(L: LeafletModule, kind: "pickup" | "destination" | "vehicle") {
  return L.divIcon({
    className: `rider-marker rider-marker-${kind}`,
    html: `<span>${kind === "pickup" ? "P" : kind === "destination" ? "D" : "EV"}</span>`,
    iconAnchor: [18, 18],
    iconSize: [36, 36]
  });
}
