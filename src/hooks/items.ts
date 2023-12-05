import { useLiveQuery } from "dexie-react-hooks";
import { useWebsocket } from "./websocket";
import { Item, Vote, db } from "../db";
import { useCallback, useEffect } from "react";
import EloRank from "elo-rank";
import { useUserID } from "./user";
type Message =
  | {
      type: "put-item";
      item: Item;
    }
  | {
      type: "put-vote";
      vote: Vote;
    }
  | {
      type: "state";
    };

export function useItems(listID: string, wsroomHost: string) {
  const userID = useUserID();

  const ws = useWebsocket<Message>(
    wsroomHost + "/hinder/" + encodeURIComponent(listID),
    async (data, ws) => {
      switch (data.type) {
        case "put-item":
          await db.items.put(data.item);

          break;
        case "put-vote":
          await db.votes.put(data.vote);
          break;
        case "state":
          const listItems = await db.items
            .where("list_id")
            .equals(listID)
            .toArray();
          for (const item of listItems) {
            await sendItem(ws, item);
          }
          const listVotes = await db.votes
            .where("list_id")
            .equals(listID)
            .toArray();
          for (const vote of listVotes) {
            await sendVote(ws, vote);
          }
          break;
      }
    },
    [listID]
  );

  useEffect(() => {
    requestState(ws);
  }, [ws]);

  const items = useLiveQuery(() =>
    db.items.where(["deleted", "list_id"]).equals([0, listID]).toArray()
  );

  const newItem = useCallback(
    async (itemName: string) => {
      const item: Item = {
        id: crypto.randomUUID(),
        user_id: userID,
        name: itemName,
        list_id: listID,
        elo: 400,
        deleted: 0,
      };
      await sendItem(ws, item);
      await db.items.put(item);
    },
    [ws, userID]
  );

  const removeItem = useCallback(
    async (itemID: string) => {
      const item = await db.items.get(itemID);
      if (item === undefined) {
        return;
      }
      item.deleted = 1;
      await sendItem(ws, item);
      await db.items.put(item);
    },
    [ws]
  );

  const vote = useCallback(
    async (winner: Item, loser: Item) => {
      const [aID, bID] = [winner.id, loser.id].sort();
      const msg: Message = {
        type: "put-vote",
        vote: {
          list_id: listID,
          user_id: userID,
          a_id: aID,
          b_id: bID,
          winner_id: winner.id,
        },
      };
      ws?.send(JSON.stringify(msg));
      const v = await db.votes
        .where(["list_id", "a_id", "b_id"])
        .equals([listID, aID, bID])
        .first();
      if (v !== undefined) {
        return;
      }
      await db.votes.add(msg.vote);
    },
    [ws, userID]
  );

  return {
    items,
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

async function sendItem(ws: WebSocket | undefined, item: Item): Promise<void> {
  const msg: Message = {
    type: "put-item",
    item: item,
  };
  ws?.send(JSON.stringify(msg));
}

async function sendVote(ws: WebSocket | undefined, vote: Vote): Promise<void> {
  const msg: Message = {
    type: "put-vote",
    vote: vote,
  };
  ws?.send(JSON.stringify(msg));
}

async function requestState(ws: WebSocket | undefined): Promise<void> {
  const msg: Message = {
    type: "state",
  };
  console.log("request state");

  ws?.send(JSON.stringify(msg));
}
