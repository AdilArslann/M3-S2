import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Messages {
  id: Generated<number>;
  userId: number;
  sprintId: number;
  templateId: number;
}

export interface Sprints {
  id: Generated<number>;
  sprintCode: string;
  title: string;
}

export interface Templates {
  id: Generated<number>;
  content: string;
}

export interface Users {
  id: Generated<number>;
  discordId: string;
}

export interface DB {
  messages: Messages;
  sprints: Sprints;
  templates: Templates;
  users: Users;
}
