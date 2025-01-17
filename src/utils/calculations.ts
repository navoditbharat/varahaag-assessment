import * as turf from "@turf/turf";
import { Polygon } from "../types";

export const calculateArea = (polygon: Polygon): number => {
  const turfPolygon = turf.polygon([polygon.coordinates as any]);
  return turf.area(turfPolygon);
};
