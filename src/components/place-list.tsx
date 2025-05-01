import { Place } from "../hooks/places";

type PlaceSearchProps = {
  places: Place[];
};

export function PlaceList({ places }: PlaceSearchProps) {
  return (
    <ul>
      {places.map((p) => (
        <li key={p.name}>
          <h3>{p.name}</h3>
          {p.priceLevel} {Math.round(p.distance * 100) / 100} km
        </li>
      ))}
    </ul>
  );
}
