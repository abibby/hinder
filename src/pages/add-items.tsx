import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { bind, bindValue } from "@zwzn/spicy";
import { useDatabase } from "../hooks/database";
import { useHash } from "../hooks/hash";
import { useUserID } from "../hooks/user";
import { Layout } from "../components/layout";
import styles from "./add-items.module.css";
import { Button } from "../components/button";
import { byKey } from "../utils";

export function AddItems() {
  const userID = useUserID();
  const [listID] = useHash();
  const [itemName, setItemName] = useState("");
  const input = useRef<HTMLInputElement | null>(null);

  const { items, newItem, removeItem } = useDatabase(listID);

  useEffect(() => {
    input.current?.focus();
  }, [input]);

  const send = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      newItem(itemName);
      setItemName("");
      input.current?.focus();
    },
    [newItem, itemName, setItemName]
  );

  useEffect(() => {
    if (input.current === document.activeElement)
      window.scrollTo(0, document.body.scrollHeight);
  }, [items]);

  return (
    <Layout className={styles.root}>
      <h1>Add Items</h1>
      <ul className={styles.items}>
        {Array.from(items ?? [])
          .sort(byKey("created_at"))
          .map((item) => (
            <li className={styles.item} key={item.id}>
              {item.name}
              {item.user_id === userID && (
                <button
                  className={styles.removeItem}
                  onClick={bind(item.id, removeItem)}
                >
                  x
                </button>
              )}
            </li>
          ))}
      </ul>
      <div>
        <Button href={`/vote#${listID}`}>vote</Button>
      </div>
      <form className={styles.form} onSubmit={send}>
        <input
          ref={input}
          className={styles.input}
          type="text"
          onInput={bindValue(setItemName)}
          value={itemName}
        />
        <button className={styles.add} type="submit">
          +
        </button>
      </form>
    </Layout>
  );
}
