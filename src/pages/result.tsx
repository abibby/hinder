import { Layout } from "../components/layout";
import { useDatabase } from "../hooks/database";
import { useHash } from "../hooks/hash";
import { byKey } from "../utils";
import styles from "./result.module.css";

export function Result() {
  const [listID] = useHash();
  const { items, votes } = useDatabase(listID);
  // TODO: add something so winning gets more points if its against an item with
  // more wins.
  const sortedItems = Array.from(items ?? [])
    .map((i) => ({
      name: i.name,
      votes: (votes ?? []).filter((v) => v.winner_id === i.id).length,
    }))
    .sort(byKey("votes", "desc"))
    .slice(0, 5);
  return (
    <Layout>
      <h1>Result</h1>
      <ul className={styles.items}>
        {sortedItems.map((item, i) => (
          <li className={styles.item} key={item.name}>
            <span className={styles.position}>#{i + 1}</span>
            {item.name}
            {/* | {item.votes} */}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
