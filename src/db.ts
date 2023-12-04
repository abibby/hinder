import Dexie, { Table } from "dexie";

export interface Item {
  id: string;
  list_id: string;
  my_item: boolean;
  name: string;
  elo: number;
}
export interface Vote {
  list_id: string;
  winner_id: string;
  loser_id: string;
}

export interface List {
  id: string;
  created_at: string;
  name: string;
  saved: number;
}

export class Database extends Dexie {
  items!: Table<Item>;
  votes!: Table<Vote>;
  lists!: Table<List>;

  constructor() {
    super("database");
    this.version(1).stores({
      items: "id, list_id",
      votes: "[list_id+winner_id+loser_id]",
      lists: "id, saved, created_at",
    });
  }
}

export const db = new Database();
