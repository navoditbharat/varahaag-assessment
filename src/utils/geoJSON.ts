import { Marker, Polygon } from "../types";
import {
  Feature,
  FeatureCollection,
  Point,
  Polygon as GeoJSONPolygon,
  GeoJsonProperties,
} from "geojson";

type MarkerFeature = Feature<Point, GeoJsonProperties>;
type PolygonFeature = Feature<GeoJSONPolygon, GeoJsonProperties>;

export const exportToGeoJSON = (
  markers: Marker[],
  polygon: Polygon | null
): FeatureCollection => {
  const features: (MarkerFeature | PolygonFeature)[] = markers.map(
    (marker) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: marker.coordinates,
      },
      properties: {},
    })
  );

  if (polygon) {
    features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: polygon.coordinates,
      },
      properties: {},
    });
  }

  return {
    type: "FeatureCollection",
    features,
  };
};

export const loadGeoJSON = (
  content: string
): { markers: Marker[]; polygon: Polygon | null } => {
  const data = JSON.parse(content) as FeatureCollection;
  const markers: Marker[] = [];
  let polygon: Polygon | null = null;

  data.features.forEach((feature: Feature) => {
    if (feature.geometry.type === "Point") {
      markers.push({
        coordinates: feature.geometry.coordinates as [number, number],
      });
    } else if (feature.geometry.type === "Polygon") {
      polygon = {
        coordinates: feature.geometry.coordinates,
      };
    } else {
      console.warn(`Unsupported geometry type: ${feature.geometry.type}`);
    }
  });

  return { markers, polygon };
};
