import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";

export function Home() {
  const [listID, setListID] = useState("");
  useEffect(() => {
    setListID(crypto.randomUUID());
  }, []);
  return (
    <section className={styles.home}>
      <h1 className={styles.title}>[hinder]</h1>

      <Link className={styles.new} to={`/add#${listID}`}>
        New List
      </Link>

      {/* <img className={styles.bg} src={bg} alt="" /> */}
    </section>
  );
}
