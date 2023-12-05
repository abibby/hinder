import { useCallback, useState } from "react";
import { bind, bindValue } from "@zwzn/spicy";
import { useItems } from "../hooks/items";
import { useHash } from "../hooks/hash";
import { Link } from "react-router-dom";
import { useUserID } from "../hooks/user";

export function AddItems() {
  const userID = useUserID();
  const [listID] = useHash();
  const [itemName, setItemName] = useState("");

  const { items, newItem, removeItem } = useItems(
    listID,
    "ws://localhost:3339"
  );

  const send = useCallback(async () => {
    newItem(itemName);
    setItemName("");
  }, [newItem, itemName, setItemName]);

  return (
    <div>
      <h1>Host</h1>
      {listID}
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
        <input type="text" onInput={bindValue(setItemName)} value={itemName} />
        <button onClick={send}>send</button>
      </div>
      <div>
        <Link to={`/vote#${listID}`}>vote</Link>
      </div>
    </div>
  );
}
