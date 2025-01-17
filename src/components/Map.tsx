import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Marker, Polygon } from "../types";
import { Position } from "geojson";

interface MapProps {
  accessToken: string;
  center: Position;
  markers: Marker[];
  polygon: Polygon | null;
  onAddMarker: (lngLat: Position) => void;
  onAddPolygonVertex: (lngLat: Position) => void;
}

const Map: React.FC<MapProps> = ({
  accessToken,
  center,
  markers,
  polygon,
  onAddMarker,
  onAddPolygonVertex,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);

  useEffect(() => {
    console.log(center);
    // if (map.current) return;
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
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [],
                },
                properties: {},
              },
            ],
          },
        });
      }

      map.current!.addLayer({
        id: "polygon",
        type: "fill",
        source: "polygon",
        layout: {},
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.3,
        },
      });
    });

    map.current.on("click", (e) => {
      const lngLat: Position = [e.lngLat.lng, e.lngLat.lat];
      if (isDrawingPolygon) {
        onAddPolygonVertex(lngLat);
      } else {
        onAddMarker(lngLat);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [accessToken, center, onAddMarker, onAddPolygonVertex, isDrawingPolygon]);

  useEffect(() => {
    markers.forEach((marker) => {
      if (map.current) {
        new mapboxgl.Marker()
          .setLngLat(marker.coordinates as [number, number])
          .addTo(map.current);
      }
    });
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
                coordinates: polygon.coordinates,
              },
              properties: {},
            },
          ],
        });
      }
    }
  }, [polygon]);

  return (
    <div className="flex-1">
      <div ref={mapContainer} className="h-full" />
      <button
        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsDrawingPolygon(!isDrawingPolygon)}
      >
        {isDrawingPolygon ? "Finish Polygon" : "Draw Polygon"}
      </button>
    </div>
  );
};

export default Map;
