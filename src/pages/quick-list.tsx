import { useHash } from "../hooks/hash";
import { Layout } from "../components/layout";
import { Button, ButtonList } from "../components/button";
import { PlaceList } from "../components/place-list";
import { useCallback } from "react";
import { usePlaces } from "../hooks/places";
import { useNavigate, useParams } from "react-router-dom";
import { useDatabase } from "../hooks/database";
import styles from "./quick-list.module.css";

export function QuickList() {
  const navigate = useNavigate();
  const { type } = useParams();
  const [listID] = useHash();
  const [places, loading] = usePlaces(type ?? "");
  const { newItem } = useDatabase(listID);

  const createList = useCallback(() => {
    for (const place of places) {
      newItem(place.name);
    }
    navigate(`/add#${listID}`);
  }, [listID, navigate, newItem, places]);

  return (
    <Layout className={styles.placeListRoot}>
      <PlaceList places={places} loading={loading} />
      <ButtonList>
        <Button
          className={styles.createList}
          size="lg"
          onClick={createList}
          disabled={loading}
        >
          Create List
        </Button>
      </ButtonList>
    </Layout>
  );
}

export function SelectQuickList() {
  const [listID] = useHash();
  return (
    <Layout>
      <ButtonList className={styles.types}>
        <Button size="lg" href={`/quick/restaurant#${listID}`}>
          Restaurants
        </Button>
        <Button size="lg" href={`/quick/cafe#${listID}`}>
          Cafe
        </Button>
        <Button size="lg" href={`/quick/hiking_area#${listID}`}>
          Hikes
        </Button>
      </ButtonList>
    </Layout>
  );
}
