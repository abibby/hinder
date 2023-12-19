import { Layout } from "../components/layout";
import { useDatabase } from "../hooks/database";
import { useHash } from "../hooks/hash";
import { byKey } from "../utils";

export function Result() {
  const [listID] = useHash();
  const { items, votes } = useDatabase(listID);
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
      <ul>
        {sortedItems.map((item) => (
          <li key={item.name}>
            {item.name} | {item.votes}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
