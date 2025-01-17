import React from "react";
import { Marker } from "../types";

interface SidebarProps {
  markers: Marker[];
  polygonArea: number | null;
  onClear: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  markers,
  polygonArea,
  onClear,
  onSave,
  onExport,
  onImport,
}) => {
  return (
    <div className="w-64 bg-gray-100 p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Map Data</h2>
      <h3 className="text-lg font-semibold mb-2">Markers</h3>
      <ul className="mb-4">
        {markers.map((marker, index) => (
          <li key={index} className="mb-1">
            Marker {index + 1}: [{marker.coordinates[0].toFixed(4)},{" "}
            {marker.coordinates[1].toFixed(4)}]
          </li>
        ))}
      </ul>
      {polygonArea !== null && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Polygon Area</h3>
          <p>{polygonArea.toFixed(2)} sq meters</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <button
          onClick={onClear}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Map
        </button>
        <button
          onClick={onSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save State
        </button>
        <button
          onClick={onExport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Export GeoJSON
        </button>
        <label className="bg-purple-500 text-white px-4 py-2 rounded text-center cursor-pointer">
          Import GeoJSON
          <input
            type="file"
            onChange={onImport}
            className="hidden"
            accept=".geojson,application/geo+json"
          />
        </label>
      </div>
    </div>
  );
};

export default Sidebar;
