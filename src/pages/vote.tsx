import { useEffect, useState } from "react";
import { useHash } from "../hooks/hash";
import { useDatabase } from "../hooks/database";
import { bind } from "@zwzn/spicy";
import { Item, Vote as DBVote } from "../db";
import { Layout } from "../components/layout";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import styles from "./vote.module.css";

const done = Symbol("done");
const loading = Symbol("loading");

export function Vote() {
  const [listID] = useHash();
  const navigate = useNavigate();

  const { items, myVotes, newVote } = useDatabase(listID);

  const [combo, setCombo] = useState<
    [Item, Item] | typeof done | typeof loading
  >(loading);
  useEffect(() => {
    if (items === undefined) {
      setCombo(loading);
      return;
    }
    const combo = getCombination(items, myVotes ?? [], 3);
    if (combo === undefined) {
      setCombo(done);
    } else {
      setCombo(combo);
    }
  }, [items, myVotes]);

  if (combo === loading) {
    return <>loading</>;
  }
  if (combo === done) {
    navigate(`/result#${listID}`);
    return <>done</>;
  }

  const [itemA, itemB] = combo;

  return (
    <Layout>
      <h1>Vote</h1>
      <div className={styles.buttons}>
        <Button onClick={bind(itemA, itemB, newVote)}>{itemA?.name}</Button>
        <Button onClick={bind(itemB, itemA, newVote)}>{itemB?.name}</Button>
      </div>
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
