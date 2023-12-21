import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";
import { Button } from "../components/button";

export function Home() {
  const [listID, setListID] = useState("");
  useEffect(() => {
    setListID(crypto.randomUUID());
  }, []);
  return (
    <section className={styles.home}>
      <h1 className={styles.title}>[hinder]</h1>

      <Button className={styles.new} size="lg" href={`/qr#${listID}`}>
        New List
      </Button>
    </section>
  );
}
