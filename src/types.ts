import { Position } from "geojson";

export interface Marker {
  coordinates: Position;
}

export interface Polygon {
  coordinates: Position[][];
}

export interface MapState {
  markers: Marker[];
  polygon: Polygon | null;
}
