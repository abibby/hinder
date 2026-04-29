import classNames from "classnames";
import { Place } from "../hooks/places";
import styles from "./place-list.module.css";

type PlaceSearchProps = {
  places: Place[];
  loading?: boolean;
};

const emptyPlace: Place = {
  name: "name",
  priceLevel: "$",
  distance: 0,
};
export function PlaceList({ places, loading }: PlaceSearchProps) {
  if (loading) {
    return (
      <ul className={styles.list}>
        <PlaceLine place={emptyPlace} loading />
        <PlaceLine place={emptyPlace} loading />
        <PlaceLine place={emptyPlace} loading />
        <PlaceLine place={emptyPlace} loading />
        <PlaceLine place={emptyPlace} loading />
      </ul>
    );
  }
  return (
    <ul className={styles.list}>
      {places.map((p) => (
        <PlaceLine place={p} />
      ))}
    </ul>
  );
}

type PlaceLineProps = {
  place: Place;
  loading?: boolean;
};

function PlaceLine({ place, loading }: PlaceLineProps) {
  return (
    <li
      key={place.name}
      className={classNames(styles.place, { [styles.loading]: loading })}
    >
      <h3>{place.name}</h3>
      <p>
        {place.priceLevel} {Math.round(place.distance * 100) / 100} km{" "}
      </p>
    </li>
  );
}
