import { useHash } from "../hooks/hash";
import { Layout } from "../components/layout";
import { Button, ButtonList } from "../components/button";
import { PlaceList } from "../components/place-list";
import { useCallback, useState } from "react";
import { bind } from "@zwzn/spicy";
import { usePlaces } from "../hooks/places";
import { useNavigate } from "react-router-dom";
import { useDatabase } from "../hooks/database";
import styles from "./quick-list.module.css";

export function QuickList() {
  const navigate = useNavigate();

  const [listID] = useHash();
  const [type, setType] = useState("");
  const places = usePlaces(type);
  const { newItem } = useDatabase(listID);

  const createList = useCallback(() => {
    for (const place of places) {
      newItem(place.name);
    }
    navigate(`/qr#${listID}`);
  }, [listID, navigate, newItem, places]);

  if (!type) {
    return (
      <Layout>
        <ButtonList className={styles.types}>
          <Button size="lg" onClick={bind("restaurant", setType)}>
            Restaurants
          </Button>
          <Button size="lg" onClick={bind("cafe", setType)}>
            Cafe
          </Button>
          <Button size="lg" onClick={bind("hiking_area", setType)}>
            Hikes
          </Button>
        </ButtonList>
      </Layout>
    );
  }
  return (
    <Layout>
      <PlaceList places={places} />
      <ButtonList>
        <Button size="lg" onClick={createList}>
          Create List
        </Button>
      </ButtonList>
    </Layout>
  );
}
