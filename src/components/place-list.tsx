import { Place } from "../hooks/places";
import styles from "./place-list.module.css";

type PlaceSearchProps = {
  places: Place[];
};

export function PlaceList({ places }: PlaceSearchProps) {
  return (
    <ul className={styles.list}>
      {places.map((p) => (
        <li key={p.name} className={styles.place}>
          <h3>{p.name}</h3>
          {p.priceLevel} {Math.round(p.distance * 100) / 100} km
        </li>
      ))}
    </ul>
  );
}
