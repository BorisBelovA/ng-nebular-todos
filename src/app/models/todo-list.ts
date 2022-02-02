import { ListItem } from "./list-item";

export interface TodoList {
  id: number;
  title: string;
  items: ListItem[]
}