import { useLiveQuery } from "dexie-react-hooks";
import { useWebsocket } from "./websocket";
import { Item, db } from "../db";
import { useCallback } from "react";
import EloRank from "elo-rank";
type Message =
  | {
      type: "new-item";
      item_id: string;
      name: string;
    }
  | {
      type: "remove-item";
      item_id: string;
    }
  | {
      type: "vote";
      winner_id: string;
      loser_id: string;
    };

export function useItems(listID: string, wsroomHost: string) {
  const [ws, open] = useWebsocket<Message>(
    wsroomHost + "/hinder/" + encodeURIComponent(listID),
    async (data) => {
      switch (data.type) {
        case "new-item":
          await db.items.put({
            id: data.item_id,
            list_id: listID,
            my_item: false,
            name: data.name,
            elo: 1000,
          });

          break;
        case "remove-item":
          await db.items.delete(data.item_id);
          break;
        case "vote":
          const winner = await db.items.get(data.winner_id);
          const loser = await db.items.get(data.loser_id);
          if (winner === undefined || loser === undefined) {
            throw "ask for item";
          }
          await _vote(winner, loser);
          break;
      }
    }
  );

  const items = useLiveQuery(() =>
    db.items.where("list_id").equals(listID).toArray()
  );

  const newItem = useCallback(
    async (itemName: string) => {
      const msg: Message = {
        type: "new-item",
        item_id: crypto.randomUUID(),
        name: itemName,
      };
      ws?.send(JSON.stringify(msg));
      await db.items.put({
        id: msg.item_id,
        list_id: listID,
        my_item: true,
        name: itemName,
        elo: 400,
      });
    },
    [ws]
  );

  const removeItem = useCallback(
    async (itemID: string) => {
      const msg: Message = {
        type: "remove-item",
        item_id: itemID,
      };
      ws?.send(JSON.stringify(msg));
      await db.items.delete(itemID);
    },
    [ws]
  );

  const vote = useCallback(
    async (winner: Item, loser: Item) => {
      const msg: Message = {
        type: "vote",
        winner_id: winner.id,
        loser_id: loser.id,
      };
      ws?.send(JSON.stringify(msg));
      const v = await db.votes
        .where(["list_id", "winner_id", "loser_id"])
        .equals([listID, winner.id, loser.id])
        .first();
      if (v !== undefined) {
        return;
      }
      await db.votes.add({
        list_id: listID,
        winner_id: winner.id,
        loser_id: loser.id,
      });
      await _vote(winner, loser);
    },
    [ws]
  );

  return {
    items,
    open,
    newItem,
    removeItem,
    vote,
  };
}

async function _vote(winner: Item, loser: Item): Promise<void> {
  const elo = new EloRank();
  var expectedScoreW = elo.getExpected(winner.elo, loser.elo);
  var expectedScoreL = elo.getExpected(loser.elo, winner.elo);

  winner.elo = elo.updateRating(expectedScoreW, 1, winner.elo);
  loser.elo = elo.updateRating(expectedScoreL, 0, loser.elo);

  await db.items.bulkPut([winner, loser]);
}
