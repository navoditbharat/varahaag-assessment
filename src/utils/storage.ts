import { MapState } from "../types";

export const saveToLocalStorage = (state: MapState) => {
  localStorage.setItem("mapState", JSON.stringify(state));
};

export const loadFromLocalStorage = (): MapState | null => {
  const savedState = localStorage.getItem("mapState");
  return savedState ? JSON.parse(savedState) : null;
};
