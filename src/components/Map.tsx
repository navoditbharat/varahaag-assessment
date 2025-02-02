import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Position } from "geojson";

import { Marker, Polygon } from "../types";

interface MapProps {
  accessToken: string;
  center: Position;
  markers: Marker[];
  polygon: Polygon | null;
  onAddMarker: (lngLat: Position) => void;
  onAddPolygonVertex: (lngLat: Position) => void;
  onClear: () => void;
}

const Map: React.FC<MapProps> = ({
  accessToken,
  center,
  markers,
  polygon,
  onAddMarker,
  onAddPolygonVertex,
  onClear,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);

  const toggleDrawingMode = useCallback(() => {
    setIsDrawingPolygon((prev) => {
      if (!prev) {
        onClear();
      }
      return !prev;
    });
  }, [onClear]);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center as [number, number],
      zoom: 12,
    });

    map.current.on("load", () => {
      if (map.current) {
        map.current.addSource("polygon", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

        map.current.addLayer({
          id: "polygon-fill",
          type: "fill",
          source: "polygon",
          layout: {},
          paint: {
            "fill-color": "#0080ff",
            "fill-opacity": 0.3,
          },
        });

        map.current.addLayer({
          id: "polygon-outline",
          type: "line",
          source: "polygon",
          layout: {},
          paint: {
            "line-color": "#0000ff",
            "line-width": 2,
          },
        });
      }
    });

    map.current.on("click", (e) => {
      const lngLat: Position = [e.lngLat.lng, e.lngLat.lat];
      if (isDrawingPolygon) {
        onAddPolygonVertex(lngLat);
        onAddMarker(lngLat);
      } else {
        onAddMarker(lngLat);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [accessToken, center, isDrawingPolygon, onAddMarker, onAddPolygonVertex]);

  useEffect(() => {
    if (map.current) {
      markers.forEach((marker) => {
        new mapboxgl.Marker()
          .setLngLat(marker.coordinates as [number, number])
          .addTo(map.current!);
      });
    }
  }, [markers]);

  useEffect(() => {
    if (map.current && polygon) {
      const source = map.current.getSource("polygon") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    ...(polygon.coordinates as any),
                    polygon.coordinates[0] as any,
                  ],
                ],
              },
              properties: {},
            },
          ],
        });
      }
    }
  }, [polygon]);

  return (
    <div className="flex-1 relative">
      <div ref={mapContainer} className="h-full" />
      <button
        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={toggleDrawingMode}
      >
        {isDrawingPolygon ? "Finish Polygon" : "Draw Polygon"}
      </button>
    </div>
  );
};

export default Map;
