import { useEffect, useState } from "react";
import { currentLocation, toLatLng } from "../google/internal";
import { searchNearby } from "../google/maps";
import { byKey } from "../utils";

export type Place = {
  name: string;
  priceLevel: string;
  distance: number;
};

export function usePlaces(type: string) {
  const [places, setPlaces] = useState<Place[]>([]);
  useEffect(() => {
    if (!type) {
      setPlaces([]);
      return;
    }
    let canceled = false;
    Promise.all([
      currentLocation(),
      searchNearby({
        includedTypes: [type],
      }),
    ]).then(([location, allPlaces]) => {
      const names = new Set<string>();
      const uniquePlaces = [];

      const sortedPlaces = allPlaces
        .map((p) => {
          return {
            name: p.displayName ?? "",
            priceLevel: getLevel(p.priceLevel),
            distance: calculateDistance(
              toLatLng(location),
              p.location?.toJSON()
            ),
          };
        })
        .sort(byKey("distance"));
      for (const place of sortedPlaces) {
        if (names.has(place.name)) {
          continue;
        }
        names.add(place.name);
        uniquePlaces.push(place);
      }
      if (canceled) {
        return;
      }
      setPlaces(uniquePlaces);
    });
    return () => {
      canceled = true;
    };
  }, [type]);
  return places;
}

// Convert degrees to radians
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
/**
 * Calculates the distance between two geographical coordinates using the Haversine formula.
 *
 * @param point1 - The first geographical coordinate { lat: number, lon: number }.
 * @param point2 - The second geographical coordinate { lat: number, lon: number }.
 * @returns The distance between the two points in kilometers.
 */
function calculateDistance(
  point1: google.maps.LatLngLiteral | undefined,
  point2: google.maps.LatLngLiteral | undefined
): number {
  if (!point1 || !point2) {
    return -1;
  }

  // Earth's mean radius in kilometers. Adjust if you need miles (approx 3959).
  const R = 6371;

  const lat1Rad = degreesToRadians(point1.lat);
  const lon1Rad = degreesToRadians(point1.lng);
  const lat2Rad = degreesToRadians(point2.lat);
  const lon2Rad = degreesToRadians(point2.lng);

  // Difference in coordinates
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  const distance = R * c;

  return distance; // Distance in kilometers
}

function getLevel(
  level: google.maps.places.PriceLevel | null | undefined
): string {
  switch (level) {
    case "FREE":
      return "free";
    case "INEXPENSIVE":
      return "$";
    case "MODERATE":
      return "$$";
    case "EXPENSIVE":
      return "$$$";
    case "VERY_EXPENSIVE":
      return "$$$$";
    default:
      return "";
  }
}
