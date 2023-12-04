import { useCallback, useState } from "react";
import { bind, bindValue } from "@zwzn/spicy";
import { useItems } from "../hooks/items";
import { useHash } from "../hooks/hash";
import { Link } from "react-router-dom";

export function AddItems() {
  const [listID] = useHash();
  const [itemName, setItemName] = useState("");

  const { items, newItem, removeItem, open } = useItems(
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
      {open ? "open" : "opening"} <br />
      {listID}
      <ul>
        {items?.map((item) => (
          <li>
            {item.name}{" "}
            {item.my_item && (
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
