import { useEffect, useState } from "react";
import styles from "./home.module.css";
import { Button, ButtonList } from "../components/button";

export function Home() {
  const [listID, setListID] = useState("");
  useEffect(() => {
    setListID(crypto.randomUUID());
  }, []);
  return (
    <section className={styles.home}>
      <h1 className={styles.title}>[hinder]</h1>
      <ButtonList className={styles.new}>
        <Button size="lg" href={`/qr#${listID}`}>
          New Empty List
        </Button>
        <Button size="lg" href={`/quick#${listID}`}>
          New Quick List
        </Button>
      </ButtonList>
    </section>
  );
}
