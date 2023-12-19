import { useEffect, useState } from "react";
import { useHash } from "../hooks/hash";
import { useDatabase } from "../hooks/database";
import { bind } from "@zwzn/spicy";
import { Item, Vote as DBVote } from "../db";
import { Layout } from "../components/layout";
import { Link } from "react-router-dom";
import { byKey } from "../utils";

export function Vote() {
  const [listID] = useHash();

  const { items, votes, myVotes, newVote } = useDatabase(listID);

  const [combo, setCombo] = useState<[Item, Item]>();
  useEffect(() => {
    const combo = getCombination(items ?? [], myVotes ?? [], 3);
    setCombo(combo);
  }, [items, myVotes]);

  const [itemA, itemB] = combo ?? [];

  return (
    <Layout>
      <h1>Vote</h1>
      <ul>
        {[...(items ?? [])].sort(byKey("name")).map((item) => (
          <li key={item.id}>
            {item.name} | {votes?.filter((v) => v.winner_id === item.id).length}
          </li>
        ))}
      </ul>
      {itemA && itemB ? (
        <div>
          <button onClick={bind(itemA, itemB, newVote)}>{itemA?.name}</button>
          <button onClick={bind(itemB, itemA, newVote)}>{itemB?.name}</button>
        </div>
      ) : (
        <Link to={`/result#${listID}`}>next</Link>
      )}
    </Layout>
  );
}

function getCombination(
  items: Item[],
  votes: DBVote[],
  rounds: number,
  usedVotes: DBVote[] = []
): [Item, Item] | undefined {
  for (let i = 0; i < items.length; i += 2) {
    const a = items[i];
    const b = items[(i + 1) % items.length];
    if (a.id == b.id) {
      continue;
    }

    const [aID, bID] = [a.id, b.id].sort();
    const vote = votes.find((v) => v.a_id === aID && v.b_id === bID);
    if (vote === undefined) {
      return [a, b];
    }
    usedVotes.push(vote);
  }

  if (rounds > 1) {
    const newItems = Array.from(items).sort((a, b) => {
      const vA = voteCount(a, usedVotes);
      const vB = voteCount(b, usedVotes);

      if (vA > vB) return -1;
      if (vA < vB) return 1;
      return 0;
    });

    return getCombination(newItems, votes, rounds - 1, usedVotes);
  }
  return undefined;
}

function voteCount(item: Item, votes: DBVote[]): number {
  return votes.filter((v) => v.winner_id === item.id).length;
}
