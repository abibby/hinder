function addScriptTag(url: string): void {
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  document.head.appendChild(script);
}

let ready: Promise<void> | undefined;
export async function googleMapsService(): Promise<typeof google.maps> {
  if (!ready) {
    ready = new Promise<void>((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).initMap = () => resolve();
    });

    addScriptTag(
      `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.HINDER_GOOGLE_MAPS_API_KEY
      }&loading=async&libraries=places&callback=initMap`
    );
  }
  await ready;
  return google.maps;
}

let locationPromise: Promise<GeolocationCoordinates> | undefined;
export function currentLocation(): Promise<GeolocationCoordinates> {
  if (locationPromise) return locationPromise;
  locationPromise = new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);

        resolve(position.coords);
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true }
    );
  });
  return locationPromise;
}

export function toLatLng(
  coords: GeolocationCoordinates
): google.maps.LatLngLiteral {
  return { lng: coords.longitude, lat: coords.latitude };
}
