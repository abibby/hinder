import { currentLocation, googleMapsService, toLatLng } from "./internal";

export async function searchNearby(
  request: Partial<google.maps.places.SearchNearbyRequest>
) {
  const maps = await googleMapsService();

  const coords = await currentLocation();

  const location = new maps.Circle({
    center: toLatLng(coords),
    radius: coords.accuracy + 5000,
  });

  const { places } = await maps.places.Place.searchNearby({
    locationRestriction: location,
    fields: ["*"],
    // fields: ["displayName", "location", "priceLevel", "rating", "primaryType"],
    ...request,
  });

  return places;
}
