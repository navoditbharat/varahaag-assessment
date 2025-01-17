import React from "react";
import { Marker } from "../types";

interface SidebarProps {
  markers: Marker[];
  polygonArea: number | null;
  onClear: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  markers,
  polygonArea,
  onClear,
  onSave,
  onExport,
  onImport,
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={`
      fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:relative md:translate-x-0
    `}
    >
      <div className="h-full overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Map Data</h2>
          <button className="md:hidden" onClick={onClose}>
            ✕
          </button>
        </div>
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
    </div>
  );
};

export default Sidebar;
