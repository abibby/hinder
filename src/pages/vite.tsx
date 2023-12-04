import { useCallback, useEffect, useState } from "react";
import { useHash } from "../hooks/hash";
import { useItems } from "../hooks/items";
import { bind } from "@zwzn/spicy";
import { Item, db } from "../db";

export function Vote() {
  const [listID] = useHash();

  const [voteNum, setVoteNum] = useState(0);
  const { items, open, vote } = useItems(listID, "ws://localhost:3339");
  const [combos, setCombos] = useState<[Item, Item][]>([]);

  useEffect(() => {
    const combos = getCombinations(items ?? []);
    (async () => {
      let i = 0;
      for (const [a, b] of combos) {
        const v = await db.votes
          .where(["list_id", "winner_id", "loser_id"])
          .equals([listID, a.id, b.id])
          .or(["list_id", "winner_id", "loser_id"])
          .equals([listID, b.id, a.id])
          .first();
        if (v === undefined) {
          setVoteNum(i);
          return;
        }
        i++;
      }
      setVoteNum(i);
    })();
    setCombos(combos);
  }, [items, setVoteNum]);

  const [itemA, itemB] = combos[voteNum] ?? [];

  const voteItem = useCallback(
    async (a: Item, b: Item) => {
      setVoteNum((n) => n + 1);
      await vote(a, b);
    },
    [vote, setVoteNum]
  );

  return (
    <div>
      {open ? "open" : "opening"} <br />
      {listID}
      <ul>
        {[...(items ?? [])].sort(byKey("elo")).map((item) => (
          <li key={item.id}>
            {item.name} {item.elo}
          </li>
        ))}
      </ul>
      {itemA && itemB && (
        <div>
          <button onClick={bind(itemA, itemB, voteItem)}>{itemA?.name}</button>
          <button onClick={bind(itemB, itemA, voteItem)}>{itemB?.name}</button>
        </div>
      )}
    </div>
  );
}

function byKey<T>(key: keyof T): (a: T, b: T) => number {
  return function (a, b) {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  };
}

function getCombinations<T>(array: T[]): [T, T][] {
  return [].concat(
    ...array.map((v, i) => array.slice(i + 1).map((w) => [v, w] as const))
  );
}
