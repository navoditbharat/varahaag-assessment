import React, { useState, useEffect, useCallback } from "react";
import { Position } from "geojson";

import { MapState, Marker, Polygon } from "./types";
import { saveToLocalStorage, loadFromLocalStorage } from "./utils/storage";
import { calculateArea } from "./utils/calculations";
import { exportToGeoJSON, loadGeoJSON } from "./utils/geoJSON";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmF2b2RpdGJoYXJhdCIsImEiOiJjbTYwdXZvOTIwZ2tiMnZzZ2Z1eWlwNnRjIn0.euQUJ8Z15TJ-gXbzXw5fhQ";
const INITIAL_CENTER = [-74.006, 40.7128];

const App: React.FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [polygon, setPolygon] = useState<Polygon | null>(null);
  const [polygonArea, setPolygonArea] = useState<number | null>(null);

  useEffect(() => {
    const savedState = loadFromLocalStorage();
    if (savedState) {
      setMarkers(savedState.markers);
      setPolygon(savedState.polygon);
    }
  }, []);

  useEffect(() => {
    if (polygon && polygon.coordinates.length > 2) {
      const area = calculateArea(polygon);
      setPolygonArea(area);
    } else {
      setPolygonArea(null);
    }
  }, [polygon]);

  const handleAddMarker = useCallback((lngLat: Position) => {
    setMarkers((prev) => [...prev, { coordinates: lngLat }]);
  }, []);

  const handleAddPolygonVertex = useCallback((lngLat: Position) => {
    setPolygon((prev: any) => {
      if (!prev) return { coordinates: [lngLat] };
      return { coordinates: [...prev.coordinates, lngLat] };
    });
  }, []);

  const handleClear = useCallback(() => {
    setMarkers([]);
    setPolygon(null);
    setPolygonArea(null);
  }, []);

  const handleSave = useCallback(() => {
    const state: MapState = { markers, polygon };
    saveToLocalStorage(state);
    alert("Map state saved successfully!");
  }, [markers, polygon]);

  const handleExport = useCallback(() => {
    const geoJSONData = exportToGeoJSON(markers, polygon);
    const dataStr = JSON.stringify(geoJSONData);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "map_data.geojson";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [markers, polygon]);

  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          try {
            const { markers: importedMarkers, polygon: importedPolygon } =
              loadGeoJSON(content);
            setMarkers(importedMarkers);
            setPolygon(importedPolygon);
          } catch (error) {
            console.error("Error parsing GeoJSON:", error);
            alert(
              "Error parsing GeoJSON file. Please make sure it's a valid GeoJSON file."
            );
          }
        };
        reader.readAsText(file);
      }
    },
    []
  );

  return (
    <div className="flex h-screen">
      <Sidebar
        markers={markers}
        polygonArea={polygonArea}
        onClear={handleClear}
        onSave={handleSave}
        onExport={handleExport}
        onImport={handleImport}
      />
      <Map
        accessToken={MAPBOX_TOKEN}
        center={INITIAL_CENTER}
        markers={markers}
        polygon={polygon}
        onAddMarker={handleAddMarker}
        onAddPolygonVertex={handleAddPolygonVertex}
      />
    </div>
  );
};

export default App;
