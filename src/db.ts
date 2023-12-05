import Dexie, { Table } from "dexie";

export interface Item {
  id: string;
  list_id: string;
  user_id: string;
  deleted: number;
  name: string;
  elo: number;
}
export interface Vote {
  list_id: string;
  user_id: string;
  a_id: string;
  b_id: string;
  winner_id: string;
}

export interface List {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
  saved: number;
}

export class Database extends Dexie {
  items!: Table<Item>;
  votes!: Table<Vote>;
  lists!: Table<List>;

  constructor() {
    super("hinder");
    this.version(1).stores({
      items: "id, list_id, [deleted+list_id]",
      votes: "[list_id+user_id+a_id+b_id]",
      lists: "id, saved, created_at",
    });
  }
}

export const db = new Database();
