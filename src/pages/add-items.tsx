import { FormEvent, useCallback, useState } from "react";
import { bind, bindValue } from "@zwzn/spicy";
import { useDatabase } from "../hooks/database";
import { useHash } from "../hooks/hash";
import { Link } from "react-router-dom";
import { useUserID } from "../hooks/user";
import { Layout } from "../components/layout";

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
      <form onSubmit={send}>
        <div>
          <input
            type="text"
            onInput={bindValue(setItemName)}
            value={itemName}
          />
          <button type="submit">send</button>
        </div>
      </form>
      <div>
        <Link to={`/vote#${listID}`}>vote</Link>
      </div>
    </Layout>
  );
}
