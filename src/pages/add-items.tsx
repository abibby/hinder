import { FormEvent, useCallback, useEffect, useState } from "react";
import { bind, bindValue } from "@zwzn/spicy";
import { useDatabase } from "../hooks/database";
import { useHash } from "../hooks/hash";
import { Link } from "react-router-dom";
import { useUserID } from "../hooks/user";
import { Layout } from "../components/layout";
import styles from "./add-items.module.css";

export function AddItems() {
  const userID = useUserID();
  const [listID] = useHash();
  const [itemName, setItemName] = useState("");

  const { items, newItem, removeItem } = useDatabase(listID);

  const send = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      newItem(itemName);
      setItemName("");
    },
    [newItem, itemName, setItemName]
  );

  return (
    <Layout>
      <section className={styles.items}>
        <h1>Add Items</h1>
        <ul>
          {items?.map((item) => (
            <li key={item.id}>
              {item.name}
              {" | "}
              {item.user_id === userID && (
                <button onClick={bind(item.id, removeItem)}>x</button>
              )}
            </li>
          ))}
        </ul>
        <div>
          <Link to={`/vote#${listID}`}>vote</Link>
        </div>
      </section>
      <form className={styles.form} onSubmit={send}>
        <input
          className={styles.input}
          type="text"
          onInput={bindValue(setItemName)}
          value={itemName}
        />
        <button className={styles.add} type="submit">
          add
        </button>
      </form>
    </Layout>
  );
}
